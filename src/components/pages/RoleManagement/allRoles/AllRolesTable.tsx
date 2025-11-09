import { Button, Checkbox, Stack, Typography, useTheme } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../../../routes/PATH';
import { useDeleteRoleMutation, useGetAllRolesQuery } from '../../../../services/roleAndPermissionApi';
import { showToast } from '../../../../slice/toastSlice';
import { useAppDispatch } from '../../../../store/hook';
import type { RoleProps } from '../../../../types/roleAndPermission';
import { formatDateForDisplay } from '../../../../utils/dateFormat';
import Actions from '../../../molecules/Action';
import UdaanTable from '../../../molecules/Table';
import EmptyRoles from '../EmptyRoles';

export default function AllRolesTable() {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [selectedRows, setSelectedRows] = useState<Set<number | string>>(new Set());
    const [qp, setQp] = React.useState({
        pageIndex: 1,
        pageSize: 8,
    })

    const { data, isLoading } = useGetAllRolesQuery(qp);
    const [deleteRole, { isLoading: deleting }] = useDeleteRoleMutation();


    const roles = data?.data?.data || [];

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIndices = new Set(roles.map((_, index) => index));
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


    const isAllSelected = roles.length > 0 && selectedRows.size === roles.length;
    const isSomeSelected = selectedRows.size > 0 && selectedRows.size < roles.length;

    const columns = useMemo<ColumnDef<RoleProps>[]>(() => [
        {
            header: () => (
                <Stack sx={{ gap: "10px" }}>
                    <Checkbox
                        checked={isAllSelected}
                        indeterminate={isSomeSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        color="primary"
                    />
                    < Typography fontWeight={500} >S.No.</Typography >
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
                    < Typography fontWeight={500} > {row.index + 1}</Typography >
                </Stack >
            ),
            size: 80,
        },
        {
            header: "Role Name",
            accessorKey: "name",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="capitalize">{row.original.name}</Typography>
            ),
        },
        {
            header: "Members",
            accessorKey: "members",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="capitalize">
                    {row.original.members || 0} Members
                </Typography>
            ),
        },
        {
            header: "Created At",
            accessorKey: "created_at",
            cell: ({ row }) => (
                <Typography fontWeight={500}>
                    {formatDateForDisplay(row.original.created_at)}
                </Typography>
            ),
        },
        {
            header: "Actions",
            accessorKey: "actions",
            cell: ({ row }) => (
                <Actions
                    deleting={deleting}
                    onEdit={() => navigate(`${PATH.ROLES.EDIT_ROLE.ROOT(row.original.id?.toString() || "")}`)}
                    onView={() => navigate(`${PATH.ROLES.EDIT_ROLE.ROOT(row.original.id?.toString() || "")}`)}
                    onDelete={async () => {
                        try {
                            const response = await deleteRole({ id: row.original.id?.toString() || "" }).unwrap();
                            dispatch(
                                showToast({
                                    message: response.message || "Role deleted successfully",
                                    severity: "success"
                                })
                            )
                        }
                        catch (e: any) {
                            dispatch(
                                showToast({
                                    message: e.data.message || "Unable to delete Role",
                                    severity: "error"
                                })
                            )
                        }
                    }}
                />
            ),
        },
    ], [selectedRows, isAllSelected, isSomeSelected, theme])

    // Helper functions to work with selected rows
    const getSelectedRoles = () => {
        return roles.filter((_, index) => selectedRows.has(index));
    };

    const clearSelection = () => {
        setSelectedRows(new Set());
    };

    if (!roles.length) {
        return <EmptyRoles />
    }

    return (
        <>
            {/* Optional: Display selected count */}
            {selectedRows.size > 0 && (
                <div style={{ padding: '16px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Typography variant="body2" color="primary">
                        {selectedRows.size} role(s) selected
                    </Typography>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={clearSelection}
                    >
                        Clear Selection
                    </Button>
                    {/* Add bulk actions here */}
                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => {
                            const selected = getSelectedRoles();
                            console.log('Delete selected roles:', selected);
                            // Implement your delete logic here
                        }}
                    >
                        Delete Selected
                    </Button>
                </div>
            )}

            <UdaanTable
                loading={isLoading}
                data={roles}
                columns={columns}
                qp={qp}
                setQp={setQp}
            />
        </>
    )
}