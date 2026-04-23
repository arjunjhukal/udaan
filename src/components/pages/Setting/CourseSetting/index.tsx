import { Button, Divider, FormControlLabel, InputLabel, OutlinedInput, Radio, RadioGroup, Switch, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useGetCourseSettingsQuery, useUpdateCourseSettingsMutation } from "../../../../services/settingApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import type { CourseSettingProps } from "../../../../types/setting";

export default function CourseSettingRoot() {
    const dispatch = useAppDispatch();
    const { data } = useGetCourseSettingsQuery();
    const [updateCourse, { isLoading }] = useUpdateCourseSettingsMutation();

    const formik = useFormik<CourseSettingProps>({
        initialValues: {
            free_trial_days: data?.data?.free_trial_days ?? 7,
            free_trial_items: data?.data?.free_trial_items ?? 3,
            global_discount_enabled: data?.data?.global_discount_enabled ?? false,
            global_discount_value: data?.data?.global_discount_value ?? 0,
            global_discount_applicable_to: data?.data?.global_discount_applicable_to ?? "both",
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const res = await updateCourse(values).unwrap();
                dispatch(showToast({ message: res?.message || "Course settings updated", severity: "success" }));
            } catch (e: any) {
                dispatch(showToast({ message: e?.data?.message || "Unable to update course settings", severity: "error" }));
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="app__settings__page__root pb-4 lg:pb-6">
            <Typography variant="h5">Course Setting</Typography>
            <Divider className="mt-4! mb-6!" />

            <Typography variant="subtitle1" fontWeight={600} className="mb-4!">Free Trial</Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <InputLabel>Free Trial Duration (Days)</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="free_trial_days"
                        type="number"
                        inputProps={{ min: 0 }}
                        value={formik.values.free_trial_days}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. 7"
                    />
                </div>

                <div>
                    <InputLabel>Free Trial Items (Number of Lessons)</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="free_trial_items"
                        type="number"
                        inputProps={{ min: 0 }}
                        value={formik.values.free_trial_items}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. 3"
                    />
                </div>
            </div>

            <Divider className="mt-2! mb-6!" />

            <Typography variant="subtitle1" fontWeight={600} className="mb-4!">Global Discount</Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <FormControlLabel
                        control={
                            <Switch
                                name="global_discount_enabled"
                                checked={formik.values.global_discount_enabled}
                                onChange={formik.handleChange}
                            />
                        }
                        label="Enable Global Discount (Overrides Existing Course Discounts)"
                    />
                </div>

                {formik.values.global_discount_enabled && (
                    <div>
                        <InputLabel>Discount Percentage (%)</InputLabel>
                        <OutlinedInput
                            fullWidth
                            name="global_discount_value"
                            type="number"
                            inputProps={{ min: 0, max: 100 }}
                            value={formik.values.global_discount_value}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="e.g. 10"
                        />
                    </div>
                )}

                {formik.values.global_discount_enabled && (
                    <div className="md:col-span-2">
                        <InputLabel className="mb-2!">Apply Discount To</InputLabel>
                        <RadioGroup
                            row
                            name="global_discount_applicable_to"
                            value={formik.values.global_discount_applicable_to}
                            onChange={formik.handleChange}
                        >
                            <FormControlLabel className="items-center! gap-0!" value="expiry" control={<Radio />} label="Expiry Purchase" />
                            <FormControlLabel className="items-center! gap-0!" value="subscription" control={<Radio />} label="Subscription" />
                            <FormControlLabel className="items-center! gap-0!" value="both" control={<Radio />} label="Both" />
                        </RadioGroup>
                    </div>
                )}
            </div>

            <Divider className="mt-6! mb-6!" />
            <div className="text-right">
                <Button type="submit" variant="contained" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Course Settings"}
                </Button>
            </div>
        </form>
    );
}
