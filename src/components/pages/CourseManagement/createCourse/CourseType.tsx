import { Box, Checkbox, Typography, useTheme } from '@mui/material';
import type { FormikProps } from 'formik';
import React, { Activity } from 'react';
import type { CourseProps, CourseTypeProps } from '../../../../types/course';
import SubscriptionFormDialog from '../../../organism/SubscriptionFormDialog';
import ExpiryCourseType from './CourseTypes/ExpiryCourseType';
import FreeCourseType from './CourseTypes/FreeCourseType';
import SubscriptionCourseType from './CourseTypes/SubscriptionCourseType';

interface Props {
    formik: FormikProps<CourseProps>
}

export default function CourseType({ formik }: Props) {
    const theme = useTheme();

    const types = [
        {
            key: "free" as CourseTypeProps,
            title: "Free",
            description:
                "Offer open access to all learners — no payment or expiry needed. Ideal for demo lessons or free study materials.",
        },
        {
            key: "subscription" as CourseTypeProps,
            title: "Subscriptions",
            description:
                "Create paid or renewable courses with flexible plans. Set pricing, duration, and integrate payment options like Esewa or Khalti.",
        },
        {
            key: "expiry" as CourseTypeProps,
            title: "Expiry",
            description:
                "Set a fixed access period for your course. Define start and end dates, duration, and renewal options.",
        },
    ];

    return (
        <div className="course__type__wrapper">


            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                    <Typography variant="h4" className="mb-1!">
                        Course Type
                    </Typography>
                    {types.map((item) => (
                        <Box
                            key={item.key}
                            className={`tab__item flex items-start gap-2 cursor-pointer py-6 px-4 rounded-md ${formik.values.course_type === item.key ? 'active' : ''}`}
                            onClick={() => formik.setFieldValue("course_type", item.key)}

                            sx={{
                                background: formik.values.course_type === item.key ? theme.palette.primary.light : ""
                            }}
                        >
                            <Checkbox
                                color="primary"
                                checked={formik.values.course_type === item.key}
                                onChange={() => formik.setFieldValue("course_type", item.key)}
                            />

                            <div className="tab__label__content">
                                <Typography variant="h6">{item.title}</Typography>
                                <p style={{ color: theme.palette.text.light, }} className='text-[12px] leading-[16.8px]'>
                                    {item.description}
                                </p>
                            </div>
                        </Box>
                    ))}
                </div>

                <div className="col-span-8">
                    <ActivityBlock currentType={formik.values.course_type} formik={formik} />
                </div>
            </div>
        </div>
    );
}

function ActivityBlock({ currentType, formik }: { currentType: CourseTypeProps, formik: FormikProps<CourseProps> }) {
    const theme = useTheme();

    const [open, setOpen] = React.useState(false);
    const onSave = () => {

    }
    console.log("open value at course type", open);
    const handleClick = () => {
        setOpen(true);
    }
    return (
        <Box
            className="py-6 px-8 rounded-2xl"
            sx={{
                background: theme.palette.gray.gray1
            }}
        >
            {currentType === "free" &&
                <Activity>
                    <FreeCourseType
                        value={formik.values.free_type_description}
                        onChange={(value) => formik.setFieldValue("free_type_description", value)}
                        onBlur={(value) => formik.setFieldValue("free_type_description", value)}
                        error={formik.errors.free_type_description}
                    />
                </Activity>}
            {currentType === "subscription" && <Activity>
                <>
                    <SubscriptionCourseType
                        formik={formik}
                        handleClick={handleClick}
                    />
                    <SubscriptionFormDialog
                        open={open}
                        setOpen={setOpen}
                        onSave={onSave}
                        formik={formik}
                    />
                </>
            </Activity>}
            {currentType === "expiry" &&
                <Activity>
                    <ExpiryCourseType formik={formik} />
                </Activity>
            }


        </Box>
    );
}
