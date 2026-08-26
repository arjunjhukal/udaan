import { Box, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import { Add } from "iconsax-reactjs";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import { useArchiveStudentFromEbookMutation, useGetEbookByIdQuery, useGetEnrolledUsersByEbookQuery } from "../../../../services/ebookApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import type { TransactionResponse } from "../../../../types/transaction";
import { getApiErrorMessage } from "../../../../utils/apiError";
import { formatDate } from "../../../../utils/dateFormat";
import ActionIconVisible from "../../../molecules/Action/ActionIconVisible";
import SortableHeader from "../../../molecules/SortableHeader";
import TabController from "../../../molecules/TabController";
import UdaanTable from "../../../molecules/Table";
import TablePagination from "../../../molecules/Table/Pagination";
import ConfirmationDialog from "../../../organism/ConfirmationDialog";
import EmptyRoute from "../../../organism/EmptyRoute";
import PageHeader from "../../../organism/PageHeader";
import TableFilter from "../../../organism/TableFilter";
import EbookIcon from "../EbookIcon";
import EnrollStudentToEbookForm from "../EnrollStudentToEbookForm";
import useServerSort from "../../../../utils/useServerSort";

export default function EbookAssignedUsersRoot() {
    const { id } = useParams();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
    const [open, setOpen] = useState(false);
    const [openTrashConfirmation, setOpenTrashConfirmation] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
    const [qp, setQp] = useState({ pageIndex: 1, pageSize: 8 });

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 1000);
        return () => clearTimeout(timer);
    }, [search]);

    const { sort, handleSortChange } = useServerSort();
    const onSort = (field: string, order: "asc" | "desc" | "") =>
        handleSortChange(field, order, () => setQp((prev) => ({ ...prev, pageIndex: 1 })));

    const { data: ebook } = useGetEbookByIdQuery({ id: Number(id) }, { skip: !id });
    const { data, isLoading } = useGetEnrolledUsersByEbookQuery({
        ...qp,
        id: Number(id),
        type: activeTab,
        search: debouncedSearch,
        sort_field: sort.sort_field,
        sort_by: sort.sort_by,
    }, { skip: !id });

    const [removeUser, { isLoading: removingUser }] = useArchiveStudentFromEbookMutation();

    const users = data?.data?.data || [];

    const handleUserRemoval = async (transactionId: number) => {
        try {
            const response = await removeUser({ id: Number(id), transactionId }).unwrap();
            dispatch(showToast({
                message: response?.message || "User Archived Successfully",
                severity: "success",
            }));
        } catch (e) {
            dispatch(showToast({
                message: getApiErrorMessage(e, "Unable to archive student"),
                severity: "error",
            }));
        }
    };

    const columns = useMemo<ColumnDef<TransactionResponse>[]>(() => [
        {
            header: () => <Typography variant="subtitle2">SN</Typography>,
            accessorKey: "sno",
            cell: ({ row }) => (
                <Typography variant="subtitle2">{(qp.pageIndex - 1) * qp.pageSize + row.index + 1}</Typography>
            ),
            size: 80,
        },
        {
            header: () => <SortableHeader field="name" label="Student Name" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "name",
            cell: ({ row }) => (
                <Typography variant="subtitle2" className="capitalize">{row.original.name || "N/A"}</Typography>
            ),
        },
        {
            header: () => <SortableHeader field="added_by" label="Added By" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "added_by",
            cell: ({ row }) => (
                <Typography variant="subtitle2" className="capitalize">{row.original.added_by || "N/A"}</Typography>
            ),
        },
        {
            header: () => <SortableHeader field="contact" label="Contact No." activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "contact",
            cell: ({ row }) => (
                <Typography variant="subtitle2">{row.original.contact || "N/A"}</Typography>
            ),
        },
        {
            header: () => <SortableHeader field="email" label="Email" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "email",
            cell: ({ row }) => (
                <Typography variant="subtitle2">{row.original.email || "N/A"}</Typography>
            ),
        },
        {
            header: () => <SortableHeader field="payment_method" label="Payment Mode" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "payment_method",
            cell: ({ row }) => (
                <Typography variant="subtitle2" className="capitalize">{row.original.payment_method || "N/A"}</Typography>
            ),
        },
        {
            header: () => <SortableHeader field="created_at" label="Created Date" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "created_at",
            cell: ({ row }) => (
                <Typography variant="subtitle2">{formatDate(row.original?.created_at || "")}</Typography>
            ),
        },
        {
            header: "Actions",
            accessorKey: "actions",
            cell: ({ row }) => (
                <ActionIconVisible
                    onTrash={() => {
                        setSelectedTransactionId(Number(row.original.id));
                        setOpenTrashConfirmation(true);
                    }}
                    activeTab={activeTab}
                    trashing={removingUser}
                />
            ),
        },
    ], [qp, activeTab, removingUser, sort]);

    return (
        <div className="ebook__enrolled__users__root">
            <div className="page__top">
                <PageHeader
                    breadcrumb={[
                        { title: t("menus.ebook.root"), icon: <EbookIcon />, url: PATH.EBOOK.ROOT },
                        { title: ebook?.data?.title || "" },
                        { title: "Assigned Students" },
                    ]}
                    cta={{ icon: <Add />, label: "Assign To Student" }}
                    handleOpenPopup={() => setOpen(true)}
                />
                <TabController
                    options={[
                        { label: "Active Students", value: "active" },
                        { label: "Archived Students", value: "archived" },
                    ]}
                    setActiveTab={(val: "active" | "archived") => setActiveTab(val)}
                    currentActive={activeTab}
                />
                <TableFilter search={search} setSearch={setSearch} />
            </div>

            {!users.length && !isLoading ? (
                <EmptyRoute
                    title={t("messages.empty_states.ebook_users.title")}
                    message={t("messages.empty_states.ebook_users.description")}
                />
            ) : (
                <Box className="table__wrapper">
                    <UdaanTable loading={isLoading} data={users} columns={columns} />
                </Box>
            )}

            <TablePagination qp={qp} setQp={setQp} totalPages={data?.data?.pagination?.total_pages || 0} />

            <EnrollStudentToEbookForm open={open} setOpen={setOpen} id={Number(id)} />

            <ConfirmationDialog
                open={openTrashConfirmation}
                setOpen={setOpenTrashConfirmation}
                title="Archive User"
                description="Are you sure you want to archive this student? This action can be reverted later."
                onSave={() => {
                    if (!selectedTransactionId) return;
                    handleUserRemoval(selectedTransactionId);
                    setOpenTrashConfirmation(false);
                    setSelectedTransactionId(null);
                }}
                icon={<EbookIcon variant="filled" />}
            />
        </div>
    );
}
