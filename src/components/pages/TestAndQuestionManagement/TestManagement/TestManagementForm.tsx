import { Box, Dialog, DialogContent, FormHelperText, InputLabel, OutlinedInput, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import MakuraDatePicker from "../../../atoms/MakuraDatePicker";
import TextEditor from "../../../atoms/TextEditor";
import FooterAction from "../../../molecules/FooterAction";

export interface Props {
    open: boolean;
    setOpen: (newValue: boolean) => void;
    editData?: TestProps | null;
}

export interface TestProps {
    id: number | null;
    name: string;
    duration: {
        hours: number;
        minutes: number;
    };
    description: string;
    full_marks: number;
    pass_marks: number;
    start_date_time: string;
    end_date_time: string;
}

export const TestInitialState: TestProps = {
    id: null,
    name: "",
    duration: {
        hours: 0,
        minutes: 0
    },
    description: "",
    full_marks: 100,
    pass_marks: 40,
    start_date_time: "",
    end_date_time: ""
};

const testValidationSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required("Name is required"),
    duration: Yup.object().shape({
        hours: Yup.number()
            .min(0, "Hours must be at least 0")
            .max(999, "Hours cannot exceed 999")
            .required("Hours is required"),
        minutes: Yup.number()
            .min(0, "Minutes must be at least 0")
            .max(59, "Minutes cannot exceed 59")
            .required("Minutes is required")
    }).test(
        "duration-required",
        "Duration must be at least 1 minute",
        function (value) {
            return (value.hours ?? 0) > 0 || (value.minutes ?? 0) > 0;
        }
    ),
    description: Yup.string()
        .trim()
        .required("Description is required"),
    full_marks: Yup.number()
        .min(1, "Full marks must be at least 1")
        .required("Full marks is required"),
    pass_marks: Yup.number()
        .min(0, "Pass marks must be at least 0")
        .required("Pass marks is required")
        .test(
            "pass-marks-validation",
            "Pass marks cannot exceed full marks",
            function (value) {
                return value <= this.parent.full_marks;
            }
        ),
    start_date_time: Yup.string()
        .required("Start date & time is required"),
    end_date_time: Yup.string()
        .required("End date & time is required")
        .test(
            "end-after-start",
            "End date must be after start date",
            function (value) {
                const { start_date_time } = this.parent;
                if (!start_date_time || !value) return true;
                return dayjs(value).isAfter(dayjs(start_date_time));
            }
        )
});

