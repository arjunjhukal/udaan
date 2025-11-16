import { Box, Button, Typography, useTheme } from "@mui/material";

interface FooterActionProps {
    handleComfirmationChange: () => void;
    isLoading?: boolean;
    isUpdating?: boolean;
    isEditMode?: boolean;
}

export default function FooterAction({
    handleComfirmationChange,
    isLoading = false,
    isUpdating = false,
    isEditMode = false,
}: FooterActionProps) {
    const theme = useTheme();

    return (
        <Box
            className="footer__action flex justify-end items-center gap-2 pt-6 mt-8 sticky -bottom-5"
            sx={{
                borderTop: `1px solid ${theme.palette.seperator.dark}`,
                background: theme.palette.primary.contrastText,
            }}
        >
            {/* CANCEL BUTTON */}
            <Button
                variant="contained"
                sx={{
                    background: theme.palette.seperator.dark,
                    color: theme.palette.text.middle,
                }}
                onClick={handleComfirmationChange}
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
                            ? "Updating Course"
                            : "Update Course"
                        : isLoading
                            ? "Creating Course"
                            : "Create Course"}
                </Typography>
            </Button>
        </Box>
    );
}
