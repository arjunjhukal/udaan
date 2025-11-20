import { Add } from "@mui/icons-material";
import { Box, Button, Collapse, Divider, Skeleton, Typography, useTheme } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { useDeleteCourseCurriculumMutation, useGetAllCurriculumQuery } from "../../../../../../services/courseApi";
import { showToast } from "../../../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../../../store/hook";
import type { ChapterProps, ChildLessonProps, CurriculumProps, LessonProps, SubjectProps, UnitProps } from "../../../../../../types/course";
import { renderHtml } from "../../../../../../utils/renderHtml";
import CustomCollapseIcon from "../../../../../atoms/CustomCollapseIcon";
import ActionIconVisible from "../../../../../molecules/Action/ActionIconVisible";
import TablePagination from "../../../../../molecules/Table/Pagination";
import CurriculumItem from "../../../../../organism/Cards/CurriculumAccordionItem";
import ConfirmationDialog from "../../../../../organism/ConfirmationDialog";
import EmptyRoute from "../../../../../organism/EmptyRoute";
import CurriculumFormWithMedia from "./CurriculumFormWithMedia";

export type CurriculumType = "subject" | "chapter" | "unit" | "lesson" | "child_lesson";

interface FormState {
    open: boolean;
    type: CurriculumType;
    parentId: number | null;
    selectedCurriculum: CurriculumProps | null;
}

interface DeleteState {
    id: number;
    type: CurriculumType;
}

