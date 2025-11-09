import { Button, Checkbox, Stack, Typography, useTheme } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../../../routes/PATH';
import { useGetAllRolesQuery } from '../../../../services/roleAndPermissionApi';
import type { RoleProps } from '../../../../types/roleAndPermission';
import { formatDateForDisplay } from '../../../../utils/dateFormat';
import UdaanTable from '../../../molecules/Table';
import EmptyRoles from '../EmptyRoles';

export default function AllRolesTable() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState<Set<number | string>>(new Set());
    const [qp, setQp] = React.useState({
        pageIndex: 1,
        pageSize: 8,
    })

    const { data, isLoading } = useGetAllRolesQuery(qp);


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
            header: "Permission",
            accessorKey: "permission",
            cell: ({ row }) => (
                <Button
                    variant='outlined' sx={{
                        color: theme.palette.text.dark,
                        border: `1px solid ${theme.palette.primary.dark}`,
                        gap: "8px"
                    }}
                    onClick={() => navigate(`${PATH.ROLES.EDIT_ROLE.ROOT(row.original.id?.toString() || "")}`)}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.4917 12.4416C14.775 14.1499 12.3167 14.6749 10.1584 13.9999L6.23337 17.9166C5.95004 18.2083 5.39171 18.3833 4.99171 18.3249L3.17504 18.0749C2.57504 17.9916 2.01671 17.4249 1.92504 16.8249L1.67504 15.0083C1.61671 14.6083 1.80837 14.0499 2.08337 13.7666L6.00004 9.84994C5.33337 7.68327 5.85004 5.22494 7.56671 3.5166C10.025 1.05827 14.0167 1.05827 16.4834 3.5166C18.95 5.97494 18.95 9.98327 16.4917 12.4416Z" stroke="#111827" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5.7417 14.575L7.65837 16.4916" stroke="#111827" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.0835 9.16675C12.7739 9.16675 13.3335 8.6071 13.3335 7.91675C13.3335 7.22639 12.7739 6.66675 12.0835 6.66675C11.3931 6.66675 10.8335 7.22639 10.8335 7.91675C10.8335 8.6071 11.3931 9.16675 12.0835 9.16675Z" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Permissions
                </Button>
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