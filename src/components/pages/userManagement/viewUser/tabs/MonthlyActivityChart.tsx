import { Box, Divider, Skeleton, Stack, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import Chart from "react-apexcharts";
import { useGetUserMonthlyActivityQuery } from "../../../../../services/userApi";

export default function MonthlyActivityChart({ uid }: { uid: number }) {
    const theme = useTheme();
    const [period, setPeriod] = useState<7 | 30>(7);

    const { data, isLoading } = useGetUserMonthlyActivityQuery({ id: uid, period }, { skip: !uid });

    const items = data?.data ?? [];
    const categories = items.map((d) => d.label);
    const seriesData = items.map((d) => d.hours);

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
            background: "transparent",
            zoom: { enabled: false },
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: "55%",
            },
        },
        colors: [theme.palette.primary.main],
        xaxis: {
            categories,
            title: {
                text: period === 30 ? "Months" : "Days",
                style: { color: theme.palette.text.secondary, fontSize: "12px", fontWeight: 400 },
            },
            labels: {
                style: { colors: theme.palette.text.secondary, fontSize: "11px" },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            title: {
                text: "Hours",
                style: { color: theme.palette.text.secondary, fontSize: "12px", fontWeight: 400 },
            },
            labels: {
                style: { colors: theme.palette.text.secondary, fontSize: "11px" },
                formatter: (val) => String(Math.round(val)),
            },
        },
        grid: {
            borderColor: theme.palette.divider,
            strokeDashArray: 3,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
        },
        tooltip: {
            theme: theme.palette.mode,
            y: { formatter: (val) => `${val} hrs` },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
    };

    return (
        <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Typography variant="h5" fontWeight={600}>Monthly Activity</Typography>
                <ToggleButtonGroup
                    value={period}
                    exclusive
                    size="small"
                    onChange={(_e, val) => { if (val !== null) setPeriod(val); }}
                    sx={{ "& .MuiToggleButton-root": { px: 1.5, py: 0.4, fontSize: 12, textTransform: "none", borderRadius: "6px !important" } }}
                >
                    <ToggleButton value={7}>Last 7 Days</ToggleButton>
                    <ToggleButton value={30}>Last 30 Days</ToggleButton>
                </ToggleButtonGroup>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            {isLoading ? (
                <Skeleton variant="rounded" height={220} animation="wave" />
            ) : (
                <Box sx={{ minWidth: 0, overflow: "hidden" }}>
                    <Chart
                        options={options}
                        series={[{ name: "Hours", data: seriesData }]}
                        type="bar"
                        height={220}
                        width="100%"
                    />
                </Box>
            )}
        </>
    );
}
