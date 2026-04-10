import { Avatar, Box, CircularProgress, OutlinedInput, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetResetRequestTimelineQuery, useGetResetRequestUserInfoQuery } from "../../../services/deviceResetApi";
import TabController from "../../molecules/TabController";
import RequestTimelineItem from "./components/RequestTimelineItem";

const STATUS_TABS = [
	{ label: "All", value: "" },
	{ label: "Approved", value: "approved" },
	{ label: "Rejected", value: "rejected" },
	{ label: "Pending", value: "pending" },
];

export default function DeviceResetDetailPage() {
	const { userId } = useParams<{ userId: string }>();
	const [statusTab, setStatusTab] = useState("");
	const [search, setSearch] = useState("");

	const uid = Number(userId);

	const { data: infoData, isLoading: infoLoading } = useGetResetRequestUserInfoQuery(
		{ userId: uid },
		{ skip: !userId }
	);

	const { data: timelineData, isLoading: timelineLoading } = useGetResetRequestTimelineQuery(
		{ userId: uid, status: statusTab, search, pageSize: 50 },
		{ skip: !userId }
	);

	if (!userId) {
		return (
			<Box display="flex" alignItems="center" justifyContent="center" height="100%">
				<Typography variant="body2" color="text.secondary">
					Select a user to view requests
				</Typography>
			</Box>
		);
	}

	if (infoLoading) {
		return (
			<Box display="flex" alignItems="center" justifyContent="center" height="100%">
				<CircularProgress size={28} />
			</Box>
		);
	}

	const info = infoData?.data;

	if (!info) {
		return (
			<Box display="flex" alignItems="center" justifyContent="center" height="100%">
				<Typography variant="body2" color="text.secondary">
					User not found
				</Typography>
			</Box>
		);
	}

	const initials = info?.name
		?.split(" ")
		.map((n: string) => n[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	const timeline = timelineData?.data?.data ?? [];

	return (
		<Box display="flex" flexDirection="column" height="100%" overflow="hidden">
			<Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: "1px solid", borderColor: "divider", flexShrink: 0 }}>
				<Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
					<Stack direction="row" alignItems="center" gap={2}>
						<Avatar
							src={info.thumbnail_url ?? undefined}
							sx={{ width: 52, height: 52, fontSize: 18, fontWeight: 700 }}
						>
							{initials}
						</Avatar>
						<Box>
							<Typography variant="h6" fontWeight={700}>
								{info.name}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								UD-{info.user_id}
							</Typography>
						</Box>
					</Stack>
					<Box textAlign="right">
						<Typography variant="h4" fontWeight={700} color="primary">
							{info.stats.total}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Requests
						</Typography>
					</Box>
				</Stack>

				{/* Mini stats */}
				<Stack direction="row" gap={2} mt={2} flexWrap="wrap">
					<Stack direction="row" alignItems="center" gap={0.75}>
						<Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main" }} />
						<Typography variant="body2" color="success.main" fontWeight={600}>{info.stats.approved}</Typography>
						<Typography variant="caption" color="text.secondary">Approved</Typography>
					</Stack>
					<Stack direction="row" alignItems="center" gap={0.75}>
						<Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "error.main" }} />
						<Typography variant="body2" color="error.main" fontWeight={600}>{info.stats.rejected}</Typography>
						<Typography variant="caption" color="text.secondary">Rejected</Typography>
					</Stack>
					<Stack direction="row" alignItems="center" gap={0.75}>
						<Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "warning.main" }} />
						<Typography variant="body2" color="warning.main" fontWeight={600}>{info.stats.pending}</Typography>
						<Typography variant="caption" color="text.secondary">Pending</Typography>
					</Stack>
				</Stack>
			</Box>

			{/* Timeline filters */}
			<Box sx={{ px: 3, pt: 2, flexShrink: 0 }}>
				<Typography variant="subtitle1" fontWeight={600} mb={1.5}>
					Request Timeline
				</Typography>
				<Stack direction="row" gap={2} alignItems="center" flexWrap="wrap" mb={1.5}>
					<TabController
						currentActive={statusTab}
						setActiveTab={setStatusTab}
						options={STATUS_TABS}
						size="sm"
					/>
					<OutlinedInput
						size="small"
						placeholder="Search requests..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						sx={{ ml: "auto", minWidth: 200 }}
					/>
				</Stack>
			</Box>

			{/* Timeline list */}
			<Box flex={1} overflow="auto" sx={{ px: 3, pb: 3 }}>
				{timelineLoading ? (
					<Box display="flex" justifyContent="center" py={4}>
						<CircularProgress size={24} />
					</Box>
				) : timeline.length === 0 ? (
					<Box textAlign="center" py={6}>
						<Typography variant="body2" color="text.secondary">
							No requests found
						</Typography>
					</Box>
				) : (
					timeline.map((req, idx) => (
						<RequestTimelineItem
							key={req.id}
							request={req}
							user={{ id: info.user_id, name: info.name }}
							userId={info.user_id}
							isLast={idx === timeline.length - 1}
						/>
					))
				)}
			</Box>
		</Box>
	);
}
