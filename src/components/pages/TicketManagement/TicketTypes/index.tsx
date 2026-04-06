import { Box, Checkbox, Stack, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import { Add } from "iconsax-reactjs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	useDeleteTicketTypeMutation,
	useGetTicketTypesQuery,
} from "../../../../services/ticketApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import type { TicketTypeProps } from "../../../../types/ticket";
import Actions from "../../../molecules/Action";
import SmartTable from "../../../molecules/Table";
import TablePagination from "../../../molecules/Table/Pagination";
import ConfirmationDialog from "../../../organism/ConfirmationDialog";
import EmptyRoute from "../../../organism/EmptyRoute";
import PageHeader from "../../../organism/PageHeader";
import TableFilter from "../../../organism/TableFilter";
import TicketTypeManagementForm from "./TicketTypeManagementForm";

export default function TicketTypes() {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
	const [search, setSearch] = React.useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [qp, setQp] = React.useState({ pageIndex: 1, pageSize: 8 });
	const [openForm, setOpenForm] = useState(false);
	const [editTarget, setEditTarget] = useState<TicketTypeProps | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<number[] | null>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
			setQp((prev) => ({ ...prev, pageIndex: 1 }));
		}, 400);
		return () => clearTimeout(timer);
	}, [search]);

	const { data, isLoading, isFetching } = useGetTicketTypesQuery({
		pageIndex: qp.pageIndex,
		pageSize: qp.pageSize,
		search: debouncedSearch,
	});

	const [deleteTicketType, { isLoading: deleting }] = useDeleteTicketTypeMutation();

	const types = useMemo(() => data?.data?.data ?? [], [data]);

	const handleSelectAll = useCallback(
		(checked: boolean) => {
			if (checked) {
				setSelectedRows(new Set(types.map((t) => t.id)));
			} else {
				setSelectedRows(new Set());
			}
		},
		[types]
	);

	const handleSelectRow = useCallback((id: number, checked: boolean) => {
		setSelectedRows((prev) => {
			const next = new Set(prev);
			if (checked) {
				next.add(id);
			} else {
				next.delete(id);
			}
			return next;
		});
	}, []);

	const isAllSelected = types.length > 0 && selectedRows.size === types.length;
	const isSomeSelected = selectedRows.size > 0 && selectedRows.size < types.length;

	const openDeleteConfirmation = (ids: number[]) => {
		setDeleteTarget(ids);
	};

	const handleDelete = async () => {
		if (!deleteTarget) return;
		try {
			await deleteTicketType({ ids: deleteTarget }).unwrap();
			dispatch(showToast({ message: t("messages.ticket_type.deleted"), severity: "success" }));
			setSelectedRows(new Set());
			setDeleteTarget(null);
		} catch {
			dispatch(showToast({ message: t("messages.ticket_type.delete_error"), severity: "error" }));
			setDeleteTarget(null);
		}
	};

	const handleResetFilter = () => {
		setSearch("");
		setQp((prev) => ({ ...prev, pageIndex: 1 }));
	};

	const columns = useMemo<ColumnDef<TicketTypeProps>[]>(
		() => [
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
							checked={selectedRows.has(row.original.id)}
							onChange={(e) => handleSelectRow(row.original.id, e.target.checked)}
							color="primary"
						/>
						<Typography fontWeight={500}>
							{(qp.pageIndex - 1) * qp.pageSize + row.index + 1}
						</Typography>
					</Stack>
				),
				size: 80,
			},
			{
				header: "Name",
				accessorKey: "name",
				cell: ({ row }) => (
					<Typography fontWeight={500} className="capitalize">
						{row.original.name}
					</Typography>
				),
			},
			{
				header: "Actions",
				accessorKey: "actions",
				cell: ({ row }) => (
					<Box className="flex">
						<Actions
							deleting={deleting}
							onEdit={() => {
								setEditTarget(row.original);
								setOpenForm(true);
							}}
							onDelete={() => openDeleteConfirmation([row.original.id])}
						/>
					</Box>
				),
			},
		],
		[isAllSelected, isSomeSelected, selectedRows, deleting, qp]
	);


	return (
		<div className="user__root h-full flex flex-col justify-between">
			<div className="page__top">
				<PageHeader
					breadcrumb={[
						{ title: t("menus.ticket.root") },
						{ title: t("menus.ticket.ticket_types") },
					]}
					cta={{
						icon: <Add />,
						label: "New Ticket Type",
					}}
					handleOpenPopup={() => {
						setEditTarget(null);
						setOpenForm(true);
					}}
				/>
				<TableFilter
					search={search}
					setSearch={setSearch}
					selectedRows={selectedRows as Set<string | number>}
					handleRoleDelete={(ids) => openDeleteConfirmation(ids.map(Number))}
					handleResetFilter={handleResetFilter}
				/>
			</div>
			{
				!isLoading && types.length === 0 ? <EmptyRoute title="No Ticket Type Found" message="You haven't created a Ticket Type yet." /> :
					<>
						<Box className="h-full overflow-auto table__wrapper">
							<SmartTable loading={isLoading || isFetching} data={types} columns={columns} />
						</Box>

						<TablePagination
							qp={qp}
							setQp={setQp}
							totalPages={data?.data?.pagination?.total_pages ?? 0}
						/>
					</>
			}

			{openForm && (
				<TicketTypeManagementForm
					open={openForm}
					onClose={() => {
						setOpenForm(false);
						setEditTarget(null);
					}}
					onSuccess={() => {
						setOpenForm(false);
						setEditTarget(null);
					}}
					editTarget={editTarget}
				/>
			)}

			<ConfirmationDialog
				open={Boolean(deleteTarget)}
				setOpen={(v) => {
					if (!v) setDeleteTarget(null);
				}}
				title="Delete Ticket Type"
				description="Are you sure you want to delete the selected ticket type(s)? This action cannot be undone."
				onSave={handleDelete}
				isLoading={deleting}
			/>
		</div>
	);
}
