import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Button, Divider, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useGetSmsGatewaySettingsQuery, useUpdateSmsGatewaySettingsMutation } from "../../../../../services/settingApi";
import { showToast } from "../../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../../store/hook";
import type { SmsGatewayProvider } from "../../../../../types/setting";

export default function SmsGatewayRoot() {
    const dispatch = useAppDispatch();
    const { data } = useGetSmsGatewaySettingsQuery();
    const [updateSms, { isLoading }] = useUpdateSmsGatewaySettingsMutation();
    const [showKey, setShowKey] = useState(false);

    const formik = useFormik({
        initialValues: {
            provider: (data?.data?.provider || "sparrow") as SmsGatewayProvider,
            api_key: "",
            sender_id: data?.data?.sender_id || "",
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            const payload: Record<string, any> = {
                provider: values.provider,
                sender_id: values.sender_id,
            };
            if (values.api_key) payload.api_key = values.api_key;

            try {
                const res = await updateSms(payload).unwrap();
                dispatch(showToast({ message: res?.message || "SMS Gateway settings updated", severity: "success" }));
                formik.setFieldValue("api_key", "");
            } catch (e: any) {
                dispatch(showToast({ message: e?.data?.message || "Unable to update SMS Gateway settings", severity: "error" }));
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="app__settings__page__root pb-4 lg:pb-6">
            <Typography variant="h5">SMS Gateway</Typography>
            <Divider className="mt-4! mb-4!" />

            <Alert severity="info" className="mb-6!">
                API keys are stored securely and never returned in responses. Leave the API key blank to keep the existing value.
            </Alert>

            {data?.data?.api_key && (
                <div className="mb-4">
                    <Typography variant="caption" color="text.secondary">
                        Current API Key: <strong>{data.data.api_key}</strong>
                    </Typography>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <InputLabel>Provider</InputLabel>
                    <FormControl fullWidth>
                        <Select
                            name="provider"
                            value={formik.values.provider}
                            onChange={formik.handleChange}
                        >
                            <MenuItem value="samaya">Samaya SMS</MenuItem>
                            <MenuItem value="aakash">Aakash SMS</MenuItem>
                            <MenuItem value="custom">Custom</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div>
                    <InputLabel>Sender ID</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="sender_id"
                        value={formik.values.sender_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. MAKURA"
                    />
                </div>

                <div>
                    <InputLabel>API Key</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="api_key"
                        type={showKey ? "text" : "password"}
                        value={formik.values.api_key}
                        onChange={formik.handleChange}
                        placeholder="Enter new API key (blank = keep existing)"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowKey((v) => !v)} edge="end">
                                    {showKey ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </div>
            </div>

            <Divider className="mt-6! mb-6!" />
            <div className="text-right">
                <Button type="submit" variant="contained" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Update SMS Gateway"}
                </Button>
            </div>
        </form>
    );
}
