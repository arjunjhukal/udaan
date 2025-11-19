import { Add } from "@mui/icons-material";
import { Box, Button, Collapse, Divider, Typography, useTheme } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { useGetAllCurriculumQuery } from "../../../../../../services/courseApi";
import { renderHtml } from "../../../../../../utils/renderHtml";
import CustomCollapseIcon from "../../../../../atoms/CustomCollapseIcon";
import ActionIconVisible from "../../../../../molecules/Action/ActionIconVisible";
import TablePagination from "../../../../../molecules/Table/Pagination";
import EmptyRoute from "../../../../../organism/EmptyRoute";
import CurriculumFormWithMedia from "./CurriculumFormWithMedia";

type CurriculumType = "subject" | "chapter" | "unit" | "lesson" | "child_lesson";

interface FormState {
    open: boolean;
    type: CurriculumType;
    parentId: number | null;
}

export default function CourseCurriculumForm() {
    const [formState, setFormState] = React.useState<FormState>({
        open: false,
        type: 'subject',
        parentId: null
    });

    // Track which curriculum items are expanded
    const [expanded, setExpanded] = React.useState<{ [key: string]: boolean }>({});

    const theme = useTheme();
    const { id } = useParams();
    const [qp, setQp] = React.useState({
        pageIndex: 1,
        pageSize: 8
    })

    const handleOpenForm = (type: CurriculumType, parentId: number | null = null) => {
        setFormState({
            open: true,
            type,
            parentId
        });
    }

    const handleCloseForm = () => {
        setFormState({
            open: false,
            type: 'subject',
            parentId: null
        });
    }

    const toggleExpanded = (key: string) => {
        setExpanded(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    }

    const { data, isLoading } = useGetAllCurriculumQuery({ ...qp, id: Number(id) }, { skip: !id })
    const curriculumns = data?.data?.data || [];
    const pagination = data?.data?.pagination;

    return (
        <div className="course__curriculum__root">
            {!isLoading && !curriculumns.length ? <EmptyRoute
                icon={(<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            /> : (
                <>
                    <div className="flex flex-col gap-4">
                        {curriculumns.map((subject) => {
                            const subjectKey = `subject-${subject.id}`;
                            const chapterKey = `chapter-${subject.id}`;
                            const unitKey = `unit-${subject.id}`;
                            const lessonKey = `lesson-${subject.id}`;
                            const childlessonKey = `child-lesson-${subject.id}`;

                            return (
                                <Box key={subject.id}
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
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <ActionIconVisible
                                                onDelete={() => { }}
                                                onEdit={() => { }}
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

                                            {/* Chapter Level */}
                                            <div className="curriculum__content py-5 px-6 rounded-2xl bg-white">
                                                <div
                                                    className="curriculum__header flex justify-between cursor-pointer"
                                                    onClick={() => toggleExpanded(chapterKey)}
                                                >
                                                    <div className="flex header_title gap-2 items-center">
                                                        <Typography variant="h6">Chapter Name</Typography>
                                                        <CustomCollapseIcon isOpen={expanded[chapterKey]} />
                                                    </div>
                                                    <div onClick={(e) => e.stopPropagation()}>
                                                        <ActionIconVisible
                                                            onDelete={() => { }}
                                                            onEdit={() => { }}
                                                        />
                                                    </div>
                                                </div>


                                                <Collapse in={expanded[chapterKey]} timeout="auto" unmountOnExit>
                                                    <Divider className="mb-4" />
                                                    <div className="curriculum__description general__content">
                                                        {renderHtml(subject.description)}
                                                    </div>
                                                    <Button
                                                        variant="contained"
                                                        className="black__btn my-6!"
                                                        startIcon={<Add />}
                                                        onClick={() => handleOpenForm('unit', subject.id)}
                                                    >
                                                        Add Unit
                                                    </Button>

                                                    {/* Unit Level */}
                                                    <div className="curriculum__content py-5 px-6 rounded-2xl bg-gray-200">
                                                        <div
                                                            className="curriculum__header flex justify-between cursor-pointer"
                                                            onClick={() => toggleExpanded(unitKey)}
                                                        >
                                                            <div className="flex header_title gap-2 items-center">
                                                                <Typography variant="h6">Unit Name</Typography>
                                                                <CustomCollapseIcon isOpen={expanded[unitKey]} />
                                                            </div>
                                                            <div onClick={(e) => e.stopPropagation()}>
                                                                <ActionIconVisible
                                                                    onDelete={() => { }}
                                                                    onEdit={() => { }}
                                                                />
                                                            </div>
                                                        </div>


                                                        <Collapse in={expanded[unitKey]} timeout="auto" unmountOnExit>
                                                            <Divider className="mb-4" />
                                                            <div className="curriculum__description general__content">
                                                                {renderHtml(subject.description)}
                                                            </div>
                                                            <Button
                                                                variant="contained"
                                                                className="black__btn my-6!"
                                                                startIcon={<Add />}
                                                                onClick={() => handleOpenForm('lesson', subject.id)}
                                                            >
                                                                Add Lesson
                                                            </Button>

                                                            {/* Lesson Level */}
                                                            <div className="curriculum__content py-5 px-6 rounded-2xl bg-white">
                                                                <div
                                                                    className="curriculum__header flex justify-between cursor-pointer"
                                                                    onClick={() => toggleExpanded(lessonKey)}
                                                                >
                                                                    <div className="flex header_title gap-2 items-center">
                                                                        <Typography variant="h6">Lesson Name</Typography>
                                                                        <CustomCollapseIcon isOpen={expanded[lessonKey]} />
                                                                    </div>
                                                                    <div onClick={(e) => e.stopPropagation()}>
                                                                        <ActionIconVisible
                                                                            onDelete={() => { }}
                                                                            onEdit={() => { }}
                                                                        />
                                                                    </div>
                                                                </div>


                                                                <Collapse in={expanded[lessonKey]} timeout="auto" unmountOnExit>
                                                                    <Divider className="mb-4" />
                                                                    <div className="curriculum__description general__content">
                                                                        {renderHtml(subject.description)}
                                                                    </div>
                                                                    <Button
                                                                        variant="contained"
                                                                        className="black__btn my-6!"
                                                                        startIcon={<Add />}
                                                                        onClick={() => handleOpenForm('child_lesson', subject.id)}
                                                                    >
                                                                        Add Child Lesson
                                                                    </Button>
                                                                    <div className="curriculum__content py-5 px-6 rounded-2xl bg-gray-100">
                                                                        <div
                                                                            className="curriculum__header flex justify-between cursor-pointer"
                                                                            onClick={() => toggleExpanded(childlessonKey)}
                                                                        >
                                                                            <div className="flex header_title gap-2 items-center">
                                                                                <Typography variant="h6">Lesson Name</Typography>
                                                                                <CustomCollapseIcon isOpen={expanded[childlessonKey]} />
                                                                            </div>
                                                                            <div onClick={(e) => e.stopPropagation()}>
                                                                                <ActionIconVisible
                                                                                    onDelete={() => { }}
                                                                                    onEdit={() => { }}
                                                                                />
                                                                            </div>

                                                                        </div>

                                                                        <Collapse in={expanded[childlessonKey]} timeout="auto" unmountOnExit>
                                                                            <Divider className="mb-4" />
                                                                            <div className="curriculum__description general__content">
                                                                                {renderHtml(subject.description)}
                                                                            </div>

                                                                        </Collapse>
                                                                    </div>
                                                                </Collapse>
                                                            </div>
                                                        </Collapse>
                                                    </div>
                                                </Collapse>
                                            </div>
                                        </div>
                                    </Collapse>
                                </Box>
                            );
                        })}
                    </div>
                    {curriculumns.length > 0 ? (
                        <Button
                            variant="text"
                            color="primary"
                            className="items-center!"
                            onClick={() => handleOpenForm('subject')}
                            startIcon={<Add />}
                        >
                            Add More Subject
                        </Button>
                    ) : ""}
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
            />
        </div>
    )
}