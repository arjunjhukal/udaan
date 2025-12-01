"use client";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";

interface MakuraDatePickerProps {
    value: Dayjs | null;
    onChange: (newValue: Dayjs | null) => void;
    required?: boolean;
    fullWidth?: boolean;
    placeholder?: string;
    includeTime?: boolean;
    format?: string;
    minDate?: Dayjs | null; // New prop for minimum date
    error?: boolean; // For error state
}

// Your custom SVG icon
function ArrowDownIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.6 7.45801L11.1667 12.8913C10.525 13.533 9.47499 13.533 8.83333 12.8913L3.39999 7.45801" stroke="#9CA3B0" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function MakuraDatePicker({
    value,
    onChange,
    required = false,
    fullWidth = true,
    placeholder = "Select date",
    includeTime = false,
    format,
    minDate,
    error = false,
}: MakuraDatePickerProps) {
    // Determine format based on whether time is included
    const displayFormat = format || (includeTime ? "YYYY/MM/DD hh:mm A" : "YYYY/MM/DD");

    const commonProps = {
        value,
        onChange,
        format: displayFormat,
        minDate: minDate || undefined,
        slots: {
            openPickerIcon: ArrowDownIcon,
        },
        slotProps: {
            textField: {
                required,
                fullWidth,
                error,
                inputProps: {
                    placeholder,
                },
                sx: {
                    "& .MuiOutlinedInput-root": {
                        fontSize: "14px",
                        "& fieldset": {
                            borderColor: error ? "#d32f2f" : "#E5E7EB",
                        },
                        "&:hover fieldset": {
                            borderColor: error ? "#d32f2f" : "#1D82F5",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: error ? "#d32f2f" : "#1D82F5",
                        },
                    },
                },
            },
        },
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            {includeTime ? (
                <DateTimePicker {...commonProps} />
            ) : (
                <DatePicker {...commonProps} />
            )}
        </LocalizationProvider>
    );
}