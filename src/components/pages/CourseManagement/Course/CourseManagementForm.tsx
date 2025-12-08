import { Box, Divider, FormHelperText, InputLabel, OutlinedInput, Typography } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { PATH } from "../../../../routes/PATH";
import { useGetAllCategoryRelatedToMegaCategoryQuery, useGetAllMegaCategoryQuery, useGetAllSubCategoryRelatedToCategoryQuery } from "../../../../services/categoryApi";
import { useCreateCourseMutation, useEditCourseMutation, useGetCourseByIdQuery } from "../../../../services/courseApi";
import { useGetAllPositionQuery } from "../../../../services/positionApi";
import { useGetAllUserQuery } from "../../../../services/userApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import { initialCourseState, type courseTabType } from "../../../../types/course";
import type { RegisterUserProps } from "../../../../types/user";
import { createCourseFormData } from "../../../../utils/courseFormData";
import TextEditor from "../../../atoms/TextEditor";
import FileDragDrop from "../../../molecules/FileDragDrop";
import FooterAction from "../../../molecules/FooterAction";
import TabController from "../../../molecules/TabController";
import CategoryFilter from "../../../organism/CategoryFilter";
import CourseMedia from "./createCourse/CourseMedia";
import CourseCurriculumForm from "./createCourse/CourseSubFields/Curriculum";
import CourseOverviewForm from "./createCourse/CourseSubFields/Overview";
import CourseTest from "./createCourse/CourseSubFields/Test";
import CourseType from "./createCourse/CourseType";

const validationSchema = (id?: string) => Yup.object().shape({
    name: Yup.string()
        .required("Course name is required")
        .min(3, "Course name must be at least 3 characters")
        .max(200, "Course name must not exceed 200 characters"),

    duration: Yup.object().shape({
        hours: Yup.number()
            .required("Hours is required")
            .min(0, "Hours must be at least 0")
            .max(999, "Hours must not exceed 999"),
        minutes: Yup.number()
            .required("Minutes is required")
            .min(0, "Minutes must be at least 0")
            .max(59, "Minutes must be between 0 and 59"),
    }).test(
        "duration-check",
        "Duration must be at least 1 minute",
        function (value) {
            const { hours, minutes } = value;
            return hours > 0 || minutes > 0;
        }
    ),

    description: Yup.string()
        .required("Course description is required")
        .min(10, "Description must be at least 10 characters"),

    thumbnail: id ?
        Yup.mixed().notRequired()
        : Yup.mixed()
            .required("Course thumbnail is required")
            .test(
                "fileSize",
                "File size must be less than 5MB",
                (value) => {
                    if (!value) return false;
                    return (value as File).size <= 5 * 1024 * 1024;
                }
            )
            .test(
                "fileType",
                "Only image files are allowed (jpg, jpeg, png, webp)",
                (value) => {
                    if (!value) return false;
                    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
                    return validTypes.includes((value as File).type);
                }
            ),

    selections: Yup.object().shape({
        mega_category: Yup.array()
            .of(Yup.number())
            .min(1, "Please select at least one mega category"),
        category: Yup.object(),
        sub_category: Yup.object(),
        // position_ids: Yup.array()
        //     .of(Yup.number())
        //     .min(1, "Please select at least one position/level"),
    }),

    about_this_course: Yup.string()
        .required("About this course is required")
        .min(10, "About course must be at least 10 characters"),

    teachers: Yup.array()
        .of(Yup.number())
        .min(1, "Please select at least one instructor"),

    course_type: Yup.string()
        .oneOf(["free", "subscription", "expiry"], "Invalid course type")
        .required("Course type is required"),



    course_expiry: Yup.object().when("course_type", {
        is: "expiry",
        then: (schema) => schema.shape({
            start_date: Yup.string().required("Start date is required"),
            end_date: Yup.string()
                .required("End date is required")
                .test(
                    "end-date-after-start",
                    "End date must be after start date",
                    function (value) {
                        const { start_date } = this.parent;
                        if (!start_date || !value) return true;
                        return new Date(value) > new Date(start_date);
                    }
                ),
            price: Yup.string().required("Price is required for expiry courses"),
            discount: Yup.number()
                .min(0, "Discount must be at least 0")
                .max(100, "Discount must not exceed 100"),
            discount_type: Yup.string()
                .oneOf(["percentage", "amount"], "Invalid discount type")
                .required("Discount type is required"),
        }),
        otherwise: (schema) => schema.notRequired(),
    }),
});

