import { Box, FormHelperText, InputLabel, OutlinedInput, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import { useGetAllCourseQuery } from "../../../../services/courseApi";
import { useEditOrCreateTestMutation, useGetAllQuestionQuery, useGetTestByIdQuery } from "../../../../services/questionApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import { useCourseFilter } from "../../../../store/useCourseFilter";
import type { CourseProps } from "../../../../types/course";
import { TestInitialState, testValidationSchema, type QuestionProps, type TestProps } from "../../../../types/question";
import { calcHasMore } from "../../../../utils/calculateHasMore";
import MakuraDatePicker from "../../../atoms/MakuraDatePicker";
import StyledToggleButtons from "../../../atoms/StyledToggleSwitch";
import { YesNoSwitch } from "../../../atoms/YesNoSwitch";
import FooterAction from "../../../molecules/FooterAction";
import InfiniteScrolling from "../../../molecules/InfiniteScrolling";
import CategoryFilter from "../../../organism/CategoryFilter";



export default function TestManagementForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const testId = Number.isFinite(Number(id)) ? Number(id) : undefined;
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

    const {
        megaCategories,
        categories,
        subCategories,
        handleCategoryChange,
        selections,
        getCategoryFilterParams,
    } = useCourseFilter();

    const { data: editData } = useGetTestByIdQuery(
        { id: testId as number },
        { skip: !testId }
    );


    function getInitialValues(): TestProps {
        if (id && editData?.data) {
            const test = editData.data;
            return {
                id: test.id,
                name: test.name || "",
                duration: test.duration || { hours: 0, minutes: 0 },
                full_mark: test.full_mark || 0,
                pass_mark: test.pass_mark || 0,
                start_datetime: test.start_datetime || "",
                end_datetime: test.end_datetime || "",
                course_ids: test.course_ids || [],
                question_ids: test.question_ids || [],
                is_scheduled: test.is_scheduled ?? false,
                test_type: test.test_type || "mcq",
                total_questions: test.total_questions || 0,
                marks_per_question: test.marks_per_question || 0
            };
        }
        return TestInitialState;
    }


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

    console.log(formik.errors)

    const categoryFilter = getCategoryFilterParams();
    const { data: courses, isLoading: loadingCourses } = useGetAllCourseQuery({ ...courseQp, categoryFilter: { ...categoryFilter } });
    const { data: questions, isLoading: loadingQuestions } = useGetAllQuestionQuery({ ...questionQp, type: formik.values.test_type });
    const [createTest, { isLoading: creatingTest }] = useEditOrCreateTestMutation();
    const [courseList, setCourseList] = useState<CourseProps[]>([]);
    const [questionList, setQuestionList] = useState<QuestionProps[]>([]);

    useEffect(() => {
        if (!courses?.data?.data) return;

        setCourseList(prev => {
            if (courseQp.pageIndex === 1) {
                return courses.data.data;
            }

            const existingIds = new Set(prev.map(course => course.id));
            const newCourses = courses.data.data.filter(
                course => !existingIds.has(course.id)
            );

            return [...prev, ...newCourses];
        });
    }, [courses, courseQp.pageIndex]);

    useEffect(() => {
        if (!questions?.data?.data) return;

        setQuestionList(prev => {
            if (questionQp.pageIndex === 1) {
                return questions.data.data;
            }

            const existingIds = new Set(prev.map(question => question.id));
            const newQuestions = questions.data.data.filter(
                question => !existingIds.has(question.id)
            );

            return [...prev, ...newQuestions];
        });
    }, [questions, questionQp.pageIndex]);




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
                    <StyledToggleButtons
                        leftLabel="MCQ"
                        rightLabel="Subjective"
                        value={formik.values.test_type === "mcq" ? "left" : "right"}
                        onChange={(_event, newValue) => {
                            if (newValue !== null) {
                                if (formik.values.test_type === "mcq") {
                                    formik.setFieldValue("full_marks", 0);
                                    formik.setFieldValue("test_type", "subjective");

                                } else {
                                    formik.setFieldValue("marks_per_question", 0);
                                    formik.setFieldValue("test_type", "mcq");

                                }
                            }
                        }}
                    />
                </div>

                <div className="col-span-1">
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

                <div className="col-span-1">
                    <div className="input__field">
                        <InputLabel className="required">Total No. of Questions</InputLabel>
                        <OutlinedInput
                            fullWidth
                            name="total_questions"
                            type="number"
                            value={formik.values.total_questions}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter Total Questions"
                            error={formik.touched.total_questions && Boolean(formik.errors.total_questions)}
                            inputProps={{ min: 1 }}
                        />
                        {formik.touched.total_questions && formik.errors.total_questions && (
                            <FormHelperText error>{formik.errors.total_questions}</FormHelperText>
                        )}
                    </div>
                </div>

                {formik.values.test_type === "subjective" ? (
                    <div className="col-span-1">
                        <div className="input__field">
                            <InputLabel className="required">Full Marks</InputLabel>
                            <OutlinedInput
                                fullWidth
                                name="full_mark"
                                value={formik.values.full_mark}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter Full Marks"
                                type="number"
                                error={formik.touched.full_mark && Boolean(formik.errors.full_mark)}
                                inputProps={{ min: 1 }}
                            />
                            {formik.touched.full_mark && formik.errors.full_mark && (
                                <FormHelperText error>{formik.errors.full_mark}</FormHelperText>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="col-span-1">
                        <div className="input__field">
                            <InputLabel className="required">Marks Per Question</InputLabel>
                            <OutlinedInput
                                fullWidth
                                name="marks_per_question"
                                value={formik.values.marks_per_question}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter Marks Per Question"
                                type="number"
                                error={formik.touched.marks_per_question && Boolean(formik.errors.marks_per_question)}
                                inputProps={{ min: 1 }}
                            />
                            {formik.touched.marks_per_question && formik.errors.marks_per_question && (
                                <FormHelperText error>{formik.errors.marks_per_question}</FormHelperText>
                            )}
                        </div>
                    </div>
                )}

                <div className="col-span-1">
                    <div className="input__field">
                        <InputLabel className="required">Pass Marks</InputLabel>
                        <OutlinedInput
                            fullWidth
                            name="pass_mark"
                            value={formik.values.pass_mark}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter Pass Marks"
                            type="number"
                            error={formik.touched.pass_mark && Boolean(formik.errors.pass_mark)}
                            inputProps={{ min: 0 }}
                        />
                        {formik.touched.pass_mark && formik.errors.pass_mark && (
                            <FormHelperText error>{formik.errors.pass_mark}</FormHelperText>
                        )}
                    </div>
                </div>

                <div className="col-span-1">
                    <div className="input__field">
                        <InputLabel className="required">Duration</InputLabel>
                        <div className="flex items-center gap-5">
                            <div className="hours__wrapper flex items-center gap-2 flex-1">
                                <OutlinedInput
                                    fullWidth
                                    placeholder="0"
                                    type="number"
                                    name="duration.hours"
                                    value={formik.values?.duration?.hours}
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
                </div>

                <div className="col-span-2 flex items-center gap-2">
                    <Typography variant="subtitle1" color="text.middle">Do you want to schedule this test?</Typography>
                    <YesNoSwitch
                        checked={formik.values.is_scheduled}
                        onChange={(event) => {
                            formik.setFieldValue("is_scheduled", event.target.checked);
                            if (!event.target.checked) {
                                formik.setFieldValue("start_datetime", "");
                                formik.setFieldValue("end_datetime", "");
                            }
                        }}
                    />
                </div>

                {formik.values.is_scheduled && (
                    <>
                        <div className="col-span-1">
                            <div className="input__field">
                                <InputLabel className="required">Start Date & Time</InputLabel>
                                <MakuraDatePicker
                                    value={formik.values.start_datetime ? dayjs(formik.values.start_datetime) : null}
                                    onChange={(date: Dayjs | null) =>
                                        formik.setFieldValue("start_datetime", date ? date.toISOString() : "")
                                    }
                                    includeTime={true}
                                    placeholder="Select start date & time"
                                    error={formik.touched.start_datetime && Boolean(formik.errors.start_datetime)}
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
                                    placeholder="Select end date & time"
                                    error={formik.touched.end_datetime && Boolean(formik.errors.end_datetime)}
                                />
                                {formik.touched.end_datetime && formik.errors.end_datetime && (
                                    <FormHelperText error>{formik.errors.end_datetime}</FormHelperText>
                                )}
                            </div>
                        </div>
                    </>
                )}

                <div className="col-span-2">
                    <div className="lg:grid grid-cols-2 gap-6">
                        <div className="col-span-1">
                            <CategoryFilter
                                megaCategories={megaCategories}
                                categories={categories}
                                subCategories={subCategories}
                                onChange={handleCategoryChange}
                                selections={selections}
                            />
                        </div>
                        <div className="col-span-1">
                            <div className="input__field">
                                <InputLabel className="required">Select Courses {formik.values.course_ids.length ? (formik.values.course_ids.length) : ""} <Typography variant="caption" color="text.middle">(Select the course you want to add test)</Typography></InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    placeholder="Search Course"
                                    value={courseQp.search}
                                    onChange={(e) => handleCourseSearch(e.target.value)}
                                    endAdornment={
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.58317 17.5001C13.9554 17.5001 17.4998 13.9557 17.4998 9.58341C17.4998 5.21116 13.9554 1.66675 9.58317 1.66675C5.21092 1.66675 1.6665 5.21116 1.6665 9.58341C1.6665 13.9557 5.21092 17.5001 9.58317 17.5001Z" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M18.3332 18.3334L16.6665 16.6667" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                    }
                                />
                                <InfiniteScrolling
                                    key="course-list"
                                    scrollableId="course-scrollable"
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
                    </div>
                </div>

                <div className="col-span-2">
                    <div className="input__field">
                        <InputLabel className="required">Select Questions ({formik.values.question_ids.length})</InputLabel>
                        <InfiniteScrolling
                            key="question-list"
                            scrollableId="question-scrollable"
                            data={questionList || []}
                            hasMore={hasMoreQuestions}
                            selectedItems={formik.values.question_ids}
                            onSelectionChange={(selectedIds) => {
                                formik.setFieldValue("question_ids", selectedIds);
                                formik.setFieldTouched("question_ids", true);
                            }}
                            fetchMore={fetchMoreQuestions}
                            onSearch={handleQuestionSearch}
                            loading={loadingQuestions}
                            maxSelection={formik.values.total_questions || undefined}
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
                handleConfirmationChange={() => { }}
                isLoading={creatingTest}
                isUpdating={creatingTest}
                isEditMode={!id}
                replaceLabel={creatingTest ? "Creating Test..." : "Create Test"}

            />
        </form>
    );
}