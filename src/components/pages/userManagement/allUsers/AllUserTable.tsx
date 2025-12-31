import { Box, Checkbox, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import { useDeleteUserMutation, useGetAllUserQuery, useSuspendUserMutation } from "../../../../services/userApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import { useCourseFilter } from "../../../../store/useCourseFilter";
import type { RegisterUserProps } from "../../../../types/user";
import Actions from "../../../molecules/Action";
import UdaanTable from "../../../molecules/Table";
import TablePagination from "../../../molecules/Table/Pagination";
import ConfirmationDialog from "../../../organism/ConfirmationDialog";
import EmptyRoute from "../../../organism/EmptyRoute";
import { CourseFilter } from "../../../organism/Filter/CourseFilter";
import TableFilter from "../../../organism/TableFilter";

type ActionType = "delete" | "suspend" | "activate";

export default function AllUserTable() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [selectedRows, setSelectedRows] = useState<Set<number | string>>(new Set());
    const [search, setSearch] = React.useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [qp, setQp] = React.useState({
        pageIndex: 1,
        pageSize: 8,
    })
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [actionType, setActionType] = React.useState<ActionType>("delete");
    const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([]);

    const {
        selections,
        handleCategoryChange,
        handleApplyFilter,
        resetFilters,
        getCategoryFilterParams,
        filterDialogOpen,
        setFilterDialogOpen,
        roles,
    } = useCourseFilter();

    const categoryFilter = getCategoryFilterParams();

    const { data, isLoading, isFetching } = useGetAllUserQuery({ pageIndex: qp.pageIndex, pageSize: qp.pageSize, search: debouncedSearch, role: categoryFilter && categoryFilter?.roles?.join(",") });
    const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();
    const [suspendUser] = useSuspendUserMutation();

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIndices = new Set(user.map((_, index) => index));
            setSelectedRows(allIndices);
        } else {
            setSelectedRows(new Set());
        }
    };

    const handleSelectRow = (index: number | string, checked: boolean) => {
        const newSelected = new Set(selectedRows);
        if (checked) {
            newSelected.add(index);
        } else {
            newSelected.delete(index);
        }
        setSelectedRows(newSelected);
    };

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 1000);
        return () => clearTimeout(timer);
    }, [search]);

    const user = data?.data?.data || [];

    const openDeleteConfirmation = (userIds: string[]) => {
        setActionType("delete");
        setSelectedUserIds(userIds);
        setOpenConfirm(true);
    };

    const openSuspendConfirmation = (userIds: string[]) => {
        setActionType("suspend");
        setSelectedUserIds(userIds);
        setOpenConfirm(true);
    };

    const openActivateConfirmation = (userIds: string[]) => {
        setActionType("activate");
        setSelectedUserIds(userIds);
        setOpenConfirm(true);
    };

    const isAllSelected = user.length > 0 && selectedRows.size === user.length;
    const isSomeSelected = selectedRows.size > 0 && selectedRows.size < user.length;

    const handleDeleteUser = async () => {
        try {
            const response = await deleteUser({
                body: selectedUserIds,
            }).unwrap();

            dispatch(
                showToast({
                    message: response.message || "User deleted successfully",
                    severity: "success",
                })
            );
            setSelectedRows(new Set());
            setOpenConfirm(false);
            setSelectedUserIds([]);
        } catch (e: any) {
            dispatch(
                showToast({
                    message: e?.data?.message || "Unable to delete user.",
                    severity: "error",
                })
            );
            setOpenConfirm(false);
        }
    };

    const handleUserSuspension = async () => {
        try {
            const response = await suspendUser({
                body: selectedUserIds,
            }).unwrap();

            dispatch(
                showToast({
                    message: response.message || `User ${actionType === "activate" ? "activated" : "suspended"} successfully.`,
                    severity: "success",
                })
            );
            setSelectedRows(new Set());
            setOpenConfirm(false);
            setSelectedUserIds([]);
        } catch (e: any) {
            dispatch(
                showToast({
                    message: e?.data?.message || `Unable to ${actionType} user.`,
                    severity: "error",
                })
            );
            setOpenConfirm(false);
        }
    };

    const handleConfirmAction = () => {
        if (actionType === "delete") {
            handleDeleteUser();
        } else {
            handleUserSuspension();
        }
    };

    const getDialogContent = () => {
        switch (actionType) {
            case "delete":
                return {
                    title: "Delete User",
                    description: "Are you sure you want to delete the selected user(s)? This action cannot be undone."
                };
            case "suspend":
                return {
                    title: "Suspend User",
                    description: "Are you sure you want to suspend the selected user(s)? This action can be undone."
                };
            case "activate":
                return {
                    title: "Activate User",
                    description: "Are you sure you want to activate the selected user(s)?"
                };
            default:
                return {
                    title: "",
                    description: ""
                };
        }
    };

    const columns = useMemo<ColumnDef<RegisterUserProps>[]>(() => [
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
                        checked={selectedRows.has(row.original.id || '')}
                        onChange={(e) => handleSelectRow(row.original.id || '', e.target.checked)}
                        color="primary"
                    />
                    <Typography fontWeight={500}>  {(qp.pageIndex - 1) * qp.pageSize + row.index + 1}</Typography>
                </Stack>
            ),
            size: 80,
        },
        {
            header: "Name",
            accessorKey: "name",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="capitalize">{row.original.name}</Typography>
            ),
        },
        {
            header: "Designation",
            accessorKey: "designation",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="capitalize">{row.original.designation}</Typography>
            ),
        },
        {
            header: "Role",
            accessorKey: "role",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="capitalize">{row.original.role?.name}</Typography>
            ),
        },
        {
            header: "Email",
            accessorKey: "email",
            cell: ({ row }) => (
                <Typography fontWeight={500}>{row.original.email}</Typography>
            ),
        },
        {
            header: "Phone",
            accessorKey: "phone",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="capitalize">{row.original.phone}</Typography>
            ),
        },
        {
            header: "Actions",
            accessorKey: "actions",
            cell: ({ row }) => (
                <Box className="flex">
                    <Actions
                        deleting={deleting}
                        onEdit={() => navigate(`${PATH.USER_MANAGEMENT.EDIT_USER.ROOT(row.original.id?.toString() || "")}`)}
                        onView={() => navigate(`${PATH.USER_MANAGEMENT.EDIT_USER.ROOT(row.original.id?.toString() || "")}`)}
                        onDelete={() => openDeleteConfirmation([row.original.id?.toString() || ""])}
                        onSuspend={() => openSuspendConfirmation([row.original.id?.toString() || ""])}
                        userStatus={row.original.is_suspended}
                    />
                    {row.original.is_suspended ? (
                        <IconButton
                            className="activate"
                            onClick={() => openActivateConfirmation([row.original.id?.toString() || ""])}
                        >
                            <Tooltip title="Activate">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 22.75L9 22.75C3.57 22.75 1.25 20.43 1.25 15L1.25 9C1.25 3.57 3.57 1.25 9 1.25L15 1.25C20.43 1.25 22.75 3.57 22.75 9L22.75 15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9L2.75 15C2.75 19.61 4.39 21.25 9 21.25L15 21.25C19.61 21.25 21.25 19.61 21.25 15L21.25 9C21.25 4.39 19.61 2.75 15 2.75L9 2.75Z" fill="#848484" />
                                    <path d="M10.5799 15.5801C10.3799 15.5801 10.1899 15.5001 10.0499 15.3601L7.21994 12.5301C6.92994 12.2401 6.92994 11.7601 7.21994 11.4701C7.50994 11.1801 7.98994 11.1801 8.27994 11.4701L10.5799 13.7701L15.7199 8.6301C16.0099 8.3401 16.4899 8.3401 16.7799 8.6301C17.0699 8.9201 17.0699 9.4001 16.7799 9.6901L11.1099 15.3601C10.9699 15.5001 10.7799 15.5801 10.5799 15.5801Z" fill="#848484" />
                                </svg>
                            </Tooltip>
                        </IconButton>
                    ) : null}
                </Box>
            ),
        },
    ], [isAllSelected, selectedRows, deleting, qp]);

    const dialogContent = getDialogContent();

    return (
        <>
            <TableFilter
                search={search}
                setSearch={setSearch}
                selectedRows={selectedRows}
                handleRoleDelete={openDeleteConfirmation}
                onFilter={() => setFilterDialogOpen(true)}
            />
            {!user.length && !isLoading ? (
                <EmptyRoute
                    icon={(<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.6665C8.50663 2.6665 5.66663 5.5065 5.66663 8.99984C5.66663 12.4265 8.34663 15.1998 11.84 15.3198C11.9466 15.3065 12.0533 15.3065 12.1333 15.3198C12.16 15.3198 12.1733 15.3198 12.2 15.3198C12.2133 15.3198 12.2133 15.3198 12.2266 15.3198C15.64 15.1998 18.32 12.4265 18.3333 8.99984C18.3333 5.5065 15.4933 2.6665 12 2.6665Z" fill="#1D82F5" />
                        <path d="M18.7733 18.8668C15.0533 16.3868 8.98661 16.3868 5.23995 18.8668C3.54661 20.0002 2.61328 21.5335 2.61328 23.1735C2.61328 24.8135 3.54661 26.3335 5.22661 27.4535C7.09328 28.7068 9.54661 29.3335 11.9999 29.3335C14.4533 29.3335 16.9066 28.7068 18.7733 27.4535C20.4533 26.3202 21.3866 24.8002 21.3866 23.1468C21.3733 21.5068 20.4533 19.9868 18.7733 18.8668Z" fill="#1D82F5" />
                        <path d="M26.6534 9.78664C26.8667 12.3733 25.0267 14.64 22.48 14.9466C22.4667 14.9466 22.4667 14.9466 22.4534 14.9466H22.4134C22.3334 14.9466 22.2534 14.9466 22.1867 14.9733C20.8934 15.04 19.7067 14.6266 18.8134 13.8666C20.1867 12.64 20.9734 10.8 20.8134 8.79997C20.72 7.71997 20.3467 6.7333 19.7867 5.8933C20.2934 5.63997 20.88 5.47997 21.48 5.42664C24.0934 5.19997 26.4267 7.14664 26.6534 9.78664Z" fill="#1D82F5" />
                        <path d="M29.32 22.1199C29.2133 23.4132 28.3867 24.5332 27 25.2932C25.6667 26.0265 23.9867 26.3732 22.32 26.3332C23.28 25.4665 23.84 24.3865 23.9467 23.2399C24.08 21.5865 23.2933 19.9999 21.72 18.7332C20.8267 18.0265 19.7867 17.4665 18.6533 17.0532C21.6 16.1999 25.3067 16.7732 27.5867 18.6132C28.8133 19.5999 29.44 20.8399 29.32 22.1199Z" fill="#1D82F5" />
                    </svg>)}
                    title="No Users Found"
                    message="Start adding users to manage access and roles within the system. Use the button below to add your first user."
                    cta={{ label: "Create User", url: PATH.USER_MANAGEMENT.CREATE_USER.ROOT }}
                />
            ) : (
                <UdaanTable
                    loading={isLoading || isFetching}
                    data={user}
                    columns={columns}
                />
            )}

            <TablePagination
                qp={qp}
                setQp={setQp}
                totalPages={data?.data?.pagination?.total_pages || 0}
            />
            <ConfirmationDialog
                open={openConfirm}
                setOpen={setOpenConfirm}
                title={dialogContent.title}
                description={dialogContent.description}
                onSave={handleConfirmAction}
                icon={(<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.0697 5.23C19.4597 5.07 17.8497 4.95 16.2297 4.86V4.85L16.0097 3.55C15.8597 2.63 15.6397 1.25 13.2997 1.25H10.6797C8.34967 1.25 8.12967 2.57 7.96967 3.54L7.75967 4.82C6.82967 4.88 5.89967 4.94 4.96967 5.03L2.92967 5.23C2.50967 5.27 2.20967 5.64 2.24967 6.05C2.28967 6.46 2.64967 6.76 3.06967 6.72L5.10967 6.52C10.3497 6 15.6297 6.2 20.9297 6.73C20.9597 6.73 20.9797 6.73 21.0097 6.73C21.3897 6.73 21.7197 6.44 21.7597 6.05C21.7897 5.64 21.4897 5.27 21.0697 5.23Z" fill="#1D82F5" />
                    <path d="M19.2297 8.14C18.9897 7.89 18.6597 7.75 18.3197 7.75H5.67975C5.33975 7.75 4.99975 7.89 4.76975 8.14C4.53975 8.39 4.40975 8.73 4.42975 9.08L5.04975 19.34C5.15975 20.86 5.29975 22.76 8.78975 22.76H15.2097C18.6997 22.76 18.8398 20.87 18.9497 19.34L19.5697 9.09C19.5897 8.73 19.4597 8.39 19.2297 8.14ZM13.6597 17.75H10.3297C9.91975 17.75 9.57975 17.41 9.57975 17C9.57975 16.59 9.91975 16.25 10.3297 16.25H13.6597C14.0697 16.25 14.4097 16.59 14.4097 17C14.4097 17.41 14.0697 17.75 13.6597 17.75ZM14.4997 13.75H9.49975C9.08975 13.75 8.74975 13.41 8.74975 13C8.74975 12.59 9.08975 12.25 9.49975 12.25H14.4997C14.9097 12.25 15.2497 12.59 15.2497 13C15.2497 13.41 14.9097 13.75 14.4997 13.75Z" fill="#1D82F5" />
                </svg>)}
            />
            <CourseFilter
                open={filterDialogOpen}
                onClose={() => setFilterDialogOpen(false)}
                selections={selections}
                roles={roles || []}
                onChange={handleCategoryChange}
                onApplyFilter={handleApplyFilter}
                onResetFilter={resetFilters}
            />
        </>
    );
}