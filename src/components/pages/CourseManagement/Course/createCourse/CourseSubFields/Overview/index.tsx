"use client";

import {
    Autocomplete,
    Box,
    FormHelperText,
    IconButton,
    InputLabel,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import type { FormikProps } from "formik";
import type { CourseProps } from "../../../../../../../types/course";
import type { RegisterUserProps } from "../../../../../../../types/user";
import TextEditor from "../../../../../../atoms/TextEditor";

interface Props {
    teachers: RegisterUserProps[];
    handleTeacherSelection?: (teacher: RegisterUserProps) => void;
    handleTeacherRemoval: (teacherId: string) => void;
    selectedTeachers: RegisterUserProps[];
    search: string;
    setSearch: (newvalue: string) => void;
    formik: FormikProps<CourseProps>;
}

export default function CourseOverviewForm({
    teachers,
    handleTeacherSelection,
    handleTeacherRemoval,
    search,
    setSearch,
    selectedTeachers,
    formik
}: Props) {
    const theme = useTheme();



    return (
        <div className="overview__form">
            <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 lg:col-span-1">
                    <TextEditor
                        value={formik.values.about_this_course}
                        onChange={(value) => formik.setFieldValue("about_this_course", value)}
                        onBlur={() => formik.setFieldTouched("about_this_course")}
                    />
                    {formik.touched.about_this_course && formik.errors.about_this_course && (
                        <FormHelperText error>{formik.errors.about_this_course}</FormHelperText>
                    )}
                </div>

                <div className="col-span-2 lg:col-span-1 flex flex-col">
                    <InputLabel className="required">Instructor</InputLabel>

                    <Box
                        sx={{
                            border: `1px solid ${theme.palette.textField.border}`,
                            borderRadius: "8px",
                            padding: "16px",
                        }}
                        className="h-full"
                    >
                        <Autocomplete
                            options={teachers}
                            getOptionLabel={(option) => option.name}
                            value={null}
                            inputValue={search}
                            onInputChange={(_, value) => setSearch(value)}
                            onChange={(_, newValue) => {
                                if (newValue && handleTeacherSelection) {
                                    // Check if teacher is not already selected
                                    const isAlreadySelected = selectedTeachers.some(
                                        t => t.id === newValue.id
                                    );
                                    if (!isAlreadySelected) {
                                        handleTeacherSelection(newValue);
                                    }
                                    // Clear search after selection
                                    setSearch("");
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params} placeholder="Select Instructor"
                                    error={formik.touched.teachers && Boolean(formik.errors.teachers)}
                                />
                            )}
                            // Filter out already selected teachers from options
                            filterOptions={(options) =>
                                options.filter(option =>
                                    !selectedTeachers.some(selected => selected.id === option.id)
                                )
                            }
                        />
                        {formik.touched.teachers && formik.errors.teachers && (
                            <FormHelperText error sx={{ mt: 1 }}>
                                {formik.errors.teachers as string}
                            </FormHelperText>
                        )}

                        {/* SELECTED CAPSULES */}
                        <div className="selected__teachers flex flex-wrap mt-4 gap-3">
                            {selectedTeachers.map((teacher) => (
                                <Box
                                    key={teacher.id}
                                    className="capsule flex gap-4 py-2 px-3 rounded-md items-center"
                                    sx={{
                                        background: theme.palette.separator.dark,
                                    }}
                                >
                                    <div className="teacher__info flex items-center gap-2">
                                        <img
                                            src={teacher.profile_url || "/auth-image.png"}
                                            alt=""
                                            width={22}
                                            height={22}
                                            className="rounded-full w-6 h-6 object-cover"
                                        />
                                        <Typography variant="subtitle1">
                                            {teacher.name}
                                        </Typography>
                                    </div>

                                    <IconButton
                                        size="small"
                                        onClick={() => handleTeacherRemoval(teacher.id || "")}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M3.33 3.33L12.66 12.66" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M3.33 12.66L12.66 3.33" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </IconButton>
                                </Box>
                            ))}
                        </div>
                    </Box>
                </div>
            </div>
        </div>
    );
}