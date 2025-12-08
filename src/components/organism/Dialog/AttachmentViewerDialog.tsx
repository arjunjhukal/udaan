import { Dialog, DialogContent, IconButton } from '@mui/material';
import { hideAttachment } from '../../../slice/attachmentSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hook';

export default function AttachmentViewerDialog() {
    const dispatch = useAppDispatch();
    const { open, url } = useAppSelector((state) => state.attachment)
    const handleClose = () => {
        dispatch(
            hideAttachment()
        )
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xl"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        background: "rgba(0, 0, 0, 0)",
                        boxShadow: "none",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                        p: 0,
                    },
                },
                backdrop: {
                    sx: {
                        backgroundColor: "rgba(0,0,0,0.1)",
                    },
                },
            }}
        >
            <DialogContent
                sx={{
                    position: "relative",
                    p: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <IconButton onClick={handleClose} className="absolute! right-4 top-4">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.492 1.66675H6.50866C3.47533 1.66675 1.66699 3.47508 1.66699 6.50841V13.4834C1.66699 16.5251 3.47533 18.3334 6.50866 18.3334H13.4837C16.517 18.3334 18.3253 16.5251 18.3253 13.4917V6.50841C18.3337 3.47508 16.5253 1.66675 13.492 1.66675ZM12.8003 11.9167C13.042 12.1584 13.042 12.5584 12.8003 12.8001C12.6753 12.9251 12.517 12.9834 12.3587 12.9834C12.2003 12.9834 12.042 12.9251 11.917 12.8001L10.0003 10.8834L8.08366 12.8001C7.95866 12.9251 7.80033 12.9834 7.64199 12.9834C7.48366 12.9834 7.32533 12.9251 7.20033 12.8001C6.95866 12.5584 6.95866 12.1584 7.20033 11.9167L9.11699 10.0001L7.20033 8.08341C6.95866 7.84175 6.95866 7.44175 7.20033 7.20008C7.44199 6.95842 7.84199 6.95842 8.08366 7.20008L10.0003 9.11675L11.917 7.20008C12.1587 6.95842 12.5587 6.95842 12.8003 7.20008C13.042 7.44175 13.042 7.84175 12.8003 8.08341L10.8837 10.0001L12.8003 11.9167Z" fill="#E21D48" />
                    </svg>
                </IconButton>
                <img src={url} alt="" />
            </DialogContent>
        </Dialog>
    )
}
