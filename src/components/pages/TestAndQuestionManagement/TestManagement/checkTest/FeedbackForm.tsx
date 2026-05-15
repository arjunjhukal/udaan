import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useGetTestFeedbackQuery, useSubmitTestFeedbackMutation } from '../../../../../services/questionApi';
import { showToast } from '../../../../../slice/toastSlice';
import { useAppDispatch } from '../../../../../store/hook';
import type { StudentSubmitTestProps, TestProps } from '../../../../../types/question';
import { msToHMS } from '../../../../../utils/parseDateTime';
import TextEditor from '../../../../atoms/TextEditor';
import { PercentageDonutChart } from '../../../../organism/Charts/PercentageDonut';

export default function FeedbackForm({ data, test, testId, resultId }: { data: StudentSubmitTestProps | null; test: TestProps | null; testId?: string; resultId?: string }) {
    const dispatch = useAppDispatch();
    const [feedback, setFeedback] = useState<string>("");
    const { hours, minutes } = msToHMS(data?.timer || 0);
    const isSubjective = data?.test_type === "subjective";
    const timeTaken = data?.timer ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}` : "N/A";
    const statusLabel = data?.status ? `${String(data.status).charAt(0).toUpperCase()}${String(data.status).slice(1)}` : "N/A";
    const [submitTestFeedback, isLoading] = useSubmitTestFeedbackMutation();
    const { data: feeback } = useGetTestFeedbackQuery({ id: Number(testId), resultId: Number(resultId) }, { skip: !testId || !resultId });

    useEffect(() => {
        setFeedback(feeback?.data?.feedback || "");
    }, [feeback])

    const handleSubmitFeedback = async () => {
        if (!data || !test) return;
        try {
            const response = await submitTestFeedback({ id: Number(testId), resultId: data.id, body: { feedback } }).unwrap();
            dispatch(
                showToast({
                    message: response.message || "Feedback submitted successfully.",
                    severity: "success",
                })
            )
        } catch (error: any) {
            dispatch(
                showToast({
                    message: error.data.message || "Failed to submit feedback. Please try again.",
                    severity: "error",
                })
            )
        }
    };

    console.log("FeedbackForm Rendered with feedback:", isLoading);
    return (
        <Box className="feedback__form p-4 rounded-md" sx={{
            background: (theme) => theme.palette.gray.gray1
        }}>
            <Box className="mb-6 text-center">
                {isSubjective ? (
                    <Box className="mb-4 mt-2 flex items-baseline justify-center gap-1">
                        <Typography variant="h1" color="primary" fontWeight={600}>
                            {data?.score ?? 0}
                        </Typography>
                        <Typography component="span" color="text.middle" sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
                            / {data?.full_mark ?? 0}
                        </Typography>
                    </Box>
                ) : (
                    <div className="chart__wrapper max-w-32 mx-auto mb-4">
                        <PercentageDonutChart value={Number(data?.total_marks)} />
                    </div>
                )}
                <Typography variant='body1' color='text.dark' className='font-medium!'>{test?.name}</Typography>
            </Box>
            {isSubjective ? (
                <Box className="grid grid-cols-2 gap-3 mb-4">
                    {[
                        { label: "Attempted", value: `${data?.total_attempted ?? 0}/${data?.total_questions ?? 0}` },
                        { label: "Marks Obtained", value: `${data?.score ?? 0}/${data?.full_mark ?? 0}` },
                        { label: "Status", value: statusLabel },
                        { label: "Time Taken", value: timeTaken },
                    ].map((stat) => (
                        <Box key={stat.label} className="p-3 rounded-lg" sx={{
                            background: (theme) => theme.palette.primary.contrastText
                        }}>
                            <Typography variant='h5'>{stat.value}</Typography>
                            <Typography variant='subtitle2' color='text.middle'>{stat.label}</Typography>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Box className="p-4 rounded-lg flex justify-between items-center mb-4" sx={{
                    background: (theme) => theme.palette.primary.contrastText
                }}>
                    <Box>
                        <Typography variant='h4'>{(data?.test_type === "mcq" || data?.test_type === "omr") ? data?.total_correct : data?.total_attempted}/{data?.total_questions}</Typography>
                        <Typography variant='subtitle2' color='text.middle'>{(data?.test_type === "mcq" || data?.test_type === "omr") ? "Correct Answer" : "Attempted Questions"}</Typography>
                    </Box>
                    <Divider orientation='vertical' />
                    <Box>
                        <Typography variant="h4">
                            {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
                        </Typography>
                        <Typography variant='subtitle2' color='text.middle'>Time Taken</Typography>
                    </Box>
                </Box>
            )}
            <Box>
                <Typography variant='subtitle1' className='mb-2!'>Add Feedback</Typography>
                <Box className="input__field rounded-md" sx={{
                    background: (theme) => theme.palette.primary.contrastText
                }}>
                    <TextEditor
                        label=''
                        value={feedback}
                        onChange={(value) => setFeedback(value)}
                        onBlur={() => { }} />
                </Box>
            </Box>
            <Stack className="gap-2 mt-6">
                <Button variant='contained' color='primary' fullWidth onClick={() => handleSubmitFeedback()}>{(data?.test_type === "mcq" || data?.test_type === "omr") ? "Submit & Next" : "Submit"}</Button>
            </Stack>
        </Box>
    )
}
