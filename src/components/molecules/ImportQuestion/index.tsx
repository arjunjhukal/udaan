import { Box, FormControlLabel, LinearProgress, Radio, Typography, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { useCallback, useState } from "react";
import { useDropzone, type Accept } from "react-dropzone";
import { useSaveUploadedQuestionsMutation, useUploadQuestionPaperMutation } from "../../../services/questionApi";
import { showToast } from "../../../slice/toastSlice";
import { useAppDispatch } from "../../../store/hook";
import type { QuestionProps } from "../../../types/question";
import { renderHtml } from "../../../utils/renderHtml";
import FooterAction from "../FooterAction";

interface MediaFileDragDropProps {
    maxSize?: number;
    onClose: () => void;
}

export default function ImportQuestion({
    maxSize = 2,
    onClose
}: MediaFileDragDropProps) {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [uploadMedia, { isLoading }] = useUploadQuestionPaperMutation();
    const [questions, setQuestions] = useState<QuestionProps[]>([]);
    const [_isDragging, setIsDragging] = useState(false);

    const getAcceptTypes = (): Accept => ({
        "application/pdf": [".pdf"]
    });

    const handleFileUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append(`question`, file);

            const response = await uploadMedia({ body: formData }).unwrap();

            if (response.data?.length) {
                setQuestions((prev) => [...prev, ...response.data])
            }

            dispatch(
                showToast({ message: "File uploaded successfully", severity: "success" })
            );

        } catch (e: any) {
            dispatch(
                showToast({ message: e?.data?.message || "Upload Failed", severity: "error" })
            );
        }
    };

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        setIsDragging(false);

        if (rejectedFiles?.length) {
            const rejection = rejectedFiles[0];
            const errorCode = rejection.errors[0]?.code;
            if (errorCode === "file-too-large") {
                dispatch(showToast({ message: `File size must be less than ${maxSize}MB`, severity: "error" }));
            } else if (errorCode === "file-invalid-type") {
                dispatch(showToast({ message: `Invalid file type for PDF`, severity: "error" }));
            }
            return;
        }

        if (acceptedFiles?.length) handleFileUpload(acceptedFiles[0]);
    }, [maxSize, dispatch]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDragEnter: () => setIsDragging(true),
        onDragLeave: () => setIsDragging(false),
        accept: getAcceptTypes(),
        multiple: false,
        maxSize: maxSize * 1024 * 1024,
        disabled: isLoading
    });

    const [saveQuestions, { isLoading: saving }] = useSaveUploadedQuestionsMutation();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            questions: questions.map(q => ({
                id: q.id,
                question: q.question,
                options: q.options.map(opt => ({
                    id: opt.id,
                    option: opt.option,
                    is_correct: opt.is_correct
                })),
            })),
        },
        onSubmit: async (values) => {
            try {
                const response = await saveQuestions({ question: values.questions }).unwrap();

                dispatch(showToast({
                    message: response?.message || "Questions saved successfully",
                    severity: "success"
                }));
                onClose();
            }
            catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Error Saving Questions",
                        severity: "error"
                    })
                );
            }
        },
    });

    const handleCorrectAnswerChange = (questionIndex: number, optionIndex: number) => {
        const updatedOptions = formik.values.questions[questionIndex].options.map((opt, idx) => ({
            ...opt,
            is_correct: idx === optionIndex
        }));
        formik.setFieldValue(`questions.${questionIndex}.options`, updatedOptions);
    };

    const renderOption = (option: any, questionIndex: number, optionIndex: number, isCorrect: boolean, isUserWrong?: boolean) => {
        const bgColor = isCorrect
            ? theme.palette.success.light
            : isUserWrong
                ? theme.palette.error.light
                : "transparent";

        const borderColor = isCorrect
            ? theme.palette.success.main
            : isUserWrong
                ? theme.palette.error.main
                : theme.palette.separator.dark;


        return (
            <Box
                key={option.option + option.id}
                className="rounded-lg p-3 col-span-1 flex items-center gap-1"
                sx={{ border: `1px solid ${borderColor}`, backgroundColor: bgColor }}
            >

                <FormControlLabel
                    className="items-center!"
                    label={
                        <Typography variant="body2">{renderHtml(option.option)}</Typography>
                    }
                    control={<Radio
                        color="success"
                        checked={option.is_correct}
                        onChange={() => handleCorrectAnswerChange(questionIndex, optionIndex)}
                    />}
                />
            </Box>
        );
    };

    if (!questions.length) {
        return (
            <Box
                {...getRootProps()}
                className="py-6 flex justify-center items-center flex-col cursor-pointer transition-all"
                sx={{ opacity: isLoading ? 0.8 : 1, pointerEvents: isLoading ? 'none' : 'auto', '&:hover': { opacity: isLoading ? 0.8 : 0.95 } }}
            >
                <input {...getInputProps()} />
                <Box
                    sx={{ width: "64px", height: "64px", borderRadius: "50%", background: isDragActive ? theme.palette.warning.main : theme.palette.warning.main, transition: 'all 0.3s ease', transform: isDragActive ? 'scale(1.1)' : 'scale(1)' }}
                    className="flex justify-center items-center mb-3"
                >

                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.6309 5.76656L16.4038 7.03825M10.6078 9.56336L12.9942 10.1992M10.7265 16.7164L11.6811 16.9708C14.381 17.6901 15.731 18.0498 16.7945 17.4393C17.858 16.8287 18.2198 15.4863 18.9432 12.8016L19.9663 9.00479C20.6898 6.32005 21.0515 4.97768 20.4375 3.92016C19.8235 2.86264 18.4735 2.50295 15.7735 1.78358L14.8189 1.52924C12.119 0.809865 10.769 0.450178 9.70548 1.06074C8.64196 1.6713 8.28023 3.01367 7.55678 5.69841L6.53366 9.49521C5.8102 12.1799 5.44848 13.5223 6.0625 14.5798C6.67652 15.6374 8.02651 15.9971 10.7265 16.7164Z" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                        <path d="M10.75 19.6963L9.79766 19.9556C7.10403 20.6891 5.75722 21.0559 4.69619 20.4333C3.63517 19.8108 3.27429 18.4421 2.55253 15.7047L1.53182 11.8334C0.810063 9.09601 0.449185 7.72731 1.06177 6.64904C1.59167 5.71631 2.75 5.75027 4.25 5.75015" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                </Box>
                <Typography variant="subtitle1" className="mb-1">
                    {isDragActive ? "Drop the file here..." : `Click to upload PDF`}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                    Max file size {maxSize}MB
                </Typography>
                {isLoading ?
                    <LinearProgress sx={{ width: "100%", height: 4 }} />
                    :

                    ""}
            </Box>

        );
    }


    return (
        <form onSubmit={formik.handleSubmit}>
            <Box
                className="flex flex-col justify-start items-start gap-3 p-3  rounded-lg"

            >
                {formik.values.questions.length ? formik.values.questions.map((question, questionIndex) => (
                    <Box className="question__box w-full pb-4 mb-4 lg:pb-8 lg:mb-8 border-b last:border-b-0 last:mb-0 last:pb-0" key={question.id} sx={{ borderColor: (theme) => theme.palette.separator.dark }}>
                        <div className="flex justify-between items-center">
                            <Typography className="mb-6!" variant="body2">Question {questionIndex + 1} of {questions?.length}</Typography>
                        </div>
                        <Typography variant="subtitle1" className="mb-2!">{renderHtml(question.question)}</Typography>
                        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 w-full">
                            {question.options.map((option: any, optionIndex: number) => {
                                return renderOption(option, questionIndex, optionIndex, option.is_correct);
                            })}
                        </div>
                    </Box>
                )) : ""}
            </Box>
            <FooterAction
                isLoading={saving}
                replaceLabel="Verify & Submit"
            />
        </form>
    );
}
