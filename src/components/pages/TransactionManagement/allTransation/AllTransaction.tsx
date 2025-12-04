import { Checkbox, Stack, Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteTransactionMutation, useGetAllTransactionsQuery } from '../../../../services/transactionApi';
import { showToast } from '../../../../slice/toastSlice';
import { useAppDispatch } from '../../../../store/hook';
import type { TransactionResponse } from '../../../../types/transaction';
import { formatDate } from '../../../../utils/dateFormat';
import Actions from '../../../molecules/Action';
import UdaanTable from '../../../molecules/Table';
import TablePagination from '../../../molecules/Table/Pagination';
import ConfirmationDialog from '../../../organism/ConfirmationDialog';
import EmptyRoute from '../../../organism/EmptyRoute';
import TableFilter from '../../../organism/TableFilter';
import TransactionManagementForm from '../TransactionManagementForm';

interface Props {
    open: boolean;
    setOpen: (newValue: boolean) => void
}
export default function AllTransaction({ open, setOpen }: Props) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [selectedRows, setSelectedRows] = useState<Set<number | string>>(new Set());
    const [search, setSearch] = useState<string>("");
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 8,
    })

    const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponse | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<string[]>([]);

    const { data, isLoading } = useGetAllTransactionsQuery({ ...qp, search });
    const [deleteTransaction, { isLoading: deleting }] = useDeleteTransactionMutation();

    const transactions = data?.data?.data || [];

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = new Set(transactions.map((course) => course.id || ''));
            setSelectedRows(allIds);
        } else {
            setSelectedRows(new Set());
        }
    };
    const handleSelectRow = (id: number | string, checked: boolean) => {
        const newSelected = new Set(selectedRows);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedRows(newSelected);
    };

    const isAllSelected = transactions.length > 0 && selectedRows.size === transactions.length;
    const isSomeSelected = selectedRows.size > 0 && selectedRows.size < transactions.length;

    const openDeleteConfirmation = (selectedCourseIds: string[]) => {
        setTransactionToDelete(selectedCourseIds);
        setOpenConfirm(true);
    };

    const handleCourseDeletion = async () => {
        try {
            const response = await deleteTransaction({
                body: transactionToDelete,
            }).unwrap();

            dispatch(
                showToast({
                    message: response.message || "Transaction deleted successfully",
                    severity: "success",
                })
            );
            setSelectedRows(new Set());
            setOpenConfirm(false);
            setTransactionToDelete([]);
        } catch (e: any) {
            dispatch(
                showToast({
                    message: e?.data?.message || "Unable to delete transaction.",
                    severity: "error",
                })
            );
            setOpenConfirm(false);
        }
    }

    const handleEdit = (transaction: TransactionResponse) => {
        setSelectedTransaction(transaction);
        setOpen(true);
    };




    const columns = useMemo<ColumnDef<TransactionResponse>[]>(() => [
        {
            header: () => (
                <Stack sx={{ gap: "10px" }}>
                    <Checkbox
                        checked={isAllSelected}
                        indeterminate={isSomeSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        color="primary"
                    />
                    <Typography fontWeight={500}>ID</Typography>
                </Stack>
            ),
            accessorKey: "sno",
            cell: ({ row }) => (
                <Stack sx={{ gap: "10px" }}>
                    <Checkbox
                        checked={selectedRows.has(row.original.id || '')}
                        onChange={(e) => handleSelectRow(row.original.id || '', e.target.checked)}
                        color="primary"
                    />
                    <Typography fontWeight={500}>{row.original.id}</Typography>
                </Stack>
            ),
            size: 80,
        },
        {
            header: "Student Name",
            accessorKey: "name",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="capitalize">
                    {row.original.name || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Course Name",
            accessorKey: "course_name",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="capitalize">
                    {row.original.course_name || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Email",
            accessorKey: "email",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="">
                    {row.original.email || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Contact No.",
            accessorKey: "contact",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="">
                    {row.original.contact || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Invoice ID",
            accessorKey: "invoice_id",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="">
                    {row.original.invoice_id || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Payment ID",
            accessorKey: "transaction_id",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="capitalize">
                    {row.original.transaction_id || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Created Date",
            accessorKey: "created_at",
            cell: ({ row }) => {
                return (
                    <Typography fontWeight={500} className="capitalize">
                        {formatDate(row.original?.created_at || "")}
                    </Typography>
                )
            },
        },
        {
            header: "Actions",
            accessorKey: "actions",
            cell: ({ row }) => (
                <Actions
                    deleting={deleting}
                    onEdit={() => handleEdit(row.original)}
                    onView={() => handleEdit(row.original)}
                    onDelete={() => openDeleteConfirmation([row.original.id?.toString() || ""])}
                />
            ),
        },
    ], [selectedRows, isAllSelected, isSomeSelected, deleting, navigate])
    return (
        <>
            <TableFilter
                search={search}
                setSearch={setSearch}
                selectedRows={selectedRows}
                handleRoleDelete={openDeleteConfirmation}
            />
            {
                !isLoading && !transactions.length ? <EmptyRoute
                    title="No Transaction Found"
                    message={`We couldn't find any transactions matching "${search}".`}
                /> : (
                    <>
                        <UdaanTable
                            data={transactions}
                            columns={columns}
                            loading={isLoading}
                        />

                        <TablePagination
                            qp={qp}
                            setQp={setQp}
                            totalPages={data?.data?.pagination?.total_pages || 0}
                        />
                    </>
                )
            }


            <ConfirmationDialog
                open={openConfirm}
                setOpen={setOpenConfirm}
                title={"Delete Transaction"}
                description={"Are you sure you want to delete the selected transaction(s)? This action cannot be undone."}
                onSave={handleCourseDeletion}
                icon={(<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.0697 5.23C19.4597 5.07 17.8497 4.95 16.2297 4.86V4.85L16.0097 3.55C15.8597 2.63 15.6397 1.25 13.2997 1.25H10.6797C8.34967 1.25 8.12967 2.57 7.96967 3.54L7.75967 4.82C6.82967 4.88 5.89967 4.94 4.96967 5.03L2.92967 5.23C2.50967 5.27 2.20967 5.64 2.24967 6.05C2.28967 6.46 2.64967 6.76 3.06967 6.72L5.10967 6.52C10.3497 6 15.6297 6.2 20.9297 6.73C20.9597 6.73 20.9797 6.73 21.0097 6.73C21.3897 6.73 21.7197 6.44 21.7597 6.05C21.7897 5.64 21.4897 5.27 21.0697 5.23Z" fill="#1D82F5" />
                    <path d="M19.2297 8.14C18.9897 7.89 18.6597 7.75 18.3197 7.75H5.67975C5.33975 7.75 4.99975 7.89 4.76975 8.14C4.53975 8.39 4.40975 8.73 4.42975 9.08L5.04975 19.34C5.15975 20.86 5.29975 22.76 8.78975 22.76H15.2097C18.6997 22.76 18.8398 20.87 18.9497 19.34L19.5697 9.09C19.5897 8.73 19.4597 8.39 19.2297 8.14ZM13.6597 17.75H10.3297C9.91975 17.75 9.57975 17.41 9.57975 17C9.57975 16.59 9.91975 16.25 10.3297 16.25H13.6597C14.0697 16.25 14.4097 16.59 14.4097 17C14.4097 17.41 14.0697 17.75 13.6597 17.75ZM14.4997 13.75H9.49975C9.08975 13.75 8.74975 13.41 8.74975 13C8.74975 12.59 9.08975 12.25 9.49975 12.25H14.4997C14.9097 12.25 15.2497 12.59 15.2497 13C15.2497 13.41 14.9097 13.75 14.4997 13.75Z" fill="#1D82F5" />
                </svg>
                )}
            />

            <TransactionManagementForm
                open={open}
                setOpen={setOpen}
                transactionId={selectedTransaction?.id}
            />
        </>
    )
}
