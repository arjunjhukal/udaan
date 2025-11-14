import { Box, Checkbox, Typography } from '@mui/material';
import React from 'react';

export type CourseTypeProps = "free" | "subscription" | "expiry";

export default function CourseType() {
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
            <Typography variant="h4" className="mb-1!">
                Course Type
            </Typography>

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4 space-y-4">
                    {types.map((item) => (
                        <div
                            key={item.key}
                            className="tab__item flex items-start gap-2 cursor-pointer"
                            onClick={() => setCurrentType(item.key)}
                        >
                            <Checkbox
                                color="primary"
                                checked={currentType === item.key}
                                onChange={() => setCurrentType(item.key)}
                            />

                            <div className="tab__label__content">
                                <Typography variant="h6">{item.title}</Typography>
                                <Typography variant="caption" color="text.middle">
                                    {item.description}
                                </Typography>
                            </div>
                        </div>
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
    return (
        <Box
            sx={{
                padding: 3,
                borderRadius: 2,
                background: "#F3F4F6",
                border: "1px solid #E5E7EB",
            }}
        >
            <Typography variant="h5" fontWeight="bold">
                {currentType === "free" && "Free Course Settings"}
                {currentType === "subscription" && "Subscription Course Settings"}
                {currentType === "expiry" && "Expiry Course Settings"}
            </Typography>

            <Typography variant="body2" color="text.secondary" mt={1}>
                Showing settings for <strong>{currentType}</strong>
            </Typography>
        </Box>
    );
}
