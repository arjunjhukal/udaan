// MakuraDatePicker.tsx
"use client";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";

interface MakuraDatePickerProps {
    value: Dayjs | null;
    onChange: (newValue: Dayjs | null) => void;
    required?: boolean;
    fullWidth?: boolean;
    placeholder?: string;
}

// Your custom SVG icon
function ArrowDownIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.6 7.45801L11.1667 12.8913C10.525 13.533 9.47499 13.533 8.83333 12.8913L3.39999 7.45801" stroke="#9CA3B0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
}

export default function MakuraDatePicker({
    value,
    onChange,
    required = false,
    fullWidth = true,
    placeholder = "Select date",
}: MakuraDatePickerProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                value={value}
                onChange={onChange}
                format="DD/MM/YYYY"
                slots={{
                    openPickerIcon: ArrowDownIcon,
                }}
                slotProps={{
                    textField: {
                        required,
                        fullWidth,
                        inputProps: {
                            placeholder,
                        },
                        sx: {
                            "& .MuiOutlinedInput-root": {
                                fontSize: "14px",
                                "& fieldset": {
                                    borderColor: "#E5E7EB",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#1D82F5",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#1D82F5",
                                },
                            },
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );
}
