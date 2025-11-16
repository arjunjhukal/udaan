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
}

export default function MakuraDatePicker({
    value,
    onChange,
    required = false,
    fullWidth = true,
}: MakuraDatePickerProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                value={value}
                onChange={onChange}
                slotProps={{
                    textField: {
                        required,
                        fullWidth,
                        sx: {
                            "& .MuiOutlinedInput-root": {
                                fontSize: "14px",
                                "& fieldset": {
                                    borderColor: "#E5E7EB", // lightPalette.textField.border
                                },
                                "&:hover fieldset": {
                                    borderColor: "#1D82F5", // primary.main
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
