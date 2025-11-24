import { Dialog, DialogContent, useTheme } from "@mui/material";
import { useState } from "react";
import type { QuestionProps } from "../../../../types/question";
import MediaFileDragDrop from "../../../molecules/MediaFileDragDrop";
import TabController from "../../../molecules/TabController";
import QuestionManagementForm from "./QuestionManagementForm";

export interface Props {
    open: boolean;
    setOpen: (newValue: boolean) => void;
    editData?: QuestionProps | null;
}

export default function QuestionManagementModal({ open, setOpen, editData }: Props) {
    const [activeTab, setActiveTab] = useState("upload");
    const theme = useTheme();

    useState(() => {
        if (editData) {
            setActiveTab("add");
        }
    });

    const handleClose = () => {
        setOpen(false);
        if (!editData) {
            setActiveTab("upload");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            sx={{
                "& .MuiPaper-root": {
                    minWidth: {
                        md: "664px",
                        xl: "1266px"
                    }
                },
            }}
        >
            <DialogContent sx={{
                background: theme.palette.primary.contrastText
            }}>
                {!editData && (
                    <TabController
                        options={[
                            { label: "Upload Questions", value: "upload" },
                            { label: "Add Question", value: "add" }
                        ]}
                        setActiveTab={setActiveTab}
                        currentActive={activeTab}
                    />
                )}

                {activeTab === "upload" && !editData && (
                    <MediaFileDragDrop type="notes" maxSize={20} />
                )}

                {(activeTab === "add" || editData) && (
                    <QuestionManagementForm
                        open={open}
                        setOpen={setOpen}
                        editData={editData}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}