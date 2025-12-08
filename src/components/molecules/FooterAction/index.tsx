import { Box, Button, Typography, useTheme } from "@mui/material";

interface FooterActionProps {
    handleConfirmationChange: () => void;
    isLoading?: boolean;
    isUpdating?: boolean;
    isEditMode?: boolean;
    buttonLabel?: string;
}

export default function FooterAction({
    handleConfirmationChange,
    isLoading = false,
    isUpdating = false,
    isEditMode = false,
    buttonLabel
}: FooterActionProps) {
    const theme = useTheme();

    return (
        <Box
            className="footer__action flex justify-end items-center gap-2 py-6 mt-8 sticky -bottom-5"
            sx={{
                borderTop: `1px solid ${theme.palette.separator.dark}`,
                background: theme.palette.primary.contrastText,
            }}
        >
            {/* CANCEL BUTTON */}
            <Button
                variant="contained"
                sx={{
                    background: theme.palette.separator.dark,
                    color: theme.palette.text.middle,
                }}
                onClick={handleConfirmationChange}
            >
                Cancel
            </Button>

            {/* CREATE / UPDATE BUTTON */}
            <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading || isUpdating}
            >
                <Typography variant="body2">
                    {isEditMode
                        ? isUpdating
                            ? `Updating ${buttonLabel}`
                            : `Update ${buttonLabel}`
                        : isLoading
                            ? `Creating ${buttonLabel}`
                            : `Create ${buttonLabel}`}
                </Typography>
            </Button>
        </Box>
    );
}
