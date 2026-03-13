import { alpha, Autocomplete, Dialog, Divider, FormHelperText, IconButton, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { CloseCircle } from 'iconsax-reactjs';
import * as Yup from 'yup';
import { useCreateOmrSheetMutation, useGetAllOmrTypeQuery, useUpdateOmrSheetMutation } from '../../../../services/questionApi';
import { showToast } from '../../../../slice/toastSlice';
import { useAppDispatch } from '../../../../store/hook';
import type { OmrSheetProps } from '../../../../types/question';
import FileDragDrop from '../../../molecules/FileDragDrop';
import FooterAction from '../../../molecules/FooterAction';

interface Props {
    data?: OmrSheetProps,
    open: boolean;
    handleClose: () => void
}

const validationSchema = Yup.object({
    sheet: Yup.mixed().when("sheet_url", {
        is: (val: string) => !val,
        then: (schema) => schema.required("Sheet is Required"),
        otherwise: (schema) => schema.nullable(),
    }),
    omr_format: Yup.number().required("Sheet Form is Required"),
    name: Yup.string().required("Name is Required"),
})

export default function OmrForm({ data, open, handleClose }: Props) {
    const dispatch = useAppDispatch();
    const [createOmrFormat, { isLoading }] = useCreateOmrSheetMutation();
    const [updateOmrFormat, { isLoading: updating }] = useUpdateOmrSheetMutation();
    const { data: omrType } = useGetAllOmrTypeQuery();
    const formik = useFormik({
        initialValues: {
            sheet: data?.sheet || null,
            sheet_url: data?.sheet_url || "",
            name: data?.name || "",
            omr_format: data?.omr_format || ""
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("omr_format", String(values.omr_format));
                if (values.sheet) {
                    formData.append("sheet", values.sheet);
                }

                if (values.sheet_url) {
                    formData.append("sheet_url", values.sheet_url);
                }

                if (data?.id) {
                    const response = await updateOmrFormat({ id: data.id, body: formData }).unwrap();
                    dispatch(showToast({ severity: "success", message: response.message || "OMR updated successfully" }));
                } else {
                    const response = await createOmrFormat({ body: formData }).unwrap();
                    dispatch(showToast({ severity: "success", message: response.message || "OMR created successfully" }));
                }
                formik.resetForm();
                handleClose();
            } catch (e: any) {
                dispatch(showToast({
                    severity: "error",
                    message: e?.data?.message || "Unable to save OMR"
                }));
            }
        }
    })
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    padding: "24px",
                    borderRadius: 3,
                    bgcolor: (theme) => theme.palette.background.paper,
                }
            }}
        >
            {/* Close */}
            <div className="flex gap-4 items-center justify-between">
                <Typography variant='h5' fontWeight={500}>Create OMR Sheet</Typography>
                <IconButton
                    onClick={handleClose}
                    sx={{

                        color: (theme) => theme.palette.text.middle,
                        '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.text.middle, 0.1)
                        }
                    }}
                >
                    <CloseCircle size={20} />
                </IconButton>
            </div>
            <Divider className="mt-2! mb-6!" />
            <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-col gap-4">
                    <div className="input__field ">
                        <InputLabel className="required">Name</InputLabel>
                        <OutlinedInput
                            fullWidth
                            placeholder="Enter OMR Name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <FormHelperText error={true} sx={{ mt: 0.5 }}>
                                {formik.errors.name}
                            </FormHelperText>
                        )}
                    </div>
                <div className="input__field ">
                        <InputLabel className="required">Number Of Sheet</InputLabel>
                        <Autocomplete
                            disableClearable
                            options={omrType?.data || []}
                            getOptionLabel={(option) => option.title}
                            value={
                                omrType?.data?.find(
                                    (item) => String(item.value) === String(formik.values.omr_format)
                                ) || undefined
                            }
                            onChange={(_, value) => {
                                formik.setFieldValue("omr_format", value?.value || null);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Select the OMR format you want for this test"
                                />
                            )}
                        />
                        {/* <OutlinedInput
                            fullWidth
                            placeholder="Enter Number of Format"
                            name="omr_format"
                            value={formik.values.omr_format}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.omr_format && Boolean(formik.errors.omr_format)}
                        /> */}
                        {formik.touched.omr_format && formik.errors.omr_format && (
                            <FormHelperText error={true} sx={{ mt: 0.5 }}>
                                {formik.errors.omr_format}
                            </FormHelperText>
                        )}
                    </div>
                    <FileDragDrop
                        label="OMR Sheet"
                        required={true}
                        initialPreview={data?.sheet_url || ""}
                        initialFile={formik.values.sheet || null}
                        onFileChange={(file) => formik.setFieldValue(`sheet`, file)}
                        error={formik.touched?.sheet && Boolean(formik.errors?.sheet)}

                    />
                </div>
                <FooterAction
                    handleConfirmationChange={handleClose}
                    isLoading={isLoading}
                    isUpdating={updating}
                    isEditMode={!!data}
                    replaceLabel={
                        data
                            ? updating
                                ? "Updating Bundle..."
                                : "Update Bundle"

                            : isLoading || data
                                ? "Creating Bundle..."
                                : "Create Bundle"
                    }
                />
            </form>
        </Dialog>
    )
}
