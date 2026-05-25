import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
    Activity,
    Cpu,
    Data2,
    Diagram,
    Global,
    People,
    VideoSquare,
} from "iconsax-reactjs";
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { LiveAnalyticsData } from "../../../../types/liveAnalytics";
import Section from "../Section";

interface Props {
    payload: LiveAnalyticsData;
}

export default function ChartsView({ payload }: Props) {
    const theme = useTheme();
    const fontFamily = theme.typography.fontFamily as string;

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

    // ── USERS ───────────────────────────────────────────────────────────
    const usersDonut = useMemo(() => {
        const web = payload.users?.active_web ?? 0;
        const mobile = payload.users?.active_mobile ?? 0;
        const other = payload.users?.active_other ?? 0;
        const total = web + mobile + other;
        return {
            series: total === 0 ? [1] : [web, mobile, other],
            labels: total === 0 ? ["No data"] : ["Web", "Mobile", "Other"],
            colors:
                total === 0
                    ? [theme.palette.divider]
                    : [theme.palette.primary.main, theme.palette.success.main, theme.palette.secondary.main],
            total,
        };
    }, [payload.users, theme.palette]);

    // ── NGINX STATES ───────────────────────────────────────────────────
    const nginxDonut = useMemo(() => {
        const reading = payload.nginx?.reading ?? 0;
        const writing = payload.nginx?.writing ?? 0;
        const waiting = payload.nginx?.waiting ?? 0;
        const total = reading + writing + waiting;
        return {
            series: total === 0 ? [1] : [reading, writing, waiting],
            labels: total === 0 ? ["No data"] : ["Reading", "Writing", "Waiting"],
            colors:
                total === 0
                    ? [theme.palette.divider]
                    : [theme.palette.info.main, theme.palette.warning.main, theme.palette.success.main],
            total: payload.nginx?.active_connections ?? total,
        };
    }, [payload.nginx, theme.palette]);

    // ── FPM PROCESSES ──────────────────────────────────────────────────
    const fpmDonut = useMemo(() => {
        const active = payload.fpm?.active_processes ?? 0;
        const idle = payload.fpm?.idle_processes ?? 0;
        const total = active + idle;
        return {
            series: total === 0 ? [1] : [active, idle],
            labels: total === 0 ? ["No data"] : ["Active", "Idle"],
            colors:
                total === 0
                    ? [theme.palette.divider]
                    : [theme.palette.warning.main, theme.palette.success.main],
            total,
        };
    }, [payload.fpm, theme.palette]);

    // ── REDIS HIT RATE ─────────────────────────────────────────────────
    const cacheDonut = useMemo(() => {
        const hits = payload.redis?.keyspace_hits ?? 0;
        const misses = payload.redis?.keyspace_misses ?? 0;
        const total = hits + misses;
        const hitRate = total === 0 ? 0 : Math.round((hits / total) * 100);
        return {
            series: total === 0 ? [1] : [hits, misses],
            labels: total === 0 ? ["No data"] : ["Hits", "Misses"],
            colors:
                total === 0
                    ? [theme.palette.divider]
                    : [theme.palette.success.main, theme.palette.error.main],
            hitRate,
        };
    }, [payload.redis, theme.palette]);

    // ── CPU LOAD COMPARISON ────────────────────────────────────────────
    const cpuLoadBars = useMemo(() => {
        const s = payload.system;
        return {
            series: [{ name: "Load", data: [s?.load_1m ?? 0, s?.load_5m ?? 0, s?.load_15m ?? 0] }],
            categories: ["1m", "5m", "15m"],
        };
    }, [payload.system]);

    // ── RESOURCE USAGE PERCENT ─────────────────────────────────────────
    const resourceBars = useMemo(() => {
        const s = payload.system;
        const cpuPct = s?.load_per_core_pct ?? 0;
        const memPct = s?.mem_used_pct ?? 0;
        const diskPct = s?.disk_used_pct ?? 0;
        const swapPct =
            s && s.swap_total_bytes > 0
                ? Math.round((s.swap_used_bytes / s.swap_total_bytes) * 100)
                : 0;
        const toneFor = (pct: number) =>
            pct >= 85 ? theme.palette.error.main : pct >= 65 ? theme.palette.warning.main : theme.palette.success.main;
        return {
            series: [{ name: "Used %", data: [cpuPct, memPct, diskPct, swapPct] }],
            categories: ["CPU", "Memory", "Disk", "Swap"],
            colors: [cpuPct, memPct, diskPct, swapPct].map(toneFor),
        };
    }, [payload.system, theme.palette]);

    // ── MYSQL THREADS ──────────────────────────────────────────────────
    const mysqlBars = useMemo(() => {
        const conn = payload.mysql?.threads_connected ?? 0;
        const run = payload.mysql?.threads_running ?? 0;
        return {
            series: [{ name: "Threads", data: [conn, run] }],
            categories: ["Connected", "Running"],
        };
    }, [payload.mysql]);

    // ── QUEUE DEPTHS (horizontal bars, sorted) ─────────────────────────
    const queueBars = useMemo(() => {
        if (!payload.queues) return { series: [{ name: "Depth", data: [] }], categories: [] as string[] };
        const entries = Object.entries(payload.queues)
            .filter(([k]) => k !== "total")
            .sort(([, a], [, b]) => b - a);
        return {
            series: [{ name: "Depth", data: entries.map(([, v]) => v) }],
            categories: entries.map(([k]) => k),
        };
    }, [payload.queues]);

    // ── REVERB CONNECTIONS PER PORT ────────────────────────────────────
    const reverbBars = useMemo(() => {
        if (!payload.reverb) return { series: [{ name: "Connections", data: [] }], categories: [] as string[] };
        const entries = Object.entries(payload.reverb)
            .filter(([k]) => k !== "total")
            .sort(([, a], [, b]) => b - a);
        return {
            series: [{ name: "Connections", data: entries.map(([, v]) => v) }],
            categories: entries.map(([k]) => k.replace("port_", ":")),
        };
    }, [payload.reverb]);

    // ── LIVE CLASS PARTICIPANTS ────────────────────────────────────────
    const classBars = useMemo(() => {
        const list = payload.live_classes?.classes ?? [];
        const sorted = [...list].sort((a, b) => b.participants - a.participants);
        return {
            series: [{ name: "Participants", data: sorted.map((c) => c.participants) }],
            categories: sorted.map((c) => (c.name.length > 28 ? c.name.slice(0, 25) + "…" : c.name)),
        };
    }, [payload.live_classes]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Row 1 — three distribution donuts */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
                <Section title="Sessions by Channel" tone="primary" icon={<People size={18} variant="Bold" />}>
                    <Box sx={{ textAlign: "center" }}>
                        <ReactApexChart
                            options={{
                                ...baseChart,
                                chart: { ...baseChart.chart, type: "donut" },
                                labels: usersDonut.labels,
                                colors: usersDonut.colors,
                                legend: { show: true, position: "bottom", fontSize: "12px" },
                                stroke: { width: 0 },
                                plotOptions: {
                                    pie: {
                                        donut: {
                                            size: "70%",
                                            labels: {
                                                show: true,
                                                total: {
                                                    show: true,
                                                    label: "Total",
                                                    fontSize: "12px",
                                                    color: theme.palette.text.secondary,
                                                    formatter: () => `${usersDonut.total}`,
                                                },
                                            },
                                        },
                                    },
                                },
                            }}
                            series={usersDonut.series}
                            type="donut"
                            height={260}
                        />
                    </Box>
                </Section>

                <Section title="Nginx Connection States" tone="info" icon={<Global size={18} variant="Bold" />}>
                    <Box sx={{ textAlign: "center" }}>
                        <ReactApexChart
                            options={{
                                ...baseChart,
                                chart: { ...baseChart.chart, type: "donut" },
                                labels: nginxDonut.labels,
                                colors: nginxDonut.colors,
                                legend: { show: true, position: "bottom", fontSize: "12px" },
                                stroke: { width: 0 },
                                plotOptions: {
                                    pie: {
                                        donut: {
                                            size: "70%",
                                            labels: {
                                                show: true,
                                                total: {
                                                    show: true,
                                                    label: "Active",
                                                    fontSize: "12px",
                                                    color: theme.palette.text.secondary,
                                                    formatter: () => `${nginxDonut.total}`,
                                                },
                                            },
                                        },
                                    },
                                },
                            }}
                            series={nginxDonut.series}
                            type="donut"
                            height={260}
                        />
                    </Box>
                </Section>

                <Section title="PHP-FPM Processes" tone="warning" icon={<Cpu size={18} variant="Bold" />}>
                    <Box sx={{ textAlign: "center" }}>
                        <ReactApexChart
                            options={{
                                ...baseChart,
                                chart: { ...baseChart.chart, type: "donut" },
                                labels: fpmDonut.labels,
                                colors: fpmDonut.colors,
                                legend: { show: true, position: "bottom", fontSize: "12px" },
                                stroke: { width: 0 },
                                plotOptions: {
                                    pie: {
                                        donut: {
                                            size: "70%",
                                            labels: {
                                                show: true,
                                                total: {
                                                    show: true,
                                                    label: "Workers",
                                                    fontSize: "12px",
                                                    color: theme.palette.text.secondary,
                                                    formatter: () => `${fpmDonut.total}`,
                                                },
                                            },
                                        },
                                    },
                                },
                            }}
                            series={fpmDonut.series}
                            type="donut"
                            height={260}
                        />
                    </Box>
                </Section>
            </Box>

            {/* Row 2 — CPU load and resource usage */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                <Section title="CPU Load Trend" description="1m / 5m / 15m averages" tone="primary" icon={<Activity size={18} variant="Bold" />}>
                    <ReactApexChart
                        options={{
                            ...baseChart,
                            chart: { ...baseChart.chart, type: "bar" },
                            xaxis: { categories: cpuLoadBars.categories, labels: { style: { fontFamily } } },
                            yaxis: { labels: { style: { fontFamily } } },
                            colors: [theme.palette.primary.main],
                            plotOptions: { bar: { borderRadius: 6, columnWidth: "40%", distributed: false } },
                            fill: {
                                type: "gradient",
                                gradient: {
                                    type: "vertical",
                                    gradientToColors: [theme.palette.primary.light],
                                    stops: [0, 100],
                                    opacityFrom: 0.95,
                                    opacityTo: 0.5,
                                },
                            },
                            grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
                        }}
                        series={cpuLoadBars.series}
                        type="bar"
                        height={260}
                    />
                </Section>

                <Section title="Resource Usage" description="% used per resource (color = severity)" tone="warning" icon={<Cpu size={18} variant="Bold" />}>
                    <ReactApexChart
                        options={{
                            ...baseChart,
                            chart: { ...baseChart.chart, type: "bar" },
                            xaxis: {
                                categories: resourceBars.categories,
                                labels: { style: { fontFamily } },
                            },
                            yaxis: {
                                max: 100,
                                labels: {
                                    style: { fontFamily },
                                    formatter: (v: number) => `${v}%`,
                                },
                            },
                            colors: resourceBars.colors,
                            plotOptions: {
                                bar: { borderRadius: 6, columnWidth: "45%", distributed: true },
                            },
                            legend: { show: false },
                            grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
                        }}
                        series={resourceBars.series}
                        type="bar"
                        height={260}
                    />
                </Section>
            </Box>

            {/* Row 3 — Cache hit rate + MySQL threads */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                <Section title="Redis Cache Hit Rate" description={`${cacheDonut.hitRate}% hits`} tone="success" icon={<Data2 size={18} variant="Bold" />}>
                    <Box sx={{ textAlign: "center" }}>
                        <ReactApexChart
                            options={{
                                ...baseChart,
                                chart: { ...baseChart.chart, type: "donut" },
                                labels: cacheDonut.labels,
                                colors: cacheDonut.colors,
                                legend: { show: true, position: "bottom", fontSize: "12px" },
                                stroke: { width: 0 },
                                plotOptions: {
                                    pie: {
                                        donut: {
                                            size: "70%",
                                            labels: {
                                                show: true,
                                                total: {
                                                    show: true,
                                                    label: "Hit rate",
                                                    fontSize: "12px",
                                                    color: theme.palette.text.secondary,
                                                    formatter: () => `${cacheDonut.hitRate}%`,
                                                },
                                            },
                                        },
                                    },
                                },
                            }}
                            series={cacheDonut.series}
                            type="donut"
                            height={260}
                        />
                    </Box>
                </Section>

                <Section title="MySQL Threads" description="Connected vs actively running" tone="error" icon={<Data2 size={18} variant="Bold" />}>
                    <ReactApexChart
                        options={{
                            ...baseChart,
                            chart: { ...baseChart.chart, type: "bar" },
                            xaxis: { categories: mysqlBars.categories, labels: { style: { fontFamily } } },
                            yaxis: { labels: { style: { fontFamily } } },
                            colors: [theme.palette.error.main, theme.palette.warning.main],
                            plotOptions: { bar: { borderRadius: 6, columnWidth: "45%", distributed: true } },
                            legend: { show: false },
                            grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
                        }}
                        series={mysqlBars.series}
                        type="bar"
                        height={260}
                    />
                </Section>
            </Box>

            {/* Row 4 — Queue depths + Reverb */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                <Section title="Queue Depths" description="Pending jobs, highest first" tone="warning" icon={<Diagram size={18} variant="Bold" />}>
                    {queueBars.categories.length === 0 ? (
                        <Typography variant="caption" color="text.secondary">No queue data.</Typography>
                    ) : (
                        <ReactApexChart
                            options={{
                                ...baseChart,
                                chart: { ...baseChart.chart, type: "bar" },
                                plotOptions: { bar: { borderRadius: 4, horizontal: true, barHeight: "60%" } },
                                xaxis: { categories: queueBars.categories, labels: { style: { fontFamily } } },
                                yaxis: { labels: { style: { fontFamily, fontSize: "12px" } } },
                                colors: [theme.palette.warning.main],
                                fill: {
                                    type: "gradient",
                                    gradient: {
                                        type: "horizontal",
                                        gradientToColors: [theme.palette.warning.light],
                                        stops: [0, 100],
                                        opacityFrom: 0.95,
                                        opacityTo: 0.6,
                                    },
                                },
                                grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
                                dataLabels: { enabled: true, style: { fontSize: "11px", colors: [theme.palette.text.primary] } },
                            }}
                            series={queueBars.series}
                            type="bar"
                            height={Math.max(220, queueBars.categories.length * 36)}
                        />
                    )}
                </Section>

                <Section title="Reverb Connections by Port" description="Active websocket connections per port" tone="success" icon={<Global size={18} variant="Bold" />}>
                    {reverbBars.categories.length === 0 ? (
                        <Typography variant="caption" color="text.secondary">No reverb data.</Typography>
                    ) : (
                        <ReactApexChart
                            options={{
                                ...baseChart,
                                chart: { ...baseChart.chart, type: "bar" },
                                plotOptions: { bar: { borderRadius: 4, horizontal: true, barHeight: "60%" } },
                                xaxis: { categories: reverbBars.categories, labels: { style: { fontFamily } } },
                                yaxis: { labels: { style: { fontFamily, fontSize: "12px" } } },
                                colors: [theme.palette.success.main],
                                fill: {
                                    type: "gradient",
                                    gradient: {
                                        type: "horizontal",
                                        gradientToColors: [theme.palette.success.light],
                                        stops: [0, 100],
                                        opacityFrom: 0.95,
                                        opacityTo: 0.6,
                                    },
                                },
                                grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
                                dataLabels: { enabled: true, style: { fontSize: "11px", colors: [theme.palette.text.primary] } },
                            }}
                            series={reverbBars.series}
                            type="bar"
                            height={Math.max(220, reverbBars.categories.length * 36)}
                        />
                    )}
                </Section>
            </Box>

            {/* Row 5 — Live class participants */}
            <Section title="Live Class Participants" description="Active classes, sorted by audience size" tone="error" icon={<VideoSquare size={18} variant="Bold" />}>
                {classBars.categories.length === 0 ? (
                    <Typography variant="caption" color="text.secondary">No active live classes.</Typography>
                ) : (
                    <ReactApexChart
                        options={{
                            ...baseChart,
                            chart: { ...baseChart.chart, type: "bar" },
                            plotOptions: { bar: { borderRadius: 4, horizontal: true, barHeight: "60%" } },
                            xaxis: { categories: classBars.categories, labels: { style: { fontFamily } } },
                            yaxis: { labels: { style: { fontFamily, fontSize: "12px" } } },
                            colors: [theme.palette.error.main],
                            fill: {
                                type: "gradient",
                                gradient: {
                                    type: "horizontal",
                                    gradientToColors: [theme.palette.error.light],
                                    stops: [0, 100],
                                    opacityFrom: 0.95,
                                    opacityTo: 0.5,
                                },
                            },
                            grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
                            dataLabels: { enabled: true, style: { fontSize: "11px", colors: [theme.palette.text.primary] } },
                        }}
                        series={classBars.series}
                        type="bar"
                        height={Math.max(240, classBars.categories.length * 42)}
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
                    Tip: snapshot view — each chart compares the most recent values from the API. Switch to the “Detailed” tab for raw numbers and tables.
                </Typography>
            </Box>
        </Box>
    );
}
