import EmptyRoute from '../../../../../../organism/EmptyRoute'
import PageHeader from '../../../../../../organism/PageHeader'

export default function CourseTest({ id }: { id?: string }) {
    return (
        <>
            <PageHeader
                breadcrumb={[
                    {
                        title: "Test",
                    }
                ]}
                description="Add a test for this course so that you can manage the test you wanted deeply. "
            />
            <EmptyRoute
                title="No Test found"
                message='Oops your test is empty. Please add test to help student gain knowledge.'
            />
        </>
    )
}
