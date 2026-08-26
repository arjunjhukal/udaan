import { Box, FormHelperText, IconButton, InputLabel, Link, Typography, useTheme } from "@mui/material";
import { DocumentText1 } from "iconsax-reactjs";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatFileSize } from "../../../utils/convertToMb";

interface PdfDragDropProps {
    onFileChange: (file: File | null) => void;
    initialFile?: File | null;
    initialName?: string;
    initialUrl?: string;
    initialSize?: number;
    error?: boolean;
    helperText?: string;
    maxSize?: number;
    label?: string;
    required?: boolean;
}

export default function PdfDragDrop({
    onFileChange,
    initialFile = null,
    initialName = "",
    initialUrl = "",
    initialSize,
    error = false,
    helperText = "",
    maxSize = 50,
    label = "eBook PDF",
    required = false,
}: PdfDragDropProps) {
    const theme = useTheme();
    const [file, setFile] = useState<File | null>(initialFile);
    const [rejection, setRejection] = useState("");

    useEffect(() => {
        setFile(initialFile);
    }, [initialFile]);

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: any[]) => {
            if (rejectedFiles?.length) {
                const code = rejectedFiles[0]?.errors?.[0]?.code;
                setRejection(
                    code === "file-too-large"
                        ? `File size must be less than ${maxSize}MB`
                        : "Only PDF files are allowed"
                );
                return;
            }
            if (acceptedFiles?.length) {
                setRejection("");
                setFile(acceptedFiles[0]);
                onFileChange(acceptedFiles[0]);
            }
        },
        [maxSize, onFileChange]
    );

    const removeFile = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            setFile(null);
            setRejection("");
            onFileChange(null);
        },
        [onFileChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        multiple: false,
        maxSize: maxSize * 1024 * 1024,
    });

    const displayName = file?.name || initialName || (initialUrl ? initialUrl.split("/").pop() : "");
    const displaySize = file?.size ?? initialSize;

    return (
        <Box className="h-full flex flex-col">
            <InputLabel className={`pb-1.5! ${required ? "required" : ""}`}>{label}</InputLabel>
            <Box
                {...getRootProps()}
                className="flex justify-start items-center gap-4 p-4 rounded-md h-full cursor-pointer transition-all duration-200 relative"
                sx={{
                    border: error || rejection
                        ? `1px solid ${theme.palette.error.main}`
                        : `1px solid ${theme.palette.textField.border}`,
                    backgroundColor: isDragActive ? theme.palette.action.hover : "transparent",
                }}
            >
                <input {...getInputProps()} id="ebook-file" name="ebook-file" />

                <Box sx={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "8px",
                            border: `1px solid ${theme.palette.textField.border}`,
                            background: displayName ? theme.palette.primary.light : "transparent",
                        }}
                        className="flex justify-center items-center"
                    >
                        <DocumentText1
                            size={32}
                            color={displayName ? theme.palette.primary.main : theme.palette.separator.darker}
                        />
                    </Box>
                    {displayName && (
                        <IconButton
                            size="small"
                            onClick={removeFile}
                            sx={{
                                position: "absolute",
                                top: -10,
                                right: -10,
                                padding: 0,
                                backgroundColor: "white",
                                "&:hover": { backgroundColor: "white" },
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM15.36 14.3C15.65 14.59 15.65 15.07 15.36 15.36C15.21 15.51 15.02 15.58 14.83 15.58C14.64 15.58 14.45 15.51 14.3 15.36L12 13.06L9.7 15.36C9.55 15.51 9.36 15.58 9.17 15.58C8.98 15.58 8.79 15.51 8.64 15.36C8.35 15.07 8.35 14.59 8.64 14.3L10.94 12L8.64 9.7C8.35 9.41 8.35 8.93 8.64 8.64C8.93 8.35 9.41 8.35 9.7 8.64L12 10.94L14.3 8.64C14.59 8.35 15.07 8.35 15.36 8.64C15.65 8.93 15.65 9.41 15.36 9.7L13.06 12L15.36 14.3Z" fill="#E21D48" />
                            </svg>
                        </IconButton>
                    )}
                </Box>

                <div className="content__wrapper overflow-hidden">
                    <Typography variant="subtitle1" color="text.dark" className="mb-1 line-clamp-1">
                        {isDragActive
                            ? "Drop the PDF here..."
                            : displayName || "Click to upload or drag and drop"}
                    </Typography>
                    <Typography variant="subtitle2" color="text.middle">
                        {displaySize ? formatFileSize(displaySize) : `PDF only · Max file size ${maxSize}MB`}
                    </Typography>
                    {!file && initialUrl && (
                        <Link
                            href={initialUrl}
                            target="_blank"
                            rel="noopener"
                            variant="subtitle2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Preview current file
                        </Link>
                    )}
                </div>
            </Box>

            {(rejection || helperText) && (
                <FormHelperText error={error || Boolean(rejection)} sx={{ mt: 0.5 }}>
                    {rejection || helperText}
                </FormHelperText>
            )}
        </Box>
    );
}
