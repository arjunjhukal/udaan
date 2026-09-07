import { Box, Button, CircularProgress, Divider, IconButton, InputAdornment, OutlinedInput, Stack, Typography } from "@mui/material";
import { CloseCircle, HamburgerMenu } from "iconsax-reactjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import SearchIcon from "../../../icons/SearchIcon";
import { PATH } from "../../../routes/PATH";
import { useGetResetRequestAnalyticsQuery, useGetResetRequestsQuery } from "../../../services/deviceResetApi";
import type { DeviceResetRequestProps } from "../../../types/deviceReset";
import EmptyRoute from "../../organism/EmptyRoute";
import PageHeader from "../../organism/PageHeader";
import DeviceResetAnalyticsBar from "./components/DeviceResetAnalyticsBar";
import UserResetCard from "./components/UserResetCard";

const PAGE_SIZE = 20;

export default function DeviceResetManagementRoot() {
	const navigate = useNavigate();
	const { userId } = useParams<{ userId: string }>();

	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [page, setPage] = useState(1);
	const [loadedPages, setLoadedPages] = useState<Record<number, DeviceResetRequestProps[]>>({});
	const [openDrawer, setOpenDrawer] = useState(false);
	const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Debounce search
	useEffect(() => {
		if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
		searchTimerRef.current = setTimeout(() => setDebouncedSearch(search), 400);
		return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
	}, [search]);

	// Start a fresh stack of pages whenever the search changes
	useEffect(() => {
		setPage(1);
		setLoadedPages({});
	}, [debouncedSearch]);

	// currentData, not data — `data` holds the previous page's rows while the
	// next one is in flight, which would file them under the wrong page number.
	const { currentData, isFetching } = useGetResetRequestsQuery({
		pageIndex: page,
		pageSize: PAGE_SIZE,
		search: debouncedSearch,
	});

	const { data: analyticsData, isLoading: analyticsLoading } = useGetResetRequestAnalyticsQuery({});

	// Keyed by page so a refetch (e.g. after approving a request) replaces that
	// page's rows instead of appending a duplicate copy of them.
	useEffect(() => {
		const rows = currentData?.data?.data;
		if (!rows) return;
		setLoadedPages((prev) => ({ ...prev, [page]: rows }));
	}, [currentData, page]);

	const requests = useMemo(
		() =>
			Object.keys(loadedPages)
				.map(Number)
				.sort((a, b) => a - b)
				.flatMap((pageNumber) => loadedPages[pageNumber]),
		[loadedPages]
	);

	const pagination = currentData?.data?.pagination;
	const hasMore = pagination ? pagination.current_page < pagination.total_pages : false;
	const activeUserId = userId ? Number(userId) : null;
	const hasSearch = debouncedSearch.trim().length > 0;

	const loadMore = useCallback(() => setPage((p) => p + 1), []);
	const sentinelRef = useInfiniteScroll(loadMore, hasMore && !isFetching);

	useEffect(() => {
		if (!userId && requests.length > 0) {
			navigate(PATH.DEVICE_RESET.DETAIL.ROOT(requests[0].user_id), { replace: true });
		}
	}, [requests, userId, navigate]);

	const clearSearch = () => {
		setSearch("");
		setDebouncedSearch("");
	};

	// Only a genuinely empty inbox takes over the page — a search that matches
	// nothing must keep the search box on screen so the admin can undo it.
	const showEmptyState = !hasSearch && !isFetching && Boolean(currentData) && requests.length === 0;

	return (
		<Box display="flex" flexDirection="column" height="100%" className="overflow-auto lg:overflow-hidden">
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

			<Box flex={1} display="flex" flexDirection="column" gap={2} mt={1} height="100%" overflow="auto">
				<div className="px-1">
					<DeviceResetAnalyticsBar
						analytics={analyticsData?.data}
						isLoading={analyticsLoading}
					/>
				</div>

				{showEmptyState ? (
					<EmptyRoute
						title="No Pending Requests"
						message="There are currently no device reset requests. Once users start requesting resets, you'll see them here."
					/>
				) : (
					<>
						<Stack alignItems={"center"} className="lg:hidden!">
							<IconButton onClick={() => setOpenDrawer(true)}>
								<HamburgerMenu />
							</IconButton>
							<Typography variant="h4" fontWeight={500}>
								Request Timeline
							</Typography>
						</Stack>
						<Box flex={1} display="flex" className="h-full" gap={2}>
							{/* Backdrop — mobile only, closes drawer on outside click */}
							{openDrawer && (
								<Box
									onClick={() => setOpenDrawer(false)}
									sx={{
										display: { lg: "none" },
										position: "fixed",
										inset: 0,
										bgcolor: "rgba(0,0,0,0.45)",
										zIndex: 9998,
									}}
								/>
							)}

							<Box
								sx={{
									width: { xs: "100%", lg: 400, xl: 549 },
									flexShrink: 0,
									display: "flex",
									flexDirection: "column",
									p: "24px",
									borderRadius: 2,
									bgcolor: "gray.gray1",
								}}
								className={`request__list fixed left-0 top-0 bottom-0 max-w-[350px] lg:max-w-[unset] lg:static z-9999 lg:z-0 lg:visible lg:opacity-100 lg:translate-x-0 transition-[transform,opacity,visibility] duration-300 ease-in-out ${openDrawer ? "opacity-100 visible translate-x-0" : "opacity-0 invisible -translate-x-full"}`}
							>
								<Stack direction="row" alignItems="center" justifyContent="space-between" >
									<Typography variant="h6" fontWeight={500}>
										Request Timeline
									</Typography>
									<div className="lg:hidden!">
										<IconButton color="error" onClick={() => setOpenDrawer(false)} >
											<CloseCircle variant="Bold" />
										</IconButton>
									</div>
								</Stack>
								<Divider className="my-4!" />
								<OutlinedInput
									fullWidth
									placeholder="Search users..."
									startAdornment={<SearchIcon />}
									endAdornment={
										search ? (
											<InputAdornment position="end">
												<IconButton size="small" aria-label="Clear search" onClick={clearSearch}>
													<CloseCircle size={18} />
												</IconButton>
											</InputAdornment>
										) : undefined
									}
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									sx={{ gap: "8px", mb: 1.5, p: "8px 12px", bgcolor: "primary.contrastText" }}
								/>

								<Box flex={1} minHeight={0} overflow="auto" pr={0.5}>
									{requests.length > 0 ? (
										<>
											{requests.map((req) => (
												<UserResetCard
													key={req.user_id}
													request={req}
													active={activeUserId === req.user_id}
													onClick={() => {
														navigate(PATH.DEVICE_RESET.DETAIL.ROOT(req.user_id));
														setOpenDrawer(false);
													}}
												/>
											))}
											<Box ref={sentinelRef} sx={{ height: 1 }} />
											{isFetching && (
												<Box display="flex" justifyContent="center" py={2}>
													<CircularProgress size={20} />
												</Box>
											)}
										</>
									) : isFetching ? (
										<Box display="flex" justifyContent="center" py={4}>
											<CircularProgress size={22} />
										</Box>
									) : (
										<Box textAlign="center" py={4}>
											<Typography variant="body2" color="text.secondary" mb={hasSearch ? 1.5 : 0}>
												{hasSearch ? `No users match "${debouncedSearch}"` : "No requests found"}
											</Typography>
											{hasSearch && (
												<Button size="small" variant="outlined" onClick={clearSearch}>
													Clear search
												</Button>
											)}
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
					</>
				)}
			</Box>
		</Box>
	);
}
