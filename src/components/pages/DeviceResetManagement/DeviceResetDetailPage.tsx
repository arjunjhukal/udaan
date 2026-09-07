import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { Avatar, Box, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetResetRequestTimelineQuery, useGetResetRequestUserInfoQuery } from "../../../services/deviceResetApi";
import { getInitials } from "../../../utils/getInitials";
import TabController from "../../molecules/TabController";
import DashboardAnalyticsCard from "../../organism/Cards/DashboardAnalyticsCard";
import ListPager from "./components/ListPager";
import RequestTimelineItem from "./components/RequestTimelineItem";

const STATUS_TABS = [
	{ label: "All", value: "" },
	{ label: "Approved", value: "approved" },
	{ label: "Rejected", value: "rejected" },
	{ label: "Pending", value: "pending" },
];

const PAGE_SIZE = 15;

interface Props {
	userIdOverride?: number | string;
}

export default function DeviceResetDetailPage({ userIdOverride }: Props = {}) {
	const { userId: paramUserId } = useParams<{ userId: string }>();
	const userId = userIdOverride !== undefined ? String(userIdOverride) : paramUserId;
	const [statusTab, setStatusTab] = useState("");
	const [page, setPage] = useState(1);

	const uid = Number(userId);

	const { data: infoData, isLoading: infoLoading } = useGetResetRequestUserInfoQuery(
		{ userId: uid },
		{ skip: !userId }
	);

	const { data: timelineData, isFetching: timelineFetching } = useGetResetRequestTimelineQuery(
		{ userId: uid, status: statusTab, pageSize: PAGE_SIZE, pageIndex: page },
		{ skip: !userId }
	);

	useEffect(() => {
		setPage(1);
	}, [uid, statusTab]);

	const timeline = timelineData?.data?.data;
	const timelinePagination = timelineData?.data?.pagination;
	const totalPages = timelinePagination?.total_pages ?? 0;

	// Reviewing a request can shrink the result set out from under the current page
	useEffect(() => {
		if (totalPages > 0 && page > totalPages) setPage(totalPages);
	}, [totalPages, page]);

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

	const initials = getInitials(info.name);

	return (
		<Box
			display="flex"
			flexDirection="column"
			height="100%"

			className="p-4 lg:p-6 2xl:p-8 overflow-auto lg:overflow-hidden "
			sx={{ boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.10)" }}
		>
			{/* User header */}
			<Box sx={{ flexShrink: 0 }}>
				<Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
					<Stack direction="row" alignItems="center" gap={2}>
						<Avatar
							src={info.thumbnail_url ?? undefined}
							sx={{ width: 52, height: 52, fontSize: 18, fontWeight: 700 }}
						>
							{initials}
						</Avatar>
						<Box>
							<Typography variant="h6" fontWeight={500}>
								{info.name || "Unnamed user"}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								UD-{info.user_id}
							</Typography>
						</Box>
					</Stack>
					<Box textAlign="right">
						<Typography variant="h4" fontWeight={500} color="primary">
							{info.stats.total}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Requests
						</Typography>
					</Box>
				</Stack>
			</Box>

			<Divider className="mt-4! mb-6!" />

			<Box
				sx={{
					flexShrink: 0,
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
					gap: 2,
					mb: 2,
				}}
			>
				<DashboardAnalyticsCard
					data={{
						title: "Approved",
						value: info.stats.approved.toString(),
						description: "Accepted requests",
						type: "success",
						icon: <CheckCircleOutlineIcon />,
					}}
				/>
				<DashboardAnalyticsCard
					data={{
						title: "Rejected",
						value: info.stats.rejected.toString(),
						description: "Declined requests",
						type: "error",
						icon: <ErrorOutlineIcon />,
					}}
				/>
				<DashboardAnalyticsCard
					data={{
						title: "Pending",
						value: info.stats.pending.toString(),
						description: "Awaiting action",
						type: "warning",
						icon: <PendingActionsIcon />,
					}}
				/>
			</Box>

			<Box sx={{ flexShrink: 0 }}>
				<Typography variant="h6" fontWeight={500} mb={1.5}>
					Request Timeline
				</Typography>
				<TabController
					currentActive={statusTab}
					setActiveTab={setStatusTab}
					options={STATUS_TABS}
					size="md"
				/>
			</Box>
			<Divider className="mb-4!" />

			{/* Timeline list */}
			<Box flex={1} className="lg:overflow-auto" sx={{ px: 0.5 }}>
				{timelineFetching && !timeline ? (
					<Box display="flex" justifyContent="center" py={4}>
						<CircularProgress size={24} />
					</Box>
				) : timeline && timeline.length > 0 ? (
					timeline.map((req, idx) => (
						<RequestTimelineItem
							key={req.id}
							request={req}
							user={{ id: info.user_id, name: info.name }}
							userId={info.user_id}
							isLast={idx === timeline.length - 1}
						/>
					))
				) : (
					<Box textAlign="center" py={6}>
						<Typography variant="body2" color="text.secondary">
							No requests found
						</Typography>
					</Box>
				)}
			</Box>

			<ListPager
				page={page}
				totalPages={totalPages}
				totalRecords={timelinePagination?.total}
				onChange={setPage}
			/>
		</Box>
	);
}
