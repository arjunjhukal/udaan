import {
    Button,
    Divider,
    InputLabel,
    OutlinedInput,
    Typography
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import {
    useGetAppSettingsQuery,
    useUpdateAppSettingMutation,
} from "../../../../services/settingApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import { OutlinedTextarea } from "../../../atoms/OutlinedTextArea";

export default function AppSettingRoot() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const { data } = useGetAppSettingsQuery();
    const [updateAppSetting, { isLoading }] = useUpdateAppSettingMutation();

    const formik = useFormik({
        initialValues: {
            contact_no: data?.data?.contact_no || "",
            support_contact_no: data?.data?.support_contact_no || "",
            email: data?.data?.email || "",
            support_email: data?.data?.support_email || "",
            address: data?.data?.address || "",
            map: data?.data?.map || "",
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const response = await updateAppSetting(values).unwrap();
                dispatch(
                    showToast({
                        message: response?.message || "Settings updated successfully",
                        severity: "success",
                    })
                );
            } catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Unable to update app settings",
                        severity: "error",
                    })
                );
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="app__settings__page__root pb-4 lg:pb-6">
            <Typography variant="h5">{t("messages.app_settings")}</Typography>
            <Divider className="mt-4! mb-6!" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact No */}
                <div>
                    <InputLabel>Contact No.</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="contact_no"
                        value={formik.values.contact_no}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter company contact number"
                        error={formik.touched.contact_no && Boolean(formik.errors.contact_no)}
                    />

                </div>

                {/* Support Contact No */}
                <div>
                    <InputLabel>Support Contact No.</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="support_contact_no"
                        value={formik.values.support_contact_no}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter support contact number"
                        error={
                            formik.touched.support_contact_no &&
                            Boolean(formik.errors.support_contact_no)
                        }
                    />

                </div>

                {/* Email */}
                <div>
                    <InputLabel>Email</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter email"
                        error={formik.touched.email && Boolean(formik.errors.email)}
                    />

                </div>

                {/* Support Email */}
                <div>
                    <InputLabel>Support Email</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="support_email"
                        value={formik.values.support_email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter support email"
                        error={
                            formik.touched.support_email &&
                            Boolean(formik.errors.support_email)
                        }
                    />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                    <InputLabel>Address</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter address"
                        error={formik.touched.address && Boolean(formik.errors.address)}
                    />
                </div>

                {/* Map (Textarea) */}
                <div className="md:col-span-2">
                    <InputLabel>Map (Iframe)</InputLabel>
                    <OutlinedTextarea
                        name="map"
                        value={formik.values.map}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Paste Google Map embed code or URL"
                        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            <Divider className="mt-4! mb-6!" />
            <div className="text-right">
                <Button
                    type="submit"
                    variant="contained"
                    className="mt-6"
                    disabled={isLoading && !formik.dirty}
                >
                    {data?.data ? isLoading ? "Updating Setting" : "Update Setting" : "Save Setting"}
                </Button>
            </div>
        </form>
    );
}
