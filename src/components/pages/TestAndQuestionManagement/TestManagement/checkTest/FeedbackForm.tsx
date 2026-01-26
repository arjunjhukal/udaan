import { Box, Button, Divider, OutlinedInput, Stack, Typography } from '@mui/material';
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
    const [videoUrl, setVideoUrl] = useState<string>("");
    const { hours, minutes } = msToHMS(data?.timer || 0);
    const [submitTestFeedback, isLoading] = useSubmitTestFeedbackMutation();
    const { data: feeback } = useGetTestFeedbackQuery({ id: Number(testId), resultId: Number(resultId) }, { skip: !testId || !resultId });

    useEffect(() => {
        setFeedback(feeback?.data?.feedback || "");
        setVideoUrl(feeback?.data?.video_url || "");
    }, [feeback])

    const handleSubmitFeedback = async () => {
        if (!data || !test) return;
        try {
            const response = await submitTestFeedback({ id: Number(testId), resultId: data.id, body: { feedback, video_url: videoUrl } }).unwrap();
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
                <div className="chart__wrapper max-w-32 mx-auto mb-4">
                    <PercentageDonutChart value={Number(data?.total_marks)} />
                </div>
                <Typography variant='body1' color='text.dark' className='font-medium!'>{test?.name}</Typography>
            </Box>
            <Box className="p-4 rounded-lg flex justify-between items-center mb-4" sx={{
                background: (theme) => theme.palette.primary.contrastText
            }}>
                <Box>
                    <Typography variant='h4'>{data?.total_correct}/{data?.total_questions}</Typography>
                    <Typography variant='subtitle2' color='text.middle'>Correct Answer</Typography>
                </Box>
                <Divider orientation='vertical' />
                <Box>
                    <Typography variant="h4">
                        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
                    </Typography>
                    <Typography variant='subtitle2' color='text.middle'>Time Taken</Typography>
                </Box>
            </Box>
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
            <div className="mt-4">
                <Typography variant='subtitle1' className='mb-2!'>Add Feedback Video</Typography>
                <Box className="input__field rounded-md" sx={{
                    background: (theme) => theme.palette.primary.contrastText
                }}>
                    <OutlinedInput
                        placeholder='Feedback video URL'
                        fullWidth
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                    />
                </Box>
            </div>
            <Stack className="gap-2 mt-6">
                <Button variant='contained' color='primary' fullWidth onClick={() => handleSubmitFeedback()}>{(data?.test_type === "mcq") ? "Submit & Next" : "Submit"}</Button>
            </Stack>
        </Box>
    )
}
