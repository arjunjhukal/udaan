import { Box, LinearProgress, Stack, Tooltip, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetUserPurchasedCourseQuery } from "../../../../../services/transactionApi";
import {
    useGetUserEnrolledBundlesQuery,
    useGetUserEnrolledCourseAnalyticsQuery,
    useGetUserEnrolledTestsQuery,
} from "../../../../../services/userApi";
import type { CourseProps } from "../../../../../types/course";
import type { UserEnrolledBundle, UserEnrolledTest } from "../../../../../types/userProfile";
import { formatDateForDisplay } from "../../../../../utils/dateFormat";
import { getCourseStatus } from "../../../../../utils/statusMap";
import useServerSort from "../../../../../utils/useServerSort";
import StatusPill from "../../../../atoms/StatusPill";
import SortableHeader from "../../../../molecules/SortableHeader";
import UdaanTable from "../../../../molecules/Table";
import TablePagination from "../../../../molecules/Table/Pagination";
import DashboardAnalyticsCard from "../../../../organism/Cards/DashboardAnalyticsCard";
import DashboardAnalyticsLoading from "../../../../organism/Cards/DashboardAnalyticsCard/Loading";
import EmptyRoute from "../../../../organism/EmptyRoute";

function ProgressCell({ value }: { value?: number }) {
    const val = Number(value ?? 0);
    return (
        <Box sx={{ minWidth: 110 }}>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" color="text.secondary">{val}%</Typography>
            </Stack>
            <LinearProgress
                variant="determinate"
                value={val}
                sx={{ height: 6, borderRadius: 3 }}
                color={val >= 80 ? "success" : val >= 20 ? "info" : "error"}
            />
        </Box>
    );
}

