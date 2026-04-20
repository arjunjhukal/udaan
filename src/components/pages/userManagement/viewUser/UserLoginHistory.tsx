import { Box, Chip, Skeleton, Typography, useTheme } from "@mui/material";
import dayjs from "dayjs";
import { Mobile, Monitor } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetUserLoginHistoryQuery } from "../../../../services/userApi";
import TablePagination from "../../../molecules/Table/Pagination";
import TableFilter from "../../../organism/TableFilter";

export default function UserLoginHistory() {
    const { id } = useParams<{ id: string }>();
    const theme = useTheme();
    const uid = Number(id);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [qp, setQp] = useState({ pageIndex: 1, pageSize: 10 });

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 800);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setQp((q) => ({ ...q, pageIndex: 1 }));
    }, [debouncedSearch]);

    const { data, isLoading } = useGetUserLoginHistoryQuery(
        { id: uid, pageIndex: qp.pageIndex, pageSize: qp.pageSize, search: debouncedSearch || undefined },
        { skip: !uid }
    );

    const items = data?.data?.data ?? [];
    const totalPages = data?.data?.pagination?.total_pages ?? 0;

    return (
        <Box>
            <Typography variant="h5" fontWeight={600} mb={2}>Login History</Typography>
            <TableFilter search={search} setSearch={setSearch} />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} height={64} sx={{ mb: 1 }} />)
                ) : items.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" py={6} textAlign="center">
                        No login history found.
                    </Typography>
                ) : (
                    items.map((item) => {
                        const isSuccess = item.status === "success";
                        const statusColor = isSuccess ? theme.palette.success.main : theme.palette.error.main;
                        const statusBg = isSuccess ? theme.palette.success.light : theme.palette.error.light;
                        return (
                            <Box
                                key={item.id}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    py: 1.5,
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    "&:last-child": { borderBottom: "none" },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 1,
                                        bgcolor: statusBg,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        color: statusColor,
                                    }}
                                >
                                    {item.device_type === "web" ? <Monitor size={20} /> : <Mobile size={20} />}
                                </Box>
                                <Box flex={1} minWidth={0}>
                                    <Typography variant="body2" fontWeight={500} noWrap>
                                        {item.browser} · {item.os}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap>
                                        {item.location} · {item.ip}
                                    </Typography>
                                </Box>
                                <Box sx={{ flexShrink: 0, textAlign: "right" }}>
                                    <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                                        {dayjs(item.created_at).format("D MMM YYYY, h:mm A")}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        label={item.status}
                                        sx={{
                                            height: 24,
                                            fontSize: 11,
                                            fontWeight: 500,
                                            textTransform: "capitalize",
                                            borderRadius: 10,
                                            bgcolor: statusBg,
                                            color: statusColor,
                                            border: `1px solid ${statusColor}`,
                                        }}
                                    />
                                </Box>
                            </Box>
                        );
                    })
                )}
            </Box>
            <TablePagination qp={qp} setQp={setQp} totalPages={totalPages} />
        </Box>
    );
}
