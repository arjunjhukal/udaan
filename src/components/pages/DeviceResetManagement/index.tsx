import { Box, OutlinedInput, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import SearchIcon from "../../../icons/SearchIcon";
import { PATH } from "../../../routes/PATH";
import { useGetResetRequestAnalyticsQuery, useGetResetRequestsQuery } from "../../../services/deviceResetApi";
import PageHeader from "../../organism/PageHeader";
import TableFilter from "../../organism/TableFilter";
import DeviceResetAnalyticsBar from "./components/DeviceResetAnalyticsBar";
import UserResetCard from "./components/UserResetCard";

export default function DeviceResetManagementRoot() {
	const navigate = useNavigate();
	const { userId } = useParams<{ userId: string }>();

	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [days, setDays] = useState<number | null>(null);
	const [customRange, setCustomRange] = useState({ startDate: "", endDate: "" });

	const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
		searchTimerRef.current = setTimeout(() => setDebouncedSearch(search), 400);
		return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
	}, [search]);

	const queryFilters = {
		days: days ?? undefined,
		start_date: customRange.startDate || undefined,
		end_date: customRange.endDate || undefined,
	};

	const { data, isFetching } = useGetResetRequestsQuery({
		pageIndex: 1,
		pageSize: 50,
		search: debouncedSearch,
		...queryFilters,
	});

	const { data: analyticsData, isLoading: analyticsLoading } = useGetResetRequestAnalyticsQuery(queryFilters);

	const requests = data?.data?.data ?? [];
	const activeUserId = userId ? Number(userId) : null;

	// Auto-select first user when none active
	useEffect(() => {
		if (!userId && requests.length > 0) {
			navigate(PATH.DEVICE_RESET.DETAIL.ROOT(requests[0].user_id), { replace: true });
		}
	}, [requests, userId, navigate]);

	return (
		<Box display="flex" flexDirection="column" height="100%" overflow="hidden">
			<div className="top__header">
				<PageHeader
					breadcrumb={[
						{
							icon: (
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M16.24 2H7.76C5 2 4 3 4 5.81V18.19C4 21 5 22 7.76 22H16.23C19 22 20 21 20 18.19V5.81C20 3 19 2 16.24 2ZM12 19.3C11.04 19.3 10.25 18.51 10.25 17.55C10.25 16.59 11.04 15.8 12 15.8C12.96 15.8 13.75 16.59 13.75 17.55C13.75 18.51 12.96 19.3 12 19.3ZM14 6.25H10C9.59 6.25 9.25 5.91 9.25 5.5C9.25 5.09 9.59 4.75 10 4.75H14C14.41 4.75 14.75 5.09 14.75 5.5C14.75 5.91 14.41 6.25 14 6.25Z" fill="#1D82F5" />
								</svg>

							),
							title: "Device Reset Requests",
						},
					]}
				/>
			</div>

			<Box flex={1} display="flex" flexDirection="column" overflow="hidden" gap={2} mt={1}>
				<div className="px-1">
					<DeviceResetAnalyticsBar
						analytics={analyticsData?.data}
						isLoading={analyticsLoading}
					/>
				</div>

				<TableFilter
					search={search}
					setSearch={setSearch}
					setDays={setDays}
					customRange={customRange}
					setCustomRange={setCustomRange}
					handleResetFilter={() => {
						setDays(null);
						setCustomRange({ startDate: "", endDate: "" });
					}}
				/>

				<Box flex={1} display="flex" gap={2} overflow="hidden">
					<Box
						sx={{
							width: { xs: "100%", lg: 360 },
							flexShrink: 0,
							overflow: "hidden",
							display: "flex",
							flexDirection: "column",
							p: 1,
							borderRadius: 2,
							border: "1px solid",
							borderColor: "divider",
						}}
					>
						<OutlinedInput
							fullWidth
							placeholder="Search users..."
							startAdornment={<SearchIcon />}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							sx={{ gap: "8px", mb: 1.5 }}
						/>
						<Box flex={1} overflow="auto" pr={0.5}>
							{requests.map((req) => (
								<UserResetCard
									key={req.user_id}
									request={req}
									active={activeUserId === req.user_id}
									onClick={() => navigate(PATH.DEVICE_RESET.DETAIL.ROOT(req.user_id))}
								/>
							))}
							{!isFetching && requests.length === 0 && (
								<Box textAlign="center" py={4}>
									<Typography variant="body2" color="text.secondary">
										No requests found
									</Typography>
								</Box>
							)}
						</Box>
					</Box>

					{/* Right panel */}
					<Box
						flex={1}
						overflow="hidden"
						sx={{
							borderRadius: 2,
							border: "1px solid",
							borderColor: "divider",
						}}
					>
						{activeUserId ? (
							<Outlet />
						) : (
							<Box display="flex" alignItems="center" justifyContent="center" height="100%">
								<Typography variant="body2" color="text.secondary">
									Select a user to view their requests
								</Typography>
							</Box>
						)}
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
