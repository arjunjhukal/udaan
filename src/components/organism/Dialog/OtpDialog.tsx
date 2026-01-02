import {
    alpha,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Fade,
    IconButton,
    Stack,
    Typography,
    useTheme
} from '@mui/material';
import { CloseCircle, Copy, TickCircle } from 'iconsax-reactjs';
import { useState } from 'react';

interface OtpDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    otp: string;
}

export default function OtpDialog({ open, setOpen, otp }: OtpDialogProps) {
    const theme = useTheme();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(otp);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClose = () => {
        setOpen(false);
        setCopied(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    bgcolor: theme.palette.background.paper,
                }
            }}
        >
            {/* Close */}
            <IconButton
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.text.middle,
                    '&:hover': {
                        bgcolor: alpha(theme.palette.text.middle, 0.1)
                    }
                }}
            >
                <CloseCircle size={20} />
            </IconButton>

            {/* Header */}
            <DialogTitle sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
                <Typography variant="h5" fontWeight={700}>
                    User OTP Code
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Use this code to verify your identity
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ pb: 4, px: 3 }}>
                <Stack spacing={3} flexDirection="column">
                    {/* OTP Box */}
                    <Box
                        onClick={handleCopy}
                        sx={{
                            position: 'relative',
                            bgcolor: theme.palette.gray.gray1,
                            border: `2px solid ${theme.palette.separator.dark}`,
                            borderRadius: 2,
                            p: 3,
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease',

                            '&:hover': {
                                borderColor: theme.palette.primary.main,
                                boxShadow: theme.shadows[4],
                                transform: 'scale(1.02)'
                            }
                        }}
                    >
                        <Typography
                            variant="h3"
                            fontWeight={700}
                            letterSpacing={4}
                            sx={{
                                fontFamily: 'monospace',
                                color: theme.palette.text.dark,
                                userSelect: 'all'
                            }}
                        >
                            {otp}
                        </Typography>

                        {/* Copied Overlay */}
                        <Fade in={copied}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    bgcolor: alpha(theme.palette.success.main, 0.95),
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    gap: 1
                                }}
                            >
                                <TickCircle size={40} variant="Bold" color="white" />
                                <Typography fontWeight={600} color="white">
                                    Copied!
                                </Typography>
                            </Box>
                        </Fade>
                    </Box>

                    {/* Copy Button */}
                    <Button
                        fullWidth
                        size="large"
                        startIcon={
                            copied
                                ? <TickCircle size={20} variant="Bold" />
                                : <Copy size={20} />
                        }
                        onClick={handleCopy}
                        sx={{
                            bgcolor: copied
                                ? theme.palette.success.main
                                : theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            fontSize: 16,

                            '&:hover': {
                                bgcolor: copied
                                    ? theme.palette.success.dark
                                    : theme.palette.primary.hover,
                                boxShadow: theme.shadows[8],
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        {copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