export default function TestManagementForm({ open, setOpen, editData }: Props) {
    const isEditMode = Boolean(editData?.id);

    const formik = useFormik<TestProps>({
        initialValues: editData || TestInitialState,
        validationSchema: testValidationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                console.log("Form values:", values);
                // Add your API call here
                alert(JSON.stringify(values, null, 2));
            } catch (e: any) {
                console.error("Error:", e);
            }
        }
    });

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            sx={{
                "& .MuiPaper-root": {
                    minWidth: {
                        md: "664px",
                        xl: "900px"
                    }
                }
            }}
        >
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col gap-6 md:grid md:grid-cols-2">
                        <div className="col-span-2">
                            <div className="input__field">
                                <InputLabel className="required">Name</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter Test Name"
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <FormHelperText error>{formik.errors.name}</FormHelperText>
                                )}
                            </div>
                        </div>

                        <div className="col-span-2">
                            <div className="input__field">
                                <InputLabel className="required">Duration</InputLabel>
                                <div className="flex items-center gap-5">
                                    <div className="hours__wrapper flex items-center gap-2 flex-1">
                                        <OutlinedInput
                                            fullWidth
                                            placeholder="0"
                                            type="number"
                                            name="duration.hours"
                                            value={formik.values.duration.hours}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.duration?.hours &&
                                                Boolean(formik.errors.duration?.hours)
                                            }
                                            inputProps={{ min: 0, max: 999 }}
                                        />
                                        <Typography variant="body2" color="text.secondary">Hrs</Typography>
                                    </div>
                                    <Box color="text.secondary">:</Box>
                                    <div className="minutes__wrapper flex items-center gap-2 flex-1">
                                        <OutlinedInput
                                            fullWidth
                                            placeholder="0"
                                            type="number"
                                            name="duration.minutes"
                                            value={formik.values.duration.minutes}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.duration?.minutes &&
                                                Boolean(formik.errors.duration?.minutes)
                                            }
                                            inputProps={{ min: 0, max: 59 }}
                                        />
                                        <Typography variant="body2" color="text.secondary">Mins</Typography>
                                    </div>
                                </div>
                                {formik.touched.duration && formik.errors.duration && (
                                    <FormHelperText error sx={{ mt: 1 }}>
                                        {typeof formik.errors.duration === 'string'
                                            ? formik.errors.duration
                                            : formik.errors.duration.hours || formik.errors.duration.minutes}
                                    </FormHelperText>
                                )}
                            </div>
                        </div>

                        <div className="col-span-2">
                            <div className="input__field">
                                <TextEditor
                                    label="Description"
                                    value={formik.values.description}
                                    onChange={(value) => formik.setFieldValue("description", value)}
                                    onBlur={(value) => formik.setFieldTouched("description", true)}
                                    error={
                                        formik.touched.description && formik.errors.description
                                            ? formik.errors.description
                                            : undefined
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-span-1">
                            <div className="input__field">
                                <InputLabel className="required">Full Marks</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    name="full_marks"
                                    value={formik.values.full_marks}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter Full Marks"
                                    type="number"
                                    error={formik.touched.full_marks && Boolean(formik.errors.full_marks)}
                                    inputProps={{ min: 0 }}
                                />
                                {formik.touched.full_marks && formik.errors.full_marks && (
                                    <FormHelperText error>{formik.errors.full_marks}</FormHelperText>
                                )}
                            </div>
                        </div>

                        <div className="col-span-1">
                            <div className="input__field">
                                <InputLabel className="required">Pass Marks</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    name="pass_marks"
                                    value={formik.values.pass_marks}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter Pass Marks"
                                    type="number"
                                    error={formik.touched.pass_marks && Boolean(formik.errors.pass_marks)}
                                    inputProps={{ min: 0 }}
                                />
                                {formik.touched.pass_marks && formik.errors.pass_marks && (
                                    <FormHelperText error>{formik.errors.pass_marks}</FormHelperText>
                                )}
                            </div>
                        </div>

                        <div className="col-span-1">
                            <div className="input__field">
                                <InputLabel className="required">Start Date & Time</InputLabel>
                                <MakuraDatePicker
                                    value={formik.values.start_date_time ? dayjs(formik.values.start_date_time) : null}
                                    onChange={(date: Dayjs | null) =>
                                        formik.setFieldValue("start_date_time", date ? date.toISOString() : "")
                                    }
                                    includeTime={true}
                                />
                                {formik.touched.start_date_time && formik.errors.start_date_time && (
                                    <FormHelperText error>{formik.errors.start_date_time}</FormHelperText>
                                )}
                            </div>
                        </div>

                        <div className="col-span-1">
                            <div className="input__field">
                                <InputLabel className="required">End Date & Time</InputLabel>
                                <MakuraDatePicker
                                    value={formik.values.end_date_time ? dayjs(formik.values.end_date_time) : null}
                                    onChange={(date: Dayjs | null) =>
                                        formik.setFieldValue("end_date_time", date ? date.toISOString() : "")
                                    }
                                    includeTime={true}
                                    minDate={formik.values.start_date_time ? dayjs(formik.values.start_date_time) : dayjs()}
                                />
                                {formik.touched.end_date_time && formik.errors.end_date_time && (
                                    <FormHelperText error>{formik.errors.end_date_time}</FormHelperText>
                                )}
                            </div>
                        </div>
                    </div>

                    <FooterAction
                        handleComfirmationChange={() => setOpen(false)}
                        isLoading={false}
                        isUpdating={false}
                        isEditMode={isEditMode}
                        buttonLabel="Test"
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}