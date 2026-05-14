import { Tooltip, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useGetUserPurchasedCourseQuery } from "../../../../services/transactionApi";
import type { CourseProps } from "../../../../types/course";
import { getCourseStatus } from "../../../../utils/statusMap";
import useServerSort from "../../../../utils/useServerSort";
import StatusPill from "../../../atoms/StatusPill";
import SortableHeader from "../../../molecules/SortableHeader";
import UdaanTable from "../../../molecules/Table";
import TablePagination from "../../../molecules/Table/Pagination";
import EmptyRoute from "../../../organism/EmptyRoute";

export default function UserEnrolledCourses() {
    const { id } = useParams();
    const { t } = useTranslation();
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 10,
    });
    const { sort, handleSortChange } = useServerSort();
    const onSort = (field: string, order: "asc" | "desc" | "") =>
        handleSortChange(field, order, () => setQp((prev) => ({ ...prev, pageIndex: 1 })));

    const { data, isLoading } = useGetUserPurchasedCourseQuery({ ...qp, id: Number(id), sort_field: sort.sort_field, sort_by: sort.sort_by });

    const courses = data?.data?.data || [];


    const columns = useMemo<ColumnDef<CourseProps>[]>(() => [
        {
            header: "S.No",
            accessorKey: "index",
            cell: ({ row }) => (
                <Typography fontWeight={500} variant="subtitle1">
                    {row.index + 1 || "N/A"}
                </Typography>
            ),
        },
        {
            header: () => <SortableHeader field="name" label="Course Name" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "name",
            cell: ({ row }) => (
                <Tooltip title={row.original.name} arrow>
                    <Typography fontWeight={500} variant="subtitle1" className="line-clamp-1">
                        {row.original.name || "N/A"}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            header: () => <SortableHeader field="sale_price" label="Price" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "price",
            cell: ({ row }) => (
                <Typography variant="subtitle1" className="capitalize">
                    {row.original.sale_price || "N/A"}
                </Typography>
            ),
        },
        {
            header: () => <SortableHeader field="started_from" label="Purchased Date" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "purchased_date",
            cell: ({ row }) => (
                <Typography variant="subtitle1" className="capitalize">
                    {row.original.started_from || "N/A"}
                </Typography>
            ),
        },
        {
            header: () => <SortableHeader field="ends_at" label="End Date" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "end_date",
            cell: ({ row }) => (
                <Typography variant="subtitle1" className="capitalize">
                    {row.original?.ends_at || "N/A"}
                </Typography>
            ),
        },
        {
            header: () => <SortableHeader field="progress" label="Status" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "course_completion_status",
            cell: ({ row }) => {
                const progress = Number(row.original?.progress ?? 0);

                const getLabel = () => {
                    if (progress === 0) return "Not Started";
                    if (progress === 100) return "Completed";
                    return "In Progress";
                };

                return (
                    <StatusPill
                        status={getLabel()}
                        variant={getCourseStatus(progress)}
                    />
                );
            },
        },


    ], [qp, sort])


    return (
        <div className="user__enrolled__course__root">
            <Typography variant="h5" className="mb-4!" fontWeight={600}>{t("messages.enrolled_courses")}</Typography>
            {!isLoading && !courses.length ? <EmptyRoute
                title="No Enrolled Courses"
                message="This user has not enrolled in any courses yet."
            /> : <>
                <UdaanTable
                    data={courses}
                    columns={columns}
                    loading={isLoading} />
                <TablePagination
                    qp={qp}
                    setQp={setQp}
                    totalPages={data?.data?.pagination?.total_pages || 0}
                />
            </>}
        </div>
    )
}
