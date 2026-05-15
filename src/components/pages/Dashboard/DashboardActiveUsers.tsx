import { Add, Close, Fullscreen, Refresh } from "@mui/icons-material";
import { Box, Button, Chip, Dialog, DialogContent, Divider, IconButton, Skeleton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { useGetActiveUsersQuery } from "../../../services/dashboardApi";
import type { ActiveUserPoint } from "../../../types/dashboard";
import MakuraDatePicker from "../../atoms/MakuraDatePicker";

const SAMPLE_ANCHOR = "2000-01-01T";

function generateSamplePoints(dateStr: string): ActiveUserPoint[] {
    const out: ActiveUserPoint[] = [];
    const base = dayjs(dateStr).startOf("day");
    const seed = base.unix();
    for (let m = 0; m < 1440; m += 5) {
        const hour = m / 60;
        const dayCurve = Math.sin(((hour - 8) / 24) * Math.PI * 2) * 25 + 35;
        const noise = ((Math.sin(seed + m * 13.37) + 1) / 2) * 12;
        const count = Math.max(0, Math.round(dayCurve + noise));
        out.push({
            timestamp: base.add(m, "minute").toISOString(),
            count,
        });
    }
    return out;
}

function timeOfDayKey(timestamp: string) {
    const d = dayjs(timestamp);
    const hh = String(d.hour()).padStart(2, "0");
    const mm = String(d.minute()).padStart(2, "0");
    const ss = String(d.second()).padStart(2, "0");
    return `${SAMPLE_ANCHOR}${hh}:${mm}:${ss}`;
}

function toSeriesData(points: ActiveUserPoint[]) {
    return points.map((p) => ({
        x: new Date(timeOfDayKey(p.timestamp)).getTime(),
        y: p.count,
    }));
}

export default function DashboardActiveUsers() {
    const theme = useTheme();
    const today = useMemo(() => dayjs().startOf("day"), []);
    const [primaryDate, setPrimaryDate] = useState<Dayjs | null>(today);
    const [compareDate, setCompareDate] = useState<Dayjs | null>(null);
    const [compareEnabled, setCompareEnabled] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const primaryDateStr = (primaryDate ?? today).format("YYYY-MM-DD");
    const compareDateStr = compareDate ? compareDate.format("YYYY-MM-DD") : undefined;

    const primaryQuery = useGetActiveUsersQuery({ date: primaryDateStr });
    const compareQuery = useGetActiveUsersQuery(
        compareEnabled && compareDateStr ? { date: compareDateStr } : { date: primaryDateStr },
        { skip: !(compareEnabled && compareDateStr) }
    );

    const primaryPoints = primaryQuery.data?.data ?? [];
    const comparePoints = compareQuery.data?.data ?? [];

    const isLoading = primaryQuery.isLoading || (compareEnabled && compareQuery.isLoading);
    const isFetching = primaryQuery.isFetching || compareQuery.isFetching;

    const hasRealPrimary = primaryPoints.length > 0;
    const hasRealCompare = compareEnabled && comparePoints.length > 0;
    const isSample = !hasRealPrimary && !hasRealCompare && !isLoading;

    const effectivePrimary = useMemo(
        () => (hasRealPrimary ? primaryPoints : isSample ? generateSamplePoints(primaryDateStr) : []),
        [hasRealPrimary, primaryPoints, isSample, primaryDateStr]
    );
    const effectiveCompare = useMemo(
        () => {
            if (!compareEnabled || !compareDateStr) return [];
            if (hasRealCompare) return comparePoints;
            if (isSample) return generateSamplePoints(compareDateStr);
            return [];
        },
        [compareEnabled, compareDateStr, hasRealCompare, comparePoints, isSample]
    );

    const series = useMemo(() => {
        const list: { name: string; data: { x: number; y: number }[] }[] = [
            {
                name: (primaryDate ?? today).format("MMM D, YYYY"),
                data: toSeriesData(effectivePrimary),
            },
        ];
        if (compareEnabled && compareDate) {
            list.push({
                name: compareDate.format("MMM D, YYYY"),
                data: toSeriesData(effectiveCompare),
            });
        }
        return list;
    }, [effectivePrimary, effectiveCompare, primaryDate, compareDate, compareEnabled, today]);

    const buildOptions = useCallback((zoomable: boolean): ApexCharts.ApexOptions => ({
        chart: {
            type: "area",
            toolbar: {
                show: zoomable,
                tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true,
                },
            },
            zoom: { enabled: zoomable, type: "x", autoScaleYaxis: true },
            background: "transparent",
            animations: { enabled: false },
        },
        stroke: {
            curve: "smooth",
            width: 2,
            dashArray: compareEnabled ? [0, 4] : [0],
        },
        colors: [theme.palette.primary.main, theme.palette.success.main],
        markers: { size: 0, hover: { size: 5 } },
        fill: {
            type: "gradient",
            gradient: {
                shade: "light",
                type: "vertical",
                shadeIntensity: 0.25,
                opacityFrom: 0.3,
                opacityTo: 0,
            },
        },
        xaxis: {
            type: "datetime",
            labels: {
                show: zoomable,
                style: { colors: theme.palette.text.secondary, fontSize: "11px" },
                datetimeUTC: false,
                format: "HH:mm",
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false },
            crosshairs: { show: true },
        },
        yaxis: {
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                    fontSize: "11px",
                },
                formatter: (val) =>
                    val >= 1000 ? `${(val / 1000).toFixed(1)}k` : String(Math.round(val)),
            },
        },
        grid: {
            borderColor: theme.palette.divider,
            strokeDashArray: 3,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
            padding: { left: 8, right: 16, top: 0, bottom: 0 },
        },
        tooltip: {
            theme: theme.palette.mode,
            shared: true,
            x: { formatter: (val) => dayjs(val).format("HH:mm") },
            y: {
                formatter: (val) => `${Math.round(val)} users`,
            },
            marker: { show: true },
        },
        dataLabels: { enabled: false },
        legend: {
            show: compareEnabled,
            position: "top",
            horizontalAlign: "right",
        },
    }), [theme, compareEnabled]);

    const options = useMemo(() => buildOptions(false), [buildOptions]);
    const expandedOptions = useMemo(() => buildOptions(true), [buildOptions]);

    const handleRefresh = () => {
        primaryQuery.refetch();
        if (compareEnabled && compareDateStr) compareQuery.refetch();
    };

    const handleEnableCompare = () => {
        setCompareEnabled(true);
        if (!compareDate) {
            setCompareDate((primaryDate ?? today).subtract(1, "day"));
        }
    };

    const handleDisableCompare = () => {
        setCompareEnabled(false);
    };

    return (
        <Box
            className="dashboard__active__users mb-4 lg:mb-6 py-6 px-8 rounded-lg"
            sx={{ background: (t) => t.palette.primary.contrastText }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                    <Typography variant="h4" fontWeight={600}>
                        Active Users
                    </Typography>
                    {isSample && (
                        <Chip
                            size="small"
                            label="Sample data"
                            sx={{
                                bgcolor: `${theme.palette.warning.main}18`,
                                color: theme.palette.warning.main,
                                border: "none",
                                height: 22,
                            }}
                        />
                    )}
                </Stack>

                <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                    {compareEnabled && (
                        <Stack direction="row" alignItems="center" gap={0.5}>
                            <Typography variant="caption" color="text.secondary">
                                Compare:
                            </Typography>
                            <Box sx={{ width: 170 }}>
                                <MakuraDatePicker
                                    value={compareDate}
                                    onChange={(v) => setCompareDate(v)}
                                    maxDate={today}
                                    placeholder="Select date"
                                />
                            </Box>
                            <Tooltip title="Remove compare">
                                <IconButton size="small" onClick={handleDisableCompare} aria-label="Remove compare">
                                    <Close fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    )}

                    <Stack direction="row" alignItems="center" gap={0.5}>
                        <Typography variant="caption" color="text.secondary">
                            Date:
                        </Typography>
                        <Box sx={{ width: 170 }}>
                            <MakuraDatePicker
                                value={primaryDate}
                                onChange={(v) => setPrimaryDate(v)}
                                maxDate={today}
                                placeholder="Select date"
                            />
                        </Box>
                    </Stack>

                    {!compareEnabled && (
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Add fontSize="small" />}
                            onClick={handleEnableCompare}
                        >
                            Compare
                        </Button>
                    )}

                    <Tooltip title="Refresh">
                        <span>
                            <IconButton
                                onClick={handleRefresh}
                                disabled={isFetching}
                                size="small"
                                aria-label="Refresh active users"
                            >
                                <Refresh
                                    sx={{
                                        animation: isFetching ? "spin 0.8s linear infinite" : "none",
                                        "@keyframes spin": {
                                            from: { transform: "rotate(0deg)" },
                                            to: { transform: "rotate(360deg)" },
                                        },
                                    }}
                                />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Expand chart">
                        <span>
                            <IconButton
                                onClick={() => setExpanded(true)}
                                disabled={isLoading}
                                size="small"
                                aria-label="Expand active users chart"
                            >
                                <Fullscreen />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Stack>
            </Stack>
            <Divider className="my-4!" />

            <Box sx={{ minHeight: 320 }}>
                {isLoading ? (
                    <Skeleton variant="rounded" height={320} animation="wave" />
                ) : (
                    <Chart options={options} series={series} type="area" height={320} width="100%" />
                )}
            </Box>

            <Dialog
                open={expanded}
                onClose={() => setExpanded(false)}
                maxWidth="lg"
                fullWidth
                aria-label="Active users expanded chart"
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ px: 3, pt: 2.5 }}
                >
                    <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                        <Typography variant="h4" fontWeight={600}>
                            Active Users
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Drag across the chart to zoom into a time range.
                        </Typography>
                    </Stack>
                    <IconButton onClick={() => setExpanded(false)} size="small" aria-label="Close expanded chart">
                        <Close />
                    </IconButton>
                </Stack>
                <DialogContent>
                    <Chart options={expandedOptions} series={series} type="area" height={520} width="100%" />
                </DialogContent>
            </Dialog>
        </Box>
    );
}
