import { Box, Skeleton } from '@mui/material';
import { useState } from 'react';
import { useGetCourseTestQuery } from '../../../../../../../services/courseApi';
import TestCard from '../../../../../../organism/Cards/TestCard';
import EmptyRoute from '../../../../../../organism/EmptyRoute';
import PageHeader from '../../../../../../organism/PageHeader';
import TableFilter from '../../../../../../organism/TableFilter';
import AssignTestDialog from './AssignTestDialog';

export default function CourseTest({ id }: { id?: string }) {
    const [search, setSearch] = useState("")
    const [open, setOpen] = useState(false);
    const [qp, _setQp] = useState({
        pageIndex: 1,
        pageSize: 8
    })
    const { data, isLoading } = useGetCourseTestQuery({ pageIndex: qp.pageIndex, pageSize: qp.pageSize, search, id: Number(id) }, { skip: !id });

    const tests = data?.data?.data || [];

    return (
        <>
            <PageHeader
                breadcrumb={[
                    {
                        title: "Test",
                    }
                ]}
                description="Add a test for this course so that you can manage the test you wanted deeply. "
                cta={{
                    label: "Add Test",
                    url: ""
                }}
                handleOpenPopup={() => {
                    setOpen(prev => !prev)
                }}
            />
            <TableFilter
                handleRoleDelete={() => { }}
                search={search}
                setSearch={setSearch}
                selectedRows={new Set<number | string>([])}
            />
            {!isLoading && !tests.length && <EmptyRoute
                title="No Test found"
                message='Oops your test is empty. Please add test to help student gain knowledge.'
            />}

            <div className="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3 2xl:gap-6">
                {isLoading ? (
                    [...Array(6)].map((_, idx) => (
                        <div key={idx} className="col-span-1">
                            <div className="flex gap-3 items-center">
                                <Box className="w-full">
                                    <Skeleton variant="rectangular" height={120} className="rounded-xl" />
                                </Box>
                            </div>
                        </div>
                    ))
                ) :
                    (tests.map((test) => (
                        <TestCard test={test} key={test.id} />
                    )))}
            </div>

            <AssignTestDialog open={open} setOpen={setOpen} selectedTestIds={tests.map((item) => Number(item.id))} />
        </>
    )
}
