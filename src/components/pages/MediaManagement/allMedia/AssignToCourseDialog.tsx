import { Dialog, DialogContent, FormHelperText, InputLabel, OutlinedInput, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from "yup";
import { useAssignMediaToCourseMutation, useGetAllCourseQuery } from '../../../../services/courseApi';
import { showToast } from '../../../../slice/toastSlice';
import { useAppDispatch } from '../../../../store/hook';
import { useCourseFilter } from '../../../../store/useCourseFilter';
import type { CourseProps, courseTabType } from '../../../../types/course';
import { calcHasMore } from '../../../../utils/calculateHasMore';
import FooterAction from '../../../molecules/FooterAction';
import InfiniteScrolling from '../../../molecules/InfiniteScrolling';
import CategoryFilter from '../../../organism/CategoryFilter';
interface Props {
    open: boolean;
    setOpen: (newValue: boolean) => void;
    selectedMedia: number[];
    type: courseTabType
}

const validationSchema = Yup.object({
    course_ids: Yup.array()
        .of(Yup.number())
        .min(1, "Please select at least one course")
        .required("Course selection is required")
})

export default function AssignToCourseDialog({ open, setOpen, selectedMedia, type }: Props) {
    const dispatch = useAppDispatch();
    const [courseQp, setCourseQp] = useState({
        pageIndex: 1,
        pageSize: 10,
        search: ""
    });
    const [courseList, setCourseList] = useState<CourseProps[]>([]);
    const {
        megaCategories,
        categories,
        subCategories,
        handleCategoryChange,
        selections,
        getSelectedCategoryFilterParams,
    } = useCourseFilter();

    const categoryFilter = getSelectedCategoryFilterParams();
    const { data: courses, isLoading: loadingCourses } = useGetAllCourseQuery({ ...courseQp, categoryFilter: { ...categoryFilter } });
    const [assignMediaToCourse, isLoading] = useAssignMediaToCourseMutation();

    const handleCourseSearch = (searchTerm: string) => {
        setCourseQp(prev => ({
            ...prev,
            search: searchTerm,
            pageIndex: 1
        }));
    };

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

    const coursePagination = courses?.data?.pagination;
    const hasMoreCourses = calcHasMore(coursePagination);

    const fetchMoreCourses = () => {
        if (hasMoreCourses) {
            setCourseQp(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
        }
    };
    const formik = useFormik({
        initialValues: { course_ids: [] },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await assignMediaToCourse({
                    course_ids: values.course_ids,
                    media_ids: selectedMedia,
                    type: type
                }).unwrap();

                dispatch(
                    showToast({
                        message: response?.message || "Media Assigned Successfully",
                        severity: "success"
                    }))
                setOpen(false);
            }
            catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Media Assignment Failed",
                        severity: "error"
                    }))
            }
        }
    })
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)} maxWidth="lg"
            fullWidth

        >
            <DialogContent sx={{
                bgcolor: (theme) => theme.palette.primary.contrastText
            }}>
                <form action="" onSubmit={formik.handleSubmit}>
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
                                <InputLabel className="required">Select Courses <Typography variant="caption" color="text.middle">(Select the course you want to add test)</Typography></InputLabel>
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
<<<<<<< Updated upstream
                                    maxSelection={10}
=======
>>>>>>> Stashed changes
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
                    <FooterAction
                        replaceLabel={!isLoading ? 'Assigning To Course' : 'Assign To Course'}
                        handleConfirmationChange={() => setOpen(false)}
                    />
                </form>
            </DialogContent>
        </Dialog >
    )
}
