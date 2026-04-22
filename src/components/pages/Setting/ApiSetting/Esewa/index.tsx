import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Box, Button, Chip, Divider, FormControlLabel, IconButton, InputAdornment, InputLabel, OutlinedInput, Switch, Tooltip, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import {
    useGetEsewaSettingsQuery,
    useGetKhaltiSettingsQuery,
    useToggleEsewaActiveMutation,
    useUpdateEsewaSettingsMutation,
} from "../../../../../services/settingApi";
import { showToast } from "../../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../../store/hook";

export default function EsewaSettingRoot() {
    const dispatch = useAppDispatch();
    const { data } = useGetEsewaSettingsQuery();
    const { data: khaltiData } = useGetKhaltiSettingsQuery();
    const [updateEsewa, { isLoading }] = useUpdateEsewaSettingsMutation();
    const [toggleEsewa, { isLoading: toggling }] = useToggleEsewaActiveMutation();
    const [showSecret, setShowSecret] = useState(false);

    const isActive = data?.data?.is_active ?? false;
    const khaltiActive = khaltiData?.data?.is_active ?? false;

    const handleToggle = async () => {
        if (isActive && !khaltiActive) {
            dispatch(showToast({ message: "Cannot disable eSewa — at least one payment gateway must remain active", severity: "error" }));
            return;
        }
        try {
            await toggleEsewa().unwrap();
        } catch (e: any) {
            dispatch(showToast({ message: e?.data?.message || "Failed to update eSewa status", severity: "error" }));
        }
    };

    const formik = useFormik({
        initialValues: {
            merchant_id: data?.data?.merchant_id || "",
            secret_key: "",
            test_mode: data?.data?.test_mode ?? true,
        },
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            const payload: Record<string, any> = {
                merchant_id: values.merchant_id,
                test_mode: values.test_mode,
            };
            if (values.secret_key) payload.secret_key = values.secret_key;

            try {
                const res = await updateEsewa(payload).unwrap();
                dispatch(showToast({ message: res?.message || "eSewa settings updated", severity: "success" }));
                resetForm({ values: { ...values, secret_key: "" } });
            } catch (e: any) {
                dispatch(showToast({ message: e?.data?.message || "Unable to update eSewa settings", severity: "error" }));
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="app__settings__page__root pb-4 lg:pb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Typography variant="h5">eSewa Payment</Typography>
                    <Chip
                        label={isActive ? "Active" : "Inactive"}
                        size="small"
                        color={isActive ? "success" : "default"}
                        variant="outlined"
                    />
                </div>
                <Tooltip title={isActive && !khaltiActive ? "Cannot disable — Khalti is also inactive" : ""}>
                    <Box>
                        <Switch
                            checked={isActive}
                            onChange={handleToggle}
                            disabled={toggling}
                            color="primary"
                        />
                    </Box>
                </Tooltip>
            </div>
            <Divider className="mt-4! mb-4!" />

            <Alert severity="info" className="mb-6!">
                Secret keys are stored securely and never returned in responses. Leave the secret key blank to keep the existing value.
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <InputLabel>Merchant ID</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="merchant_id"
                        value={formik.values.merchant_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="eSewa Merchant ID"
                    />
                </div>

                <div>
                    <InputLabel>Secret Key</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="secret_key"
                        type={showSecret ? "text" : "password"}
                        value={formik.values.secret_key}
                        onChange={formik.handleChange}
                        placeholder="Enter new secret key (blank = keep existing)"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowSecret((v) => !v)} edge="end">
                                    {showSecret ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </div>

                <div>
                    <FormControlLabel
                        control={
                            <Switch
                                name="test_mode"
                                checked={formik.values.test_mode}
                                onChange={formik.handleChange}
                            />
                        }
                        label="Test Mode (Sandbox)"
                    />
                </div>
            </div>

            <Divider className="mt-6! mb-6!" />
            <div className="text-right">
                <Button type="submit" variant="contained" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Update eSewa Settings"}
                </Button>
            </div>
        </form>
    );
}
