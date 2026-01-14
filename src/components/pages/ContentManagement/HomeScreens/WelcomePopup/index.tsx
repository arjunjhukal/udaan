import {
    Box,
    Button,
    Divider,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    Typography
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import {
    useAddWelcomePopupMutation,
    useGetWelcomePopupQuery
} from "../../../../../services/contentApi";
import { showToast } from "../../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../../store/hook";
import { WelcomePopupInitialState } from "../../../../../types/content";
import FileDragDrop from "../../../../molecules/FileDragDrop";

const validationSchema = Yup.object({
    heading: Yup.string().required("Heading is required"),
    image: Yup.mixed().required("Image is required"),
});

export default function WelcomePopupRoot() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [addWelcomePopup, { isLoading }] = useAddWelcomePopupMutation();
    const { data } = useGetWelcomePopupQuery();

    const formik = useFormik({
        initialValues: data?.data ?? WelcomePopupInitialState,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {

            try {
                const formData = new FormData();

                formData.append("heading", values.heading);
                if (values.sub_heading) {
                    formData.append("sub_heading", values.sub_heading);
                }
                if (values.image instanceof File) {
                    formData.append("image", values.image);
                }
                if (values.image_url) {
                    formData.append("image_url", values.image_url);
                }

                const response = await addWelcomePopup(formData).unwrap();
                dispatch(
                    showToast({
                        message: response.message || "Successfully Added Welcome Banner.",
                        severity: "success"
                    })
                );
            } catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Unable to add welcome popup",
                        severity: "error"
                    })
                );
            }
        }
    });

    const handleFileChange = (file: File | null) => {
        formik.setFieldValue("image", file);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="welcome__popup__root">
            <Typography variant="h5">
                {t("menus.content_management.home_screen.welcome_popup.root")}
            </Typography>

            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:gap-6 mt-5">
                {/* Image */}
                <div className="col-span-1">
                    <FileDragDrop
                        required
                        label="Image"
                        initialFile={formik.values.image}
                        initialPreview={formik.values.image_url}
                        onFileChange={handleFileChange}
                    />
                    {formik.touched.image && formik.errors.image && (
                        <FormHelperText error>{formik.errors.image}</FormHelperText>
                    )}
                </div>

                {/* Text Inputs */}
                <div className="col-span-1">
                    {/* Heading */}
                    <div className="input__field mb-4 lg:mb-6">
                        <InputLabel className="required">Heading</InputLabel>
                        <OutlinedInput
                            fullWidth
                            name="heading"
                            placeholder="Enter Heading"
                            value={formik.values.heading}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(formik.touched.heading && formik.errors.heading)}
                        />
                        <FormHelperText error>
                            {formik.touched.heading && formik.errors.heading}
                        </FormHelperText>
                    </div>

                    {/* Sub Heading */}
                    <div className="input__field">
                        <InputLabel>Subheading</InputLabel>
                        <OutlinedInput
                            fullWidth
                            name="sub_heading"
                            placeholder="Enter Subheading"
                            value={formik.values.sub_heading}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(
                                formik.touched.sub_heading && formik.errors.sub_heading
                            )}
                        />
                        <FormHelperText error>
                            {formik.touched.sub_heading && formik.errors.sub_heading}
                        </FormHelperText>
                    </div>
                </div>
            </div>

            <Divider className="mt-6!" />

            <Box className="mt-6 flex justify-end gap-4">

                <Button type="submit" variant="contained" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create"}
                </Button>
            </Box>
        </form>
    );
}
