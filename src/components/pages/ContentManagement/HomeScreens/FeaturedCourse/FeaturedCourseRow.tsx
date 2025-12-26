import { Box, Checkbox, FormControlLabel, IconButton, OutlinedInput, Typography } from "@mui/material";
import { Trash } from "iconsax-reactjs";
import { useState } from "react";
import SearchIcon from "../../../../../icons/SearchIcon";
import { useGetAllCourseQuery } from "../../../../../services/courseApi";
import type { CategoryTypeResponse } from "../../../../../types/category";

interface Props {
    index: number;
    megaCategories?: CategoryTypeResponse;
    formik: any;
    remove: (index: number) => void;
}

export default function FeaturedCourseRow({ index, megaCategories, formik, remove }: Props) {
    const [search, setSearch] = useState("");

    const selectedMegaCategoryId = formik.values.featured[index]?.mega_cat_id;

    const { data: filteredCourses, isLoading } = useGetAllCourseQuery({
        pageIndex: 1,
        pageSize: 100,
        search,
        categoryFilter: selectedMegaCategoryId ? { mega_category: [selectedMegaCategoryId] } : undefined
    }, {
        skip: !selectedMegaCategoryId
    });

    const courses = filteredCourses?.data?.data || [];
    const selectedCourses = formik.values.featured[index]?.courses || [];

    const otherSelectedMegaCategories = formik.values.featured
        .map((featured: any, idx: number) => idx !== index ? featured.mega_cat_id : null)
        .filter((id: number | null) => id !== null);



    const handleMegaCategorySelect = (megaCategoryId: number) => {
        formik.setFieldValue(`featured[${index}].mega_cat_id`, megaCategoryId);
        formik.setFieldValue(`featured[${index}].courses`, []);
        setSearch("");
    };

    const handleCourseToggle = (courseId: number) => {
        const currentCourses = selectedCourses;
        const isSelected = currentCourses.includes(courseId);

        if (isSelected) {
            formik.setFieldValue(
                `featured[${index}].courses`,
                currentCourses.filter((id: number) => id !== courseId)
            );
        } else {
            formik.setFieldValue(`featured[${index}].courses`, [...currentCourses, courseId]);
        }
    };

    // useEffect(() => {
    //     if (search) {
    //         // Don't clear courses on search, just filter
    //     }
    // }, [search]);

    return (
        <Box className="flex flex-col gap-4 md:grid md:grid-cols-12 lg:gap-6 mt-4 mb-4">
            <div className="col-span-4 lg:col-span-3">
                <Box className="rounded-md p-2" sx={{ border: (theme) => `1px solid ${theme.palette.separator.dark}` }}>
                    <Typography
                        sx={{
                            background: (theme) => theme.palette.primary.light,
                            color: (theme) => theme.palette.primary.main
                        }}
                        className="text-center py-2 px-4 rounded-md mb-2"
                    >
                        Megacategory
                    </Typography>

                    {megaCategories?.data?.map((mega) => {
                        const isSelected = selectedMegaCategoryId === mega.id;
                        const isDisabled = otherSelectedMegaCategories.includes(mega.id);

                        return (
                            <FormControlLabel
                                key={mega.id}
                                sx={{ m: 0, p: 0.5, width: "100%" }}
                                control={
                                    <Checkbox
                                        checked={isSelected}
                                        disabled={isDisabled}
                                        onChange={() => handleMegaCategorySelect(Number(mega.id))}
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography variant="subtitle1">{mega.name}</Typography>
                                    </Box>
                                }
                            />
                        );
                    })}

                    {formik.touched.featured?.[index]?.mega_cat_id && formik.errors.featured?.[index]?.mega_cat_id && (
                        <Typography color="error" variant="caption" className="mt-2 block">
                            {formik.errors.featured[index].mega_cat_id}
                        </Typography>
                    )}
                </Box>
            </div>

            {/* Course Selection */}
            <div className="col-span-8 lg:col-span-9">
                <Box className="rounded-md p-2" sx={{ border: (theme) => `1px solid ${theme.palette.separator.dark}` }}>
                    {/* Search and Delete */}
                    <div className="flex gap-4 items-center mb-3">
                        <OutlinedInput
                            fullWidth
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            startAdornment={<SearchIcon />}
                            sx={{ gap: "8px", padding: "8px 12px" }}
                            disabled={!selectedMegaCategoryId}
                        />
                        <IconButton
                            color="error"
                            onClick={() => remove(index)}
                            sx={{ border: (theme) => `1px solid ${theme.palette.separator.dark}` }}
                        >
                            <Trash size={20} />
                        </IconButton>
                    </div>


                    {!selectedMegaCategoryId && (
                        <Typography variant="body2" color="text.secondary" className="text-center py-4">
                            Please select a mega category first
                        </Typography>
                    )}

                    {/* Loading State */}
                    {selectedMegaCategoryId && isLoading && (
                        <Typography variant="body2" color="text.secondary" className="text-center py-4">
                            Loading courses...
                        </Typography>
                    )}

                    {/* No Courses Found */}
                    {selectedMegaCategoryId && !isLoading && courses.length === 0 && (
                        <Typography variant="body2" color="text.secondary" className="text-center py-4">
                            No courses found
                        </Typography>
                    )}

                    {/* Course List */}
                    {selectedMegaCategoryId && !isLoading && courses.length > 0 && (
                        <Box className="h-64 overflow-y-auto">
                            {courses.map((course) => {
                                const isSelected = selectedCourses.includes(course.id);

                                return (
                                    <FormControlLabel
                                        key={course.id}
                                        sx={{ m: 0, p: 0.5, width: "100%" }}
                                        control={
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={() => handleCourseToggle(Number(course.id))}
                                            />
                                        }
                                        label={
                                            <Box>
                                                <Typography variant="subtitle2">{course.name}</Typography>
                                            </Box>
                                        }
                                    />
                                );
                            })}
                        </Box>
                    )}

                    {/* Validation Error */}
                    {formik.touched.featured?.[index]?.courses && formik.errors.featured?.[index]?.courses && (
                        <Typography color="error" variant="caption" className="mt-2 block">
                            {formik.errors.featured[index].courses}
                        </Typography>
                    )}


                </Box>
            </div>
        </Box>
    );
}