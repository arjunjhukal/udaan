import { Add } from "@mui/icons-material";
import { Button, Collapse, Divider, Typography } from "@mui/material";
import React from "react";
import type { ChapterProps, ChildLessonProps, LessonProps, SubjectProps, UnitProps } from "../../../types/course";
import { renderHtml } from "../../../utils/renderHtml";
import CustomCollapseIcon from "../../atoms/CustomCollapseIcon";
import ActionIconVisible from "../../molecules/Action/ActionIconVisible";
import type { CurriculumType } from "../../pages/CourseManagement/createCourse/CourseSubFields/Curriculum";

interface CurriculumItemProps {
    item: SubjectProps | ChapterProps | UnitProps | LessonProps | ChildLessonProps;
    itemType: CurriculumType;
    isExpanded: boolean;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onAddChild?: () => void;
    addChildLabel?: string;
    backgroundColor?: string;
    children?: React.ReactNode;
}

export default function CurriculumItem({
    item,
    itemType,
    isExpanded,
    onToggle,
    onEdit,
    onDelete,
    onAddChild,
    addChildLabel,
    backgroundColor = "white",
    children
}: CurriculumItemProps) {
    return (
        <div
            className="curriculum__content py-5 px-6 rounded-2xl"
            style={{ backgroundColor }}
        >
            <div
                className="curriculum__header flex justify-between cursor-pointer"
                onClick={onToggle}
            >
                <div className="flex header_title gap-2 items-center">
                    <Typography variant="h6">{item.name}</Typography>
                    <CustomCollapseIcon isOpen={isExpanded} />
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <ActionIconVisible
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                </div>
            </div>

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Divider className="mb-4" />
                <div className="curriculum__description general__content">
                    {renderHtml(item.description)}
                </div>

                {onAddChild && addChildLabel && (
                    <Button
                        variant="contained"
                        className="black__btn my-6!"
                        startIcon={<Add />}
                        onClick={onAddChild}
                    >
                        {addChildLabel}
                    </Button>
                )}

                {children}
            </Collapse>
        </div>
    );
}