import { Box, Chip, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import dayjs from "dayjs";
import { Activity, Cpu, Diagram, Global } from "iconsax-reactjs";
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { useGetActiveUsersQuery } from "../../../../services/dashboardApi";
import type { LiveAnalyticsData } from "../../../../types/liveAnalytics";
import Section from "../Section";

export type SnapshotPoint = {
    ts: string;
    rps: number;
    activeUsers: number;
    cpuPct: number;
    memPct: number;
    nginxActive: number;
    queueTotal: number;
    redisHitRate: number;
};

interface Props {
    history: SnapshotPoint[];
    payload: LiveAnalyticsData;
}

const ANCHOR = "2000-01-01T";

function toTimeOfDay(iso: string): number {
    const d = dayjs(iso);
    return new Date(
        `${ANCHOR}${String(d.hour()).padStart(2, "0")}:${String(d.minute()).padStart(2, "0")}:00`
    ).getTime();
}

function computeOgive(values: number[]): { x: number; y: number }[] {
    if (values.length === 0) return [];
    const sorted = [...values].sort((a, b) => a - b);
    return sorted.map((val, i) => ({
        x: parseFloat(val.toFixed(2)),
        y: Math.round(((i + 1) / sorted.length) * 100),
    }));
}

export default function TrendsView({ history, payload }: Props) {
    const theme = useTheme();
    const fontFamily = theme.typography.fontFamily as string;
    const today = dayjs().format("YYYY-MM-DD");

    const { data: auData, isLoading: auLoading } = useGetActiveUsersQuery({ date: today });
    const auSeries = auData?.data ?? [];

    const baseChart = useMemo(
        () => ({
            chart: {
                fontFamily,
                toolbar: { show: false },
                background: "transparent",
                animations: { enabled: true, speed: 350 },
            },
            tooltip: { theme: theme.palette.mode, style: { fontSize: "12px", fontFamily } },
            dataLabels: { enabled: false },
        }),
        [fontFamily, theme.palette.mode]
    );

    // ── OGIVE DATA ─────────────────────────────────────────────────────
    const rpsOgive = useMemo(() => computeOgive(history.map((h) => h.rps)), [history]);
    const cpuOgive = useMemo(() => computeOgive(history.map((h) => h.cpuPct)), [history]);
    const memOgive = useMemo(() => computeOgive(history.map((h) => h.memPct)), [history]);

    // ── SESSION TIME SERIES ────────────────────────────────────────────
    const sessionTs = useMemo(
        () => ({
            rps: history.map((h) => ({ x: new Date(h.ts).getTime(), y: h.rps })),
            users: history.map((h) => ({ x: new Date(h.ts).getTime(), y: h.activeUsers })),
            cpu: history.map((h) => ({ x: new Date(h.ts).getTime(), y: h.cpuPct })),
            queues: history.map((h) => ({ x: new Date(h.ts).getTime(), y: h.queueTotal })),
        }),
        [history]
    );

    // ── CROSS-API: align both sources to today's clock ─────────────────
    const crossSeries = useMemo(
        () => ({
            auApiLine: auSeries.map((p) => ({ x: toTimeOfDay(p.timestamp), y: p.count })),
            liveUsersDots: history.map((h) => ({ x: toTimeOfDay(h.ts), y: h.activeUsers })),
            rpsDots: history.map((h) => ({ x: toTimeOfDay(h.ts), y: h.rps })),
        }),
        [auSeries, history]
    );

    const currentRps = payload.request_rate?.rps ?? 0;
    const currentCpu = payload.system?.load_per_core_pct ?? 0;

    const hasHistory = history.length >= 3;

    const noDataHint = (
        <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="caption" color="text.secondary">
                Collecting snapshots… Refresh a few more times to build the distribution.
            </Typography>
            <Box sx={{ mt: 1 }}>
                <Chip
                    label={`${history.length} snapshot${history.length !== 1 ? "s" : ""} collected`}
                    size="small"
                />
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Row 1 – Ogive curves */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                {/* Traffic ogive (RPS distribution) */}
                <Section
                    title="Traffic Distribution (Ogive)"
                    description="Cumulative % of refreshes at or below each request rate — shows your traffic range"
                    tone="primary"
                    icon={<Activity size={18} variant="Bold" />}
                >
                    {!hasHistory ? noDataHint : (
                        <ReactApexChart
                            options={{
                                ...baseChart,
                                chart: { ...baseChart.chart, type: "line" },
                                stroke: { curve: "smooth", width: 2 },
                                colors: [theme.palette.primary.main],
                                xaxis: {
                                    type: "numeric",
                                    title: {
                                        text: "Requests / sec",
                                        style: { fontFamily, fontSize: "11px", color: theme.palette.text.secondary },
                                    },
                                    labels: {
                                        formatter: (v: string) => parseFloat(v).toFixed(1),
                                        style: { fontFamily, fontSize: "11px" },
                                    },
                                },
                                yaxis: {
                                    min: 0,
                                    max: 100,
                                    title: {
                                        text: "Cumulative %",
                                        style: { fontFamily, fontSize: "11px", color: theme.palette.text.secondary },
                                    },
                                    labels: {
                                        formatter: (v: number) => `${v}%`,
                                        style: { fontFamily, fontSize: "11px" },
                                    },
                                },
                                annotations: {
                                    yaxis: [
                                        {
                                            y: 50,
                                            borderColor: alpha(theme.palette.text.secondary, 0.4),
                                            strokeDashArray: 4,
                                            label: {
                                                text: "P50 median",
                                                offsetY: -6,
                                                style: {
                                                    color: theme.palette.text.secondary,
                                                    background: "transparent",
                                                    fontSize: "10px",
                                                },
                                            },
                                        },
                                        {
                                            y: 90,
                                            borderColor: alpha(theme.palette.warning.main, 0.7),
                                            strokeDashArray: 4,
                                            label: {
                                                text: "P90 tail",
                                                offsetY: -6,
                                                style: {
                                                    color: theme.palette.warning.main,
                                                    background: "transparent",
                                                    fontSize: "10px",
                                                },
                                            },
                                        },
                                    ],
                                    xaxis: currentRps > 0
                                        ? [
                                            {
                                                x: currentRps,
                                                borderColor: theme.palette.primary.main,
                                                strokeDashArray: 0,
                                                label: {
                                                    text: `Now: ${currentRps.toFixed(1)} rps`,
                                                    style: {
                                                        color: "#fff",
                                                        background: theme.palette.primary.main,
                                                        fontSize: "10px",
                                                    },
                                                },
                                            },
                                        ]
                                        : [],
                                },
                                grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
                                legend: { show: false },
                            }}
                            series={[{ name: "RPS", data: rpsOgive }]}
                            type="line"
                            height={280}
                        />
                    )}
                </Section>

                {/* System load ogive (CPU% + Memory%) */}
                <Section
                    title="System Load Distribution (Ogive)"
                    description="Cumulative % of snapshots at or below each usage level — see how often you hit warning zones"
                    tone="warning"
                    icon={<Cpu size={18} variant="Bold" />}
                >
                    {!hasHistory ? noDataHint : (
                        <ReactApexChart
                            options={{
                                ...baseChart,
                                chart: { ...baseChart.chart, type: "line" },
                                stroke: { curve: "smooth", width: [2, 2] },
                                colors: [theme.palette.warning.main, theme.palette.error.main],
                                xaxis: {
                                    type: "numeric",
                                    min: 0,
                                    max: 100,
                                    title: {
                                        text: "Usage %",
                                        style: { fontFamily, fontSize: "11px", color: theme.palette.text.secondary },
                                    },
                                    labels: {
                                        formatter: (v: string) => `${Math.round(parseFloat(v))}%`,
                                        style: { fontFamily, fontSize: "11px" },
                                    },
                                },
                                yaxis: {
                                    min: 0,
                                    max: 100,
                                    title: {
                                        text: "Cumulative %",
                                        style: { fontFamily, fontSize: "11px", color: theme.palette.text.secondary },
                                    },
                                    labels: {
                                        formatter: (v: number) => `${v}%`,
                                        style: { fontFamily, fontSize: "11px" },
                                    },
                                },
                                annotations: {
                                    yaxis: [
                                        {
                                            y: 50,
                                            borderColor: alpha(theme.palette.text.secondary, 0.35),
                                            strokeDashArray: 4,
                                            label: {
                                                text: "P50",
                                                offsetY: -6,
                                                style: {
                                                    color: theme.palette.text.secondary,
                                                    background: "transparent",
                                                    fontSize: "10px",
                                                },
                                            },
                                        },
                                        {
                                            y: 90,
                                            borderColor: alpha(theme.palette.warning.main, 0.6),
                                            strokeDashArray: 4,
                                            label: {
                                                text: "P90",
                                                offsetY: -6,
                                                style: {
                                                    color: theme.palette.warning.main,
                                                    background: "transparent",
                                                    fontSize: "10px",
                                                },
                                            },
                                        },
                                    ],
                                    xaxis: [
                                        {
                                            x: 65,
                                            borderColor: theme.palette.warning.main,
                                            strokeDashArray: 0,
                                            label: {
                                                text: "65% warn",
                                                orientation: "horizontal",
                                                style: {
                                                    color: "#fff",
                                                    background: theme.palette.warning.main,
                                                    fontSize: "10px",
                                                },
                                            },
                                        },
                                        {
                                            x: 85,
                                            borderColor: theme.palette.error.main,
                                            strokeDashArray: 0,
                                            label: {
                                                text: "85% crit",
                                                orientation: "horizontal",
                                                style: {
                                                    color: "#fff",
                                                    background: theme.palette.error.main,
                                                    fontSize: "10px",
                                                },
                                            },
                                        },
                                        ...(currentCpu > 0
                                            ? [
                                                {
                                                    x: currentCpu,
                                                    borderColor: theme.palette.warning.main,
                                                    strokeDashArray: 2,
                                                    label: {
                                                        text: `CPU now: ${Math.round(currentCpu)}%`,
                                                        orientation: "horizontal" as const,
                                                        style: {
                                                            color: "#fff",
                                                            background: theme.palette.warning.dark,
                                                            fontSize: "10px",
                                                        },
                                                    },
                                                },
                                            ]
                                            : []),
                                    ],
                                },
                                legend: { show: true, position: "top", fontSize: "12px" },
                                grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
                            }}
                            series={[
                                { name: "CPU %", data: cpuOgive },
                                { name: "Memory %", data: memOgive },
                            ]}
                            type="line"
                            height={280}
                        />
                    )}
                </Section>
            </Box>

            {/* Row 2 – Session time series (range visible over time) */}
            <Section
                title="Live Metrics Over Time"
                description="All values recorded this session — range and trend visible as you refresh"
                tone="info"
                icon={<Diagram size={18} variant="Bold" />}
            >
                {!hasHistory ? noDataHint : (
                    <ReactApexChart
                        options={{
                            ...baseChart,
                            chart: { ...baseChart.chart, type: "line" },
                            stroke: { curve: "smooth", width: [2, 2, 2, 2] },
                            colors: [
                                theme.palette.primary.main,
                                theme.palette.success.main,
                                theme.palette.warning.main,
                                theme.palette.error.main,
                            ],
                            xaxis: {
                                type: "datetime",
                                labels: {
                                    format: "HH:mm",
                                    datetimeUTC: false,
                                    style: { fontFamily, fontSize: "11px", colors: theme.palette.text.secondary },
                                },
                                axisBorder: { show: false },
                                axisTicks: { show: false },
                            },
                            yaxis: [
                                {
                                    seriesName: "RPS",
                                    title: {
                                        text: "RPS / Users",
                                        style: { fontFamily, fontSize: "11px" },
                                    },
                                    labels: { style: { fontFamily, fontSize: "11px" } },
                                },
                                { seriesName: "Active Users", show: false },
                                {
                                    seriesName: "CPU %",
                                    opposite: true,
                                    title: {
                                        text: "% / Queue depth",
                                        style: { fontFamily, fontSize: "11px" },
                                    },
                                    labels: {
                                        formatter: (v: number) => `${Math.round(v)}`,
                                        style: { fontFamily, fontSize: "11px" },
                                    },
                                },
                                { seriesName: "Queue Total", show: false },
                            ],
                            legend: { show: true, position: "top", fontSize: "12px" },
                            grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
                            tooltip: {
                                theme: theme.palette.mode,
                                shared: true,
                                x: { formatter: (val: number) => dayjs(val).format("HH:mm:ss") },
                            },
                        }}
                        series={[
                            { name: "RPS", data: sessionTs.rps },
                            { name: "Active Users", data: sessionTs.users },
                            { name: "CPU %", data: sessionTs.cpu },
                            { name: "Queue Total", data: sessionTs.queues },
                        ]}
                        type="line"
                        height={300}
                    />
                )}
            </Section>

            {/* Row 3 – Cross-API comparison */}
            <Section
                title="Cross-API Comparison"
                description="Analytics-DB active users (continuous line) vs live-analytics session snapshots + RPS — dual-source, dual-axis"
                tone="success"
                icon={<Global size={18} variant="Bold" />}
            >
                {auLoading ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                            Loading active-users API…
                        </Typography>
                    </Box>
                ) : (
                    <ReactApexChart
                        options={{
                            ...baseChart,
                            chart: { ...baseChart.chart, type: "area" },
                            stroke: { curve: "smooth", width: [2, 1, 2], dashArray: [0, 6, 0] },
                            colors: [
                                theme.palette.primary.main,
                                theme.palette.success.main,
                                theme.palette.warning.main,
                            ],
                            markers: { size: [0, 6, 5], hover: { size: 7 } },
                            fill: {
                                type: ["gradient", "solid", "solid"],
                                gradient: {
                                    shade: "light",
                                    type: "vertical",
                                    opacityFrom: 0.25,
                                    opacityTo: 0,
                                },
                            },
                            xaxis: {
                                type: "datetime",
                                labels: {
                                    format: "HH:mm",
                                    datetimeUTC: false,
                                    style: { fontFamily, fontSize: "11px", colors: theme.palette.text.secondary },
                                },
                                axisBorder: { show: false },
                                axisTicks: { show: false },
                            },
                            yaxis: [
                                {
                                    seriesName: "Active Users (analytics API)",
                                    title: {
                                        text: "Active Users",
                                        style: { fontFamily, fontSize: "11px" },
                                    },
                                    labels: { style: { fontFamily, fontSize: "11px" } },
                                },
                                {
                                    seriesName: "Live Sessions (live-analytics)",
                                    show: false,
                                },
                                {
                                    seriesName: "RPS (live-analytics)",
                                    opposite: true,
                                    title: {
                                        text: "Req / sec",
                                        style: { fontFamily, fontSize: "11px" },
                                    },
                                    labels: {
                                        formatter: (v: number) => v.toFixed(1),
                                        style: { fontFamily, fontSize: "11px" },
                                    },
                                },
                            ],
                            legend: { show: true, position: "top", fontSize: "12px" },
                            grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
                            tooltip: {
                                theme: theme.palette.mode,
                                shared: true,
                                x: { formatter: (val: number) => dayjs(val).format("HH:mm") },
                                y: {
                                    formatter: (val: number, opts) => {
                                        const name = opts?.seriesIndex === 2 ? `${val.toFixed(1)} rps` : `${Math.round(val)} users`;
                                        return name;
                                    },
                                },
                            },
                        }}
                        series={[
                            { name: "Active Users (analytics API)", data: crossSeries.auApiLine },
                            { name: "Live Sessions (live-analytics)", data: crossSeries.liveUsersDots },
                            { name: "RPS (live-analytics)", data: crossSeries.rpsDots },
                        ]}
                        type="area"
                        height={320}
                    />
                )}
            </Section>

            <Box
                sx={{
                    p: 1.25,
                    borderRadius: 1.5,
                    background: alpha(theme.palette.info.main, 0.06),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                }}
            >
                <Typography variant="caption" sx={{ color: theme.palette.info.main, fontWeight: 600 }}>
                    Tip: Ogive curves and session history grow with each refresh — hit Refresh repeatedly to build a richer distribution.
                    The Cross-API chart overlays the analytics-DB user count (continuous line) with live-analytics snapshots (dots).
                    Divergence between the two user counts can reveal session counting differences between the two backends.
                </Typography>
            </Box>
        </Box>
    );
}