export default function CoursesTab() {
    const { id } = useParams();
    const uid = Number(id);

    const [courseQp, setCourseQp] = useState({ pageIndex: 1, pageSize: 10 });
    const [testQp, setTestQp] = useState({ pageIndex: 1, pageSize: 10 });
    const [bundleQp, setBundleQp] = useState({ pageIndex: 1, pageSize: 10 });

    const courseSort = useServerSort();
    const testSort = useServerSort();
    const bundleSort = useServerSort();
    const onCourseSort = (field: string, order: "asc" | "desc" | "") =>
        courseSort.handleSortChange(field, order, () => setCourseQp((prev) => ({ ...prev, pageIndex: 1 })));
    const onTestSort = (field: string, order: "asc" | "desc" | "") =>
        testSort.handleSortChange(field, order, () => setTestQp((prev) => ({ ...prev, pageIndex: 1 })));
    const onBundleSort = (field: string, order: "asc" | "desc" | "") =>
        bundleSort.handleSortChange(field, order, () => setBundleQp((prev) => ({ ...prev, pageIndex: 1 })));

    const { data: analyticsData, isLoading: analyticsLoading } = useGetUserEnrolledCourseAnalyticsQuery({ id: uid }, { skip: !uid });
    const { data: courseData, isLoading: courseLoading } = useGetUserPurchasedCourseQuery({ ...courseQp, id: uid, sort_field: courseSort.sort.sort_field, sort_by: courseSort.sort.sort_by }, { skip: !uid });
    const { data: testData, isLoading: testLoading } = useGetUserEnrolledTestsQuery({ id: uid, ...testQp, sort_field: testSort.sort.sort_field, sort_by: testSort.sort.sort_by }, { skip: !uid });
    const { data: bundleData, isLoading: bundleLoading } = useGetUserEnrolledBundlesQuery({ id: uid, ...bundleQp, sort_field: bundleSort.sort.sort_field, sort_by: bundleSort.sort.sort_by }, { skip: !uid });

    const courses = courseData?.data?.data ?? [];
    const tests = testData?.data?.data ?? [];
    const bundles = bundleData?.data?.data ?? [];

    const courseColumns = useMemo<ColumnDef<CourseProps>[]>(() => [
        {
            header: "S.No",
            accessorKey: "index",
            cell: ({ row }) => <Typography variant="subtitle1" fontWeight={500}>{row.index + 1}</Typography>,
        },
        {
            header: () => <SortableHeader field="name" label="Course Name" activeField={courseSort.sort.sort_field} activeOrder={courseSort.sort.sort_by} onSortChange={onCourseSort} />,
            accessorKey: "name",
            cell: ({ row }) => (
                <Tooltip title={row.original.name} arrow>
                    <Typography variant="subtitle1" fontWeight={500} className="line-clamp-1">{row.original.name || "N/A"}</Typography>
                </Tooltip>
            ),
        },
        {
            header: () => <SortableHeader field="sale_price" label="Price" activeField={courseSort.sort.sort_field} activeOrder={courseSort.sort.sort_by} onSortChange={onCourseSort} />,
            accessorKey: "sale_price",
            cell: ({ row }) => <Typography variant="subtitle1">{row.original.sale_price || "N/A"}</Typography>,
        },
        {
            header: () => <SortableHeader field="started_from" label="Enrolled On" activeField={courseSort.sort.sort_field} activeOrder={courseSort.sort.sort_by} onSortChange={onCourseSort} />,
            accessorKey: "started_from",
            cell: ({ row }) => <Typography variant="subtitle1">{formatDateForDisplay(row.original.started_from) || "N/A"}</Typography>,
        },
        {
            header: () => <SortableHeader field="ends_at" label="Expires On" activeField={courseSort.sort.sort_field} activeOrder={courseSort.sort.sort_by} onSortChange={onCourseSort} />,
            accessorKey: "ends_at",
            cell: ({ row }) => <Typography variant="subtitle1">{formatDateForDisplay(row.original.ends_at) || "N/A"}</Typography>,
        },
        {
            header: () => <SortableHeader field="progress" label="Progress" activeField={courseSort.sort.sort_field} activeOrder={courseSort.sort.sort_by} onSortChange={onCourseSort} />,
            accessorKey: "progress",
            cell: ({ row }) => <ProgressCell value={row.original.progress} />,
        },
        {
            header: () => <SortableHeader field="course_completion_status" label="Status" activeField={courseSort.sort.sort_field} activeOrder={courseSort.sort.sort_by} onSortChange={onCourseSort} />,
            accessorKey: "course_completion_status",
            cell: ({ row }) => {
                const progress = Number(row.original.progress ?? 0);
                const label = progress === 0 ? "Not Started" : progress === 100 ? "Completed" : "In Progress";
                return <StatusPill status={label} variant={getCourseStatus(progress)} />;
            },
        },
    ], [courseSort.sort]);

    const testColumns = useMemo<ColumnDef<UserEnrolledTest>[]>(() => [
        {
            header: "S.No",
            accessorKey: "index",
            cell: ({ row }) => <Typography variant="subtitle1" fontWeight={500}>{row.index + 1}</Typography>,
        },
        {
            header: () => <SortableHeader field="name" label="Test Name" activeField={testSort.sort.sort_field} activeOrder={testSort.sort.sort_by} onSortChange={onTestSort} />,
            accessorKey: "name",
            cell: ({ row }) => (
                <Tooltip title={row.original.name} arrow>
                    <Typography variant="subtitle1" fontWeight={500} className="line-clamp-1">{row.original.name || "N/A"}</Typography>
                </Tooltip>
            ),
        },
        {
            header: () => <SortableHeader field="test_type" label="Type" activeField={testSort.sort.sort_field} activeOrder={testSort.sort.sort_by} onSortChange={onTestSort} />,
            accessorKey: "test_type",
            cell: ({ row }) => <Typography variant="subtitle1" className="capitalize">{row.original.test_type || "N/A"}</Typography>,
        },
        {
            header: () => <SortableHeader field="full_mark" label="Full Mark" activeField={testSort.sort.sort_field} activeOrder={testSort.sort.sort_by} onSortChange={onTestSort} />,
            accessorKey: "full_mark",
            cell: ({ row }) => <Typography variant="subtitle1">{row.original.full_mark ?? "N/A"}</Typography>,
        },
        {
            header: () => <SortableHeader field="pass_mark" label="Pass Mark" activeField={testSort.sort.sort_field} activeOrder={testSort.sort.sort_by} onSortChange={onTestSort} />,
            accessorKey: "pass_mark",
            cell: ({ row }) => <Typography variant="subtitle1">{row.original.pass_mark ?? "N/A"}</Typography>,
        },
        {
            header: () => <SortableHeader field="started_from" label="Enrolled On" activeField={testSort.sort.sort_field} activeOrder={testSort.sort.sort_by} onSortChange={onTestSort} />,
            accessorKey: "started_from",
            cell: ({ row }) => <Typography variant="subtitle1">{formatDateForDisplay(row.original.started_from) || "N/A"}</Typography>,
        },
        {
            header: () => <SortableHeader field="status" label="Status" activeField={testSort.sort.sort_field} activeOrder={testSort.sort.sort_by} onSortChange={onTestSort} />,
            accessorKey: "status",
            cell: ({ row }) => {
                const progress = Number(row.original.progress ?? 0);
                const label = progress === 0 ? "Not Started" : progress === 100 ? "Completed" : "In Progress";
                return <StatusPill status={label} variant={getCourseStatus(progress)} />;
            },
        },
    ], [testSort.sort]);

    const bundleColumns = useMemo<ColumnDef<UserEnrolledBundle>[]>(() => [
        {
            header: "S.No",
            accessorKey: "index",
            cell: ({ row }) => <Typography variant="subtitle1" fontWeight={500}>{row.index + 1}</Typography>,
        },
        {
            header: () => <SortableHeader field="name" label="Bundle Name" activeField={bundleSort.sort.sort_field} activeOrder={bundleSort.sort.sort_by} onSortChange={onBundleSort} />,
            accessorKey: "name",
            cell: ({ row }) => (
                <Tooltip title={row.original.name} arrow>
                    <Typography variant="subtitle1" fontWeight={500} className="line-clamp-1">{row.original.name || "N/A"}</Typography>
                </Tooltip>
            ),
        },
        {
            header: () => <SortableHeader field="started_from" label="Enrolled On" activeField={bundleSort.sort.sort_field} activeOrder={bundleSort.sort.sort_by} onSortChange={onBundleSort} />,
            accessorKey: "started_from",
            cell: ({ row }) => <Typography variant="subtitle1">{formatDateForDisplay(row.original.started_from) || "N/A"}</Typography>,
        },
        {
            header: () => <SortableHeader field="ends_at" label="Expires On" activeField={bundleSort.sort.sort_field} activeOrder={bundleSort.sort.sort_by} onSortChange={onBundleSort} />,
            accessorKey: "ends_at",
            cell: ({ row }) => <Typography variant="subtitle1">{formatDateForDisplay(row.original.ends_at) || "N/A"}</Typography>,
        },
        {
            header: () => <SortableHeader field="progress" label="Progress" activeField={bundleSort.sort.sort_field} activeOrder={bundleSort.sort.sort_by} onSortChange={onBundleSort} />,
            accessorKey: "progress",
            cell: ({ row }) => <ProgressCell value={row.original.progress} />,
        },
        {
            header: () => <SortableHeader field="status" label="Status" activeField={bundleSort.sort.sort_field} activeOrder={bundleSort.sort.sort_by} onSortChange={onBundleSort} />,
            accessorKey: "status",
            cell: ({ row }) => {
                const progress = Number(row.original.progress ?? 0);
                const label = progress === 0 ? "Not Started" : progress === 100 ? "Completed" : "In Progress";
                return <StatusPill status={label} variant={getCourseStatus(progress)} />;
            },
        },
    ], [bundleSort.sort]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, pb: 4 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" }, gap: 2, p: 2 }}>
                {analyticsLoading
                    ? Array.from({ length: 3 }).map((_, i) => <DashboardAnalyticsLoading key={i} />)
                    : analyticsData?.data?.map((item) => (
                        <DashboardAnalyticsCard key={item.title} data={{ title: item.title, value: item.value.toLocaleString(), description: "", type: item.type }} />
                    ))
                }
            </Box>

            <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>Enrolled Courses</Typography>
                {!courseLoading && !courses.length
                    ? <EmptyRoute title="No Enrolled Courses" message="This user has not enrolled in any courses yet." />
                    : <>
                        <UdaanTable data={courses} columns={courseColumns} loading={courseLoading} />
                        <TablePagination qp={courseQp} setQp={setCourseQp} totalPages={courseData?.data?.pagination?.total_pages ?? 0} />
                    </>
                }
            </Box>

            <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>Enrolled Tests</Typography>
                {!testLoading && !tests.length
                    ? <EmptyRoute title="No Enrolled Tests" message="This user has not enrolled in any tests yet." />
                    : <>
                        <UdaanTable data={tests} columns={testColumns} loading={testLoading} />
                        <TablePagination qp={testQp} setQp={setTestQp} totalPages={testData?.data?.pagination?.total_pages ?? 0} />
                    </>
                }
            </Box>

            <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>Enrolled Bundles</Typography>
                {!bundleLoading && !bundles.length
                    ? <EmptyRoute title="No Enrolled Bundles" message="This user has not enrolled in any bundles yet." />
                    : <>
                        <UdaanTable data={bundles} columns={bundleColumns} loading={bundleLoading} />
                        <TablePagination qp={bundleQp} setQp={setBundleQp} totalPages={bundleData?.data?.pagination?.total_pages ?? 0} />
                    </>
                }
            </Box>
        </Box>
    );
}
