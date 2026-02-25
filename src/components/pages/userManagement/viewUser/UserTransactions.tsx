import { Tooltip, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useGetAllUserTransacionsQuery } from "../../../../services/transactionApi";
import type { TransactionProps } from "../../../../types/transaction";
import { formatDateForDisplay } from "../../../../utils/dateFormat";
import { getTransactionStatus } from "../../../../utils/statusMap";
import StatusPill from "../../../atoms/StatusPill";
import UdaanTable from "../../../molecules/Table";
import TablePagination from "../../../molecules/Table/Pagination";
import EmptyRoute from "../../../organism/EmptyRoute";

export default function UserTransactions() {
    const { t } = useTranslation();
    const { id } = useParams();
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 10,
    });
    const { data, isLoading } = useGetAllUserTransacionsQuery({ ...qp, id: Number(id) });

    const courses = data?.data?.data || [];

    const columns = useMemo<ColumnDef<TransactionProps>[]>(() => [
        {
            header: "S.No",
            accessorKey: "index",
            cell: ({ row }) => (
                <Typography fontWeight={500} variant="subtitle1">
                    {row.index + 1 || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Course Name",
            accessorKey: "course_name",
            cell: ({ row }) => (
                <Tooltip title={row.original.course_name} arrow>
                    <Typography fontWeight={500} variant="subtitle1" className="line-clamp-1">
                        {row.original.course_name || "N/A"}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            header: "Payment Method",
            accessorKey: "payment_method",
            cell: ({ row }) => (
                <Typography variant="subtitle1" className="capitalize">
                    {row.original.payment_method || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Purchased Date",
            accessorKey: "purchased_date",
            cell: ({ row }) => (
                <Typography variant="subtitle1" className="capitalize">
                    {formatDateForDisplay(row.original.purchased_date) || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Amount Paid",
            accessorKey: "amount_paid",
            cell: ({ row }) => (
                <Typography variant="subtitle1" className="capitalize">
                    {row.original.amount_paid || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Invoice ID",
            accessorKey: "invoice_id",
            cell: ({ row }) => (
                <Typography variant="subtitle1" className="capitalize">
                    {row.original.invoice_id || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ row }) => (
                <StatusPill status={row.original.status} variant={getTransactionStatus(row.original.status)} />
            ),
        },

    ], [qp])


    return (
        <div className="user__transactions__root mt-6 lg:mt-8">
            <Typography className="mb-4!" variant="h5" fontWeight={600}>{t("messages.transaction_information")}</Typography>
            {!isLoading && !courses.length ? <EmptyRoute
                title="No Transactions"
                message="This user has not made any transactions yet."
            /> : <>
                <UdaanTable
                    data={courses}
                    columns={columns}
                    loading={isLoading} />
                <TablePagination
                    qp={qp}
                    setQp={setQp}
                    totalPages={data?.data?.pagination?.total_pages || 0}
                /></>
            }
        </div>
    )
}
