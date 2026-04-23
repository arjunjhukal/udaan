import { Alert, Box, Button, Chip, Divider, InputLabel, MenuItem, OutlinedInput, Select, Switch, Tooltip, Typography } from "@mui/material";
import { useFormik } from "formik";
import {
    useGetEsewaSettingsQuery,
    useToggleEsewaActiveMutation,
    useUpdateEsewaSettingsMutation,
} from "../../../../../services/settingApi";
import { showToast } from "../../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../../store/hook";
import Password from "../../../../atoms/Password";

export default function EsewaSettingRoot() {
    const dispatch = useAppDispatch();
    const { data } = useGetEsewaSettingsQuery();
    const [updateEsewa, { isLoading }] = useUpdateEsewaSettingsMutation();
    const [toggleEsewa, { isLoading: toggling }] = useToggleEsewaActiveMutation();

    const isActive = data?.data?.is_active ?? false;

    const handleToggle = async () => {
        try {
            await toggleEsewa().unwrap();
        } catch (e: any) {
            dispatch(showToast({ message: e?.data?.message || "Failed to update eSewa status", severity: "error" }));
        }
    };

    const formik = useFormik({
        initialValues: {
            merchant_id: data?.data?.merchant_id || "",
            product_code: data?.data?.product_code || "",
            secret_key: "",
            merchant_secret: "",
            mode: data?.data?.mode ?? "test",
        },
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            const payload: Record<string, any> = {
                merchant_id: values.merchant_id,
                product_code: values.product_code,
                mode: values.mode,
            };
            if (values.secret_key) payload.secret_key = values.secret_key;
            if (values.merchant_secret) payload.merchant_secret = values.merchant_secret;

            try {
                const res = await updateEsewa(payload).unwrap();
                dispatch(showToast({ message: res?.message || "eSewa settings updated", severity: "success" }));
                resetForm({ values: { ...values, secret_key: "", merchant_secret: "" } });
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
                <Tooltip title={isActive ? "Disable eSewa" : "Enable eSewa"}>
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
                Secret keys are stored securely and never returned in responses. Leave secret fields blank to keep the existing values.
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <InputLabel className="required">Merchant ID</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="merchant_id"
                        value={formik.values.merchant_id}
                        onChange={formik.handleChange}
                        placeholder="eSewa Merchant ID"
                    />
                </div>

                <div>
                    <InputLabel className="required">Product Code</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="product_code"
                        value={formik.values.product_code}
                        onChange={formik.handleChange}
                        placeholder="eSewa Product Code"
                    />
                </div>

                <div>
                    <InputLabel>Secret Key <span style={{ fontWeight: 400, fontSize: 12, marginLeft: 4 }}>(blank = keep existing)</span></InputLabel>
                    <Password
                        name="secret_key"
                        value={formik.values.secret_key}
                        onChange={formik.handleChange}
                        placeholder="Enter new secret key to replace"
                    />
                </div>

                <div>
                    <InputLabel>Merchant Secret <span style={{ fontWeight: 400, fontSize: 12, marginLeft: 4 }}>(blank = keep existing)</span></InputLabel>
                    <Password
                        name="merchant_secret"
                        value={formik.values.merchant_secret}
                        onChange={formik.handleChange}
                        placeholder="Enter new merchant secret to replace"
                    />
                </div>

                <div>
                    <InputLabel className="required">Mode</InputLabel>
                    <Select
                        fullWidth
                        name="mode"
                        value={formik.values.mode}
                        onChange={formik.handleChange}
                    >
                        <MenuItem value="test">Test (Sandbox)</MenuItem>
                        <MenuItem value="live">Live (Production)</MenuItem>
                    </Select>
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
