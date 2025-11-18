import { Add, Delete } from "@mui/icons-material";
import { Autocomplete, Button, Divider, IconButton, OutlinedInput, TextField, Typography } from "@mui/material";
import type { FormikProps } from "formik";
import { useMemo } from "react";
import { useGetAllSubscriptionQuery } from "../../../../../services/subscriptionPlanApi";
import type { BillingCycle, CourseProps } from "../../../../../types/course";
import type { SubscriptionPlanProps } from "../../../../../types/subscriptionPlan";
import EmptyRoute from "../../../../organism/EmptyRoute";

interface Props {
    formik: FormikProps<CourseProps>;
    handleClick: () => void;
}

const billingCycleOptions: { value: BillingCycle; label: string }[] = [
    { value: "days", label: "Days" },
    { value: "months", label: "Months" },
    { value: "years", label: "Years" },
];

export default function SubscriptionCourseType({ handleClick, formik }: Props) {
    const { data } = useGetAllSubscriptionQuery({
        pageIndex: 1,
        pageSize: 10,
    });

    const subscriptionPlans: SubscriptionPlanProps[] = data?.data?.data || [];

    // Initialize with at least one empty row if none exist
    const ensureInitialRow = () => {
        if (!formik.values.course_subscription || formik.values.course_subscription.length === 0) {
            formik.setFieldValue("course_subscription", [{
                subscription_id: 0,
                price: "",
                billing_cycle: "months" as BillingCycle,
                number: 1,
            }]);
        }
    };

    // Call on mount if needed
    useMemo(() => {
        ensureInitialRow();
    }, []);

    const handleAddRow = () => {
        const currentRows = formik.values.course_subscription || [];
        formik.setFieldValue("course_subscription", [
            ...currentRows,
            {
                subscription_id: 0,
                price: "",
                billing_cycle: "months" as BillingCycle,
                number: 1,
            }
        ]);
    };

    const handleDeleteRow = (index: number) => {
        const currentRows = formik.values.course_subscription || [];
        if (currentRows.length > 1) {
            formik.setFieldValue(
                "course_subscription",
                currentRows.filter((_, i) => i !== index)
            );
        }
    };

    const hasData = (formik.values.course_subscription && formik.values.course_subscription.length > 0);

    return (
        <div className="course__type__record subscription__course__record">
            <div className="flex items-center justify-between pb-2">
                <Typography variant='h5'>Subscription</Typography>
                {hasData && (
                    <Button
                        startIcon={<Add />}
                        variant="contained"
                        color="primary"
                        onClick={handleClick}
                    >
                        Add Subscription
                    </Button>
                )}
            </div>
            <Divider className='mb-8!' />

            {hasData ? (
                <div className="subscription__form__wrapper">
                    <div className="bg-white rounded-2xl">
                        {/* Header Row */}
                        <div className="grid grid-cols-5 ">
                            <div className="col-span-1 p-5">
                                <Typography variant="subtitle2" color="text.middle">
                                    Subscription Name
                                </Typography>
                            </div>
                            <div className="col-span-1 p-5">
                                <Typography variant="subtitle2" color="text.middle">
                                    Price
                                </Typography>
                            </div>
                            <div className="col-span-1 p-5">
                                <Typography variant="subtitle2" color="text.middle">
                                    Billing Cycle
                                </Typography>
                            </div>
                            <div className="col-span-1 p-5">
                                <Typography variant="subtitle2" color="text.middle">
                                    Duration Number
                                </Typography>
                            </div>
                            <div className="col-span-1 p-5">
                                <Typography variant="subtitle2" color="text.middle">
                                    Actions
                                </Typography>
                            </div>
                        </div>

                        <Divider />

                        {/* Data Rows */}
                        {formik.values.course_subscription?.map((item, index) => (
                            <div key={index}>
                                <div className="grid grid-cols-5  items-center">
                                    {/* Subscription Plan */}
                                    <div className="col-span-1 p-5">
                                        <Autocomplete
                                            options={subscriptionPlans.filter(plan => {
                                                const selectedIds = formik.values.course_subscription
                                                    ?.filter((_, i) => i !== index)
                                                    .map(sub => sub.subscription_id) || [];
                                                return !selectedIds.includes(Number(plan.id));
                                            })}
                                            getOptionLabel={(option) => option.name || ""}
                                            value={subscriptionPlans.find(plan => Number(plan.id) === item.subscription_id) || null}
                                            onChange={(_, newValue) => {
                                                formik.setFieldValue(
                                                    `course_subscription[${index}].subscription_id`,
                                                    newValue ? Number(newValue.id) : 0
                                                );
                                            }}
                                            isOptionEqualToValue={(option, value) => Number(option.id) === Number(value.id)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select subscription"
                                                    size="small"
                                                />
                                            )}
                                            fullWidth
                                        />
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-1 p-5">
                                        <OutlinedInput
                                            sx={{
                                                padding: "8px 14px"
                                            }}
                                            value={item.price}
                                            onChange={(e) => {
                                                formik.setFieldValue(
                                                    `course_subscription[${index}].price`,
                                                    e.target.value
                                                );
                                            }}
                                            placeholder="Enter price"
                                            size="small"
                                            fullWidth
                                        />
                                    </div>

                                    {/* Billing Cycle */}
                                    <div className="col-span-1 p-5">
                                        <Autocomplete
                                            options={billingCycleOptions}
                                            getOptionLabel={(option) => option.label}
                                            value={billingCycleOptions.find(opt => opt.value === item.billing_cycle) || billingCycleOptions[1]}
                                            onChange={(_, newValue) => {
                                                formik.setFieldValue(
                                                    `course_subscription[${index}].billing_cycle`,
                                                    newValue?.value || "months"
                                                );
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select billing cycle"
                                                    size="small"
                                                />
                                            )}
                                            fullWidth
                                        />
                                    </div>

                                    {/* Duration Number */}
                                    <div className="col-span-1 p-5">
                                        <OutlinedInput
                                            sx={{
                                                padding: "8px 14px"
                                            }}
                                            type="number"
                                            value={item.number}
                                            onChange={(e) => {
                                                formik.setFieldValue(
                                                    `course_subscription[${index}].number`,
                                                    Number(e.target.value)
                                                );
                                            }}
                                            placeholder="Enter number"
                                            size="small"
                                            fullWidth
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1 p-5">
                                        <IconButton
                                            onClick={() => handleDeleteRow(index)}
                                            color="error"
                                            disabled={(formik.values.course_subscription?.length ?? 0) <= 1}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </div>
                                </div>
                                {index < (formik.values.course_subscription?.length ?? 0) - 1 && <Divider />}
                            </div>
                        ))}
                    </div>

                    {/* Add More Button */}
                    <div className="mt-4">
                        <Button
                            startIcon={<Add />}
                            variant="text"
                            color="primary"
                            onClick={handleAddRow}
                        >
                            Add More
                        </Button>
                    </div>
                </div>
            ) : (
                <EmptyRoute
                    title="No Subscription found"
                    message="Oops this course subscription is empty. Please add subscription to help student gain knowledge."
                    cta={{
                        label: "Add Subscription",
                        url: ""
                    }}
                    handleClick={handleClick}
                />
            )}
        </div>
    );
}