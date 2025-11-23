import { Dialog, DialogContent } from "@mui/material";
import FooterAction from "../../../molecules/FooterAction";

export interface Props {
    open: boolean;
    setOpen: (newValue: boolean) => void;
}

export default function QuizManagementFrom({ open, setOpen }: Props) {
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogContent>

                <FooterAction
                    handleComfirmationChange={() => setOpen(false)}
                    isLoading={false}
                    isUpdating={false}
                    isEditMode={false}
                    buttonLabel="Quiz"
                />
            </DialogContent>
        </Dialog>
    )
}
