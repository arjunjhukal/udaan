import { Box, Divider, LinearProgress, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetUserPerformanceAnalyticsQuery, useGetUserTrackPerformanceQuery } from "../../../../../services/userApi";
import type { TrackPerformanceItem } from "../../../../../types/userProfile";
import DashboardAnalyticsCard from "../../../../organism/Cards/DashboardAnalyticsCard";
import DashboardAnalyticsLoading from "../../../../organism/Cards/DashboardAnalyticsCard/Loading";
import MonthlyActivityChart from "./MonthlyActivityChart";

const TRACK_COLORS: Record<string, "success" | "info" | "warning" | "error" | "primary"> = {
    success: "success",
    info: "info",
    warning: "warning",
    error: "error",
};

function TrackRow({ item }: { item: TrackPerformanceItem }) {
    const color = TRACK_COLORS[item.type] ?? "primary";
    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                <Typography variant="body2" color="text.secondary">{item.title}</Typography>
                <Typography variant="body2" fontWeight={500}>{item.value}%</Typography>
            </Stack>
            <LinearProgress
                variant="determinate"
                value={item.value}
                color={color}
                sx={{ height: 6, borderRadius: 3 }}
            />
        </Box>
    );
}

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
    const theme = useTheme();
    return (
        <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, p: 2.5, height: "100%" }}>
            <Typography variant="h5" fontWeight={600} mb={1.5}>{title}</Typography>
            <Divider sx={{ mb: 2 }} />
            {children}
        </Box>
    );
}

function EmptyBox() {
    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 160 }}>
            <Typography variant="body2" color="text.secondary">Data coming soon.</Typography>
        </Box>
    );
}

export default function PerformanceTab() {
    const { id } = useParams();
    const uid = Number(id);

    const { data: analyticsData, isLoading: analyticsLoading } = useGetUserPerformanceAnalyticsQuery({ id: uid }, { skip: !uid });
    const { data: trackData, isLoading: trackLoading } = useGetUserTrackPerformanceQuery({ id: uid }, { skip: !uid });
    const trackItems = trackData?.data ?? [];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, pb: 4 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" }, gap: 2, p: 2 }}>
                {analyticsLoading
                    ? Array.from({ length: 4 }).map((_, i) => <DashboardAnalyticsLoading key={i} />)
                    : analyticsData?.data?.map((item) => (
                        <DashboardAnalyticsCard
                            key={item.title}
                            data={{ title: item.title, value: item.value.toLocaleString(), description: "", type: item.type }}
                        />
                    ))
                }
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                <Box sx={{ border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 3, p: 2.5 }}>
                    <MonthlyActivityChart uid={uid} />
                </Box>

                <SectionBox title="Track Performance">
                    {trackLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={40} sx={{ mb: 1 }} />)
                    ) : trackItems.length === 0 ? (
                        <EmptyBox />
                    ) : (
                        <Stack gap={2.5} flexDirection={"column"}>
                            {trackItems.map((item) => (
                                <TrackRow key={item.title} item={item} />
                            ))}
                        </Stack>
                    )}
                </SectionBox>

                <SectionBox title="Test Rankings">
                    <EmptyBox />
                </SectionBox>
        </Box>
        </Box>
    );
}
