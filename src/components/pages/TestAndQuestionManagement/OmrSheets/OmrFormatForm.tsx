import { Box, CircularProgress, FormHelperText, InputLabel, OutlinedInput, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { PATH } from "../../../../routes/PATH";
import { useCreateOmrFormatMutation, useGetOmrFormatByIdQuery, useUpdateOmrFormatMutation } from "../../../../services/questionApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import { OmrFormatInitialState, type OmrFormatProps } from "../../../../types/question";
import TextEditor from "../../../atoms/TextEditor";
import FileDragDrop from "../../../molecules/FileDragDrop";
import FooterAction from "../../../molecules/FooterAction";
import PageHeader from "../../../organism/PageHeader";

const validationSchema = Yup.object({
    title: Yup.string().trim().required("Title is required"),
});

export default function OmrFormatForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const formatId = Number.isFinite(Number(id)) ? Number(id) : undefined;

    const { data: editData, isLoading: loadingFormat } = useGetOmrFormatByIdQuery(
        { id: formatId as number },
        { skip: !formatId }
    );

    const [createOmrFormat, { isLoading: creating }] = useCreateOmrFormatMutation();
    const [updateOmrFormat, { isLoading: updating }] = useUpdateOmrFormatMutation();

    function getInitialValues(): OmrFormatProps {
        if (formatId && editData?.data) {
            const f = editData.data;
            return {
                id: f.id,
                title: f.title || "",
                test_instructions: f.test_instructions || "",
                omr_sheet_instructions: f.omr_sheet_instructions || "",
                post_test_instructions: f.post_test_instructions || "",
                omr_note: f.omr_note || "",
                qr_code: null,
                qr_code_url: f.qr_code_url || "",
                wrong_method_image: null,
                wrong_method_image_url: f.wrong_method_image_url || "",
                correct_method_image: null,
                correct_method_image_url: f.correct_method_image_url || "",
            };
        }
        return OmrFormatInitialState;
    }

    const formik = useFormik<OmrFormatProps>({
        initialValues: getInitialValues(),
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append("title", values.title);
                formData.append("test_instructions", values.test_instructions);
                formData.append("omr_sheet_instructions", values.omr_sheet_instructions);
                formData.append("post_test_instructions", values.post_test_instructions);
                formData.append("omr_note", values.omr_note);
                if (values.qr_code) formData.append("qr_code", values.qr_code);
                if (values.wrong_method_image) formData.append("wrong_method_image", values.wrong_method_image);
                if (values.correct_method_image) formData.append("correct_method_image", values.correct_method_image);
                if (values.qr_code_url) formData.append("qr_code_url", values.qr_code_url);
                if (values.wrong_method_image_url) formData.append("wrong_method_image_url", values.wrong_method_image_url);
                if (values.correct_method_image_url) formData.append("correct_method_image_url", values.correct_method_image_url);

                if (formatId) {
                    const res = await updateOmrFormat({ id: formatId, body: formData }).unwrap();
                    dispatch(showToast({ severity: "success", message: res.message || "OMR Format updated successfully" }));
                } else {
                    const res = await createOmrFormat({ body: formData }).unwrap();
                    dispatch(showToast({ severity: "success", message: res.message || "OMR Format created successfully" }));
                }
                navigate(PATH.OMR.FORMAT.ROOT);
            } catch (e: any) {
                dispatch(showToast({ severity: "error", message: e?.data?.message || "Unable to save OMR Format" }));
            }
        }
    });

    if (loadingFormat) return <CircularProgress />;

    return (
        <Box className="flex flex-col h-full justify-between overflow-auto">
            <PageHeader
                breadcrumb={[
                    { title: "OMR Formats", url: PATH.OMR.FORMAT.ROOT },
                    { title: formatId ? "Edit Instructions" : "Create Instructions" },
                ]}
                description="Latest Instruction will be fetched automatically for all OMR tests."
            />
            <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1 justify-between overflow-auto mt-6">
                <Box className="flex flex-col gap-6 md:grid md:grid-cols-2 overflow-auto">

                    {/* Title */}
                    <div className="col-span-1">
                        <div className="input__field">
                            <InputLabel className="required">Instruction Title</InputLabel>
                            <OutlinedInput
                                fullWidth
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="e.g. 90 Questions Format"
                                error={formik.touched.title && Boolean(formik.errors.title)}
                            />
                            {formik.touched.title && formik.errors.title && (
                                <FormHelperText error>{formik.errors.title}</FormHelperText>
                            )}
                        </div>
                    </div>

                    {/* Instruction sections */}
                    <div className="col-span-2">
                        <Typography variant="subtitle1" fontWeight={600} color="text.secondary" className="mb-2">
                            Popup Instructions
                        </Typography>
                    </div>

                    <div className="col-span-2">
                        <div className="input__field">
                            <TextEditor
                                label="Instruction to Take a Test"
                                value={formik.values.test_instructions}
                                onChange={(val) => formik.setFieldValue("test_instructions", val)}
                                onBlur={(val) => formik.setFieldValue("test_instructions", val)}
                            />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <div className="input__field">
                            <TextEditor
                                label="Instruction How to Answer Using the OMR Sheet"
                                value={formik.values.omr_sheet_instructions}
                                onChange={(val) => formik.setFieldValue("omr_sheet_instructions", val)}
                                onBlur={(val) => formik.setFieldValue("omr_sheet_instructions", val)}
                            />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <div className="input__field">
                            <TextEditor
                                label="Instruction on What to Do After Completing Test"
                                value={formik.values.post_test_instructions}
                                onChange={(val) => formik.setFieldValue("post_test_instructions", val)}
                                onBlur={(val) => formik.setFieldValue("post_test_instructions", val)}
                            />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <div className="input__field">
                            <TextEditor
                                label="Note / Warning"
                                value={formik.values.omr_note}
                                onChange={(val) => formik.setFieldValue("omr_note", val)}
                                onBlur={(val) => formik.setFieldValue("omr_note", val)}
                            />
                        </div>
                    </div>

                    {/* Images */}
                    <div className="col-span-2">
                        <Typography variant="subtitle1" fontWeight={600} color="text.secondary" className="mb-2">
                            Images
                        </Typography>
                    </div>

                    <div className="col-span-1">
                        <FileDragDrop
                            label="QR Code for App Redirection"
                            initialPreview={formik.values.qr_code_url}
                            onFileChange={(file) => formik.setFieldValue("qr_code", file)}
                        />
                    </div>

                    <div className="col-span-1">
                        <FileDragDrop
                            label="Wrong Method Image"
                            initialPreview={formik.values.wrong_method_image_url}
                            onFileChange={(file) => formik.setFieldValue("wrong_method_image", file)}
                        />
                    </div>

                    <div className="col-span-1">
                        <FileDragDrop
                            label="Correct Method Image"
                            initialPreview={formik.values.correct_method_image_url}
                            onFileChange={(file) => formik.setFieldValue("correct_method_image", file)}
                        />
                    </div>

                </Box>

                <FooterAction
                    handleConfirmationChange={() => navigate(PATH.OMR.FORMAT.ROOT)}
                    isLoading={creating}
                    isUpdating={updating}
                    isEditMode={!!formatId}
                    replaceLabel={
                        formatId
                            ? updating ? "Updating Format..." : "Update Format"
                            : creating ? "Creating Format..." : "Create Format"
                    }
                />
            </form>
        </Box>
    );
}