export default function CourseManagementForm() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const [selectedTeachers, setSelectedTeachers] = React.useState<RegisterUserProps[]>([]);


    const { data: megaCategories, isLoading: loadingMegaCategory } = useGetAllMegaCategoryQuery();


    const [activeTab, setActiveTab] = React.useState<courseTabType>("overview");
    const [searchTeacher, setSearchTeacher] = React.useState("")

    const { data: positions } = useGetAllPositionQuery({ pageIndex: 1, pageSize: 20, search: "", });
    const { data: teachers } = useGetAllUserQuery({ pageIndex: 1, pageSize: 20, search: searchTeacher, role: "teacher" });


    const { data } = useGetCourseByIdQuery({ id: id || "" }, { skip: !id });
    const [createCourse, { isLoading }] = useCreateCourseMutation();
    const [updateCourse, { isLoading: updating }] = useEditCourseMutation();


    React.useEffect(() => {
        if (data?.data?.teachers && teachers?.data?.data) {
            const selected = data.data.teachers
                .map((id: number) =>
                    teachers.data.data.find((t: RegisterUserProps) => Number(t.id) === Number(id))
                )
                .filter((t): t is RegisterUserProps => !!t);
            setSelectedTeachers(selected);

        }
    }, [data?.data?.teachers, teachers?.data?.data]);

    const handleCategoryChange = (
        type: "mega" | "category" | "sub" | "position",
        ids: number[],
        parentId?: number
    ) => {
        switch (type) {
            case "mega":
                formik.setFieldValue("selections.mega_category", ids);
                // Reset child selection when mega changes:
                formik.setFieldValue("selections.category", {});
                formik.setFieldValue("selections.sub_category", {});
                break;
            case "category":
                formik.setFieldValue(`selections.category.${parentId}`, ids);
                formik.setFieldValue("selections.sub_category", {});
                break;
            case "sub":
                formik.setFieldValue(`selections.sub_category.${parentId}`, ids);
                break;
            case "position":
                formik.setFieldValue("selections.position_ids", ids);
                break;
        }
    };


    const handleTeacherSelection = (newValue: RegisterUserProps) => {
        const updatedTeachers = [...selectedTeachers, newValue];
        setSelectedTeachers(updatedTeachers);
        formik.setFieldValue(
            "teachers",
            updatedTeachers.map(t => parseInt(t.id || "0", 10))
        );
    };

    const handleTeacherRemoval = (teacherId: string) => {
        const filteredTeachers = selectedTeachers.filter((item) => item.id !== teacherId);
        setSelectedTeachers(filteredTeachers);
        formik.setFieldValue(
            "teachers",
            filteredTeachers.map(t => parseInt(t.id || "0", 10))
        );
    };

    const formik = useFormik({
        initialValues: data?.data || initialCourseState,
        validationSchema: validationSchema(id),
        enableReinitialize: true,
        onSubmit: async (values) => {
            console.log("inside", values);
            if (id) {
                try {
                    const formattedData = createCourseFormData(values);
                    const response = await updateCourse({ body: formattedData, id: Number(id) }).unwrap();

                    dispatch(
                        showToast({
                            message: response?.message || "Course Updated Successfully",
                            severity: "success"
                        })
                    );

                }
                catch (e: any) {
                    dispatch(
                        showToast({
                            message: e?.data?.message || "Unable to Update Course",
                            severity: "error"
                        })
                    )
                }
            }
            else {

                try {
                    const formattedData = createCourseFormData(values);
                    const response = await createCourse({ body: formattedData }).unwrap();
                    dispatch(
                        showToast({
                            message: response?.message || "Course Created Successfully",
                            severity: "success"
                        })
                    );
                    navigate(response.data && PATH.COURSE_MANAGEMENT.COURSES.EDIT_COURSE.ROOT(response.data.id))
                }
                catch (e: any) {
                    console.log(e);
                    dispatch(
                        showToast({
                            message: e?.data?.message || "Unable to Create Course",
                            severity: "error"
                        })
                    )
                }
            }
        }
    })

    const { data: categories } = useGetAllCategoryRelatedToMegaCategoryQuery(
        {
            currentCategory: (formik?.values?.selections?.mega_category || [])
                .join(","),
        },
        {
            skip: !formik?.values?.selections?.mega_category?.length,
        }
    );
    const { data: subCategories } = useGetAllSubCategoryRelatedToCategoryQuery(
        {
            currentCategory: (formik?.values?.selections?.category
                ? Object.values(formik.values.selections.category)
                    .flat()
                    .join(",")
                : ""),
        },
        {
            skip: !formik?.values?.selections?.category ||
                !Object.values(formik.values.selections.category).length,
        }
    );

    const handleFileChange = (file: File | null) => {
        formik.setFieldValue("thumbnail", file);
    };
    return (
        <div className="course__management__form__root">
            <form action="" onSubmit={formik.handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4 lg:gap-6 mb-6">
                    <FileDragDrop
                        onFileChange={handleFileChange}
                        initialFile={formik.values.thumbnail}
                        initialPreview={formik.values.thumbnail_url}
                        error={formik.touched.thumbnail && Boolean(formik.errors.thumbnail)}
                        helperText={formik.touched.thumbnail && formik.errors.thumbnail ? String(formik.errors.thumbnail) : ""} label="Image" />
                    <div className="col-span-1">
                        <div className="input__field mb-6">
                            <InputLabel className="required">Course Name</InputLabel>
                            <OutlinedInput
                                fullWidth
                                placeholder="Enter Course Name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <FormHelperText error={true} sx={{ mt: 0.5 }}>
                                    {formik.errors.name}
                                </FormHelperText>
                            )}
                        </div>
                        <div className="input__field">
                            <InputLabel className="required">Duration</InputLabel>
                            <div className="flex items-center gap-5">
                                <div className="hours__wrapper flex items-center gap-2 flex-1">
                                    <OutlinedInput
                                        fullWidth
                                        placeholder="0"
                                        type="number"
                                        name="duration.hours"
                                        value={formik.values.duration?.hours}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.duration?.hours &&
                                            Boolean(formik.errors.duration?.hours)
                                        }
                                        inputProps={{ min: 0, max: 999 }}
                                    />
                                    <Typography variant="body2" color="text.middle">Hrs</Typography>
                                </div>
                                <Box color={"gray.gray3"}>:</Box>
                                <div className="minutes__wrapper flex items-center gap-2 flex-1">
                                    <OutlinedInput
                                        fullWidth
                                        placeholder="0"
                                        type="number"
                                        name="duration.minutes"
                                        value={formik.values.duration?.minutes}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.duration?.minutes &&
                                            Boolean(formik.errors.duration?.minutes)
                                        }
                                        inputProps={{ min: 0, max: 59 }}
                                    />
                                    <Typography variant="body2" color="text.middle">Mins</Typography>
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
                </div >
                <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                    <div className="col-span-1">
                        <div className="input__field">
                            <TextEditor
                                value={formik.values.description}
                                onChange={(value) => formik.setFieldValue("description", value)}
                                onBlur={() => formik.setFieldTouched("description")}
                            />
                            {formik.touched.description && formik.errors.description && (
                                <FormHelperText error={true} sx={{ mt: 0.5 }}>
                                    {formik.errors.description}
                                </FormHelperText>
                            )}
                        </div>
                    </div>
                    <div className="col-span-1">
                        <CategoryFilter
                            megaCategories={megaCategories?.data || []}
                            categories={categories?.data || []}
                            subCategories={subCategories?.data || []}
                            positions={positions?.data?.data || []}
                            selections={formik.values.selections}
                            onChange={handleCategoryChange}
                            loadingMegaCategory={loadingMegaCategory}
                        />
                        {formik.touched.selections?.mega_category && formik.errors.selections?.mega_category && (
                            <FormHelperText error sx={{ mt: 0.5 }}>
                                {formik.errors.selections.mega_category}
                            </FormHelperText>
                        )}

                        {/* Flatten category errors */}
                        {formik.touched.selections?.category && Object.keys(formik.errors.selections?.category || {}).length > 0 && (
                            <FormHelperText error sx={{ mt: 0.5 }}>
                                Please select at least one category
                            </FormHelperText>
                        )}

                        {/* Flatten sub_category errors */}
                        {formik.touched.selections?.sub_category && Object.keys(formik.errors.selections?.sub_category || {}).length > 0 && (
                            <FormHelperText error sx={{ mt: 0.5 }}>
                                Please select at least one sub-category
                            </FormHelperText>
                        )}

                        {/* Position ids error */}
                        {formik.touched.selections?.position_ids && formik.errors.selections?.position_ids && (
                            <FormHelperText error sx={{ mt: 0.5 }}>
                                {formik.errors.selections.position_ids}
                            </FormHelperText>
                        )}
                    </div>
                </div>
                <Divider sx={{ marginTop: "36px", marginBottom: "36px" }} />
                <CourseType
                    formik={formik}
                />
                <Divider sx={{ marginTop: "36px", marginBottom: "36px" }} />
                <TabController setActiveTab={setActiveTab} currentActive={activeTab} />
                {activeTab === "overview" ? <CourseOverviewForm
                    teachers={teachers?.data?.data || []}
                    selectedTeachers={selectedTeachers}
                    handleTeacherSelection={handleTeacherSelection}
                    search={searchTeacher}
                    setSearch={setSearchTeacher}
                    handleTeacherRemoval={handleTeacherRemoval}
                    formik={formik}
                /> : ""}
                {activeTab === "curriculum" ? <CourseCurriculumForm /> : ""}
                {activeTab === "notes" ? <CourseMedia type="notes" id={id} /> : ""}
                {activeTab === "audios" ? <CourseMedia type="audios" id={id} /> : ""}
                {activeTab === "videos" ? <CourseMedia type="videos" id={id} /> : ""}
                {activeTab === "test" ? <CourseTest id={id} /> : ""}
                <FooterAction
                    handleConfirmationChange={() => navigate(PATH.COURSE_MANAGEMENT.COURSES.ROOT)}
                    isLoading={isLoading}
                    isUpdating={updating}
                    isEditMode={!!id}
                    buttonLabel="Course"
                />
            </form >
        </div >
    )
}
