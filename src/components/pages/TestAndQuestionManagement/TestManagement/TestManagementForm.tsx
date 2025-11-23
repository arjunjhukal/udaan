import { Dialog, DialogContent } from "@mui/material";
import FooterAction from "../../../molecules/FooterAction";
import MediaFileDragDrop from "../../../molecules/MediaFileDragDrop";

export interface Props {
    open: boolean;
    setOpen: (newValue: boolean) => void;
}
export default function TestManagementForm({ open, setOpen }: Props) {
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogContent>
                <MediaFileDragDrop type="notes" />
                <FooterAction
                    handleComfirmationChange={() => setOpen(false)}
                    isLoading={false}
                    isUpdating={false}
                    isEditMode={false}
                    buttonLabel="Test"
                />
            </DialogContent>
        </Dialog>
    )
}

