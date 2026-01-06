import { Box, Tooltip, Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useGetAllActivityQuery } from '../../../services/activityApi';
import type { ActivityProps } from '../../../types/activity';
import UdaanTable from '../../molecules/Table';
import TablePagination from '../../molecules/Table/Pagination';
import EmptyRoute from '../../organism/EmptyRoute';
import PageHeader from '../../organism/PageHeader';
import TableFilter from '../../organism/TableFilter';

export default function ActivityRoot() {
    const [search, setSearch] = useState("");
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 20,
    });
    const { data, isLoading } = useGetAllActivityQuery({ ...qp, search });

    const formatToNepalTime = (timestamp: string): string => {
        if (!timestamp) return "N/A";

        try {
            const date = new Date(timestamp);

            if (isNaN(date.getTime())) {
                return "Invalid Date";
            }

            return new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Kathmandu',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).format(date);
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid Date";
        }
    };

    const columns = useMemo<ColumnDef<ActivityProps>[]>(() => [
        {
            header: "S.No.",
            accessorKey: "sn",
            cell: ({ row }) => (
                <Typography>
                    {(qp.pageIndex - 1) * qp.pageSize + row.index + 1}
                </Typography>
            )
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
        {
            header: "Date",
            accessorKey: "date",
            cell: ({ row }) => (
                <Typography >{formatToNepalTime(row.original.timestamp) || "N/A"}</Typography>
            ),
        },
    ], [qp]);

    return (
        <div className='activity__root  flex flex-col justify-start h-full overflow-hidden'>
            <div className="page__top">
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
            </div>
            <Box className="table__wrapper h-full overflow-hidden">
                {data?.data?.data.length ? <UdaanTable
                    data={data?.data?.data || []}
                    loading={isLoading}
                    columns={columns}
                    maxHeight='calc(100%  - 400px)'
                /> : <EmptyRoute
                    title="No Activity Found"
                    message="There are currently no logs available for this transaction. Please check back later or verify the transaction process."
                />
                }
            </Box>
            <TablePagination
                qp={qp}
                setQp={setQp}
                totalPages={data?.data?.pagination?.total_pages || 0}
            />
        </div>
    )
}
