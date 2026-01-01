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
        try {
            await navigator.clipboard.writeText(otp);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
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
                    overflow: 'visible'
                }
            }}
        >
            {/* Close Button */}
            <IconButton
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                    '&:hover': {
                        bgcolor: alpha(theme.palette.grey[500], 0.1)
                    }
                }}
            >
                <CloseCircle size={20} />
            </IconButton>

            {/* Header */}
            <DialogTitle sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
                <Typography variant="h5" fontWeight={700} mb={1}>
                    User OTP Code
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Use this code to verify your identity
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ pb: 4, px: 3 }}>
                <Stack spacing={3} flexDirection={"column"}>
                    <Box
                        sx={{
                            position: 'relative',
                            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                            border: `2px solid ${theme.palette.grey[300]}`,
                            borderRadius: 2,
                            p: 3,
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                                borderColor: theme.palette.primary.main,
                                transform: 'scale(1.02)',
                                boxShadow: theme.shadows[4]
                            }
                        }}
                        onClick={handleCopy}
                    >
                        <Typography
                            variant="h3"
                            fontWeight={700}
                            letterSpacing={4}
                            sx={{
                                fontFamily: 'monospace',
                                color: theme.palette.grey[900],
                                userSelect: 'all'
                            }}
                        >
                            {otp}
                        </Typography>

                        {/* Copy indicator overlay */}
                        <Fade in={copied}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: alpha(theme.palette.success.main, 0.95),
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    gap: 1
                                }}
                            >
                                <TickCircle size={40} color="#fff" variant="Bold" />
                                <Typography variant="body1" fontWeight={600} color="white">
                                    Copied!
                                </Typography>
                            </Box>
                        </Fade>
                    </Box>

                    {/* Copy Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={copied ? <TickCircle size={20} variant="Bold" /> : <Copy size={20} />}
                        onClick={handleCopy}
                        sx={{
                            background: copied
                                ? theme.palette.success.main
                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: 16,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: copied
                                    ? theme.palette.success.dark
                                    : 'linear-gradient(135deg, #5568d3 0%, #6941a5 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: theme.shadows[8]
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