"use client";

import {
    Box,
    Checkbox,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from "@mui/material";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useEffect, useRef } from "react";

type SelectionMode = "none" | "single" | "multiple";

interface InfiniteTableProps<T extends { id: number }> {
    data: T[];
    columns: ColumnDef<T, any>[];
    loading?: boolean;
    hasMore?: boolean;
    fetchNext?: () => void;

    selectionMode?: SelectionMode;
    selectedIds?: number[];
    onSelectionChange?: (ids: number[]) => void;

    skeletonRows?: number;
    className?: string;
}

export default function InfiniteTable<T extends object>({
    data,
    columns,
    loading = false,
    hasMore = false,
    fetchNext,
    selectionMode = "none",
    selectedIds = [],
    onSelectionChange,
    skeletonRows = 8,
    className,
}: InfiniteTableProps<T>) {
    const theme = useTheme();
    const loaderRef = useRef<HTMLTableRowElement | null>(null);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    /* ------------------ Infinite Scroll ------------------ */
    useEffect(() => {
        if (!loaderRef.current || !fetchNext || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNext();
                }
            },
            { root: null, threshold: 1 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [fetchNext, hasMore]);

    /* ------------------ Selection ------------------ */
    const toggleSelection = (id: number) => {
        if (!onSelectionChange) return;

        if (selectionMode === "single") {
            onSelectionChange([id]);
        }

        if (selectionMode === "multiple") {
            onSelectionChange(
                selectedIds.includes(id)
                    ? selectedIds.filter((x) => x !== id)
                    : [...selectedIds, id]
            );
        }
    };

    return (
        <Box className={`${className} h-full`}>
            <TableContainer
                sx={{
                    height: "100%",
                    border: `1px solid ${theme.palette.separator.dark}`,
                    borderRadius: 2,
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {selectionMode !== "none" && (
                                    <TableCell width={60} />
                                )}

                                {headerGroup.headers.map((header) => (
                                    <TableCell key={header.id}>
                                        <Typography variant="subtitle2">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>

                    <TableBody>
                        {table.getRowModel().rows.map((row) => {
                            const isSelected = selectedIds.includes(row.original.id);

                            return (
                                <TableRow
                                    key={row.id}
                                    hover
                                    selected={isSelected}
                                    onClick={() =>
                                        selectionMode !== "none" &&
                                        toggleSelection(row.original.id)
                                    }
                                    sx={{ cursor: selectionMode !== "none" ? "pointer" : "default" }}
                                >
                                    {selectionMode !== "none" && (
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={isSelected} />
                                        </TableCell>
                                    )}

                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}

                        {/* Skeleton Loader */}
                        {loading &&
                            Array.from({ length: skeletonRows }).map((_, i) => (
                                <TableRow key={`skeleton-${i}`}>
                                    {Array.from({
                                        length: columns.length + (selectionMode !== "none" ? 1 : 0),
                                    }).map((_, j) => (
                                        <TableCell key={j}>
                                            <Skeleton height={24} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}

                        {/* Infinite Scroll Trigger */}
                        {hasMore && !loading && (
                            <TableRow ref={loaderRef}>
                                <TableCell colSpan={columns.length + 1}>
                                    <Typography align="center" variant="caption">
                                        Loading more…
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
