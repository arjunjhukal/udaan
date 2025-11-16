import { Box, Checkbox, Typography, useTheme } from '@mui/material';
import React, { Activity } from 'react';
import ExpiryCourseType from './CourseTypes/ExpiryCourseType';
import FreeCourseType from './CourseTypes/FreeCourseType';
import SubscriptionCourseType from './CourseTypes/SubscriptionCourseType';

export type CourseTypeProps = "free" | "subscription" | "expiry";

export default function CourseType() {
    const theme = useTheme();
    const [currentType, setCurrentType] = React.useState<CourseTypeProps>("free");

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
                            className={`tab__item flex items-start gap-2 cursor-pointer py-6 px-4 rounded-md ${currentType === item.key ? 'active' : ''}`}
                            onClick={() => setCurrentType(item.key)}

                            sx={{
                                background: currentType === item.key ? theme.palette.primary.light : ""
                            }}
                        >
                            <Checkbox
                                color="primary"
                                checked={currentType === item.key}
                                onChange={() => setCurrentType(item.key)}
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
                    <ActivityBlock currentType={currentType} />
                </div>
            </div>
        </div>
    );
}

function ActivityBlock({ currentType }: { currentType: CourseTypeProps }) {
    const theme = useTheme();
    return (
        <Box
            className="py-6 px-8 rounded-2xl"
            sx={{
                background: theme.palette.gray.gray1
            }}
        >
            {currentType === "free" &&
                <Activity>
                    <FreeCourseType />
                </Activity>}
            {currentType === "subscription" && <Activity>
                <SubscriptionCourseType />
            </Activity>}
            {currentType === "expiry" && <Activity>
                <ExpiryCourseType />
            </Activity>}


        </Box>
    );
}
