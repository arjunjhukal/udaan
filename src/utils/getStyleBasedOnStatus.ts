import { useTheme } from "@mui/material";

export const getStatusStyle = (status: "ongoing" | "upcoming" | "ended") => {
    const theme = useTheme();
    switch (status) {
        case "ongoing":
            return {
                backgroundColor: theme.palette.success.light,
                color: theme.palette.success.dark
            };
        case "upcoming":
            return {
                backgroundColor: theme.palette.info.light,
                color: theme.palette.info.dark,
            };
        case "ended":
            return {
                backgroundColor: theme.palette.error.light,
                color: theme.palette.error.dark,
            };
        default:
            return {
                backgroundColor: theme.palette.separator.dark,
                color: theme.palette.text.dark,
            };
    }
};