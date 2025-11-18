import { Button, Dialog, DialogContent, Divider, FormHelperText, IconButton, InputLabel, OutlinedInput, Typography, useTheme } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useCreateSubscriptionMutation, useEditSubscriptionMutation } from '../../../../../../services/subscriptionPlanApi';
import { showToast } from '../../../../../../slice/toastSlice';
import { useAppDispatch } from '../../../../../../store/hook';
import { subscriptionPlanInitialState, type SubscriptionPlanProps } from '../../../../../../types/subscriptionPlan';
import TextEditor from '../../../../../atoms/TextEditor';
import FooterAction from '../../../../../molecules/FooterAction';

interface Props {
    open: boolean;
    setOpen: (newValue: boolean) => void;
    selectedPlan?: SubscriptionPlanProps | null;
}

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required")
})
export default function CurriculumFormWithMedia({ open, setOpen, selectedPlan }: Props) {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const handleClose = () => {
        setOpen(false);
    }

    const [createPlan, { isLoading }] = useCreateSubscriptionMutation();
    const [updatePlan, { isLoading: updating }] = useEditSubscriptionMutation();
    const formik = useFormik({
        initialValues: selectedPlan ? {
            ...selectedPlan
        } : {
            ...subscriptionPlanInitialState
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (selectedPlan) {
                try {
                    const response = await updatePlan({ body: values, id: selectedPlan.id || "" }).unwrap();

                    dispatch(
                        showToast({
                            message: response.message || "Something went wrong",
                            severity: "success",
                        })
                    );
                    handleClose();
                }
                catch (e: any) {
                    dispatch(
                        showToast({
                            message: e.data.message || "Something went wrong",
                            severity: "error",
                        })
                    );
                }
            }
            else {

                try {
                    const response = await createPlan({ body: values }).unwrap();

                    dispatch(
                        showToast({
                            message: response.message || "Something went wrong",
                            severity: "success",
                        })
                    );
                    handleClose();
                }
                catch (e: any) {
                    dispatch(
                        showToast({
                            message: e.data.message || "Something went wrong",
                            severity: "error",
                        })
                    );
                }
            }
        }
    })

    return (
        <Dialog open={open} onClose={handleClose}
            sx={{
                "& .MuiPaper-root": {
                    minWidth: {
                        md: "664px",
                    }
                }
            }}
        >
            <DialogContent className="p-6!  rounded-2xl"
                sx={{
                    boxShadow: "0 4px 20px 0 rgba(0, 8, 251, 0.20)",
                    background: theme.palette.primary.contrastText
                }}>
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex justify-between items-center pb-1">
                        <Typography variant="h5" className="text.dark">Create Subscription</Typography>
                        <IconButton onClick={handleClose} >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.492 1.66675H6.50866C3.47533 1.66675 1.66699 3.47508 1.66699 6.50841V13.4834C1.66699 16.5251 3.47533 18.3334 6.50866 18.3334H13.4837C16.517 18.3334 18.3253 16.5251 18.3253 13.4917V6.50841C18.3337 3.47508 16.5253 1.66675 13.492 1.66675ZM12.8003 11.9167C13.042 12.1584 13.042 12.5584 12.8003 12.8001C12.6753 12.9251 12.517 12.9834 12.3587 12.9834C12.2003 12.9834 12.042 12.9251 11.917 12.8001L10.0003 10.8834L8.08366 12.8001C7.95866 12.9251 7.80033 12.9834 7.64199 12.9834C7.48366 12.9834 7.32533 12.9251 7.20033 12.8001C6.95866 12.5584 6.95866 12.1584 7.20033 11.9167L9.11699 10.0001L7.20033 8.08341C6.95866 7.84175 6.95866 7.44175 7.20033 7.20008C7.44199 6.95842 7.84199 6.95842 8.08366 7.20008L10.0003 9.11675L11.917 7.20008C12.1587 6.95842 12.5587 6.95842 12.8003 7.20008C13.042 7.44175 13.042 7.84175 12.8003 8.08341L10.8837 10.0001L12.8003 11.9167Z" fill="#E21D48" />
                            </svg>
                        </IconButton>
                    </div>
                    <Divider className="mb-6!" />

                    <div className="flex flex-col gap-6 ">
                        <div className="input__field">
                            <InputLabel>Name of the Subscription</InputLabel>
                            <OutlinedInput
                                fullWidth
                                name="name"
                                placeholder="Enter the name of the subscription"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <FormHelperText error sx={{ mt: 0.5 }}>
                                    {formik.errors.name}
                                </FormHelperText>
                            )}
                        </div>
                        <div className="input__field">
                            <TextEditor
                                value={formik.values.description}
                                onChange={(value) => formik.setFieldValue("description", value)}
                                onBlur={(value) => formik.setFieldValue("description", value)}
                            />
                            {formik.touched.description && formik.errors.description && (
                                <FormHelperText error sx={{ mt: 0.5 }}>
                                    {formik.errors.description}
                                </FormHelperText>
                            )}
                        </div>
                        <div className="input__field">
                            <InputLabel>Add Notes</InputLabel>
                            <Button variant="outlined" color='inherit' className='justify-start!' fullWidth startIcon={
                                (<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="32" height="32" rx="16" fill="#D9F0FF" />
                                    <path d="M18.6667 9.33301H13.3333C11 9.33301 10 10.6663 10 12.6663V19.333C10 21.333 11 22.6663 13.3333 22.6663H18.6667C21 22.6663 22 21.333 22 19.333V12.6663C22 10.6663 21 9.33301 18.6667 9.33301ZM13.3333 16.1663H16C16.2733 16.1663 16.5 16.393 16.5 16.6663C16.5 16.9397 16.2733 17.1663 16 17.1663H13.3333C13.06 17.1663 12.8333 16.9397 12.8333 16.6663C12.8333 16.393 13.06 16.1663 13.3333 16.1663ZM18.6667 19.833H13.3333C13.06 19.833 12.8333 19.6063 12.8333 19.333C12.8333 19.0597 13.06 18.833 13.3333 18.833H18.6667C18.94 18.833 19.1667 19.0597 19.1667 19.333C19.1667 19.6063 18.94 19.833 18.6667 19.833ZM20.3333 14.1663H19C17.9867 14.1663 17.1667 13.3463 17.1667 12.333V10.9997C17.1667 10.7263 17.3933 10.4997 17.6667 10.4997C17.94 10.4997 18.1667 10.7263 18.1667 10.9997V12.333C18.1667 12.793 18.54 13.1663 19 13.1663H20.3333C20.6067 13.1663 20.8333 13.393 20.8333 13.6663C20.8333 13.9397 20.6067 14.1663 20.3333 14.1663Z" fill="#1D82F5" />
                                </svg>
                                )
                            }>Click to upload note</Button>
                        </div>
                        <div className="input__field">
                            <InputLabel>Add Notes</InputLabel>
                            <Button variant="outlined" color='inherit' className='justify-start!' fullWidth startIcon={
                                (<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="32" height="32" rx="16" fill="#EDFDF5" />
                                    <path d="M14.4467 17.2803C13.9534 17.2803 13.5601 17.6803 13.5601 18.1736C13.5601 18.6669 13.9601 19.0603 14.4467 19.0603C14.9401 19.0603 15.3401 18.6603 15.3401 18.1736C15.3401 17.6803 14.9401 17.2803 14.4467 17.2803Z" fill="#1BB830" />
                                    <path d="M18.7935 9.33301H13.2068C10.7802 9.33301 9.3335 10.7797 9.3335 13.2063V18.7863C9.3335 21.2197 10.7802 22.6663 13.2068 22.6663H18.7868C21.2135 22.6663 22.6602 21.2197 22.6602 18.793V13.2063C22.6668 10.7797 21.2202 9.33301 18.7935 9.33301ZM19.4135 14.533C19.4135 14.9397 19.2402 15.2997 18.9468 15.513C18.7602 15.6463 18.5335 15.7197 18.2935 15.7197C18.1535 15.7197 18.0135 15.693 17.8668 15.6463L16.3402 15.1397C16.3335 15.1397 16.3202 15.133 16.3135 15.1263V18.1663C16.3135 19.193 15.4735 20.033 14.4468 20.033C13.4202 20.033 12.5802 19.193 12.5802 18.1663C12.5802 17.1397 13.4202 16.2997 14.4468 16.2997C14.7735 16.2997 15.0735 16.393 15.3402 16.533V13.753V13.3463C15.3402 12.9397 15.5135 12.5797 15.8068 12.3663C16.1068 12.153 16.5002 12.0997 16.8868 12.233L18.4135 12.7397C18.9868 12.933 19.4202 13.533 19.4202 14.133V14.533H19.4135Z" fill="#1BB830" />
                                </svg>
                                )
                            }>Click to upload audio file </Button>
                        </div>
                        <div className="input__field">
                            <InputLabel>Add Notes</InputLabel>
                            <OutlinedInput
                                placeholder='Add URL to add videos'
                                className='justify-start! gap-2! text-[8px]!'
                                fullWidth
                                startAdornment={
                                    (<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="32" height="32" rx="16" fill="#FFF0F1" />
                                        <path d="M16.0002 9.33301C12.3202 9.33301 9.3335 12.3197 9.3335 15.9997C9.3335 19.6797 12.3202 22.6663 16.0002 22.6663C19.6802 22.6663 22.6668 19.6797 22.6668 15.9997C22.6668 12.3197 19.6802 9.33301 16.0002 9.33301ZM17.7735 17.153L16.9202 17.6463L16.0668 18.1397C14.9668 18.773 14.0668 18.253 14.0668 16.9863V15.9997V15.013C14.0668 13.7397 14.9668 13.2263 16.0668 13.8597L16.9202 14.353L17.7735 14.8463C18.8735 15.4797 18.8735 16.5197 17.7735 17.153Z" fill="#D91111" />
                                    </svg>
                                    )
                                } />
                        </div>
                    </div>
                    <FooterAction
                        isLoading={isLoading}
                        isEditMode={!!selectedPlan?.id}
                        isUpdating={updating}
                        handleComfirmationChange={handleClose}
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}
