import { Box, Checkbox, Stack, Tooltip, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import { useGetAllCourseQuery } from "../../../../services/courseApi";
import { useCourseFilter } from "../../../../store/useCourseFilter";
import type { CourseProps } from "../../../../types/course";
import { formatDate } from "../../../../utils/dateFormat";
import ActionIconVisible from "../../../molecules/Action/ActionIconVisible";
import UdaanTable from "../../../molecules/Table";
import TablePagination from "../../../molecules/Table/Pagination";
import EmptyRoute from "../../../organism/EmptyRoute";
import { CourseFilter } from "../../../organism/Filter/CourseFilter";
import PageHeader from "../../../organism/PageHeader";
import TableFilter from "../../../organism/TableFilter";

export default function AllEntrollments() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [search, setSearch] = useState<string>("");
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 8,
    })

    const {
        selections,
        megaCategories,
        categories,
        subCategories,
        positions,
        teachers,
        loadingMegaCategory,
        searchTeacher,
        setSearchTeacher,
        handleCategoryChange,
        handleApplyFilter,
        resetFilters,
        getCategoryFilterParams,
        filterDialogOpen,
        setFilterDialogOpen
    } = useCourseFilter();

    const categoryFilter = getCategoryFilterParams();

    const courseTypes = [
        { value: "free", label: "Free" },
        { value: "subscription", label: "Subscription" },
        { value: "expiry", label: "Expiry" }
    ];

    const { data, isLoading } = useGetAllCourseQuery({
        ...qp,
        search,
        categoryFilter: { ...categoryFilter },
        status: "published"
    });

    useEffect(() => {
        resetFilters();
    }, [])

    const courses = data?.data?.data || [];

    const columns = useMemo<ColumnDef<CourseProps>[]>(() => [
        {
            header: () => (
                <Stack sx={{ gap: "10px" }}>
                    <Checkbox
                        color="primary"
                    />
                    <Typography fontWeight={500}>S.No.</Typography>
                </Stack>
            ),
            accessorKey: "sno",
            cell: ({ row }) => (
                <Stack sx={{ gap: "10px" }}>
                    <Checkbox
                        color="primary"
                    />
                    <Typography fontWeight={500}>  {(qp.pageIndex - 1) * qp.pageSize + row.index + 1}</Typography>
                </Stack>
            ),
            size: 80,
        },
        {
            header: "Course Name",
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
            header: "Course Type",
            accessorKey: "course_type",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="capitalize">
                    {row.original.course_type || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Price",
            accessorKey: "price",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="capitalize">
                    {row.original.marked_price || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Subjects",
            accessorKey: "subjects",
            cell: ({ row }) => (
                <Typography fontWeight={500} className="capitalize">
                    {row.original.subjects || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Enrolled Student",
            accessorKey: "enrolled_students",
            cell: ({ row }) => (
                <Typography >
                    {row.original.enrolled_students || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Created Date",
            accessorKey: "created_at",
            cell: ({ row }) => {
                return (
                    <Typography fontWeight={500} className="capitalize">
                        {formatDate(row.original?.created_at || "")}
                    </Typography>
                )
            },
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
    ], [navigate, qp])

    return (
        <div className="all__enrollment__root flex flex-col overflow-hidden h-full">
            <div className="page__top">
                <PageHeader
                    breadcrumb={[
                        {
                            title: t("menus.course_management.courses.root"),
                            icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 4.84969V16.7397C22 17.7097 21.21 18.5997 20.24 18.7197L19.93 18.7597C18.29 18.9797 15.98 19.6597 14.12 20.4397C13.47 20.7097 12.75 20.2197 12.75 19.5097V5.59969C12.75 5.22969 12.96 4.88969 13.29 4.70969C15.12 3.71969 17.89 2.83969 19.77 2.67969H19.83C21.03 2.67969 22 3.64969 22 4.84969Z" fill="#1D82F5" />
                                <path d="M10.7102 4.70969C8.88023 3.71969 6.11023 2.83969 4.23023 2.67969H4.16023C2.96023 2.67969 1.99023 3.64969 1.99023 4.84969V16.7397C1.99023 17.7097 2.78023 18.5997 3.75023 18.7197L4.06023 18.7597C5.70023 18.9797 8.01023 19.6597 9.87023 20.4397C10.5202 20.7097 11.2402 20.2197 11.2402 19.5097V5.59969C11.2402 5.21969 11.0402 4.88969 10.7102 4.70969ZM5.00023 7.73969H7.25023C7.66023 7.73969 8.00023 8.07969 8.00023 8.48969C8.00023 8.90969 7.66023 9.23969 7.25023 9.23969H5.00023C4.59023 9.23969 4.25023 8.90969 4.25023 8.48969C4.25023 8.07969 4.59023 7.73969 5.00023 7.73969ZM8.00023 12.2397H5.00023C4.59023 12.2397 4.25023 11.9097 4.25023 11.4897C4.25023 11.0797 4.59023 10.7397 5.00023 10.7397H8.00023C8.41023 10.7397 8.75023 11.0797 8.75023 11.4897C8.75023 11.9097 8.41023 12.2397 8.00023 12.2397Z" fill="#1D82F5" />
                            </svg>),
                        }
                    ]}
                />
                <TableFilter
                    search={search}
                    setSearch={setSearch}
                    onFilter={() => setFilterDialogOpen(true)}
                />

            </div>
            {
                !isLoading && !courses.length ? <EmptyRoute
                    title="No Course Found"
                    message={`We couldn't find any courses matching "${search}".`}
                /> : (
                    <>
                        <Box className="table__wrapper h-full" sx={{
                            overflow: "auto"
                        }}>
                            <UdaanTable
                                data={courses}
                                columns={columns}
                                loading={isLoading}
                            />
                        </Box>
                        <TablePagination
                            qp={qp}
                            setQp={setQp}
                            totalPages={data?.data?.pagination?.total_pages || 0}
                        />
                    </>
                )
            }
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
    )
}
