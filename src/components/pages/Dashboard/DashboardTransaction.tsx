import { Box, Stack, Tooltip, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import { useGetAllTransactionsQuery } from "../../../services/transactionApi";
import type { TransactionResponse } from "../../../types/transaction";
import { formatDate } from "../../../utils/dateFormat";
import useServerSort from "../../../utils/useServerSort";
import SortableHeader from "../../molecules/SortableHeader";
import UdaanTable from "../../molecules/Table";
import EmptyRoute from "../../organism/EmptyRoute";
import TableFilter from "../../organism/TableFilter";

export default function DashboardTransaction() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 6,
    })
    const [customRange, setCustomRange] = useState({
        startDate: "",
        endDate: ""
    });
    const [days, setDays] = useState<number | null>(null);

    const { sort, handleSortChange } = useServerSort();
    const onSort = (field: string, order: "asc" | "desc" | "") =>
        handleSortChange(field, order, () => setQp((prev) => ({ ...prev, pageIndex: 1 })));

    const { data, isLoading, isFetching } = useGetAllTransactionsQuery({
        ...qp,
        days,
        ...customRange,
        search,
        sort_field: sort.sort_field,
        sort_by: sort.sort_by,
    });

    const transactions = data?.data?.data || [];

    const columns = useMemo<ColumnDef<TransactionResponse>[]>(() => [
        {
            header: () => (
                <Stack sx={{ gap: "10px" }}>

                    <Typography variant='subtitle2'>SN</Typography>
                </Stack>
            ),
            accessorKey: "sno",
            cell: ({ row }) => (
                <Stack sx={{ gap: "10px" }}>
                    <Typography variant='subtitle2'>  {(qp.pageIndex - 1) * qp.pageSize + row.index + 1}</Typography>
                </Stack>
            ),
            size: 80,
        },
        {
            header: () => <SortableHeader field="name" label="Student Name" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "name",
            cell: ({ row }) => (
                <Typography variant='subtitle2' className="capitalize">
                    {row.original.name || "N/A"}
                </Typography>
            ),
        },
        {
            header: () => <SortableHeader field="added_by" label="Added By" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "added_by",
            cell: ({ row }) => (
                <Typography variant='subtitle2' className="capitalize">
                    {row.original.added_by || "N/A"}
                </Typography>
            ),
        },
        {
            id: "course_name",
            header: () => <SortableHeader field="course_name" label="Course Name" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "name",
            cell: ({ row }) => (
                <Tooltip title={row.original.name} arrow>
                    <Typography variant='subtitle2' className="capitalize line-clamp-1">
                        {row.original.name || "N/A"}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            header: () => <SortableHeader field="contact" label="Contact No." activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "contact",
            cell: ({ row }) => (
                <Typography variant='subtitle2' className="">
                    {row.original.contact || "N/A"}
                </Typography>
            ),
        },
        {
            header: () => <SortableHeader field="invoice_id" label="Invoice ID" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "invoice_id",
            cell: ({ row }) => (
                <Typography variant='subtitle2' className="">
                    {row.original.invoice_id || "N/A"}
                </Typography>
            ),
        },
        {
            header: () => <SortableHeader field="transaction_id" label="Payment ID" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "transaction_id",
            cell: ({ row }) => (
                <Typography variant='subtitle2' className="capitalize">
                    {row.original.transaction_id || "N/A"}
                </Typography>
            ),
        },
        {
            header: () => <SortableHeader field="payment_method" label="Payment Mode" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "payment_method",
            cell: ({ row }) => (
                <Typography variant='subtitle2' className="capitalize">
                    {row.original.payment_method || "N/A"}
                </Typography>
            ),
        },
        {
            header: () => <SortableHeader field="created_at" label="Created Date" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "created_at",
            cell: ({ row }) => {
                return (
                    <Typography variant='subtitle2' className="capitalize">
                        {formatDate(row.original?.created_at || "")}
                    </Typography>
                )
            },
        },

    ], [navigate, qp, sort]);

    if (!transactions.length && !days && !customRange) {
        return;
    }

    return (
        <Box className="dashboard__transaction__root mb-6 lg:mb-8 rounded-lg py-6 px-8" sx={{
            background: (theme) => theme.palette.primary.contrastText
        }}>
            <TableFilter
                title={t("messages.recent") + " " + t("messages.transactions")}
                categoryLayout={true}
                search={search}
                setSearch={setSearch}
                customRange={customRange}
                setCustomRange={setCustomRange}
                setDays={setDays}
                redirectUrl={PATH.TRANSACTION_MANAGEMENT.ROOT}
            />

            {
                !isLoading && !transactions.length ? <EmptyRoute
                    title="No Transaction Found"
                    message={`We couldn't find any transactions matching".`}
                /> : (
                    <>
                        <Box className="table__wrapper h-full overflow-auto">
                            <UdaanTable
                                data={transactions}
                                columns={columns}
                                loading={isLoading || isFetching}
                            />
                        </Box>
                    </>
                )
            }
        </Box>
    )
}
