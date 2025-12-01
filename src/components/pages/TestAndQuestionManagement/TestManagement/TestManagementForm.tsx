import { Box, FormHelperText, InputLabel, OutlinedInput, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { PATH } from "../../../../routes/PATH";
import { useGetAllCourseQuery } from "../../../../services/courseApi";
import { useEditOrCreateTestMutation, useGetAllQuestionQuery, useGetTestByIdQuery } from "../../../../services/questionApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import type { CourseProps } from "../../../../types/course";
import { TestInitialState, type TestProps } from "../../../../types/question";
import MakuraDatePicker from "../../../atoms/MakuraDatePicker";
import TextEditor from "../../../atoms/TextEditor";
import FooterAction from "../../../molecules/FooterAction";
import InfiniteScrolling from "../../../molecules/InfiniteScrolling";

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
    start_datetime: Yup.string()
        .required("Start date & time is required"),
    end_datetime: Yup.string()
        .required("End date & time is required")
        .test(
            "end-after-start",
            "End date must be after start date",
            function (value) {
                const { start_datetime } = this.parent;
                if (!start_datetime || !value) return true;
                return dayjs(value).isAfter(dayjs(start_datetime));
            }
        ),
    course_ids: Yup.array()
        .of(Yup.number())
        .required("Course selection is required"),
    question_ids: Yup.array()
        .of(Yup.number())
        .required("Question selection is required")
});

