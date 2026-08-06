import {
    alpha,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    OutlinedInput,
    Stack,
    Typography,
    useTheme
} from '@mui/material';
import { CloseCircle, Copy, Facebook, TickCircle } from 'iconsax-reactjs';
import { useEffect, useState } from 'react';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    link: string;
    title?: string;
    description?: string;
}

export default function ShareLinkDialog({ open, setOpen, link, title = "Share Test", description = "Anyone with this link can open the test." }: Props) {
    const theme = useTheme();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timer = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(timer);
    }, [copied]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    };

    const handleFacebookShare = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
            '_blank',
            'width=600,height=600'
        );
    };

    const handleClose = () => {
        setOpen(false);
        setCopied(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    bgcolor: theme.palette.background.paper,
                }
            }}
        >
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

            <DialogTitle sx={{ pt: 4, pb: 2 }}>
                <Typography variant="h5" fontWeight={700}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ pb: 4, px: 3 }}>
                <Stack spacing={2} flexDirection="column">
                    <Box className="flex items-center gap-2">
                        <OutlinedInput
                            fullWidth
                            readOnly
                            value={link}
                            onFocus={(e) => e.currentTarget.select()}
                            sx={{ borderRadius: 2, bgcolor: theme.palette.gray.gray1 }}
                        />
                        <Button
                            onClick={handleCopy}
                            startIcon={copied ? <TickCircle size={20} variant="Bold" /> : <Copy size={20} />}
                            sx={{
                                flexShrink: 0,
                                px: 2.5,
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                bgcolor: copied ? theme.palette.success.main : theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                '&:hover': {
                                    bgcolor: copied ? theme.palette.success.dark : theme.palette.primary.hover,
                                }
                            }}
                        >
                            {copied ? 'Copied' : 'Copy'}
                        </Button>
                    </Box>

                    <Button
                        fullWidth
                        size="large"
                        onClick={handleFacebookShare}
                        startIcon={<Facebook size={20} variant="Bold" />}
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            bgcolor: '#1877F2',
                            color: '#FFFFFF',
                            '&:hover': {
                                bgcolor: '#0F5FCC',
                            }
                        }}
                    >
                        Share to Facebook
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
