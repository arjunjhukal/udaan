import { useTheme } from "@mui/material";
import Chart from "react-apexcharts";

interface PercentageChartProps {
    value: number;
}

export function PercentageDonutChart({ value = 0 }: PercentageChartProps) {
    const theme = useTheme();

    const safeValue =
        typeof value === "number" && !isNaN(value)
            ? Math.min(Math.max(value, 0), 100)
            : 0;
    const remaining = 100 - safeValue;

    const series = [safeValue, remaining];

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "donut",
            width: 128,
            height: 128,
            sparkline: {
                enabled: true,
            },
        },
        colors: [theme.palette.primary.main, theme.palette.textField.border],
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "70%",
                    labels: {
                        show: true,
                        name: {
                            show: false,
                        },

                        total: {
                            show: true,
                            showAlways: true,
                            label: "Score",
                            fontSize: "20px",
                            fontWeight: "500",
                            color: theme.palette.primary.main,
                            formatter: () => `${safeValue}%`,
                        },
                    },
                },
            },
        },
        stroke: {
            width: 0,
        },
        tooltip: {
            enabled: false,
        },
        states: {
            hover: {
                filter: {
                    type: 'none',
                }
            },
            active: {
                filter: {
                    type: 'none',
                }
            }
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    chart: {
                        width: 180,
                    },
                },
            },
        ],
    };

    return <Chart options={options} series={series} type="donut" width="100%" />;
}