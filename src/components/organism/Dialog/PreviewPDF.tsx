"use client";

import { Button, Dialog, DialogContent, IconButton, Typography } from "@mui/material";
import { CloseCircle, Status } from "iconsax-reactjs";
import { useDispatch, useSelector } from "react-redux";
import { useUseChangeMediaStatusMutation } from "../../../services/mediaApi";
import { closePreviewPdf } from "../../../slice/previewPdfSlice";
import { showToast } from "../../../slice/toastSlice";
import type { RootState } from "../../../store/store";

export default function PreviewPDF() {
    const dispatch = useDispatch();
    const { open, mediaUrl, mediaName, mediaId } = useSelector(
        (state: RootState) => state.previewPdf
    );

    const [changeStatus] = useUseChangeMediaStatusMutation();

    const handleMediaStatusChange = async () => {
        try {
            const response = await changeStatus({
                media_ids: [Number(mediaId)]
            }).unwrap();
            dispatch(
                showToast({
                    messsage: response?.message || "Media Availabe For Download Successfully",
                    severity: "success"
                })
            )
        }
        catch (e: any) {
            dispatch(
                showToast({
                    messsage: e?.data?.message || "Unable to mark media for Download",
                    severity: "error"
                })
            )
        }
    }


    return (
        <Dialog
            open={open}
            onClose={() => dispatch(closePreviewPdf())}
            maxWidth="lg"
            fullWidth
        >
            <DialogContent sx={{ position: "relative", height: "80vh" }}>
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6" className="capitalize" fontWeight={"600"}>{mediaName}</Typography>
                    <IconButton
                        color="error"
                        onClick={() => dispatch(closePreviewPdf())}
                    >
                        <CloseCircle variant="Bold" />
                    </IconButton>
                </div>

                {mediaUrl && (
                    <iframe
                        src={`${mediaUrl}#toolbar=0`}
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                    />
                )}

                <div className="text-end mt-4 flex gap-2 justify-end">
                    <Button
                        sx={{
                            background: (theme) => theme.palette.separator.dark,
                            color: (theme) => theme.palette.text.middle,
                        }}
                        variant="contained"
                        onClick={() => dispatch(closePreviewPdf())}
                    >
                        <Typography variant="subtitle1" color="text.dark">Cancel</Typography>
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!mediaId}
                        onClick={handleMediaStatusChange} startIcon={<Status />} sx={{
                            border: (theme) => `1px solid ${theme.palette.separator.dark}`
                        }}
                    >
                        <Typography variant="subtitle1" >{"Mark Downloadable"}</Typography>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}