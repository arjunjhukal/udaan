import { Box, Divider, InputLabel, OutlinedInput, Typography } from "@mui/material";
import React from "react";
import { useGetAllCategoryRelatedToMegaCategoryQuery, useGetAllMegaCategoryQuery, useGetAllSubCategoryRelatedToCategoryQuery } from "../../../services/categoryApi";
import { useGetAllPositionQuery } from "../../../services/positionApi";
import { useGetAllUserQuery } from "../../../services/userApi";
import type { RegisterUserProps } from "../../../types/user";
import TextEditor from "../../atoms/TextEditor";
import FileDragDrop from "../../molecules/FileDragDrop";
import FooterAction from "../../molecules/FooterAction";
import CategoryFilter from "../../organism/CategoryFilter";
import CourseOverviewForm from "./createCourse/CourseSubFields/Overview";
import CourseType from "./createCourse/CourseType";

export default function CourseManagementForm() {

    const [selectedMegaCategories, setSelectedMegaCategories] = React.useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
    const [selectedSubCategories, setSelectedSubCategories] = React.useState<string[]>([]);
    const [selectedPosition, setSelectedPosition] = React.useState<string[]>([]);
    const [selectedTeachers, setSelectedTeachers] = React.useState<RegisterUserProps[]>([]);
    const selectedMegaCategoriesString = React.useMemo(
        () => selectedMegaCategories.join(","),
        [selectedMegaCategories]
    );
    const selectedCategoriesString = React.useMemo(
        () => selectedCategories.join(","),
        [selectedCategories]
    );

    const { data: megaCategories, isLoading: loadingMegaCategory } = useGetAllMegaCategoryQuery();

    const { data: categories } = useGetAllCategoryRelatedToMegaCategoryQuery(
        { currentCategory: selectedMegaCategoriesString },
        { skip: selectedMegaCategories.length === 0 }
    );
    const { data: subCategories } = useGetAllSubCategoryRelatedToCategoryQuery(
        { currentCategory: selectedCategoriesString },
        { skip: selectedCategories.length === 0 }
    );
    const [searchTeacher, setSearchTeacher] = React.useState("")
    const { data: positions } = useGetAllPositionQuery({ pageIndex: 1, pageSize: 10, search: "", });
    const { data: teachers } = useGetAllUserQuery({ pageIndex: 1, pageSize: 10, search: searchTeacher, role: "teacher" });

    const handleCategoryChange = (type: "mega" | "category" | "sub" | "position", ids: string[]) => {
        switch (type) {
            case "mega":
                setSelectedMegaCategories(ids);
                break;
            case "category":
                setSelectedCategories(ids);
                break;
            case "sub":
                setSelectedSubCategories(ids);
                break;
            case "position":
                setSelectedPosition(ids);
                break;
        }
    };

    const handleTeacherSelection = (newValue: RegisterUserProps) => {
        setSelectedTeachers(
            [...selectedTeachers, newValue]
        )
    }

    const handleTeacherRemoval = (teacherId: string) => {
        console.log(teacherId)
        const filteredTeachers = selectedTeachers.filter((item) => item.id != teacherId);
        setSelectedTeachers(filteredTeachers);
    }
    return (
        <div className="course__management__form__root">
            <div className="grid md:grid-cols-2 gap-4 lg:gap-6 mb-6">
                <FileDragDrop onFileChange={() => { }} label="Image" />
                <div className="col-span-1">
                    <div className="input__field mb-6">
                        <InputLabel className="required">Course Name</InputLabel>
                        <OutlinedInput
                            fullWidth
                        />
                    </div>
                    <div className="input__field">
                        <InputLabel className="required">Duration</InputLabel>
                        <div className="flex items-center gap-5">
                            <div className="hours__wrapper flex items-center gap-2">
                                <OutlinedInput
                                    fullWidth
                                />
                                <Typography variant="body2" color="text.middle">Hrs</Typography>
                            </div>
                            <Box color={"gray.gray3"}>:</Box>

                            <div className="minutes__wrapper flex items-center gap-2">
                                <OutlinedInput
                                    fullWidth
                                />
                                <Typography variant="body2" color="text.middle">Mins</Typography>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                <TextEditor />
                <CategoryFilter
                    megaCategories={megaCategories?.data || []}
                    categories={categories?.data || []}
                    subCategories={subCategories?.data || []}
                    positions={positions?.data?.data || []}
                    selectedMegaCategories={selectedMegaCategories}
                    loadingMegaCategory={loadingMegaCategory}
                    selectedCategories={selectedCategories}
                    selectedSubCategories={selectedSubCategories}
                    selectedPosition={selectedPosition}
                    onChange={handleCategoryChange}

                />
            </div>
            <Divider sx={{ marginTop: "36px", marginBottom: "36px" }} />
            <CourseType />
            <Divider sx={{ marginTop: "36px", marginBottom: "36px" }} />
            <CourseOverviewForm
                teachers={teachers?.data?.data || []}
                selectedTeachers={selectedTeachers}
                handleTeacherSelection={handleTeacherSelection}
                search={searchTeacher}
                setSearch={setSearchTeacher}
                handleTeacherRemoval={handleTeacherRemoval}
            />
            <FooterAction
                handleComfirmationChange={() => { }}
                isLoading={false}
                isUpdating={false}
                isEditMode={false}
            />

        </div >
    )
}
