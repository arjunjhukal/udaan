import {
	Button,
	FormHelperText,
	InputLabel,
	OutlinedInput,
} from "@mui/material";
import Password from "../../atoms/Password";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../../../services/authApi";
import { setItem } from "../../../utils/localStorageUtil";
import { useAppDispatch } from "../../../store/hook";
import { showToast } from "../../../slice/toastSlice";
import { useNavigate } from "react-router-dom";

export default function LoginForm({
	requirePassword = false,
}: {
	requirePassword?: boolean;
}) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const validationSchema = Yup.object().shape({
		email: Yup.string().required("Email or Phone Number is required"),
		password: requirePassword
			? Yup.string().required("Password is required")
			: Yup.string(),
	});
	const [loginUser, { isLoading }] = useLoginMutation();
	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema,
		onSubmit: async (values) => {
			try {
				const response = await loginUser({
					email: values.email,
					password: values.password || "",
				}).unwrap();
				dispatch(
					showToast({
						message: response?.message || "Login Successful",
						severity: "success",
					}),
				);
				setItem("user", response?.data?.user);
				setItem("token", response?.data?.token);
				navigate("/dashboard");
			} catch (error) {
				console.error("Login error:", error);
			}
		},
	});

	return (
		<form onSubmit={formik.handleSubmit} className="login__form">
			<div className="input__field mb-6">
				<InputLabel>Email Address</InputLabel>
				<OutlinedInput
					fullWidth
					id="email"
					name="email"
					placeholder="Enter your email address"
					value={formik.values.email}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.email && Boolean(formik.errors.email)}
				/>
				{formik.touched.email && formik.errors.email && (
					<FormHelperText error={true} sx={{ mt: 0.5 }}>
						{formik.errors.email}
					</FormHelperText>
				)}
			</div>

			{requirePassword && (
				<div className="input__field mb-6">
					<InputLabel>Password</InputLabel>
					<Password
						id="password"
						name="password"
						value={formik.values.password}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.password && Boolean(formik.errors.password)}
						helperText={formik.touched.password ? formik.errors.password : ""}
					/>
				</div>
			)}

			<Button
				type="submit"
				variant="contained"
				color="primary"
				fullWidth
				disabled={formik.isSubmitting || !formik.dirty}>
				{isLoading ? "Signing In..." : "Sign In"}
			</Button>
		</form>
	);
}
