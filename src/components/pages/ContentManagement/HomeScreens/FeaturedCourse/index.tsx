// import { Box, Button, Divider, IconButton, OutlinedInput, Typography } from '@mui/material';
// import { FieldArray, useFormik } from 'formik';
// import { Add } from 'iconsax-reactjs';
// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import * as Yup from "yup";
// import SearchIcon from '../../../../../icons/SearchIcon';
// import { useGetAllMegaCategoryQuery } from '../../../../../services/categoryApi';
// import { useAddOrUpdateFeaturedCourseMutation, useGetAllFeaturedCourseQuery } from '../../../../../services/contentApi';
// import { useGetAllCourseQuery } from '../../../../../services/courseApi';
// import { showToast } from '../../../../../slice/toastSlice';
// import { useAppDispatch } from '../../../../../store/hook';
// import { FeaturedCourseInitialState } from '../../../../../types/content';

// const validationSchema = Yup.object({
//     featured: Yup.array().of(
//         Yup.object({
//             mega_cat_id: Yup.number().required("Mega Category is required"),
//             courses: Yup.array().of(Yup.number()).min(1, "Select at least one course")
//         })
//     )
// });
// export default function FeaturedCourseRoot() {
//     const { t } = useTranslation();
//     const dispatch = useAppDispatch();
//     const [searches, setSearches] = useState<string[]>([]);



//     const [addOrUpdateFeaturedCourses, { isLoading }] = useAddOrUpdateFeaturedCourseMutation();
//     const { data: featuredCourse } = useGetAllFeaturedCourseQuery();
//     const { data: megaCategories } = useGetAllMegaCategoryQuery();
//     const { data: courses } = useGetAllCourseQuery({ pageIndex: 1, pageSize: 20 });


//     const handleSearchChange = (index: number, value: string) => {
//         const newSearches = [...searches];
//         newSearches[index] = value;
//         setSearches(newSearches);
//     };

//     const formik = useFormik({
//         initialValues: {
//             featured: featuredCourse?.data.length ? featuredCourse.data : FeaturedCourseInitialState.featured
//         },
//         validationSchema,
//         onSubmit: async (values) => {
//             try {
//                 const response = await addOrUpdateFeaturedCourses(values).unwrap();
//                 dispatch(showToast({ message: response.message || "Banner Created Successfully", severity: "success" }));
//             }
//             catch (e: any) {
//                 dispatch(showToast({ message: e?.data?.message || "Unable to Add Banner.", severity: "error" }));
//             }
//         }
//     });
//     return (
//         <div className="featured__course__root">
//             <Typography variant="h5">{t("menus.content_management.home_screen.featured_course.root")}</Typography>
//             <FieldArray name="banners">

