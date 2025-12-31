"use client";

import {
    Box,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme
} from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
interface UdaanTableProps<T extends object> {
    data: T[];
    columns: ColumnDef<T, any>[];
    pagination?: boolean;
    sortable?: boolean;
    className?: string;
    loading?: boolean
    skeletonRows?: number,

}

export default function UdaanTable<T extends object>({
    data,
    columns,
    pagination = false,
    sortable = true,
    className,
    loading,
    skeletonRows = 8,
}: UdaanTableProps<T>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
        getSortedRowModel: sortable ? getSortedRowModel() : undefined,
        getFilteredRowModel: getFilteredRowModel(),
    });

    const theme = useTheme();
    return (
        <Box className={className}>
            <TableContainer sx={{ borderRadius: 2, border: `1px solid ${theme.palette.separator.dark}`, }}>
                <Table >
                    <TableHead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableCell key={header.id} sx={{ fontWeight: 600 }} className="p-5!" >
                                        <Typography variant="subtitle2" color="text.middle">{flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}</Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>

                    {/* <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="px-5! py-6!">
                                        <Typography variant="body2" color="text.dark">{flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}</Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody> */}
                    <TableBody>
                        {loading ? (
                            // Render skeleton rows
                            Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                                <TableRow key={`skeleton-${rowIndex}`}>
                                    {columns.map((_, cellIndex) => (
                                        <TableCell key={`skeleton-cell-${cellIndex}`} className="px-5! py-6!">
                                            <Skeleton
                                                variant="text"
                                                width={cellIndex === 0 ? "60%" : "80%"}
                                                height={24}
                                                sx={{
                                                    bgcolor: theme.palette.mode === 'dark'
                                                        ? 'rgba(255, 255, 255, 0.1)'
                                                        : 'rgba(0, 0, 0, 0.06)',
                                                }}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            // Render actual data
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-5! py-6!">
                                            <Typography variant="body2" color="text.dark">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </Typography>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

        </Box>
    );
}
