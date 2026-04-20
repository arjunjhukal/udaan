import { TrendingDown, TrendingUp } from "@mui/icons-material";
import { Box, Chip, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import Chart from "react-apexcharts";
import { useGetNewSignUpsQuery } from "../../../../services/userApi";

export default function NewSignUpsChart() {
    const theme = useTheme();
    const { data, isLoading } = useGetNewSignUpsQuery();

    const signUpData = data?.data?.data ?? [];
    const categories = signUpData.map((d) => d.month);
    const seriesData = signUpData.map((d) => d.sign_ups);

    const isDecrease = data?.data?.description?.toLowerCase().includes("decrease");

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "area",
            toolbar: { show: false },
            background: "transparent",
            sparkline: { enabled: false },
            zoom: { enabled: false },
        },
        stroke: {
            curve: "smooth",
            width: 2.5,
        },
        colors: [theme.palette.primary.main],
        markers: {
            size: 0,
            hover: { size: 5 },
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "light",
                type: "vertical",
                shadeIntensity: 0.2,
                opacityFrom: 0.15,
                opacityTo: 0,
            },
        },
        xaxis: {
            categories,
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                    fontSize: "11px",
                },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false },
        },
        yaxis: {
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                    fontSize: "11px",
                },
                formatter: (val) =>
                    val >= 1000 ? `${(val / 1000).toFixed(0)}k` : String(Math.round(val)),
            },
        },
        grid: {
            borderColor: theme.palette.divider,
            strokeDashArray: 3,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
            padding: { left: 0, right: 8 },
        },
        tooltip: {
            theme: theme.palette.mode,
            y: { formatter: (val) => val.toLocaleString() },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
    };

    const series = [{ name: "Sign Ups", data: seriesData }];

    return (
        <Box
            sx={{
                borderRadius: 3,
                p: 2.5,
                border: (t) => `1px solid ${t.palette.divider}`,
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
            }}
        >
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1} mb={2} flexWrap="wrap">
                <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap" minWidth={0}>
                    <Typography variant="h6" fontWeight={700} noWrap>
                        {data?.data?.title ?? "New Sign Ups"}
                    </Typography>
                    {isLoading ? (
                        <Skeleton width={80} height={24} />
                    ) : (
                        <Typography variant="h6" fontWeight={700} color="primary.main" noWrap>
                            {(data?.data?.value ?? 0).toLocaleString()}
                        </Typography>
                    )}
                    {!isLoading && data?.data?.description && (
                        <Chip
                            size="small"

                            icon={
                                isDecrease ? (
                                    <TrendingDown />
                                ) : (
                                    <TrendingUp />
                                )
                            }
                            label={
                                <Typography
                                    variant="caption"
                                    color={isDecrease ? "error.main" : "success.main"}
                                    sx={{
                                        maxWidth: 160,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        display: "block",
                                    }}
                                >
                                    {data.data.description}
                                </Typography>
                            }
                            sx={{
                                bgcolor: isDecrease
                                    ? `${theme.palette.error.main}18`
                                    : `${theme.palette.success.main}18`,
                                border: "none",
                                height: 24,
                                maxWidth: 200,
                                color: isDecrease ? theme.palette.error.main : theme.palette.success.main
                            }}
                        />
                    )}
                </Stack>
            </Stack>

            {isLoading ? (
                <Skeleton variant="rounded" height={220} animation="wave" sx={{ flexShrink: 0 }} />
            ) : (
                <Box sx={{ flexGrow: 1, minWidth: 0, overflow: "hidden" }}>
                    <Chart options={options} series={series} type="area" height={220} width="100%" />
                </Box>
            )}
        </Box>
    );
}
