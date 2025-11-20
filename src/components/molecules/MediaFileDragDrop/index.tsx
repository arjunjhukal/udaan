import { Box, LinearProgress, Typography, useTheme } from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone, type Accept } from "react-dropzone";
import { useUploadMediaMutation } from "../../../services/mediaApi";
import { showToast } from "../../../slice/toastSlice";
import { useAppDispatch } from "../../../store/hook";
import type { courseTabType } from "../../../types/course";

interface MediaFileDragDropProps {
  variant?: "error" | "success";
  type: courseTabType;
  onUploadSuccess?: () => void;
  maxSize?: number;
}

export default function MediaFileDragDrop({
  variant = "success",
  type,
  onUploadSuccess,
  maxSize = 2
}: MediaFileDragDropProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [uploadMedia, { isLoading }] = useUploadMediaMutation();
  const [_isDragging, setIsDragging] = useState(false);

  const getAcceptTypes = (): Accept => {
    switch (type) {
      case "notes":
        return {
          "application/pdf": [".pdf"],
          "application/msword": [".doc"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
        };
      case "audios":
        return {
          "audio/mpeg": [".mp3"],
          "audio/wav": [".wav"],
          "audio/ogg": [".ogg"],
          "audio/mp4": [".m4a"]
        };
      case "videos":
        return {
          "video/mp4": [".mp4"],
          "video/quicktime": [".mov"],
          "video/x-msvideo": [".avi"],
          "video/webm": [".webm"]
        };
      default:
        return {
          "video/mp4": [".mp4"],
          "video/quicktime": [".mov"],
          "video/x-msvideo": [".avi"],
          "video/webm": [".webm"]
        };
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append(`${type}[]`, file);


      await uploadMedia({ type, body: formData }).unwrap();

      dispatch(
        showToast({
          message: "File uploaded successfully",
          severity: "success",
        })
      );

      onUploadSuccess?.();
    } catch (e: any) {
      dispatch(
        showToast({
          message: e?.data?.message || "Upload Failed",
          severity: "error",
        })
      );
    }
  };


  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setIsDragging(false);

    // Handle rejected files
    if (rejectedFiles && rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        dispatch(
          showToast({
            message: `File size must be less than ${maxSize}MB`,
            severity: "error"
          })
        );
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        dispatch(
          showToast({
            message: `Invalid file type for ${type}`,
            severity: "error"
          })
        );
      }
      return;
    }

    // Handle accepted files
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      handleFileUpload(file);
    }
  }, [type, maxSize, dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    accept: getAcceptTypes(),
    multiple: false,
    maxSize: maxSize * 1024 * 1024,
    disabled: isLoading
  });

  const getIconColor = () => {
    if (variant === "error") return "#F97415";
    if (isLoading) return theme.palette.primary.main;
    return "#F97415";
  };

  const getBackgroundColor = () => {
    if (variant === "error") return theme.palette.warning.light;
    if (isLoading || isDragActive) return theme.palette.primary.light;
    return theme.palette.primary.light;
  };

  return (
    <Box
      {...getRootProps()}
      className="py-6! flex justify-center items-center flex-col cursor-pointer transition-all"
      sx={{
        opacity: isLoading ? 0.8 : 1,
        pointerEvents: isLoading ? 'none' : 'auto',
        '&:hover': {
          opacity: isLoading ? 0.8 : 0.95
        }
      }}
    >
      <input {...getInputProps()} />

      <Box
        sx={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: getBackgroundColor(),
          transition: 'all 0.3s ease',
          transform: isDragActive ? 'scale(1.1)' : 'scale(1)'
        }}
        className="flex justify-center items-center mb-3.5!"
      >
        {isLoading ? (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" stroke={theme.palette.primary.main} strokeWidth="3" fill="none" opacity="0.3" />
            <path d="M16 4 A12 12 0 0 1 28 16" stroke={theme.palette.primary.main} strokeWidth="3" fill="none" strokeLinecap="round">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 16 16"
                to="360 16 16"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.3333 2.66699H10.6667C6 2.66699 4 5.33366 4 9.33366V22.667C4 26.667 6 29.3337 10.6667 29.3337H21.3333C26 29.3337 28 26.667 28 22.667V9.33366C28 5.33366 26 2.66699 21.3333 2.66699ZM10.6667 16.3337H16C16.5467 16.3337 17 16.787 17 17.3337C17 17.8803 16.5467 18.3337 16 18.3337H10.6667C10.12 18.3337 9.66667 17.8803 9.66667 17.3337C9.66667 16.787 10.12 16.3337 10.6667 16.3337ZM21.3333 23.667H10.6667C10.12 23.667 9.66667 23.2137 9.66667 22.667C9.66667 22.1203 10.12 21.667 10.6667 21.667H21.3333C21.88 21.667 22.3333 22.1203 22.3333 22.667C22.3333 23.2137 21.88 23.667 21.3333 23.667ZM24.6667 12.3337H22C19.9733 12.3337 18.3333 10.6937 18.3333 8.66699V6.00033C18.3333 5.45366 18.7867 5.00033 19.3333 5.00033C19.88 5.00033 20.3333 5.45366 20.3333 6.00033V8.66699C20.3333 9.58699 21.08 10.3337 22 10.3337H24.6667C25.2133 10.3337 25.6667 10.787 25.6667 11.3337C25.6667 11.8803 25.2133 12.3337 24.6667 12.3337Z" fill={getIconColor()} />
          </svg>
        )}
      </Box>

      <Typography variant="subtitle1" className="mb-1">
        {isLoading
          ? "Uploading..."
          : isDragActive
            ? "Drop the file here..."
            : `Click to upload ${type}`
        }
      </Typography>

      <Typography variant="subtitle1" color="text.middle">
        Max file size {maxSize}MB
      </Typography>

      {/* Upload Progress Bar */}
      {isLoading && (
        <Box sx={{ width: '80%', mt: 2 }}>
          <LinearProgress
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: theme.palette.primary.light,
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.palette.primary.main,
                borderRadius: 4
              }
            }}
          />
          <Typography
            variant="caption"
            color="primary"
            sx={{
              mt: 1,
              display: 'block',
              textAlign: 'center',
              fontWeight: 600
            }}
          >
            Uploading...
          </Typography>
        </Box>
      )}
    </Box>
  );
}