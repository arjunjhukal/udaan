import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

export const YesNoSwitch = styled(Switch)(({ theme }) => ({
    width: 60,
    height: 30,
    padding: 0,
    display: "flex",
    "& .MuiSwitch-switchBase": {
        padding: 2,
        "&.Mui-checked": {
            transform: "translateX(30px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
                backgroundColor: theme.palette.success.main,
                opacity: 1,
            },
        },
    },

    "& .MuiSwitch-thumb": {
        width: 26,
        height: 26,
        borderRadius: "50%",
        backgroundColor: "#fff",
    },

    "& .MuiSwitch-track": {
        borderRadius: 30,
        backgroundColor: "#A3A7AD", // grey bg like screenshot
        opacity: 1,
        position: "relative",
        transition: theme.transitions.create(["background-color"]),
    },

    // YES / NO Text
    "& .MuiSwitch-track:before": {
        content: '"NO"',
        position: "absolute",
        left: 32,
        top: "50%",
        transform: "translateY(-50%)",
        color: "#fff",
        fontSize: "12px",
        fontWeight: 600,
    },
    "& .Mui-checked + .MuiSwitch-track:before": {
        content: '"YES"',
        left: 8,
    },
}));
