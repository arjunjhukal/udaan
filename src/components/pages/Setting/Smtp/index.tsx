import { Button, Divider, InputLabel, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useGetSmtpSettingsQuery, useUpdateSmtpSettingsMutation } from "../../../../services/settingApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import type { SmtpSettingProps } from "../../../../types/setting";

export default function SmtpSettingRoot() {
    const dispatch = useAppDispatch();
    const { data } = useGetSmtpSettingsQuery();
    const [updateSmtp, { isLoading }] = useUpdateSmtpSettingsMutation();

    const formik = useFormik<SmtpSettingProps>({
        initialValues: {
            host: data?.data?.host || "",
            port: data?.data?.port || 587,
            encryption: data?.data?.encryption || "tls",
            username: data?.data?.username || "",
            password: "",
            from_name: data?.data?.from_name || "",
            from_email: data?.data?.from_email || "",
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const res = await updateSmtp(values).unwrap();
                dispatch(showToast({ message: res?.message || "SMTP settings updated", severity: "success" }));
            } catch (e: any) {
                dispatch(showToast({ message: e?.data?.message || "Unable to update SMTP settings", severity: "error" }));
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="app__settings__page__root pb-4 lg:pb-6">
            <Typography variant="h5">SMTP Configuration</Typography>
            <Divider className="mt-4! mb-6!" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <InputLabel>SMTP Host</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="host"
                        value={formik.values.host}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. smtp.gmail.com"
                    />
                </div>

                <div>
                    <InputLabel>Port</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="port"
                        type="number"
                        value={formik.values.port}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. 587"
                    />
                </div>

                <div>
                    <InputLabel>Encryption</InputLabel>
                    <Select
                        fullWidth
                        name="encryption"
                        value={formik.values.encryption}
                        onChange={formik.handleChange}
                    >
                        <MenuItem value="tls">TLS</MenuItem>
                        <MenuItem value="ssl">SSL</MenuItem>
                        <MenuItem value="none">None</MenuItem>
                    </Select>
                </div>

                <div>
                    <InputLabel>Username</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="SMTP username or email"
                    />
                </div>

                <div>
                    <InputLabel>Password</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Leave blank to keep existing password"
                    />
                </div>

                <div>
                    <InputLabel>From Name</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="from_name"
                        value={formik.values.from_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. Makura Academy"
                    />
                </div>

                <div className="md:col-span-2">
                    <InputLabel>From Email</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="from_email"
                        type="email"
                        value={formik.values.from_email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. noreply@makura.com"
                    />
                </div>
            </div>

            <Divider className="mt-6! mb-6!" />
            <div className="text-right">
                <Button type="submit" variant="contained" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save SMTP Settings"}
                </Button>
            </div>
        </form>
    );
}
