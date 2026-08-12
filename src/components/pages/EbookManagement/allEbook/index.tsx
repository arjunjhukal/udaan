import { Box, Button, Checkbox, Stack, Tooltip, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PATH } from "../../../../routes/PATH";
import { useChangeEbookStatusMutation, useDeleteEbookMutation, useGetAllEbookQuery } from "../../../../services/ebookApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import type { EbookProps, EbookStatus } from "../../../../types/ebook";
import { getApiErrorMessage } from "../../../../utils/apiError";
import { formatDate } from "../../../../utils/dateFormat";
import { formatNpr, getEbookPricing } from "../../../../utils/ebookPricing";
import { getPublishedStatus } from "../../../../utils/statusMap";
import useServerSort from "../../../../utils/useServerSort";
import StatusPill from "../../../atoms/StatusPill";
import Actions from "../../../molecules/Action";
import SortableHeader from "../../../molecules/SortableHeader";
import TabController from "../../../molecules/TabController";
import UdaanTable from "../../../molecules/Table";
import TablePagination from "../../../molecules/Table/Pagination";
import EbookCard from "../../../organism/Cards/EbookCard";
import ConfirmationDialog from "../../../organism/ConfirmationDialog";
import EmptyRoute from "../../../organism/EmptyRoute";
import PageHeader from "../../../organism/PageHeader";
import type { LayoutProps } from "../../../organism/TableFilter";
import TableFilter from "../../../organism/TableFilter";
import EbookIcon from "../EbookIcon";

