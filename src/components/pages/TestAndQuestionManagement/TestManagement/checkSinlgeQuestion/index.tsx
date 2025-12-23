import { Box, Button, InputLabel, OutlinedInput, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useGetSingleQuestionInTestQuery, useMarkSubjectiveQuestionMutation } from '../../../../../services/questionApi';
import { showToast } from '../../../../../slice/toastSlice';
import { useAppDispatch } from '../../../../../store/hook';
import TextEditor from '../../../../atoms/TextEditor';
import DrawingCanvas from './DrawingCanvas';

const validationSchema = (max: number) => Yup.object({
    marks_obtained: Yup.number()
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
    const { id, resultId, questionId } = useParams();
    const { data } = useGetSingleQuestionInTestQuery({
        id: Number(id),
        resultId: Number(resultId),
        questionId: Number(questionId)
    }, {
        skip: !id || !resultId || !questionId
    });
    const [markSubjectiveQuestion] = useMarkSubjectiveQuestionMutation();

    const maxMarks = data?.data?.points || 100;

    const formik = useFormik({
        initialValues: {
            marks_obtained: '',
            feedback: '',
            drawings: {}
        },
        validationSchema: validationSchema(maxMarks),
        onSubmit: async (values) => {
            console.log('Form submitted with values:', {
                marks_obtained: values.marks_obtained,
                feedback: values.feedback,
                drawings: values.drawings,
                // drawingCount: Object.keys(values.drawings).length,
                // drawingKeys: Object.keys(values.drawings)
            });

            // const drawingBlobs = await Promise.all(
            //     Object.entries(values.drawings).map(async ([imageId, dataUrl]) => {
            //         const response = await fetch(dataUrl as string);
            //         const blob = await response.blob();
            //         return {
            //             imageId,
            //             blob,
            //             fileName: `drawing_${imageId}.png`
            //         };
            //     })
            // );

            try {
                const response = await markSubjectiveQuestion({
                    id: Number(id),
                    resultId: Number(resultId),
                    questionId: Number(questionId),
                    body: {
                        marks_obtained: Number(values.marks_obtained),
                        feedback: values.feedback,
                        drawings: values.drawings
                    }
                }).unwrap();
                dispatch(
                    showToast({
                        message: response.message || 'Submitted evaluation successfully!',
                        severity: 'success'
                    }))
            }
            catch (error: any) {
                dispatch(
                    showToast({
                        message: error.data.message || 'Failed to submit evaluation. Please try again.',
                        severity: 'error'
                    }))
            }

            // TODO: Submit to API
            // Example:
            // const formData = new FormData();
            // formData.append('marks_obtained', values.marks_obtained);
            // formData.append('feedback', values.feedback);
            // drawingBlobs.forEach(({ blob, fileName, imageId }) => {
            //     formData.append(`drawings[${imageId}]`, blob, fileName);
            // });
        }
    });

    const handleSave = () => {
        console.log('Save clicked - Current form values:', formik.values);
        console.log('Form errors:', formik.errors);
    };

    const handleNext = () => {
        formik.handleSubmit();
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
                        console.log('Drawings updated:', drawings);
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
                            <InputLabel htmlFor="marks_obtained">
                                Grade this answer
                            </InputLabel>
                            <OutlinedInput
                                id="marks_obtained"
                                name="marks_obtained"
                                type="number"
                                fullWidth
                                size="small"
                                placeholder='How much would you grade this answer?'
                                value={formik.values.marks_obtained}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.marks_obtained && Boolean(formik.errors.marks_obtained)}
                            />
                            {formik.touched.marks_obtained && formik.errors.marks_obtained && (
                                <Typography variant='caption' color='error' className='mt-1 block'>
                                    {formik.errors.marks_obtained}
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
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                            <Button
                                variant='contained'
                                color='primary'
                                fullWidth
                                onClick={handleNext}
                            >
                                Next Question
                            </Button>
                        </div>
                    </div>
                </Box>
            </div>
        </div>
    )
}
