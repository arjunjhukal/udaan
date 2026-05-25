import {
    Box,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
    Activity,
    Cpu,
    Data2,
    Diagram,
    DocumentText,
    Global,
    People,
    Stickynote,
    VideoSquare,
} from "iconsax-reactjs";
import type { LiveAnalyticsData } from "../../../../types/liveAnalytics";
import MetricTile from "../MetricTile";
import Section from "../Section";
import { formatBytes, formatDuration, formatUptime, timeAgo } from "../utils";

interface Props {
    payload: LiveAnalyticsData;
}

export default function DetailedView({ payload }: Props) {
    const theme = useTheme();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* TOP ROW — accent tiles in vibrant colors */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
                    gap: 1.5,
                }}
            >
                <MetricTile
                    label="Active Users"
                    value={payload.users?.active_total ?? 0}
                    sub={`Web ${payload.users?.active_web ?? 0} · Mobile ${payload.users?.active_mobile ?? 0} · Other ${payload.users?.active_other ?? 0}`}
                    tone="primary"
                    accent
                    icon={<People size={16} variant="Bold" />}
                />
                <MetricTile
                    label="Live Classes"
                    value={payload.live_classes?.active_count ?? 0}
                    sub={`${payload.live_classes?.total_participants ?? 0} participants`}
                    tone="error"
                    accent
                    icon={<VideoSquare size={16} variant="Bold" />}
                />
                <MetricTile
                    label="Active Tests"
                    value={payload.tests?.tracked_in_redis ?? 0}
                    sub={
                        payload.tests?.tracked_in_redis === 0
                            ? `${payload.tests?.distinct_users_in_log ?? 0} from logs (60s)`
                            : "tracked in redis"
                    }
                    tone="success"
                    accent
                    icon={<DocumentText size={16} variant="Bold" />}
                />
                <MetricTile
                    label="Requests / sec"
                    value={payload.request_rate?.rps ?? 0}
                    sub={`${payload.request_rate?.requests_last_60s ?? 0} in last 60s`}
                    tone="info"
                    accent
                    icon={<Activity size={16} variant="Bold" />}
                />
            </Box>

            {/* SYSTEM HEALTH */}
            <Section
                title="System Health"
                description="Host CPU, memory, disk, and swap"
                tone="primary"
                icon={<Cpu size={18} variant="Bold" />}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
                        gap: 1.5,
                    }}
                >
                    <MetricTile
                        label="CPU Load (1m)"
                        value={payload.system ? payload.system.load_1m.toFixed(2) : "—"}
                        sub={
                            payload.system
                                ? `${payload.system.cpu_count} cores · ${payload.system.load_per_core_pct ?? 0}% per core`
                                : undefined
                        }
                        percent={payload.system?.load_per_core_pct ?? null}
                    />
                    <MetricTile
                        label="Memory"
                        value={
                            payload.system
                                ? `${formatBytes(payload.system.mem_total_bytes - payload.system.mem_available_bytes)} / ${formatBytes(payload.system.mem_total_bytes)}`
                                : "—"
                        }
                        sub={`${payload.system?.mem_used_pct ?? 0}% used`}
                        percent={payload.system?.mem_used_pct ?? null}
                    />
                    <MetricTile
                        label="Disk"
                        value={
                            payload.system
                                ? `${formatBytes(payload.system.disk_used_bytes)} / ${formatBytes(payload.system.disk_total_bytes)}`
                                : "—"
                        }
                        sub={`${payload.system?.disk_used_pct ?? 0}% used`}
                        percent={payload.system?.disk_used_pct ?? null}
                    />
                    <MetricTile
                        label="Swap"
                        value={
                            payload.system
                                ? `${formatBytes(payload.system.swap_used_bytes)} / ${formatBytes(payload.system.swap_total_bytes)}`
                                : "—"
                        }
                        sub={`Uptime ${formatUptime(payload.system?.uptime_seconds)}`}
                        tone="secondary"
                    />
                </Box>
                <Box sx={{ display: "flex", gap: 2, mt: 1.5, flexWrap: "wrap" }}>
                    <Typography variant="caption" color="text.secondary">
                        Load 5m: <strong>{payload.system?.load_5m.toFixed(2) ?? "—"}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Load 15m: <strong>{payload.system?.load_15m.toFixed(2) ?? "—"}</strong>
                    </Typography>
                </Box>
            </Section>

            {/* WEB STACK */}
            <Section
                title="Web Stack"
                description="Nginx, PHP-FPM and Reverb websocket"
                tone="info"
                icon={<Global size={18} variant="Bold" />}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                        gap: 1.5,
                    }}
                >
                    {/* Nginx */}
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                            background: alpha(theme.palette.info.main, 0.04),
                        }}
                    >
                        <Typography sx={{ fontSize: "13px", fontWeight: 800, mb: 1, color: theme.palette.info.main }}>
                            Nginx
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                            <MetricTile label="Active" value={payload.nginx?.active_connections ?? "—"} tone="info" />
                            <MetricTile label="Reading" value={payload.nginx?.reading ?? "—"} tone="info" />
                            <MetricTile label="Writing" value={payload.nginx?.writing ?? "—"} tone="info" />
                            <MetricTile label="Waiting" value={payload.nginx?.waiting ?? "—"} tone="info" />
                        </Box>
                    </Box>

                    {/* PHP-FPM */}
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                            background: alpha(theme.palette.warning.main, 0.04),
                        }}
                    >
                        <Typography sx={{ fontSize: "13px", fontWeight: 800, mb: 1, color: theme.palette.warning.main }}>
                            PHP-FPM
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                            <MetricTile
                                label="Active"
                                value={payload.fpm?.active_processes ?? "—"}
                                sub={`max ${payload.fpm?.max_active_processes ?? "—"}`}
                                tone="warning"
                            />
                            <MetricTile label="Idle" value={payload.fpm?.idle_processes ?? "—"} tone="warning" />
                            <MetricTile
                                label="Listen Queue"
                                value={payload.fpm?.listen_queue ?? "—"}
                                sub={`peak ${payload.fpm?.max_listen_queue ?? "—"}`}
                                tone={(payload.fpm?.listen_queue ?? 0) > 0 ? "error" : "warning"}
                            />
                            <MetricTile
                                label="Slow Reqs"
                                value={payload.fpm?.slow_requests ?? "—"}
                                tone={(payload.fpm?.slow_requests ?? 0) > 0 ? "error" : "warning"}
                            />
                        </Box>
                        {(payload.fpm?.max_children_reached ?? 0) > 0 && (
                            <Typography variant="caption" sx={{ display: "block", mt: 1, color: "error.main", fontWeight: 700 }}>
                                ⚠ max_children_reached: {payload.fpm?.max_children_reached}
                            </Typography>
                        )}
                    </Box>

                    {/* Reverb */}
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                            background: alpha(theme.palette.success.main, 0.04),
                        }}
                    >
                        <Typography sx={{ fontSize: "13px", fontWeight: 800, mb: 1, color: theme.palette.success.main }}>
                            Reverb (WS)
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <MetricTile
                                label="Total Connections"
                                value={payload.reverb?.total ?? 0}
                                tone="success"
                                accent
                            />
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {payload.reverb &&
                                    Object.entries(payload.reverb)
                                        .filter(([k]) => k !== "total")
                                        .map(([k, v]) => (
                                            <Chip
                                                key={k}
                                                size="small"
                                                label={`${k.replace("port_", ":")} → ${v}`}
                                                sx={{
                                                    fontSize: "10.5px",
                                                    height: 22,
                                                    backgroundColor: alpha(theme.palette.success.main, 0.14),
                                                    color: theme.palette.success.main,
                                                    fontWeight: 600,
                                                    border: `1px solid ${alpha(theme.palette.success.main, 0.25)}`,
                                                }}
                                            />
                                        ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Section>

            {/* DATABASE & CACHE */}
            <Section
                title="Database & Cache"
                description="MySQL and Redis"
                tone="error"
                icon={<Data2 size={18} variant="Bold" />}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        gap: 1.5,
                    }}
                >
                    {/* MySQL */}
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                            background: alpha(theme.palette.error.main, 0.04),
                        }}
                    >
                        <Typography sx={{ fontSize: "13px", fontWeight: 800, mb: 1, color: theme.palette.error.main }}>
                            MySQL
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                            <MetricTile label="Threads Conn." value={payload.mysql?.threads_connected ?? "—"} tone="error" />
                            <MetricTile label="Threads Running" value={payload.mysql?.threads_running ?? "—"} tone="error" />
                            <MetricTile label="Queries / sec" value={payload.mysql?.queries_per_sec ?? "—"} tone="error" />
                            <MetricTile
                                label="Slow Queries"
                                value={payload.mysql?.slow_queries_total ?? "—"}
                                tone={(payload.mysql?.slow_queries_total ?? 0) > 0 ? "warning" : "error"}
                            />
                            <Box sx={{ gridColumn: "1 / -1" }}>
                                <MetricTile
                                    label="InnoDB Buffer Pool"
                                    value={`${payload.mysql?.innodb_buffer_pool_used_pct ?? 0}%`}
                                    percent={payload.mysql?.innodb_buffer_pool_used_pct ?? null}
                                />
                            </Box>
                        </Box>
                    </Box>

                    {/* Redis */}
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            background: alpha(theme.palette.primary.main, 0.04),
                        }}
                    >
                        <Typography sx={{ fontSize: "13px", fontWeight: 800, mb: 1, color: theme.palette.primary.main }}>
                            Redis
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                            <MetricTile
                                label="Used Memory"
                                value={formatBytes(payload.redis?.used_memory_bytes)}
                                sub={`peak ${formatBytes(payload.redis?.used_memory_peak_bytes)}`}
                                tone="primary"
                            />
                            <MetricTile
                                label="Frag Ratio"
                                value={payload.redis?.mem_fragmentation_ratio?.toFixed(2) ?? "—"}
                                tone={(payload.redis?.mem_fragmentation_ratio ?? 0) > 1.5 ? "warning" : "primary"}
                            />
                            <MetricTile label="Clients" value={payload.redis?.connected_clients ?? "—"} tone="primary" />
                            <MetricTile label="Ops / sec" value={payload.redis?.ops_per_sec ?? "—"} tone="primary" />
                            <Box sx={{ gridColumn: "1 / -1" }}>
                                <MetricTile
                                    label="Cache Hits / Misses"
                                    value={`${payload.redis?.keyspace_hits ?? 0} / ${payload.redis?.keyspace_misses ?? 0}`}
                                    sub={
                                        (payload.redis?.keyspace_hits ?? 0) + (payload.redis?.keyspace_misses ?? 0) > 0
                                            ? `${Math.round(
                                                ((payload.redis?.keyspace_hits ?? 0) /
                                                    ((payload.redis?.keyspace_hits ?? 0) +
                                                        (payload.redis?.keyspace_misses ?? 0))) *
                                                100
                                            )}% hit rate`
                                            : undefined
                                    }
                                    tone="success"
                                    accent
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Section>

            {/* QUEUES */}
            <Section
                title="Queue Depths"
                description="Pending jobs per Redis queue"
                tone="warning"
                icon={<Diagram size={18} variant="Bold" />}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
                        gap: 1.5,
                    }}
                >
                    {payload.queues &&
                        Object.entries(payload.queues)
                            .filter(([k]) => k !== "total")
                            .map(([k, v]) => (
                                <MetricTile
                                    key={k}
                                    label={k}
                                    value={v}
                                    tone={v === 0 ? "success" : v > 100 ? "error" : v > 10 ? "warning" : "info"}
                                />
                            ))}
                    <MetricTile
                        label="Total"
                        value={payload.queues?.total ?? 0}
                        tone={
                            (payload.queues?.total ?? 0) === 0
                                ? "success"
                                : (payload.queues?.total ?? 0) > 100
                                    ? "error"
                                    : "warning"
                        }
                        accent
                    />
                </Box>
            </Section>

            {/* LIVE CLASSES */}
            <Section
                title="Active Live Classes"
                description={
                    payload.live_classes?.active_count === 0
                        ? "No classes currently in progress"
                        : `${payload.live_classes?.active_count ?? 0} class${(payload.live_classes?.active_count ?? 0) === 1 ? "" : "es"} ongoing`
                }
                tone="error"
                icon={<VideoSquare size={18} variant="Bold" />}
            >
                {(payload.live_classes?.classes?.length ?? 0) === 0 ? (
                    <Typography variant="caption" color="text.secondary">
                        Nothing live right now.
                    </Typography>
                ) : (
                    <TableContainer>
                        <Table size="small" sx={{
                            "& tbody tr": {
                                transition: "background 0.15s ease",
                                "&:hover": { background: alpha(theme.palette.error.main, 0.05) },
                            },
                        }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, color: theme.palette.error.main }}>Class</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: theme.palette.error.main }}>Started</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: theme.palette.error.main }}>Ends</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: theme.palette.error.main }} align="right">Participants</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payload.live_classes?.classes.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                                        <TableCell>{timeAgo(c.started_at)}</TableCell>
                                        <TableCell>{c.ends_at ? new Date(c.ends_at).toLocaleTimeString() : "—"}</TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                size="small"
                                                label={c.participants}
                                                sx={{
                                                    background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.hover || theme.palette.error.main})`,
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                    minWidth: 36,
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Section>

            {/* SESSIONS */}
            <Section
                title="Sessions"
                description={`${payload.users?.active_window_minutes ?? 0}-minute active window`}
                tone="success"
                icon={<People size={18} variant="Bold" />}
            >
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 1.5 }}>
                    <MetricTile label="Web" value={payload.users?.active_web ?? 0} tone="primary" accent />
                    <MetricTile label="Mobile" value={payload.users?.active_mobile ?? 0} tone="success" accent />
                    <MetricTile label="Other" value={payload.users?.active_other ?? 0} tone="secondary" />
                    <MetricTile
                        label="Avg Session Age"
                        value={formatDuration(payload.users?.avg_session_age_seconds)}
                        tone="info"
                    />
                </Box>
                {payload.tests?.instrumentation_note && (
                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            mt: 1.5,
                            p: 1.25,
                            borderRadius: 1.5,
                            background: alpha(theme.palette.warning.main, 0.1),
                            color: theme.palette.warning.main,
                            fontStyle: "italic",
                            fontWeight: 500,
                        }}
                    >
                        {payload.tests.instrumentation_note}
                    </Typography>
                )}
            </Section>

            {/* RECENT ACTIVITY */}
            <Section
                title="Recent Activity"
                description="Latest 20 activity log entries"
                tone="primary"
                icon={<Stickynote size={18} variant="Bold" />}
            >
                {(payload.recent_activity?.length ?? 0) === 0 ? (
                    <Typography variant="caption" color="text.secondary">
                        No recent activity.
                    </Typography>
                ) : (
                    <TableContainer>
                        <Table size="small" sx={{
                            "& tbody tr": {
                                transition: "background 0.15s ease",
                                "&:hover": { background: alpha(theme.palette.primary.main, 0.05) },
                            },
                        }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>Log</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>Description</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>Subject</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>Causer</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>When</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payload.recent_activity?.map((a) => (
                                    <TableRow key={a.id}>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={a.log_name ?? "—"}
                                                sx={{
                                                    fontSize: "10.5px",
                                                    height: 22,
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.14),
                                                    color: theme.palette.primary.main,
                                                    fontWeight: 600,
                                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontSize: "12.5px" }}>{a.description ?? "—"}</TableCell>
                                        <TableCell sx={{ fontSize: "12px", color: "text.secondary" }}>
                                            {a.subject_type ? `${a.subject_type.split("\\").pop()}${a.subject_id ? ` #${a.subject_id}` : ""}` : "—"}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: "12px", color: "text.secondary" }}>
                                            {a.causer_id ? `User #${a.causer_id}` : "—"}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: "12px", whiteSpace: "nowrap" }}>{timeAgo(a.created_at)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Section>
        </Box>
    );
}
