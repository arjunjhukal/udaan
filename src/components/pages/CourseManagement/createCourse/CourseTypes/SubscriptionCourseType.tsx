import { Add } from "@mui/icons-material";
import { Button, Divider, Typography } from "@mui/material";
import type { FormikProps } from "formik";
import type { CourseProps } from "../../../../../types/course";
import SubscriptionCard from "../../../../organism/Cards/SubscriptionCard";
import EmptyRoute from "../../../../organism/EmptyRoute";
interface Props {
    formik: FormikProps<CourseProps>;
    handleClick: () => void;
}
export default function SubscriptionCourseType({ handleClick, formik }: Props) {
    return (
        <div className="course__type__record subscription__course__record">
            <div className="flex items-center justify-between pb-2">
                <Typography variant='h5' >Subscription</Typography>
                {formik.values.course_subscription?.length ? <Button startIcon={<Add />} variant="contained" color="primary" onClick={handleClick} >Add Subscription</Button> : ""}
            </div>
            <Divider className='mb-8!' />
            {formik.values.course_subscription?.length ?
                formik.values.course_subscription.map((item) => (
                    <SubscriptionCard key={item.name} item={item} />
                )) : <EmptyRoute
                    title="No Subscription found"
                    message="Oops this course subscription  is empty. Please add subscription to help student gain knowledge."
                    cta={{
                        label: "Add Subsciption",
                        url: ""
                    }}
                    handleClick={handleClick}
                />}
        </div>
    )
}
