import { styled } from "@mui/material/styles";

export const OutlinedTextarea = styled("textarea")(({ theme }) => ({
    ...theme.typography.subtitle1,

    width: "100%",
    minHeight: "120px",
    padding: "16px",
    fontSize: "16px",
    fontWeight: 500,
    borderRadius: "8px",

    border: `1px solid ${theme.palette.textField.border}`,
    backgroundColor: "transparent",
    color: theme.palette.text.primary,

    resize: "vertical",

    "&:hover": {
        borderColor: theme.palette.text.primary,
    },

    "&:focus": {
        outline: "none",
        borderColor: theme.palette.primary.main,
        borderWidth: "2px",
    },

    "&::placeholder": {
        color: theme.palette.text.disabled,
    },

    "&:disabled": {
        backgroundColor: theme.palette.action.disabledBackground,
        cursor: "not-allowed",
    },
}));