export default function TestManagementForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [courseQp, setCourseQp] = useState({
        pageIndex: 1,
        pageSize: 10,
        search: ""
    });

    const [questionQp, setQuestionQp] = useState({
        pageIndex: 1,
        pageSize: 10,
        search: ""
    });


    const { data: courses, isLoading: loadingCourses } = useGetAllCourseQuery({ ...courseQp });
    const { data: questions, isLoading: loadingQuestions } = useGetAllQuestionQuery({ ...questionQp });
    const { data: editData } = useGetTestByIdQuery({ id: Number(id) }, { skip: !!id });
    const [createTest, { isLoading: creatingTest }] = useEditOrCreateTestMutation();
    const [courseList, setCourseList] = useState<CourseProps[]>([]);

    useEffect(() => {
        if (!courses?.data?.data) return;

        setCourseList(prev =>
            courseQp.pageIndex === 1
                ? courses.data.data
                : [...prev, ...courses.data.data]
        );
    }, [courses]);


    const getInitialValues = (): TestProps => {
        if (id && editData?.data) {
            const test = editData.data;
            return {
                id: test.id,
                name: test.name || "",
                duration: test.duration || { hours: 0, minutes: 0 },
                description: test.description || "",
                full_marks: test.full_marks || 100,
                pass_marks: test.pass_marks || 40,
                start_datetime: test.start_datetime || "",
                end_datetime: test.end_datetime || "",
                course_ids: test.course_ids || [],
                question_ids: test.question_ids || []
            };
        }
        return TestInitialState;
    };

    const formik = useFormik<TestProps>({
        initialValues: getInitialValues(),
        validationSchema: testValidationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            console.log(values);
            try {
                const response = await createTest({ body: values }).unwrap();
                dispatch(
                    showToast({
                        message: response?.message || "Test Created Successfully.",
                        severity: "success"
                    })
                )
                navigate(PATH.TEST_QUESTION_MANAGEMENT.TEST.ROOT)
                formik.resetForm();
            } catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Unable to Create Test",
                        severity: "error"
                    })
                )
            }
        }
    });



    const handleCourseSearch = (searchTerm: string) => {
        setCourseQp(prev => ({
            ...prev,
            search: searchTerm,
            pageIndex: 1
        }));
    };

    const handleQuestionSearch = (searchTerm: string) => {
        setQuestionQp(prev => ({
            ...prev,
            search: searchTerm,
            pageIndex: 1
        }));
    };

    const calcHasMore = (pagination?: { current_page?: number; total_pages?: number }) => {
        if (!pagination?.current_page || !pagination?.total_pages) return false;
        return pagination.current_page < pagination.total_pages;
    };
    const coursePagination = courses?.data?.pagination;
    const questionPagination = questions?.data?.pagination;

    const hasMoreCourses = calcHasMore(coursePagination);
    const hasMoreQuestions = calcHasMore(questionPagination);

    const fetchMoreCourses = () => {
        if (hasMoreCourses) {
            setCourseQp(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
        }
    };

    const fetchMoreQuestions = () => {
        if (hasMoreQuestions) {
            setQuestionQp(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
        }
    };
    return (

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

                {/* <div className="col-span-2">
                    <div className="input__field">
                        <InputLabel className="required">Duration</InputLabel>
                        <div className="flex items-center gap-5">
                            <div className="hours__wrapper flex items-center gap-2 flex-1">
                                <OutlinedInput
                                    fullWidth
                                    placeholder="0"
                                    type="number"
                                    name="duration.hours"
                                    value={formik.values?.duration.hours}
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
                                    value={formik.values?.duration?.minutes}
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
                                    : formik.errors.duration?.hours || formik.errors.duration?.minutes}
                            </FormHelperText>
                        )}
                    </div>
                </div> */}

                <div className="col-span-2">
                    <div className="input__field">
                        <TextEditor
                            label="Description"
                            value={formik.values.description}
                            onChange={(value) => formik.setFieldValue("description", value)}
                            onBlur={(_value) => formik.setFieldTouched("description", true)}
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
                            value={formik.values.start_datetime ? dayjs(formik.values.start_datetime) : null}
                            onChange={(date: Dayjs | null) =>
                                formik.setFieldValue("start_datetime", date ? date.toISOString() : "")
                            }
                            includeTime={true}
                        />
                        {formik.touched.start_datetime && formik.errors.start_datetime && (
                            <FormHelperText error>{formik.errors.start_datetime}</FormHelperText>
                        )}
                    </div>
                </div>

                <div className="col-span-1">
                    <div className="input__field">
                        <InputLabel className="required">End Date & Time</InputLabel>
                        <MakuraDatePicker
                            value={formik.values.end_datetime ? dayjs(formik.values.end_datetime) : null}
                            onChange={(date: Dayjs | null) =>
                                formik.setFieldValue("end_datetime", date ? date.toISOString() : "")
                            }
                            includeTime={true}
                            minDate={formik.values.start_datetime ? dayjs(formik.values.start_datetime) : dayjs()}
                        />
                        {formik.touched.end_datetime && formik.errors.end_datetime && (
                            <FormHelperText error>{formik.errors.end_datetime}</FormHelperText>
                        )}
                    </div>
                </div>

                <div className="col-span-1">
                    <div className="input__field">
                        <InputLabel className="required">Select Courses <Typography variant="caption" color="text.middle">(Select the course you want to add test)</Typography></InputLabel>
                        <InfiniteScrolling
                            key="course-list"
                            data={courseList || []}
                            hasMore={hasMoreCourses}
                            selectedItems={formik.values.course_ids}
                            onSelectionChange={(selectedIds) => {
                                formik.setFieldValue("course_ids", selectedIds);
                                formik.setFieldTouched("course_ids", true);
                            }}
                            fetchMore={fetchMoreCourses}
                            onSearch={handleCourseSearch}
                            loading={loadingCourses}
                            maxSelection={10}
                            itemLabelKey="name"
                            itemIdKey="id"
                            placeholder="Search courses..."
                        />
                        {formik.touched.course_ids && formik.errors.course_ids && (
                            <FormHelperText error>{formik.errors.course_ids}</FormHelperText>
                        )}
                    </div>
                </div>

                <div className="col-span-1">
                    <div className="input__field">
                        <InputLabel className="required">Select Questions</InputLabel>
                        <InfiniteScrolling
                            key="question-list"
                            data={questions?.data?.data || []}
                            hasMore={hasMoreQuestions}
                            selectedItems={formik.values.question_ids}
                            onSelectionChange={(selectedIds) => {
                                formik.setFieldValue("question_ids", selectedIds);
                                formik.setFieldTouched("question_ids", true);
                            }}
                            fetchMore={fetchMoreQuestions}
                            onSearch={handleQuestionSearch}
                            loading={loadingQuestions}
                            maxSelection={100}
                            itemLabelKey="question"
                            itemIdKey="id"
                            placeholder="Search questions..."
                        />
                        {formik.touched.question_ids && formik.errors.question_ids && (
                            <FormHelperText error>{formik.errors.question_ids}</FormHelperText>
                        )}
                    </div>
                </div>
            </div>

            <FooterAction
                handleComfirmationChange={() => { }}
                isLoading={creatingTest}
                isUpdating={creatingTest}
                isEditMode={!!id}
                buttonLabel={"Test"}
            />
        </form>
    );
}