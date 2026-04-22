import {
    Button,
    Divider,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useGetLoginTypeSettingQuery, useUpdateLoginTypeSettingMutation } from "../../../../services/settingApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import type { LoginTypeSettingProps } from "../../../../types/setting";

export default function LoginTypeRoot() {
    const dispatch = useAppDispatch();
    const { data } = useGetLoginTypeSettingQuery();
    const [updateLoginType, { isLoading }] = useUpdateLoginTypeSettingMutation();

    const formik = useFormik<LoginTypeSettingProps>({
        initialValues: {
            login_type: data?.data?.login_type ?? "password",
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const res = await updateLoginType(values).unwrap();
                dispatch(showToast({ message: res?.message || "Login type updated", severity: "success" }));
            } catch (e: any) {
                dispatch(showToast({ message: e?.data?.message || "Unable to update login type", severity: "error" }));
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="app__settings__page__root pb-4 lg:pb-6">
            <Typography variant="h5">Login Type</Typography>
            <Divider className="mt-4! mb-6!" />

            <Typography variant="body2" color="text.secondary" className="mb-4!">
                Choose how users can log in to the platform. This setting affects the mobile app and web login screens.
            </Typography>

            <RadioGroup
                name="login_type"
                value={formik.values.login_type}
                onChange={formik.handleChange}
                className="gap-2"
            >
                <FormControlLabel
                    value="password"
                    control={<Radio />}
                    label={
                        <div>
                            <Typography variant="subtitle2" fontWeight={500}>Password</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Users log in with their email and password.
                            </Typography>
                        </div>
                    }
                />
                <FormControlLabel
                    value="otp"
                    control={<Radio />}
                    label={
                        <div>
                            <Typography variant="subtitle2" fontWeight={500}>OTP</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Users receive a one-time password via SMS or email to log in.
                            </Typography>
                        </div>
                    }
                />
                <FormControlLabel
                    value="both"
                    control={<Radio />}
                    label={
                        <div>
                            <Typography variant="subtitle2" fontWeight={500}>Both</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Users can choose between password or OTP login.
                            </Typography>
                        </div>
                    }
                />
            </RadioGroup>

            <Divider className="mt-6! mb-6!" />
            <div className="text-right">
                <Button type="submit" variant="contained" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Login Type"}
                </Button>
            </div>
        </form>
    );
}
