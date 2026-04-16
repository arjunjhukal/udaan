import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { Box, Skeleton } from "@mui/material";
import type { DeviceResetAnalytics } from "../../../../types/deviceReset";
import DashboardAnalyticsCard from "../../../organism/Cards/DashboardAnalyticsCard";
import PlatformBreakdown from "./PlatformBreakdown";

interface Props {
	analytics?: DeviceResetAnalytics["data"];
	isLoading: boolean;
}

export default function DeviceResetAnalyticsBar({ analytics, isLoading }: Props) {
	const cards = [
		{
			icon: <ConfirmationNumberOutlinedIcon sx={{ fontSize: 28, color: "#3B82F6" }} />,
			title: "Total Requests",
			description: "All time",
			value: analytics?.totals.total?.toString() ?? "0",
			type: "info" as const,
		},
		{
			icon: <CheckCircleOutlineIcon sx={{ fontSize: 28, color: "#10B981" }} />,
			title: "Approved",
			description: "Accepted requests",
			value: analytics?.totals.approved?.toString() ?? "0",
			type: "success" as const,
		},
		{
			icon: <ErrorOutlineIcon sx={{ fontSize: 28, color: "#EF4444" }} />,
			title: "Rejected",
			description: "Declined requests",
			value: analytics?.totals.rejected?.toString() ?? "0",
			type: "error" as const,
		},
		{
			icon: <PendingActionsIcon sx={{ fontSize: 28, color: "#F59E0B" }} />,
			title: "Pending Reviews",
			description: "Awaiting action",
			value: analytics?.totals.pending?.toString() ?? "0",
			type: "warning" as const,
		},
	];

	if (isLoading) {
		return (
			<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4, 1fr) 1.2fr" }, gap: 2, mb: 2 }}>
				{[1, 2, 3, 4, 5].map((i) => (
					<Skeleton key={i} variant="rounded" height={110} />
				))}
			</Box>
		);
	}

	return (

		<div className="flex flex-col gap-4 xl:grid lg:grid-cols-12">
			<div className="col-span-6 grid md:grid-cols-2 gap-2">
				{cards.map((card) => (
					<DashboardAnalyticsCard
						key={card.title}
						data={{
							title: card.title,
							value: card.value,
							description: card.description,
							type: card.type,
							icon: card.icon,
						}}
					/>
				))}
			</div>
			<Box
				className="col-span-6"
				sx={{
					background: "rgba(255, 255, 255, 0.08)",
					backdropFilter: "blur(20px)",
					WebkitBackdropFilter: "blur(20px)",
					border: "1px solid rgba(255,255,255,0.15)",
					boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
					borderRadius: 3,
					px: 3,
					py: 2,
				}}
			>
				<PlatformBreakdown breakdown={analytics?.platform_breakdown ?? []} />
			</Box>
		</div>
	);
}
