import { Box, Button, InputLabel, OutlinedInput, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { PATH } from '../../../../../routes/PATH';
import { useGetMarkedSubjectiveQuestionQuery, useGetQuestionsListInTestQuery, useGetSingleQuestionInTestQuery, useMarkSubjectiveQuestionMutation } from '../../../../../services/questionApi';
import { showToast } from '../../../../../slice/toastSlice';
import { useAppDispatch } from '../../../../../store/hook';
import TextEditor from '../../../../atoms/TextEditor';
import DrawingCanvas from './DrawingCanvas';

const validationSchema = (max: number) => Yup.object({
    grade: Yup.number()
        .required('Marks obtained is required')
        .min(0, 'Marks cannot be negative')
        .max(max, `Marks cannot exceed ${max}`)
        .typeError('Must be a valid number'),
    feedback: Yup.string(),
    drawings: Yup.mixed().test(
        'has-drawings',
        'At least one drawing is required',
        (value) => {
            if (!value || typeof value !== 'object') return false;
            return Object.keys(value).length > 0;
        }
    )
});

export default function SingleStudentSingleQuestion() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id, resultId, questionId } = useParams();

    const { data: allAttendedQuestions } = useGetQuestionsListInTestQuery({
        id: Number(id),
        resultId: Number(resultId)
    });

    const { data } = useGetSingleQuestionInTestQuery({
        id: Number(id),
        resultId: Number(resultId),
        questionId: Number(questionId)
    }, {
        skip: !id || !resultId || !questionId
    });

    const [markSubjectiveQuestion, { isLoading }] = useMarkSubjectiveQuestionMutation();

    const { data: markedQuestion } = useGetMarkedSubjectiveQuestionQuery({
        id: Number(id),
        resultId: Number(resultId),
        questionId: Number(questionId)
    }, {
        skip: !id || !resultId || !questionId
    });

    const maxMarks = data?.data?.points || 100;

    const formik = useFormik({
        initialValues: {
            grade: markedQuestion?.data?.grade || '',
            feedback: markedQuestion?.data?.feedback || '',
            drawings: {}
        },
        enableReinitialize: true,
        validationSchema: validationSchema(maxMarks),
        onSubmit: async (values) => {
            try {
                const checkedAnswerMedia = Object.entries(values.drawings).map(([imageId, dataUrl]) => ({
                    media_id: Number(imageId),
                    media: dataUrl as string
                }));

                const response = await markSubjectiveQuestion({
                    id: Number(id),
                    resultId: Number(resultId),
                    questionId: Number(questionId),
                    body: {
                        grade: Number(values.grade),
                        feedback: values.feedback,
                        checked_answer_media: checkedAnswerMedia
                    }
                }).unwrap();

                dispatch(
                    showToast({
                        message: response.message || 'Submitted evaluation successfully!',
                        severity: 'success'
                    })
                );

                // Optionally reset form or navigate to next question
                // formik.resetForm();
            }
            catch (error: any) {
                console.error('Submission error:', error);
                dispatch(
                    showToast({
                        message: error?.data?.message || 'Failed to submit evaluation. Please try again.',
                        severity: 'error'
                    })
                );
            }
        }
    });

    const questionIds = allAttendedQuestions?.data?.data?.map(item => item.id) || [];
    const currentIndex = questionIds.indexOf(Number(questionId));
    const isLastQuestion = currentIndex === questionIds.length - 1;

    const submitEvaluation = async () => {
        const checkedAnswerMedia = Object.entries(formik.values.drawings).map(([imageId, dataUrl]) => ({
            media_id: Number(imageId),
            media: dataUrl as string
        }));

        const response = await markSubjectiveQuestion({
            id: Number(id),
            resultId: Number(resultId),
            questionId: Number(questionId),
            body: {
                grade: Number(formik.values.grade),
                feedback: formik.values.feedback,
                checked_answer_media: checkedAnswerMedia
            }
        }).unwrap();

        return response;
    };



    const handleNext = async () => {
        try {
            const errors = await formik.validateForm();

            if (Object.keys(errors).length > 0) {
                formik.setTouched({
                    grade: true,
                    feedback: true,
                    drawings: true
                });
                return;
            }

            const response = await submitEvaluation();

            dispatch(
                showToast({
                    message: response.message || 'Submitted evaluation successfully!',
                    severity: 'success'
                })
            );

            // Only navigate if submission was successful
            if (!isLastQuestion) {
                const nextQuestionId = questionIds[currentIndex + 1];
                navigate(PATH.TEST_QUESTION_MANAGEMENT.TEST.CHECK_PAPER.CHECK_SUBJECTIVE_QUESTION.ROOT(
                    Number(id),
                    Number(resultId),
                    Number(nextQuestionId)
                ));
            } else {
                console.log("This is the last question! Redirect to results or completion page.");
            }
        } catch (error: any) {
            console.error("Submission failed, cannot proceed:", error);
            dispatch(
                showToast({
                    message: error?.data?.message || 'Failed to submit evaluation. Please try again.',
                    severity: 'error'
                })
            );
        }
    };

    return (
        <div className="flex flex-col md:grid md:grid-cols-12 gap-4 lg:gap-6">
            <div className="col-span-7 lg:col-span-8">
                <Typography variant='subtitle1' color='text.dark' className='mb-5!'>
                    {data?.data?.question}
                </Typography>
                <DrawingCanvas
                    images={data?.data?.media_files}
                    value={formik.values.drawings}
                    onChange={(drawings) => {
                        formik.setFieldValue('drawings', drawings);
                    }}
                />
                {formik.touched.drawings && formik.errors.drawings && (
                    <Typography variant='caption' color='error' className='mt-2 block'>
                        {formik.errors.drawings as string}
                    </Typography>
                )}
            </div>
            <div className="col-span-5 lg:col-span-4 sticky top-0 self-start">
                <Box className="feedback__form rounded-md overflow-hidden" sx={{
                    border: (theme) => `1px solid ${theme.palette.separator.dark}`
                }}>
                    <Box className="aside__header py-4 px-6" sx={{
                        background: (theme) => theme.palette.primary.main,
                        color: (theme) => theme.palette.primary.contrastText
                    }}>
                        <Typography variant='h6' fontWeight={500}>Evaluation</Typography>
                        <Typography variant="subtitle2">Grade this answer</Typography>
                    </Box>
                    <div className="py-4 px-5 flex flex-col gap-6">
                        <div className="input__field">
                            <InputLabel htmlFor="grade">
                                Grade this answer {`(out of ${maxMarks})`}
                            </InputLabel>
                            <OutlinedInput
                                id="grade"
                                name="grade"
                                type="number"
                                fullWidth
                                size="small"
                                placeholder='How much would you grade this answer?'
                                value={formik.values.grade}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.grade && Boolean(formik.errors.grade)}
                            />
                            {formik.touched.grade && formik.errors.grade && (
                                <Typography variant='caption' color='error' className='mt-1 block'>
                                    {formik.errors.grade}
                                </Typography>
                            )}
                        </div>
                        <div className="input__field">
                            <TextEditor
                                label='Add Feedback'
                                value={formik.values.feedback}
                                onChange={(value) => {
                                    formik.setFieldValue('feedback', value);
                                }}
                                onBlur={() => formik.setFieldTouched('feedback', true)}
                            />
                            {formik.touched.feedback && formik.errors.feedback && (
                                <Typography variant='caption' color='error' className='mt-1 block'>
                                    {formik.errors.feedback}
                                </Typography>
                            )}
                        </div>
                        <div className="action__footer flex items-center justify-center gap-4">
                            <Button
                                variant='outlined'
                                color='primary'
                                fullWidth
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </Button>
                            <Button
                                variant='contained'
                                color='primary'
                                fullWidth
                                onClick={handleNext}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Submitting...' : (isLastQuestion ? 'Submit Result' : ' Save & Next Question')}
                            </Button>
                        </div>
                    </div>
                </Box>
            </div>
        </div>
    );
}