export default function AllEbookRoot() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [qp, setQp] = useState({ pageIndex: 1, pageSize: 8 });
    const [openConfirm, setOpenConfirm] = useState(false);
    const [ebooksToDelete, setEbooksToDelete] = useState<string[]>([]);
    const [layout, setLayout] = useState<LayoutProps>("table");
    const [customRange, setCustomRange] = useState({ startDate: "", endDate: "" });
    const [days, setDays] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<"" | EbookStatus>("");

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 1000);
        return () => clearTimeout(timer);
    }, [search]);

    const { sort, handleSortChange } = useServerSort();
    const onSort = (field: string, order: "asc" | "desc" | "") =>
        handleSortChange(field, order, () => setQp((prev) => ({ ...prev, pageIndex: 1 })));

    const { data, isLoading } = useGetAllEbookQuery({
        ...qp,
        search: debouncedSearch,
        status: activeTab,
        days,
        ...customRange,
        sort_field: sort.sort_field,
        sort_by: sort.sort_by,
    });

    const [deleteEbook, { isLoading: deleting }] = useDeleteEbookMutation();
    const [changeStatus] = useChangeEbookStatusMutation();

    const ebooks = data?.data?.data || [];
    const pagination = data?.data?.pagination;

    const selectableIds = ebooks.filter((item) => item.id != null);
    const isAllSelected = ebooks.length > 0 && selectedRows.size === selectableIds.length;
    const isSomeSelected = selectedRows.size > 0 && selectedRows.size < selectableIds.length;

    const handleSelectAll = (checked: boolean) => {
        setSelectedRows(checked ? new Set(selectableIds.map((item) => Number(item.id))) : new Set());
    };

    const handleSelectRow = (id: number | null, checked: boolean) => {
        if (id == null) return;
        const newSelected = new Set(selectedRows);
        if (checked) newSelected.add(Number(id));
        else newSelected.delete(Number(id));
        setSelectedRows(newSelected);
    };

    const openDeleteConfirmation = (ids: string[]) => {
        setEbooksToDelete(ids);
        setOpenConfirm(true);
    };

    const handleEbookDeletion = async () => {
        try {
            const response = await deleteEbook({ body: ebooksToDelete }).unwrap();
            dispatch(showToast({ message: response.message || "eBook deleted successfully", severity: "success" }));
            setSelectedRows(new Set());
            setEbooksToDelete([]);
        } catch (e) {
            dispatch(showToast({ message: getApiErrorMessage(e, "Unable to delete eBook."), severity: "error" }));
        } finally {
            setOpenConfirm(false);
        }
    };

    const handleEbookStatusChange = async (id: number | null) => {
        if (id == null) return;
        try {
            const response = await changeStatus({ body: [Number(id)] }).unwrap();
            dispatch(showToast({ message: response?.message || "eBook status updated", severity: "success" }));
        } catch (e) {
            dispatch(showToast({ message: getApiErrorMessage(e, "Unable to update eBook status."), severity: "error" }));
        }
    };

    const columns = useMemo<ColumnDef<EbookProps>[]>(() => [
        {
            header: () => (
                <Stack sx={{ gap: "10px" }}>
                    <Checkbox
                        checked={isAllSelected}
                        indeterminate={isSomeSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        color="primary"
                    />
                    <Typography fontWeight={500}>S.No.</Typography>
                </Stack>
            ),
            accessorKey: "sno",
            cell: ({ row }) => (
                <Stack sx={{ gap: "10px" }}>
                    <Checkbox
                        checked={row.original.id != null && selectedRows.has(Number(row.original.id))}
                        onChange={(e) => handleSelectRow(row.original.id || null, e.target.checked)}
                        color="primary"
                        disabled={row.original.id == null}
                    />
                    <Typography fontWeight={500}>{(qp.pageIndex - 1) * qp.pageSize + row.index + 1}</Typography>
                </Stack>
            ),
            size: 80,
        },
        {
            header: () => <SortableHeader field="title" label="Title" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "title",
            cell: ({ row }) => (
                <Stack className="items-center! gap-2!">
                    {row.original.thumbnail_url ? (
                        <img
                            src={row.original.thumbnail_url}
                            alt={row.original.title}
                            className="w-10 h-10 rounded-md object-cover shrink-0"
                        />
                    ) : null}
                    <div className="min-w-0">
                        <Tooltip title={row.original.title} arrow>
                            <Typography fontWeight={500} variant="subtitle1" className="line-clamp-1">
                                {row.original.title || "N/A"}
                            </Typography>
                        </Tooltip>
                        {row.original.author ? (
                            <Typography variant="caption" color="text.middle" className="line-clamp-1">
                                by {row.original.author}
                            </Typography>
                        ) : null}
                    </div>
                </Stack>
            ),
        },
        {
            header: () => <SortableHeader field="is_downloadable" label="Downloadable" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "is_downloadable",
            cell: ({ row }) => (
                <StatusPill
                    variant={row.original.is_downloadable ? "success" : "warning"}
                    status={row.original.is_downloadable ? "Downloadable" : "Read only"}
                />
            ),
        },
        {
            header: () => <SortableHeader field="price" label="Price" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "price",
            cell: ({ row }) => {
                const pricing = getEbookPricing(row.original);
                if (pricing.isFree) return <Typography fontWeight={500} color="success.main">Free</Typography>;
                return (
                    <Stack className="items-center! gap-2!">
                        <Typography fontWeight={500}>{formatNpr(pricing.salePrice)}</Typography>
                        {pricing.hasDiscount && (
                            <Typography variant="subtitle2" color="text.middle" sx={{ textDecoration: "line-through" }}>
                                {formatNpr(pricing.markedPrice)}
                            </Typography>
                        )}
                    </Stack>
                );
            },
        },
        {
            header: () => <SortableHeader field="purchased_count" label="Purchased" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "purchased_count",
            cell: ({ row }) => <Typography fontWeight={500}>{row.original.purchased_count ?? 0}</Typography>,
        },
        {
            header: () => <SortableHeader field="assigned_count" label="Assigned" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "assigned_count",
            cell: ({ row }) => <Typography fontWeight={500}>{row.original.assigned_count ?? 0}</Typography>,
        },
        {
            header: () => <SortableHeader field="status" label="Status" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "status",
            cell: ({ row }) => (
                <Tooltip title={`Click to change status to ${row.original.status === "published" ? "Draft" : "Publish"}`}>
                    <Button
                        className="py-0.5! px-2! rounded-xl! capitalize!"
                        onClick={() => handleEbookStatusChange(Number(row.original.id))}
                    >
                        <StatusPill variant={getPublishedStatus(row.original.status)} status={row.original.status} />
                    </Button>
                </Tooltip>
            ),
        },
        {
            header: () => <SortableHeader field="created_at" label="Created Date" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "created_at",
            cell: ({ row }) => <Typography fontWeight={500}>{formatDate(row.original?.created_at || "")}</Typography>,
        },
        {
            header: "Actions",
            accessorKey: "actions",
            cell: ({ row }) => (
                <Actions
                    deleting={deleting}
                    editUrl={row.original.id != null ? PATH.EBOOK.EDIT_EBOOK.ROOT(Number(row.original.id)) : undefined}
                    viewUrl={row.original.id != null ? PATH.EBOOK.ASSIGNED_USERS.ROOT(Number(row.original.id)) : undefined}
                    onDelete={() => openDeleteConfirmation([row.original.id?.toString() || ""])}
                    onStatus={() => handleEbookStatusChange(Number(row.original.id))}
                    courseStatus={row.original.status}
                    file={row.original.file_url}
                />
            ),
        },
    ], [selectedRows, isAllSelected, isSomeSelected, deleting, qp, sort]);

    const handleResetFilter = () => {
        setCustomRange({ startDate: "", endDate: "" });
        setSearch("");
        setDays(null);
        setQp((prev) => ({ ...prev, pageIndex: 1 }));
    };

    return (
        <div className="all__ebook__root h-full flex flex-col justify-between">
            <div className="page__top">
                <PageHeader
                    breadcrumb={[{ title: t("menus.ebook.root"), icon: <EbookIcon /> }]}
                    cta={{
                        label: `${t("actions.create")} ${t("messages.ebook")}`,
                        url: PATH.EBOOK.CREATE_EBOOK.ROOT,
                    }}
                />
                <TableFilter
                    search={search}
                    setSearch={setSearch}
                    selectedRows={selectedRows}
                    handleRoleDelete={openDeleteConfirmation}
                    layout={layout}
                    setLayout={setLayout}
                    customRange={customRange}
                    setCustomRange={setCustomRange}
                    setDays={setDays}
                    handleResetFilter={handleResetFilter}
                />
                <TabController
                    options={[
                        { label: "All eBooks", value: "" },
                        { label: "Published", value: "published" },
                        { label: "Draft", value: "draft" },
                    ]}
                    currentActive={activeTab}
                    setActiveTab={(value: "" | EbookStatus) => {
                        setActiveTab(value);
                        setQp((prev) => ({ ...prev, pageIndex: 1 }));
                    }}
                />
            </div>

            {!isLoading && !ebooks.length ? (
                <EmptyRoute
                    title={t("messages.empty_states.ebook.title")}
                    message={t("messages.empty_states.ebook.description")}
                    cta={{
                        label: `${t("actions.create")} ${t("messages.ebook")}`,
                        url: PATH.EBOOK.CREATE_EBOOK.ROOT,
                    }}
                />
            ) : (
                <>
                    <Box className="table__wrapper h-full" sx={{ overflow: "auto" }}>
                        {layout === "table" ? (
                            <UdaanTable data={ebooks} columns={columns} loading={isLoading} />
                        ) : (
                            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
                                {ebooks.map((ebook) => (
                                    <EbookCard
                                        key={`${ebook.title}-${ebook.id}`}
                                        data={ebook}
                                        editUrl={ebook.id != null ? PATH.EBOOK.EDIT_EBOOK.ROOT(Number(ebook.id)) : undefined}
                                        viewUrl={ebook.id != null ? PATH.EBOOK.ASSIGNED_USERS.ROOT(Number(ebook.id)) : undefined}
                                        onDelete={() => openDeleteConfirmation([ebook.id?.toString() || ""])}
                                        onStatus={() => handleEbookStatusChange(Number(ebook.id))}
                                    />
                                ))}
                            </div>
                        )}
                    </Box>
                    <TablePagination qp={qp} setQp={setQp} totalPages={pagination?.total_pages || 0} />
                </>
            )}

            <ConfirmationDialog
                open={openConfirm}
                setOpen={setOpenConfirm}
                title="Delete eBook"
                description="Are you sure you want to delete this eBook. This action cannot be undone."
                onSave={handleEbookDeletion}
                isLoading={deleting}
                icon={<EbookIcon variant="filled" />}
            />
        </div>
    );
}
