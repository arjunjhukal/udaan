
import { Box, Button, Divider, Typography } from "@mui/material";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { Add } from "iconsax-reactjs";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useGetAllMegaCategoryQuery } from "../../../../../services/categoryApi";
import { useAddOrUpdateFeaturedCourseMutation, useGetAllFeaturedCourseQuery } from "../../../../../services/contentApi";
import { showToast } from "../../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../../store/hook";
import { FeaturedCourseInitialState } from "../../../../../types/content";
import FeaturedCourseRow from "./FeaturedCourseRow";

const validationSchema = Yup.object({
    featured: Yup.array().of(
        Yup.object({
            mega_cat_id: Yup.number().required("Mega Category is required"),
            courses: Yup.array().of(Yup.number()).min(1, "Select at least one course")
        })
    )
});

export default function FeaturedCourseRoot() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const { data: featuredCourse } = useGetAllFeaturedCourseQuery();
    const { data: megaCategories } = useGetAllMegaCategoryQuery();
    const [addOrUpdateFeaturedCourses, { isLoading }] = useAddOrUpdateFeaturedCourseMutation();

    const formik = useFormik({
        initialValues: {
            featured: featuredCourse?.data.length ? featuredCourse.data : FeaturedCourseInitialState.featured
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await addOrUpdateFeaturedCourses(values).unwrap();
                dispatch(showToast({ message: response.message || "Banner Created Successfully", severity: "success" }));
            } catch (e: any) {
                dispatch(showToast({ message: e?.data?.message || "Unable to Add Banner.", severity: "error" }));
            }
        }
    });

    return (
        <FormikProvider value={formik}>
            <div className="featured__course__root h-full flex flex-col justify-between overflow-hidden">
                <Typography variant="h5" className="mb-4">
                    {t("menus.content_management.home_screen.featured_course.root")}
                </Typography>

                <form onSubmit={formik.handleSubmit} className="h-full flex flex-col justify- overflow-hidden">
                    <div className="h-full overflow-auto">
                        <FieldArray name="featured">
                            {({ push, remove }) => (
                                <>
                                    {formik.values.featured.map((_item, index) => (
                                        <FeaturedCourseRow
                                            key={index}
                                            index={index}
                                            megaCategories={megaCategories}
                                            formik={formik}
                                            remove={remove}
                                        />
                                    ))}

                                    <Button
                                        variant="text"
                                        color="primary"
                                        startIcon={<Add />}
                                        onClick={() => push({ mega_cat_id: null, courses: [] })}
                                        className="mt-4"
                                    >
                                        Add Megacategory
                                    </Button>
                                </>
                            )}
                        </FieldArray>
                    </div>

                    <Divider className="my-6" />
                    <Box className="mt-6 flex justify-end gap-4">

                        <Button type="submit" variant="contained" disabled={isLoading}>
                            {isLoading ? "Adding Featured Courses..." : "Add Featured Courses"}
                        </Button>
                    </Box>
                </form>
            </div>
        </FormikProvider>
    );
}
