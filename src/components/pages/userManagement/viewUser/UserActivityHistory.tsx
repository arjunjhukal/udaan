import { Box, Divider, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import dayjs from "dayjs";
import { Book, Book1, Monitor, VideoCircle } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetUserRecentActivitiesQuery } from "../../../../services/userApi";
import TablePagination from "../../../molecules/Table/Pagination";
import TableFilter from "../../../organism/TableFilter";

const ACTIVITY_ICON_CONFIG = [
    { Icon: Book1, colorKey: "primary" as const },
    { Icon: VideoCircle, colorKey: "error" as const },
    { Icon: Book, colorKey: "warning" as const },
    { Icon: Monitor, colorKey: "success" as const },
];

export default function UserActivityHistory() {
    const { id } = useParams<{ id: string }>();
    const theme = useTheme();
    const uid = Number(id);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [qp, setQp] = useState({ pageIndex: 1, pageSize: 15 });

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 800);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setQp((q) => ({ ...q, pageIndex: 1 }));
    }, [debouncedSearch]);

    const { data, isLoading } = useGetUserRecentActivitiesQuery(
        { id: uid, pageIndex: qp.pageIndex, pageSize: qp.pageSize, search: debouncedSearch || undefined },
        { skip: !uid }
    );

    const items = data?.data?.data ?? [];
    const totalPages = data?.data?.pagination?.total_pages ?? 0;

    const groupedActivities = items.reduce<Record<string, typeof items>>((acc, item) => {
        const date = dayjs(item.created_at);
        const today = dayjs().startOf("day");
        const yesterday = today.subtract(1, "day");
        let label: string;
        if (date.isAfter(today)) label = "Today";
        else if (date.isAfter(yesterday)) label = "Yesterday";
        else label = date.format("D MMM YYYY");
        (acc[label] ??= []).push(item);
        return acc;
    }, {});

    return (
        <Box>
            <Typography variant="h5" fontWeight={600} mb={2}>Activity History</Typography>
            <TableFilter search={search} setSearch={setSearch} />
            {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} height={60} sx={{ mb: 1 }} />)
            ) : items.length === 0 ? (
                <Typography variant="body2" color="text.secondary" py={6} textAlign="center">
                    No activity history found.
                </Typography>
            ) : (
                Object.entries(groupedActivities).map(([label, groupItems]) => (
                    <Box key={label} mb={1.5}>
                        <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                                {label}
                            </Typography>
                            <Divider sx={{ flex: 1 }} />
                        </Stack>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            {groupItems.map((act, idx) => {
                                const { Icon, colorKey } = ACTIVITY_ICON_CONFIG[idx % ACTIVITY_ICON_CONFIG.length];
                                const iconColor = theme.palette[colorKey].main;
                                const iconBg = theme.palette[colorKey].light;
                                return (
                                    <Box
                                        key={act.id}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                            py: 1.5,
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            "&:last-child": { borderBottom: "none" },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                bgcolor: iconBg,
                                                color: iconColor,
                                                flexShrink: 0,
                                            }}
                                        >
                                            <Icon size={20} color={iconColor} />
                                        </Box>
                                        <Box flex={1} minWidth={0}>
                                            <Typography variant="body2" fontWeight={500} noWrap>{act.title}</Typography>
                                            <Typography variant="caption" color="text.secondary" noWrap>
                                                {act.description ?? act.type}
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                                            {dayjs(act.created_at).format("D MMM, h:mm A")}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                ))
            )}
            <TablePagination qp={qp} setQp={setQp} totalPages={totalPages} />
        </Box>
    );
}
