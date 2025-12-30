import { Tooltip, Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useGetAllActivityQuery } from '../../../services/activityApi';
import type { ActivityProps } from '../../../types/activity';
import UdaanTable from '../../molecules/Table';
import TablePagination from '../../molecules/Table/Pagination';
import PageHeader from '../../organism/PageHeader';
import TableFilter from '../../organism/TableFilter';

export default function ActivityRoot() {
    const [search, setSearch] = useState("");
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 20,
    });
    const { data, isLoading } = useGetAllActivityQuery({ ...qp, search });
    const columns = useMemo<ColumnDef<ActivityProps>[]>(() => [
        {
            header: "S.No.",
            accessorKey: "sn",
            cell: ({ row }) => (
                <Typography >{row.index + 1}</Typography>
            ),
        },
        {
            header: "Log",
            accessorKey: "log",
            cell: ({ row }) => (
                <Tooltip title={row.original.log}>
                    <Typography className='line-clamp-1'>{row.original.log || "N/A"}</Typography>
                </Tooltip>
            ),
        },
        {
            header: "Device",
            accessorKey: "device_type",
            cell: ({ row }) => (
                <Typography className='line-clamp-1'>{row.original.device_type || "N/A"}</Typography>
            ),
        },
        {
            header: "Username",
            accessorKey: "username",
            cell: ({ row }) => (
                <Typography >{row.original.username || "N/A"}</Typography>
            ),
        },
        {
            header: "Email",
            accessorKey: "email",
            cell: ({ row }) => (
                <Typography >{row.original.email || "N/A"}</Typography>
            ),
        },
        {
            header: "Phone",
            accessorKey: "phone",
            cell: ({ row }) => (
                <Typography >{row.original.phone || "N/A"}</Typography>
            ),
        },
        {
            header: "Type",
            accessorKey: "type",
            cell: ({ row }) => (
                <Typography >{row.original.type || "N/A"}</Typography>
            ),
        },
    ], [])
    return (
        <div className='activity__root pb-4 lg:pb-6'>
            <PageHeader
                breadcrumb={[
                    {
                        title: "Activity Log",
                        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM20 18c1.26-1.67 2-3.75 2-6s-.74-4.33-2-6M4 6c-1.26 1.67-2 3.75-2 6s.74 4.33 2 6M16.8 15.6c.75-1 1.2-2.25 1.2-3.6s-.45-2.6-1.2-3.6M7.2 8.4C6.45 9.4 6 10.65 6 12s.45 2.6 1.2 3.6" stroke="#1D82F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>)
                    }
                ]}
            />
            <TableFilter
                search={search}
                setSearch={setSearch}
                selectedRows={new Set<number | string>([])}
                handleRoleDelete={() => { }}
            />
            <UdaanTable
                data={data?.data?.data || []}
                loading={isLoading}
                columns={columns}
            />
            <TablePagination
                qp={qp}
                setQp={setQp}
                totalPages={data?.data?.pagination?.total_pages || 0}
            />
        </div>
    )
}
