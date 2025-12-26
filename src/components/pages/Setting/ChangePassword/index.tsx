import { Divider, InputLabel, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useChangePasswordMutation } from "../../../../services/settingApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import Password from "../../../atoms/Password";
import FooterAction from "../../../molecules/FooterAction";

const validationSchema = Yup.object({
    current_password: Yup.string().required("Change Password is required"),
    password: Yup.string().required("Password is required"),
    password_confirmation: Yup.string().required("Password Confirmation is required"),
})

export default function ChangePassword() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const formik = useFormik({
        initialValues: {
            current_password: "",
            password: "",
            password_confirmation: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await changePassword(values).unwrap();

                dispatch(
                    showToast({
                        message: "Password Changed Successfully",
                        severity: "success",
                    })
                );
                formik.resetForm();
            } catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Unable to change password",
                        severity: "error",
                    })
                );
            }
        },
    });

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="change__password__page__root"
        >
            <Typography variant="h5">
                {t("messages.change_password")}
            </Typography>

            <Divider className="mt-4! mb-6!" />

            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3">
                {/* Current Password */}
                <div className="col-span-1">
                    <InputLabel className="required">
                        Current Password
                    </InputLabel>

                    <Password
                        name="current_password"
                        value={formik.values.current_password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.current_password &&
                            Boolean(formik.errors.current_password)
                        }
                        helperText={
                            formik.touched.current_password
                                ? formik.errors.current_password
                                : ""
                        }
                        placeholder="Enter current password"
                    />
                </div>

                {/* New Password */}
                <div className="col-span-1">
                    <InputLabel className="required">
                        New Password
                    </InputLabel>

                    <Password
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.password &&
                            Boolean(formik.errors.password)
                        }
                        helperText={
                            formik.touched.password
                                ? formik.errors.password
                                : ""
                        }
                        placeholder="Enter new password"
                    />
                </div>

                {/* Confirm Password */}
                <div className="col-span-1">
                    <InputLabel className="required">
                        Confirm Password
                    </InputLabel>

                    <Password
                        name="password_confirmation"
                        value={formik.values.password_confirmation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.password_confirmation &&
                            Boolean(formik.errors.password_confirmation)
                        }
                        helperText={
                            formik.touched.password_confirmation
                                ? formik.errors.password_confirmation
                                : ""
                        }
                        placeholder="Confirm new password"
                    />
                </div>
            </div>

            <FooterAction
                handleConfirmationChange={() => navigate(-1)}
                isLoading={isLoading}
                isUpdating={isLoading}
                buttonLabel="New Password"
            />
        </form>
    );
}

