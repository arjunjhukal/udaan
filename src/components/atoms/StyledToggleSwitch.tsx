import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";

interface StyledToggleButtonsProps {
    value: string;
    onChange: (event: React.MouseEvent<HTMLElement>, newValue: string | null) => void;
    leftLabel?: string;
    rightLabel?: string;
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    backgroundColor: theme.palette.seperator.dark,
    borderRadius: "8px",
    padding: "4px",
    gap: "4px",
    "& .MuiToggleButtonGroup-grouped": {
        border: 0,
        borderRadius: "6px !important",
        margin: 0,
        "&:not(:first-of-type)": {
            marginLeft: 0,
        },
    },
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
    padding: "8px 24px",
    fontSize: "14px",
    fontWeight: 500,
    textTransform: "none",
    color: "#6B7280",
    backgroundColor: "transparent",
    transition: "all 0.2s ease",
    "&.Mui-selected": {
        backgroundColor: theme.palette.primary.black,
        color: theme.palette.primary.contrastText,

    },
}));

export default function StyledToggleButtons({
    value,
    onChange,
    leftLabel = "Import Test",
    rightLabel = "Add Questions",
}: StyledToggleButtonsProps) {
    return (
        <StyledToggleButtonGroup
            value={value}
            exclusive
            onChange={onChange}
            aria-label="toggle options"
        >
            <StyledToggleButton value="left" aria-label={leftLabel}>
                {leftLabel}
            </StyledToggleButton>
            <StyledToggleButton value="right" aria-label={rightLabel}>
                {rightLabel}
            </StyledToggleButton>
        </StyledToggleButtonGroup>
    );
}

