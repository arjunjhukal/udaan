
import { Dialog, DialogContent, useTheme } from "@mui/material";
import { useState } from "react";
import MediaFileDragDrop from "../../../molecules/MediaFileDragDrop";
import TabController from "../../../molecules/TabController";
import QuestionManagementForm from "./QuestionManagementForm";

export interface Props {
    open: boolean;
    setOpen: (newValue: boolean) => void;
}
export default function QuestionManagementModal({ open, setOpen }: Props) {
    const [activeTab, setActiveTab] = useState("upload");
    const theme = useTheme();
    return (
        <Dialog open={open} onClose={() => setOpen(false)}
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
                <TabController
                    options={[{ label: "Upload Questions", value: "upload" }, { label: "Add Question", value: "add" },]}
                    setActiveTab={setActiveTab}
                    currentActive={activeTab}
                />
                {activeTab === "upload" ? <MediaFileDragDrop type="notes" maxSize={20} /> : ""}
                {activeTab === "add" ? <QuestionManagementForm open={open} setOpen={setOpen}/> : ""}


            </DialogContent>
        </Dialog>
    )
}
