import { Box, LinearProgress, Stack, Typography, useTheme } from "@mui/material";
import Chart from "react-apexcharts";

const platformConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
	android: {
		label: "Android",
		color: "#3DDC84",
		icon: (
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M6 18V9.5M18 18V9.5M9 9.5V18M15 9.5V18M3 7.5C3 6.4 3.9 5.5 5 5.5H19C20.1 5.5 21 6.4 21 7.5V20.5C21 21.6 20.1 22.5 19 22.5H5C3.9 22.5 3 21.6 3 20.5V7.5ZM15.5 5.5L17 2M8.5 5.5L7 2" stroke="#3DDC84" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		),
	},
	ios: {
		label: "iOS",
		color: "#555555",
		icon: (
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12 2C8.5 2 7 3.5 7 7C5.5 7 4 8.5 4 10.5C4 14 6 17.5 8 19.5C9 20.5 10 21 11 21H13C14 21 15 20.5 16 19.5C18 17.5 20 14 20 10.5C20 8.5 18.5 7 17 7C17 3.5 15.5 2 12 2Z" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				<path d="M12 2V7" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" />
			</svg>
		),
	},
	web: {
		label: "Web",
		color: "#3B82F6",
		icon: (
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="1.5" />
				<path d="M12 2C12 2 8 7 8 12C8 17 12 22 12 22M12 2C12 2 16 7 16 12C16 17 12 22 12 22M2 12H22" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
			</svg>
		),
	},
};

function getPlatformConfig(platform: string) {
	const key = platform.toLowerCase();
	return (
		platformConfig[key] ?? {
			label: platform.charAt(0).toUpperCase() + platform.slice(1),
			color: "#8B5CF6",
			icon: (
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="5" y="2" width="14" height="20" rx="2" stroke="#8B5CF6" strokeWidth="1.5" />
					<circle cx="12" cy="18" r="1" fill="#8B5CF6" />
				</svg>
			),
		}
	);
}

interface Props {
	breakdown: { platform: string; count: number; percentage: number }[];
}

export default function PlatformBreakdown({ breakdown }: Props) {
	const theme = useTheme();

	const chartSeries = breakdown.map((item) => item.percentage);
	const chartLabels = breakdown.map((item) => getPlatformConfig(item.platform).label);
	const chartColors = breakdown.map((item) => getPlatformConfig(item.platform).color);
	const topPlatform = breakdown.reduce(
		(prev, current) => (current.percentage > prev.percentage ? current : prev),
		breakdown[0] ?? { platform: "", count: 0, percentage: 0 }
	);
	const hasData = breakdown.length > 0 && breakdown.some((item) => item.percentage > 0);

	const chartOptions: ApexCharts.ApexOptions = {
		chart: {
			type: "donut",
			sparkline: {
				enabled: true,
			},
			toolbar: {
				show: false,
			},
		},
		labels: chartLabels,
		colors: chartColors,
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
							show: true,
							fontSize: "14px",
							fontWeight: "600",
							color: theme.palette.text.primary,
							formatter: () => (topPlatform ? getPlatformConfig(topPlatform.platform).label : ""),
						},
						total: {
							show: true,
							showAlways: true,
							label: "Top",
							fontSize: "12px",
							color: theme.palette.text.secondary,
							formatter: () => `${topPlatform.percentage}%`,
						},
					},
				},
			},
		},
		stroke: {
			width: 0,
		},
		tooltip: {
			enabled: true,
			theme: theme.palette.mode,
		},
	};

	return (
		<Box>
			<Typography variant="subtitle2" color="text.secondary" fontWeight={400} mb={1.5}>
				Request by platform
			</Typography>
			<Box className="flex flex-wrap gap-4" sx={{ alignItems: "flex-start" }}>
				<Box sx={{ width: "100%", maxWidth: 220, mx: "auto" }}>
					{hasData ? (
						<Chart options={chartOptions} series={chartSeries} type="donut" width="100%" height={220} />
					) : (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								height: 220,
								borderRadius: 3,
								border: `1px solid ${theme.palette.divider}`,
							}}>
							<Typography variant="caption" color="text.secondary">
								No platform data available
							</Typography>
						</Box>
					)}
				</Box>

				<Stack gap={1.5} flexDirection={"column"} className="w-full md:w-[calc(100%-280px)]">
					{breakdown.map((item) => {
						const cfg = getPlatformConfig(item.platform);
						return (
							<Box key={item.platform}>
								<Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.5}>
									<Stack direction="row" alignItems="center" gap={1}>
										{cfg.icon}
										<Typography variant="body2" fontWeight={500}>
											{cfg.label}
										</Typography>
									</Stack>
									<Typography variant="body2" fontWeight={600} color="text.secondary">
										{item.percentage}%
									</Typography>
								</Stack>
								<LinearProgress
									variant="determinate"
									value={item.percentage}
									sx={{
										height: 6,
										borderRadius: 3,
										bgcolor: "action.hover",
										"& .MuiLinearProgress-bar": {
											bgcolor: cfg.color,
											borderRadius: 3,
										},
									}}
								/>
							</Box>
						);
					})}
					{breakdown.length === 0 && (
						<Typography variant="caption" color="text.secondary">
							No data available
						</Typography>
					)}
				</Stack>
			</Box>
		</Box>
	);
}
