import CloseIcon from "@mui/icons-material/Close";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    IconButton,
    InputLabel,
    OutlinedInput,
    Stack,
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import {
    useCreateTicketTypeMutation,
    useUpdateTicketTypeMutation,
} from "../../../../services/ticketApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import type { TicketTypeProps } from "../../../../types/ticket";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editTarget?: TicketTypeProps | null;
}

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required").max(100, "Max 100 characters"),
});

export default function TicketTypeManagementForm({ open, onClose, onSuccess, editTarget }: Props) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const isEdit = Boolean(editTarget);

    const [createType, { isLoading: isCreating }] = useCreateTicketTypeMutation();
    const [updateType, { isLoading: isUpdating }] = useUpdateTicketTypeMutation();
    const isLoading = isCreating || isUpdating;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: editTarget?.name ?? "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                if (isEdit && editTarget) {
                    await updateType({ id: editTarget.id, name: values.name.trim() }).unwrap();
                    dispatch(showToast({ message: t("messages.ticket_type.updated"), severity: "success" }));
                } else {
                    await createType({ name: values.name.trim() }).unwrap();
                    dispatch(showToast({ message: t("messages.ticket_type.saved"), severity: "success" }));
                }
                formik.resetForm();
                onSuccess();
            } catch {
                dispatch(
                    showToast({
                        message: isEdit
                            ? t("messages.ticket_type.update_error")
                            : t("messages.ticket_type.save_error"),
                        severity: "error",
                    })
                );
            }
        },
    });

    const handleClose = () => {
        if (!isLoading) {
            formik.resetForm();
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    {isEdit ? "Edit Ticket Type" : "New Ticket Type"}
                    <IconButton size="small" onClick={handleClose} disabled={isLoading}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <form onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                    <div className="flex flex-col gap-4">
                        <div>
                            <InputLabel className="required">Name</InputLabel>
                            <OutlinedInput
                                fullWidth
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter ticket type name"
                                autoFocus
                            />
                            {formik.touched.name && formik.errors.name && (
                                <FormHelperText error>{formik.errors.name}</FormHelperText>
                            )}
                        </div>
                    </div>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button variant="outlined" onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading || !formik.isValid || !formik.dirty}
                        startIcon={isLoading ? <CircularProgress size={16} /> : null}
                    >
                        {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