export default function CourseCurriculumForm() {
    const dispatch = useAppDispatch();
    const [formState, setFormState] = React.useState<FormState>({
        open: false,
        type: 'subject',
        parentId: null,
        selectedCurriculum: null
    });

    const [expanded, setExpanded] = React.useState<{ [key: string]: boolean }>({});
    const theme = useTheme();
    const { id } = useParams();
    const [qp, setQp] = React.useState({
        pageIndex: 1,
        pageSize: 8
    });
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [curriculumToDelete, setCurriculumToDelete] = React.useState<DeleteState | null>(null);

    const handleOpenForm = (
        type: CurriculumType,
        parentId: number | null = null,
        selectedCurriculum: CurriculumProps | null = null
    ) => {
        setFormState({
            open: true,
            type,
            parentId,
            selectedCurriculum
        });
    };

    const handleCloseForm = () => {
        setFormState({
            open: false,
            type: 'subject',
            parentId: null,
            selectedCurriculum: null
        });
    };

    const toggleExpanded = (key: string) => {
        setExpanded(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleDeleteClick = (idToDelete: number, type: CurriculumType) => {
        setCurriculumToDelete({ id: idToDelete, type });
        setOpenConfirm(true);
    };

    const handleEditClick = (
        curriculum: CurriculumProps | ChapterProps | UnitProps | LessonProps | ChildLessonProps,
        type: CurriculumType,
        parentId: number | null = null
    ) => {
        handleOpenForm(type, parentId, curriculum as CurriculumProps);
    };

    const { data, isLoading } = useGetAllCurriculumQuery(
        { ...qp, id: Number(id) },
        { skip: !id }
    );
    const [deleteCurriculum, { isLoading: isDeleting }] = useDeleteCourseCurriculumMutation();
    const curriculumns = data?.data?.data || [];
    const pagination = data?.data?.pagination;

    const handleDelete = async () => {
        if (!curriculumToDelete) return;

        try {
            const response = await deleteCurriculum({
                id: Number(id),
                type: curriculumToDelete.type,
                idToDelete: curriculumToDelete.id
            }).unwrap();

            dispatch(
                showToast({
                    message: response.message || "Curriculum Deleted Successfully",
                    severity: "success"
                })
            );
            setOpenConfirm(false);
            setCurriculumToDelete(null);
        } catch (e: any) {
            dispatch(
                showToast({
                    message: e?.data?.message || "Unable to Delete Curriculum",
                    severity: "error"
                })
            );
        }
    };

    return (
        <div className="course__curriculum__root">
            {!isLoading && !curriculumns.length ? (
                <EmptyRoute
                    icon={(
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M29.3333 6.46658V22.3199C29.3333 23.6132 28.28 24.7999 26.9867 24.9599L26.5733 25.0132C24.3867 25.3066 21.3067 26.2132 18.8267 27.2532C17.96 27.6132 17 26.9599 17 26.0132V7.46658C17 6.97324 17.28 6.51991 17.72 6.27991C20.16 4.95991 23.8533 3.78658 26.36 3.57324H26.44C28.04 3.57324 29.3333 4.86658 29.3333 6.46658Z" fill="#1D82F5" />
                            <path d="M14.28 6.27991C11.84 4.95991 8.14665 3.78658 5.63999 3.57324H5.54665C3.94665 3.57324 2.65332 4.86658 2.65332 6.46658V22.3199C2.65332 23.6132 3.70665 24.7999 4.99999 24.9599L5.41332 25.0132C7.59999 25.3066 10.68 26.2132 13.16 27.2532C14.0267 27.6132 14.9867 26.9599 14.9867 26.0132V7.46658C14.9867 6.95991 14.72 6.51991 14.28 6.27991ZM6.66665 10.3199H9.66665C10.2133 10.3199 10.6667 10.7732 10.6667 11.3199C10.6667 11.8799 10.2133 12.3199 9.66665 12.3199H6.66665C6.11999 12.3199 5.66665 11.8799 5.66665 11.3199C5.66665 10.7732 6.11999 10.3199 6.66665 10.3199ZM10.6667 16.3199H6.66665C6.11999 16.3199 5.66665 15.8799 5.66665 15.3199C5.66665 14.7732 6.11999 14.3199 6.66665 14.3199H10.6667C11.2133 14.3199 11.6667 14.7732 11.6667 15.3199C11.6667 15.8799 11.2133 16.3199 10.6667 16.3199Z" fill="#1D82F5" />
                        </svg>
                    )}
                    title="No Subject found"
                    message="Oops your curriculum is empty. Please add curriculum to help student gain knowlegde."
                    cta={{
                        label: "Add Subject",
                        url: ""
                    }}
                    handleClick={() => handleOpenForm('subject')}
                />
            ) : (
                <>
                    <div className="flex flex-col gap-4">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, index) => (
                                <Box className="w-full" key={index.toString()}>
                                    <Skeleton className="rounded-md py-5 px-6" />
                                </Box>
                            ))
                        )
                            : curriculumns.map((subject: SubjectProps) => {
                                const subjectKey = `subject-${subject.id}`;

                                return (
                                    <Box
                                        key={subject.id}
                                        sx={{
                                            background: theme.palette.textField.border,
                                            border: `1px solid ${theme.palette.gray.gray2}`
                                        }}
                                        className="rounded-md py-5 px-6"
                                    >
                                        <div
                                            className="curriculum__header flex justify-between cursor-pointer"
                                            onClick={() => toggleExpanded(subjectKey)}
                                        >
                                            <div className="flex header_title gap-2 items-center">
                                                <Typography variant="h6">{subject.name}</Typography>
                                                <CustomCollapseIcon isOpen={expanded[subjectKey]} />
                                            </div>
                                            <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                                <ActionIconVisible
                                                    onDelete={() => subject.id && handleDeleteClick(subject.id, 'subject')}
                                                    onEdit={() => handleEditClick(subject, 'subject')}
                                                />
                                            </div>
                                        </div>

                                        <Collapse in={expanded[subjectKey]} timeout="auto" unmountOnExit>
                                            <div className="curriculum__content">
                                                <Divider />
                                                <div className="curriculum__description general__content">
                                                    {renderHtml(subject.description)}
                                                </div>
                                                <Button
                                                    variant="contained"
                                                    className="black__btn my-6!"
                                                    startIcon={<Add />}
                                                    onClick={() => handleOpenForm('chapter', subject.id)}
                                                >
                                                    Add Chapter
                                                </Button>

                                                {/* Chapters */}
                                                {subject?.chapters?.map((chapter: ChapterProps) => (
                                                    <CurriculumItem
                                                        key={chapter.id}
                                                        item={chapter}
                                                        itemType="chapter"
                                                        isExpanded={expanded[`chapter-${chapter.id}`] || false}
                                                        onToggle={() => toggleExpanded(`chapter-${chapter.id}`)}
                                                        onEdit={() => handleEditClick(chapter, 'chapter', subject.id)}
                                                        onDelete={() => chapter.id && handleDeleteClick(chapter.id, 'chapter')}
                                                        onAddChild={() => handleOpenForm('unit', chapter.id)}
                                                        addChildLabel="Add Unit"
                                                        backgroundColor="white"
                                                    >
                                                        {/* Units */}
                                                        {chapter?.units?.map((unit: UnitProps) => (
                                                            <CurriculumItem
                                                                key={unit.id}
                                                                item={unit}
                                                                itemType="unit"
                                                                isExpanded={expanded[`unit-${unit.id}`] || false}
                                                                onToggle={() => toggleExpanded(`unit-${unit.id}`)}
                                                                onEdit={() => handleEditClick(unit, 'unit', chapter.id)}
                                                                onDelete={() => unit.id && handleDeleteClick(unit.id, 'unit')}
                                                                onAddChild={() => handleOpenForm('lesson', unit.id)}
                                                                addChildLabel="Add Lesson"
                                                                backgroundColor="#e5e7eb"
                                                            >
                                                                {/* Lessons */}
                                                                {unit?.lessons?.map((lesson: LessonProps) => (
                                                                    <CurriculumItem
                                                                        key={lesson.id}
                                                                        item={lesson}
                                                                        itemType="lesson"
                                                                        isExpanded={expanded[`lesson-${lesson.id}`] || false}
                                                                        onToggle={() => toggleExpanded(`lesson-${lesson.id}`)}
                                                                        onEdit={() => handleEditClick(lesson, 'lesson', unit.id)}
                                                                        onDelete={() => lesson.id && handleDeleteClick(lesson.id, 'lesson')}
                                                                        onAddChild={() => handleOpenForm('child_lesson', lesson.id)}
                                                                        addChildLabel="Add Child Lesson"
                                                                        backgroundColor="white"
                                                                    >
                                                                        {/* Child Lessons */}
                                                                        {lesson?.child_lessons?.map((child: ChildLessonProps) => (
                                                                            <CurriculumItem
                                                                                key={child.id}
                                                                                item={child}
                                                                                itemType="child_lesson"
                                                                                isExpanded={expanded[`child-lesson-${child.id}`] || false}
                                                                                onToggle={() => toggleExpanded(`child-lesson-${child.id}`)}
                                                                                onEdit={() => handleEditClick(child, 'child_lesson', lesson.id)}
                                                                                onDelete={() => child.id && handleDeleteClick(child.id, 'child_lesson')}
                                                                                backgroundColor="#f3f4f6"
                                                                            />
                                                                        ))}
                                                                    </CurriculumItem>
                                                                ))}
                                                            </CurriculumItem>
                                                        ))}
                                                    </CurriculumItem>
                                                ))}
                                            </div>
                                        </Collapse>
                                    </Box>
                                );
                            })}
                    </div>

                    {curriculumns.length > 0 && (
                        <Button
                            variant="text"
                            color="primary"
                            className="items-center! font-medium!"
                            onClick={() => handleOpenForm('subject')}
                            startIcon={<Add />}
                        >
                            Add More Subject
                        </Button>
                    )}

                    <TablePagination
                        qp={qp}
                        setQp={setQp}
                        totalPages={pagination?.total_pages || 0}
                    />
                </>
            )}

            <CurriculumFormWithMedia
                open={formState.open}
                setOpen={(value) => value ? setFormState({ ...formState, open: true }) : handleCloseForm()}
                curriculumType={formState.type}
                parentId={formState.parentId}
                selectedCurriculum={formState.selectedCurriculum}
            />

            <ConfirmationDialog
                open={openConfirm}
                setOpen={setOpenConfirm}
                onSave={handleDelete}
                title="Delete Curriculum"
                description="Are you sure you want to delete this curriculum? This action cannot be undone."
                isLoading={isDeleting}
            />
        </div>
    );
}