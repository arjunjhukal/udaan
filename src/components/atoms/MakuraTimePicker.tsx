"use client";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import type { Dayjs } from "dayjs";
import { useState } from "react";

interface MakuraTimePickerProps {
    value: Dayjs | null;
    onChange: (newValue: Dayjs | null) => void;
    required?: boolean;
    fullWidth?: boolean;
    placeholder?: string;
    format?: string;
    error?: boolean;
}

function ArrowDownIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
                d="M16.6 7.45801L11.1667 12.8913C10.525 13.533 9.47499 13.533 8.83333 12.8913L3.39999 7.45801"
                stroke="#9CA3B0"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function MakuraTimePicker({
    value,
    onChange,
    required = false,
    fullWidth = true,
    placeholder = "Select time",
    format = "hh:mm A",
    error = false,
}: MakuraTimePickerProps) {
    const [open, setOpen] = useState(false);

    const CustomTextField = (params: any) => {
        return (
            <div style={{ position: "relative", width: fullWidth ? "100%" : "auto" }}>
                <TextField
                    {...params}
                    required={required}
                    fullWidth={fullWidth}
                    error={error}
                    onClick={() => setOpen(true)}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            fontSize: "14px",
                            cursor: "pointer",
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
                        "& .MuiOutlinedInput-input": {
                            cursor: "pointer",
                            color: value ? "inherit" : "transparent",
                        },
                    }}
                />

                {!value && (
                    <div
                        onClick={() => setOpen(true)}
                        style={{
                            position: "absolute",
                            left: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#9CA3B0",
                            fontSize: "14px",
                            pointerEvents: "none",
                        }}
                    >
                        {placeholder}
                    </div>
                )}
            </div>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileTimePicker
                value={value}
                onChange={onChange}
                format={format}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                enableAccessibleFieldDOMStructure={false}
                slots={{
                    openPickerIcon: ArrowDownIcon,
                    textField: CustomTextField,
                }}
            />
        </LocalizationProvider>
    );
}
