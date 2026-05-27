import { Box, Button, CircularProgress, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Refresh } from "iconsax-reactjs";
import { useEffect, useMemo, useState } from "react";
import { useGetLiveAnalyticsQuery } from "../../../services/liveAnalyticsApi";
import TabController from "../../molecules/TabController";
import PageHeader from "../../organism/PageHeader";
import ChartsView from "./tabs/ChartsView";
import DetailedView from "./tabs/DetailedView";
import TrendsView, { type SnapshotPoint } from "./tabs/TrendsView";
import { timeAgo } from "./utils";

type TabKey = "detailed" | "charts" | "trends";

export default function LiveAnalyticsPage() {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState<TabKey>("detailed");
    const [history, setHistory] = useState<SnapshotPoint[]>([]);

    const { data, isLoading, isFetching, refetch, error } = useGetLiveAnalyticsQuery();

    const payload = data?.data;
    const generatedAt = payload?.generated_at;
    const lastUpdatedLabel = useMemo(() => timeAgo(generatedAt), [generatedAt]);

    useEffect(() => {
        if (!payload) return;
        const redisHits = payload.redis?.keyspace_hits ?? 0;
        const redisMisses = payload.redis?.keyspace_misses ?? 0;
        const redisTotal = redisHits + redisMisses;
        const pt: SnapshotPoint = {
            ts: payload.generated_at,
            rps: payload.request_rate?.rps ?? 0,
            activeUsers: payload.users?.active_total ?? 0,
            cpuPct: payload.system?.load_per_core_pct ?? 0,
            memPct: payload.system?.mem_used_pct ?? 0,
            nginxActive: payload.nginx?.active_connections ?? 0,
            queueTotal: payload.queues?.total ?? 0,
            redisHitRate: redisTotal === 0 ? 0 : Math.round((redisHits / redisTotal) * 100),
        };
        setHistory((prev) => {
            if (prev.some((p) => p.ts === pt.ts)) return prev;
            return [...prev.slice(-49), pt];
        });
    }, [payload]);

    return (
        <Box className="h-full overflow-auto pr-2">
            <PageHeader breadcrumb={[{ title: "Live Analytics" }]} />

            {/* Toolbar — shared across tabs */}
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1.5,
                    mb: 2,
                    p: 1.5,
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.error.main, 0.08)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                }}
            >
                <Typography sx={{ fontSize: "12.5px", color: "text.primary", fontWeight: 600 }}>
                    {generatedAt
                        ? `Last updated ${lastUpdatedLabel} · ${new Date(generatedAt).toLocaleTimeString()}`
                        : "Awaiting first response…"}
                </Typography>
                <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    startIcon={isFetching ? <CircularProgress size={14} color="inherit" /> : <Refresh size={16} />}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                >
                    Refresh
                </Button>
            </Box>

            <TabController<TabKey>
                options={[
                    { value: "detailed", label: "Detailed" },
                    { value: "charts", label: "Charts" },
                    { value: "trends", label: "Trends & Comparison" },
                ]}
                currentActive={activeTab}
                setActiveTab={(v) => setActiveTab(v)}
            />

            {error && !payload && (
                <Box
                    sx={{
                        p: 3,
                        border: `1px solid ${theme.palette.error.main}`,
                        background: alpha(theme.palette.error.main, 0.06),
                        borderRadius: 2,
                        mb: 2,
                    }}
                >
                    <Typography color="error.main" fontWeight={700}>
                        Failed to load live analytics
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Make sure your account has access and the backend endpoint is reachable.
                    </Typography>
                </Box>
            )}

            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                    <CircularProgress />
                </Box>
            )}

            {payload && activeTab === "detailed" && <DetailedView payload={payload} />}
            {payload && activeTab === "charts" && <ChartsView payload={payload} />}
            {payload && activeTab === "trends" && <TrendsView payload={payload} history={history} />}
        </Box>
    );
}