//                 {({ push, remove }) => (
//                     <>
//                         {formik.values.featured.map((item, index) => {
//                             // API call for courses based on search value
//                             const { data: filteredCourses, isFetching } = useGetAllCourseQuery({
//                                 pageIndex: 1,
//                                 pageSize: 100,
//                                 search: searches[index] || ''
//                             });
//                             return (
//                                 <div className="flex flex-col gap-4 md:grid md:grid-cols-12 lg:gap-6 mt-2">
//                                     <div className="col-span-4 lg:col-span-3 ">
//                                         <Box className="rounded-md p-2 " sx={{
//                                             border: (theme) => `1px solid ${theme.palette.separator.dark}`
//                                         }}>
//                                             <Typography sx={{
//                                                 background: (theme) => theme.palette.primary.light,
//                                                 color: (theme) => theme.palette.primary.main
//                                             }} className='text-center py-2 px-4 rounded-md'>Megacategorie</Typography>
//                                         </Box>
//                                     </div>
//                                     <div className="col-span-8 lg:col-span-9 ">
//                                         <Box className="rounded-md p-2 " sx={{
//                                             border: (theme) => `1px solid ${theme.palette.separator.dark}`
//                                         }}>
//                                             <div className="flex gap-4 items-center">
//                                                 <OutlinedInput
//                                                     fullWidth
//                                                     placeholder="Search"
//                                                     name="search"
//                                                     id="search"
//                                                     startAdornment={<SearchIcon />}
//                                                     sx={{
//                                                         gap: "8px",
//                                                         padding: "8px 12px"
//                                                     }}
//                                                 />
//                                                 <IconButton
//                                                     sx={{
//                                                         border: (theme) => `1px solid ${theme.palette.separator.dark}`
//                                                     }} className={`rounded-md! `}
//                                                 >
//                                                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                                         <path d="M21.0702 5.23C19.4602 5.07 17.8502 4.95 16.2302 4.86V4.85L16.0102 3.55C15.8602 2.63 15.6402 1.25 13.3002 1.25H10.6802C8.35016 1.25 8.13016 2.57 7.97016 3.54L7.76016 4.82C6.83016 4.88 5.90016 4.94 4.97016 5.03L2.93016 5.23C2.51016 5.27 2.21016 5.64 2.25016 6.05C2.29016 6.46 2.65016 6.76 3.07016 6.72L5.11016 6.52C10.3502 6 15.6302 6.2 20.9302 6.73C20.9602 6.73 20.9802 6.73 21.0102 6.73C21.3902 6.73 21.7202 6.44 21.7602 6.05C21.7902 5.64 21.4902 5.27 21.0702 5.23Z" fill="#111827" />
//                                                         <path d="M19.2302 8.14C18.9902 7.89 18.6602 7.75 18.3202 7.75H5.68024C5.34024 7.75 5.00024 7.89 4.77024 8.14C4.54024 8.39 4.41024 8.73 4.43024 9.08L5.05024 19.34C5.16024 20.86 5.30024 22.76 8.79024 22.76H15.2102C18.7002 22.76 18.8402 20.87 18.9502 19.34L19.5702 9.09C19.5902 8.73 19.4602 8.39 19.2302 8.14ZM13.6602 17.75H10.3302C9.92024 17.75 9.58024 17.41 9.58024 17C9.58024 16.59 9.92024 16.25 10.3302 16.25H13.6602C14.0702 16.25 14.4102 16.59 14.4102 17C14.4102 17.41 14.0702 17.75 13.6602 17.75ZM14.5002 13.75H9.50024C9.09024 13.75 8.75024 13.41 8.75024 13C8.75024 12.59 9.09024 12.25 9.50024 12.25H14.5002C14.9102 12.25 15.2502 12.59 15.2502 13C15.2502 13.41 14.9102 13.75 14.5002 13.75Z" fill="#111827" />
//                                                     </svg>
//                                                 </IconButton>
//                                             </div>
//                                         </Box>
//                                     </div>
//                                 </div>
//                             )
//                         })}
//                         <Button variant="text" color="primary" startIcon={<Add />} onClick={() => push(FeaturedCourseInitialState)}>Add Megacategory</Button>
//                     </>
//                 )}
//             </FieldArray>

//             <Divider className="mt-6" />
//             <Box className="mt-6 flex justify-end gap-4">
//                 <Button onClick={() => formik.resetForm()} variant="contained" color="inherit">Cancel</Button>
//                 <Button type="submit" variant="contained" disabled={isLoading}>{isLoading ? "Creating Banner..." : "Create Banner"}</Button>
//             </Box>
//         </div>
//     )
// }

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
            <div className="featured__course__root">
                <Typography variant="h5" className="mb-4">
                    {t("menus.content_management.home_screen.featured_course.root")}
                </Typography>

                <form onSubmit={formik.handleSubmit}>
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

                    <Divider className="my-6" />
                    <Box className="mt-6 flex justify-end gap-4">
                        <Button onClick={() => formik.resetForm()} variant="contained" color="inherit">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={isLoading}>
                            {isLoading ? "Creating Courses..." : "Create Courses"}
                        </Button>
                    </Box>
                </form>
            </div>
        </FormikProvider>
    );
}
