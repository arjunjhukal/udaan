import { Box, FormHelperText, IconButton, InputLabel, Typography, useTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileDragDropProps {
    onFileChange: (file: File | null) => void;
    initialFile?: File | null;
    initialPreview?: string;
    error?: boolean;
    helperText?: string;
    maxSize?: number; // in MB
}

export default function FileDragDrop({
    onFileChange,
    initialPreview = "",
    error = false,
    helperText = "",
    maxSize = 2,
}: FileDragDropProps) {
    const theme = useTheme();
    const [preview, setPreview] = useState<string | null>(initialPreview || null);

    // Update preview when initialPreview changes (for edit mode)
    useEffect(() => {
        if (initialPreview) {
            setPreview(initialPreview);
        }
    }, [initialPreview]);

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        // Handle rejected files
        if (rejectedFiles && rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];
            if (rejection.errors[0]?.code === 'file-too-large') {
                alert(`File size must be less than ${maxSize}MB`);
            } else if (rejection.errors[0]?.code === 'file-invalid-type') {
                alert('Only image files (PNG, JPG, JPEG, GIF, WEBP) are allowed');
            }
            return;
        }

        // Handle accepted files
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const url = URL.createObjectURL(file);
            setPreview(url);
            onFileChange(file); // Send file to parent
        }
    }, [maxSize, onFileChange]);

    const removeImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation(); // prevent triggering file dialog
        setPreview(null);
        onFileChange(null); // Notify parent that file is removed
    }, [onFileChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
        multiple: false,
        maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    });

    return (
        <Box className="h-full flex flex-col">
            <InputLabel htmlFor="profile">Profile Picture</InputLabel>
            <Box
                {...getRootProps()}
                className="flex justify-start items-center gap-4 p-4 rounded-md h-full cursor-pointer transition-all duration-200 relative"
                sx={{
                    border: error
                        ? `1px solid ${theme.palette.error.main}`
                        : `1px solid ${theme.palette.textField.border}`,
                    backgroundColor: isDragActive ? theme.palette.action.hover : "transparent",
                }}
            >
                <input {...getInputProps()} id="profile" name="profile" />

                {/* Image Wrapper */}
                <Box sx={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                    <img
                        src={preview || "/no-image.svg"}
                        alt="uploaded preview"
                        style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: `1px solid ${theme.palette.textField.border}`,
                        }}
                    />
                    {preview && (
                        <IconButton
                            size="small"
                            onClick={removeImage}
                            sx={{
                                position: "absolute",
                                top: -10,
                                right: -10,
                                padding: 0,
                                backgroundColor: "white",
                                "&:hover": {
                                    backgroundColor: "white",
                                }
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM15.36 14.3C15.65 14.59 15.65 15.07 15.36 15.36C15.21 15.51 15.02 15.58 14.83 15.58C14.64 15.58 14.45 15.51 14.3 15.36L12 13.06L9.7 15.36C9.55 15.51 9.36 15.58 9.17 15.58C8.98 15.58 8.79 15.51 8.64 15.36C8.35 15.07 8.35 14.59 8.64 14.3L10.94 12L8.64 9.7C8.35 9.41 8.35 8.93 8.64 8.64C8.93 8.35 9.41 8.35 9.7 8.64L12 10.94L14.3 8.64C14.59 8.35 15.07 8.35 15.36 8.64C15.65 8.93 15.65 9.41 15.36 9.7L13.06 12L15.36 14.3Z" fill="#E21D48" />
                            </svg>
                        </IconButton>
                    )}
                </Box>

                <div className="content__wrapper">
                    <Typography variant="subtitle1" color="text.dark" className="mb-1">
                        {isDragActive ? "Drop the file here..." : "Click to upload or drag and drop"}
                    </Typography>
                    <Typography variant="subtitle2" color="text.middle">
                        Max file size {maxSize}MB
                    </Typography>
                </div>
            </Box>

            {helperText && (
                <FormHelperText error={error} sx={{ mt: 0.5 }}>
                    {helperText}
                </FormHelperText>
            )}
        </Box>
    );
}