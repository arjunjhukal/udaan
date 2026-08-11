import { Box, Checkbox, Stack, Tooltip, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import { useGetAllCourseQuery } from "../../../../services/courseApi";
import { useGetAllEbookQuery } from "../../../../services/ebookApi";
import { useGetAllBundleQuery, useGetAllIndividualTestQuery } from "../../../../services/questionApi";
import { useCourseFilter } from "../../../../store/useCourseFilter";
import type { CourseProps } from "../../../../types/course";
import type { EbookProps } from "../../../../types/ebook";
import type { SetProps, TestProps } from "../../../../types/question";
import type { EnrollmentType } from "../../../../types/transaction";
import { formatDate } from "../../../../utils/dateFormat";
import { formatNpr, getEbookPricing } from "../../../../utils/ebookPricing";
import useServerSort from "../../../../utils/useServerSort";
import ActionIconVisible from "../../../molecules/Action/ActionIconVisible";
import SortableHeader from "../../../molecules/SortableHeader";
import TabController from "../../../molecules/TabController";
import UdaanTable from "../../../molecules/Table";
import TablePagination from "../../../molecules/Table/Pagination";
import ActiveFilterBar from "../../../organism/ActiveFilterBar";
import EmptyRoute from "../../../organism/EmptyRoute";
import { CourseFilter } from "../../../organism/Filter/CourseFilter";
import TableFilter from "../../../organism/TableFilter";

export default function AllEntrollments() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<EnrollmentType>("course");
    const [search, setSearch] = useState<string>("");
    const [qp, setQp] = useState({ pageIndex: 1, pageSize: 8 });

    const {
        selections,
        megaCategories,
        categories,
        subCategories,
        positions,
        teachers,
        loadingMegaCategory,
        searchTeacher,
        appliedPills,
        setSearchTeacher,
        handleCategoryChange,
        handleApplyFilter,
        resetFilters,
        getCategoryFilterParams,
        filterDialogOpen,
        setFilterDialogOpen
    } = useCourseFilter({ persistOnMount: true, namespace: "enrollments" });

    const categoryFilter = getCategoryFilterParams();

    const courseTypes = [
        { value: "free", label: "Free" },
        { value: "subscription", label: "Subscription" },
        { value: "expiry", label: "Expiry" }
    ];

    const { sort, handleSortChange, resetSort } = useServerSort();
    const onSort = (field: string, order: "asc" | "desc" | "") =>
        handleSortChange(field, order, () => setQp((prev) => ({ ...prev, pageIndex: 1 })));

    const { data: courseData, isLoading: loadingCourses } = useGetAllCourseQuery(
        { ...qp, search, categoryFilter: { ...categoryFilter }, status: "published", sort_field: sort.sort_field, sort_by: sort.sort_by },
    );
    const { data: testData, isLoading: loadingTests } = useGetAllIndividualTestQuery(
        { ...qp, search, sort_field: sort.sort_field, sort_by: sort.sort_by },
    );
    const { data: bundleData, isLoading: loadingBundles } = useGetAllBundleQuery(
        { ...qp, search, sort_field: sort.sort_field, sort_by: sort.sort_by },
    );
    const { data: ebookData, isLoading: loadingEbooks } = useGetAllEbookQuery(
        { ...qp, search, status: "published", categoryFilter: { ...categoryFilter }, sort_field: sort.sort_field, sort_by: sort.sort_by },
    );

    useEffect(() => {
        resetFilters();
    }, []);

    const handleTabChange = (tab: EnrollmentType) => {
        setActiveTab(tab);
        setSearch("");
        setQp({ pageIndex: 1, pageSize: 8 });
        resetSort();
    };

    // ── Course columns ──────────────────────────────────────────────────────
    const courseColumns = useMemo<ColumnDef<CourseProps>[]>(() => [
        {
            header: () => (
                <Stack sx={{ gap: "10px" }}>
                    <Checkbox color="primary" />
                    <Typography fontWeight={500}>S.No.</Typography>
                </Stack>
            ),
            accessorKey: "sno",
            cell: ({ row }) => (
                <Stack sx={{ gap: "10px" }}>
                    <Checkbox color="primary" />
                    <Typography fontWeight={500}>{(qp.pageIndex - 1) * qp.pageSize + row.index + 1}</Typography>
                </Stack>
            ),
            size: 80,
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
            header: () => <SortableHeader field="course_type" label="Course Type" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "course_type",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="capitalize">
                    {row.original.course_type || "N/A"}
                </Typography>
            ),
        },
        {
            header: () => <SortableHeader field="marked_price" label="Price" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "price",
            cell: ({ row }) => (
                <Typography fontWeight={500}>{row.original.marked_price || "N/A"}</Typography>
            ),
        },
        {
            header: () => <SortableHeader field="subjects" label="Subjects" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "subjects",
            cell: ({ row }) => (
                <Typography fontWeight={500}>{row.original.subjects || "N/A"}</Typography>
            ),
        },
        {
            header: () => <SortableHeader field="enrolled_students" label="Enrolled Students" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "enrolled_students",
            cell: ({ row }) => (
                <Typography>{row.original.enrolled_students || "N/A"}</Typography>
            ),
        },
        {
            header: () => <SortableHeader field="created_at" label="Created Date" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "created_at",
            cell: ({ row }) => (
                <Typography fontWeight={500}>{formatDate(row.original?.created_at || "")}</Typography>
            ),
        },
        {
            header: "Actions",
            accessorKey: "actions",
            cell: ({ row }) => (
                <ActionIconVisible
                    onView={() => navigate(PATH.COURSE_MANAGEMENT.COURSES.ANALYTICS.ROOT(row.original.id))}
                />
            ),
        },
    ], [navigate, qp, sort]);

    // ── Test columns ────────────────────────────────────────────────────────
    const testColumns = useMemo<ColumnDef<TestProps>[]>(() => [
        {
            header: () => (
                <Stack sx={{ gap: "10px" }}>
                    <Checkbox color="primary" />
                    <Typography fontWeight={500}>S.No.</Typography>
                </Stack>
            ),
            accessorKey: "sno",
            cell: ({ row }) => (
                <Stack sx={{ gap: "10px" }}>
                    <Checkbox color="primary" />
                    <Typography fontWeight={500}>{(qp.pageIndex - 1) * qp.pageSize + row.index + 1}</Typography>
                </Stack>
            ),
            size: 80,
        },
        {
            header: () => <SortableHeader field="name" label="Test Name" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
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
            header: () => <SortableHeader field="test_type" label="Test Type" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "test_type",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="capitalize">
                    {row.original.test_type || "N/A"}
                </Typography>
            ),
        },
        {
            header: () => <SortableHeader field="price" label="Price" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "price",
            cell: ({ row }) => (
                <Typography fontWeight={500}>{row.original.price || "N/A"}</Typography>
            ),
        },
        {
            header: () => <SortableHeader field="total_questions" label="Total Questions" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "total_questions",
            cell: ({ row }) => (
                <Typography fontWeight={500}>{row.original.total_questions ?? "N/A"}</Typography>
            ),
        },
        {
            header: () => <SortableHeader field="no_of_students" label="Enrolled Students" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "no_of_students",
            cell: ({ row }) => (
                <Typography>{row.original.no_of_students ?? "N/A"}</Typography>
            ),
        },
        {
            header: () => <SortableHeader field="created_at" label="Created Date" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "created_at",
            cell: ({ row }) => (
                <Typography fontWeight={500}>{formatDate(row.original?.created_at || "")}</Typography>
            ),
        },
        {
            header: "Actions",
            accessorKey: "actions",
            cell: ({ row }) => (
                <ActionIconVisible
                    onView={() => navigate(PATH.ENROLLMENT.TEST_ANALYTICS.ROOT(row.original.id))}
                />
            ),
        },
    ], [navigate, qp, sort]);

    // ── Bundle columns ──────────────────────────────────────────────────────
    const bundleColumns = useMemo<ColumnDef<SetProps>[]>(() => [
        {
            header: () => (
                <Stack sx={{ gap: "10px" }}>
                    <Checkbox color="primary" />
                    <Typography fontWeight={500}>S.No.</Typography>
                </Stack>
            ),
            accessorKey: "sno",
            cell: ({ row }) => (
                <Stack sx={{ gap: "10px" }}>
                    <Checkbox color="primary" />
                    <Typography fontWeight={500}>{(qp.pageIndex - 1) * qp.pageSize + row.index + 1}</Typography>
                </Stack>
            ),
            size: 80,
        },
        {
            header: () => <SortableHeader field="name" label="Bundle Name" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
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
            header: () => <SortableHeader field="marked_price" label="Price" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "price",
            cell: ({ row }) => (
                <Typography fontWeight={500}>{row.original.marked_price || row.original.price || "N/A"}</Typography>
            ),
        },
        {
            header: () => <SortableHeader field="set_count" label="Tests Included" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "set_count",
            cell: ({ row }) => (
                <Typography fontWeight={500}>{row.original.set_count || "N/A"}</Typography>
            ),
        },
        {
            header: () => <SortableHeader field="status" label="Status" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "status",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="capitalize">{row.original.status || "N/A"}</Typography>
            ),
        },
        {
            header: "Actions",
            accessorKey: "actions",
            cell: ({ row }) => (
                <ActionIconVisible
                    onView={() => navigate(PATH.ENROLLMENT.BUNDLE_ANALYTICS.ROOT(row.original.id))}
                />
            ),
        },
    ], [navigate, qp, sort]);

    // ── eBook columns ───────────────────────────────────────────────────────
    const ebookColumns = useMemo<ColumnDef<EbookProps>[]>(() => [
        {
            header: () => (
                <Stack sx={{ gap: "10px" }}>
                    <Checkbox color="primary" />
                    <Typography fontWeight={500}>S.No.</Typography>
                </Stack>
            ),
            accessorKey: "sno",
            cell: ({ row }) => (
                <Stack sx={{ gap: "10px" }}>
                    <Checkbox color="primary" />
                    <Typography fontWeight={500}>{(qp.pageIndex - 1) * qp.pageSize + row.index + 1}</Typography>
                </Stack>
            ),
            size: 80,
        },
        {
            header: () => <SortableHeader field="title" label="eBook Title" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "title",
            cell: ({ row }) => (
                <Tooltip title={row.original.title} arrow>
                    <Typography fontWeight={500} variant="subtitle1" className="line-clamp-1">
                        {row.original.title || "N/A"}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            header: () => <SortableHeader field="is_downloadable" label="Downloadable" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "is_downloadable",
            cell: ({ row }) => (
                <Typography fontWeight={500}>{row.original.is_downloadable ? "Yes" : "No"}</Typography>
            ),
        },
        {
            header: () => <SortableHeader field="price" label="Price" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "price",
            cell: ({ row }) => {
                const pricing = getEbookPricing(row.original);
                return <Typography fontWeight={500}>{pricing.isFree ? "Free" : formatNpr(pricing.salePrice)}</Typography>;
            },
        },
        {
            header: () => <SortableHeader field="purchased_count" label="Purchased" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "purchased_count",
            cell: ({ row }) => <Typography>{row.original.purchased_count ?? 0}</Typography>,
        },
        {
            header: () => <SortableHeader field="assigned_count" label="Assigned" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "assigned_count",
            cell: ({ row }) => <Typography>{row.original.assigned_count ?? 0}</Typography>,
        },
        {
            header: () => <SortableHeader field="created_at" label="Created Date" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
            accessorKey: "created_at",
            cell: ({ row }) => (
                <Typography fontWeight={500}>{formatDate(row.original?.created_at || "")}</Typography>
            ),
        },
        {
            header: "Actions",
            accessorKey: "actions",
            cell: ({ row }) => (
                <ActionIconVisible
                    onView={() => navigate(PATH.EBOOK.ASSIGNED_USERS.ROOT(Number(row.original.id)))}
                />
            ),
        },
    ], [navigate, qp, sort]);

    const isLoading = activeTab === "course" ? loadingCourses
        : activeTab === "test" ? loadingTests
            : activeTab === "bundle" ? loadingBundles : loadingEbooks;
    const courses = courseData?.data?.data || [];
    const tests = testData?.data?.data || [];
    const bundles = bundleData?.data?.data || [];
    const ebooks = ebookData?.data?.data || [];
    const activeData = activeTab === "course" ? courses
        : activeTab === "test" ? tests
            : activeTab === "bundle" ? bundles : ebooks;
    const totalPages =
        activeTab === "course" ? courseData?.data?.pagination?.total_pages || 0
            : activeTab === "test" ? testData?.data?.pagination?.total_pages || 0
                : activeTab === "bundle" ? bundleData?.data?.pagination?.total_pages || 0
                    : ebookData?.data?.pagination?.total_pages || 0;

    const emptyLabel = activeTab === "course" ? "course"
        : activeTab === "test" ? "test"
            : activeTab === "bundle" ? "bundle" : "eBook";

    return (
        <div className="all__enrollment__root">
            <div className="page__top">
                <TabController
                    currentActive={activeTab}
                    setActiveTab={handleTabChange}
                    options={[
                        { label: t("messages.course") || "Course", value: "course" },
                        { label: t("messages.test") || "Test", value: "test" },
                        { label: t("messages.bundle") || "Bundle", value: "bundle" },
                        { label: t("messages.ebook") || "eBook", value: "ebook" },
                    ]}
                />
                <TableFilter
                    search={search}
                    setSearch={setSearch}
                    onFilter={activeTab === "course" || activeTab === "ebook" ? () => setFilterDialogOpen(true) : undefined}
                />
                <ActiveFilterBar pills={appliedPills} onClearAll={resetFilters} />
            </div>
            {!isLoading && !activeData.length ? (
                <EmptyRoute
                    title={`No ${emptyLabel.charAt(0).toUpperCase() + emptyLabel.slice(1)} Found`}
                    message={`We couldn't find any ${emptyLabel}s matching "${search}".`}
                />
            ) : (
                <>
                    <Box className="table__wrapper h-full" sx={{ overflow: "auto" }}>
                        {activeTab === "course" && (
                            <UdaanTable data={courses} columns={courseColumns} loading={loadingCourses} />
                        )}
                        {activeTab === "test" && (
                            <UdaanTable data={tests} columns={testColumns} loading={loadingTests} />
                        )}
                        {activeTab === "bundle" && (
                            <UdaanTable data={bundles} columns={bundleColumns} loading={loadingBundles} />
                        )}
                        {activeTab === "ebook" && (
                            <UdaanTable data={ebooks} columns={ebookColumns} loading={loadingEbooks} />
                        )}
                    </Box>
                    <TablePagination qp={qp} setQp={setQp} totalPages={totalPages} />
                </>
            )}
            <CourseFilter
                open={filterDialogOpen}
                onClose={() => setFilterDialogOpen(false)}
                megaCategories={megaCategories}
                categories={categories}
                subCategories={subCategories}
                positions={positions}
                teachers={teachers}
                selections={selections}
                onChange={handleCategoryChange}
                loadingMegaCategory={loadingMegaCategory}
                searchTeacher={searchTeacher}
                setSearchTeacher={setSearchTeacher}
                onApplyFilter={handleApplyFilter}
                onResetFilter={resetFilters}
                courseTypes={courseTypes || []}
            />
        </div>
    );
}
