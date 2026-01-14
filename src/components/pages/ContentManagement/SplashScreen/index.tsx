import { Box, Button, Divider, FormHelperText, InputLabel, OutlinedInput, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useAddOrUpdateSplashScreenMutation, useGetSplashScreenQuery } from "../../../../services/contentApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import FileDragDrop from "../../../molecules/FileDragDrop";

const validationSchema = Yup.object({
    splash_icon_url: Yup.string().nullable(),
    splash_icon: Yup.mixed<File>().when("splash_icon_url", {
        is: (value: string | undefined | null) => !value,
        then: (schema) => schema.required("Icon is Required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    splash_heading: Yup.string().required("Heading is required"),
    splash_sub_heading: Yup.string().required("Sub Heading is required"),
});

export default function SplashScreenRoot() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { data } = useGetSplashScreenQuery();
    const [updateSplashScreen, { isLoading }] = useAddOrUpdateSplashScreenMutation();

    const formik = useFormik({
        initialValues: data ? data?.data : {
            splash_heading: "",
            splash_sub_heading: "",
            splash_icon: null
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();

                formData.append("splash_heading", values.splash_heading ?? "");
                formData.append("splash_sub_heading", values.splash_sub_heading ?? "");

                if (values.splash_icon instanceof File) {
                    formData.append("splash_icon", values.splash_icon);
                }


                if (values.splash_icon_url) {
                    formData.append("splash_icon_url", values.splash_icon_url);
                }
                const response = await updateSplashScreen(formData).unwrap();
                dispatch(
                    showToast({
                        message: response?.message || "Updated Splash Screen Successfully",
                        severity: "success"
                    })
                )
            }
            catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Unable to Updated Splash Screen",
                        severity: "error"
                    })
                )
            }
        }
    })

    return (
        <>
            <form onSubmit={formik.handleSubmit} className="splash__root">
                <div className="page__header flex flex-col gap-1.5">
                    <Typography variant="h5">
                        {t("menus.content_management.splash_screen.root")}
                    </Typography>
                    <Typography variant="subtitle2" color="text.middle">
                        {t("menus.content_management.splash_screen.message")}
                    </Typography>
                </div>

                <Divider className="mt-4! mb-6!" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <FileDragDrop
                            label="Splash Icon"
                            required
                            initialPreview={formik.values.splash_icon_url}
                            onFileChange={(file) =>
                                formik.setFieldValue("splash_icon", file)
                            }
                            error={
                                formik.touched.splash_icon &&
                                Boolean(formik.errors.splash_icon)
                            }
                            helperText={
                                formik.touched.splash_icon
                                    ? (formik.errors.splash_icon as string)
                                    : ""
                            }
                        />
                    </div>

                    <div>
                        {/* Heading */}
                        <div className="mb-4 lg:mb-6">
                            <InputLabel className="required">Heading</InputLabel>
                            <OutlinedInput
                                fullWidth
                                name="splash_heading"
                                placeholder="Enter heading"
                                value={formik.values.splash_heading}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.splash_heading &&
                                    Boolean(formik.errors.splash_heading)
                                }
                            />
                            {formik.touched.splash_heading &&
                                formik.errors.splash_heading && (
                                    <FormHelperText error>
                                        {formik.errors.splash_heading}
                                    </FormHelperText>
                                )}
                        </div>

                        {/* Sub Heading */}
                        <div>
                            <InputLabel className="required">Sub Heading</InputLabel>
                            <OutlinedInput
                                fullWidth
                                name="splash_sub_heading"
                                placeholder="Enter sub heading"
                                value={formik.values.splash_sub_heading}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.splash_sub_heading &&
                                    Boolean(formik.errors.splash_sub_heading)
                                }
                            />
                            {formik.touched.splash_sub_heading &&
                                formik.errors.splash_sub_heading && (
                                    <FormHelperText error>
                                        {formik.errors.splash_sub_heading}
                                    </FormHelperText>
                                )}
                        </div>
                    </div>
                </div>
                <Box
                    className="footer__action flex justify-end items-center gap-2 pt-6 mt-8 sticky bottom-0"
                    sx={{
                        borderTop: (theme) => `1px solid ${theme.palette.separator.dark}`,
                    }}
                >
                    <Button variant="contained" color="primary">{isLoading ? "Updating Splash Screen" : "Update Splash Screen"}</Button>
                </Box>
            </form>
        </>
    )
}
