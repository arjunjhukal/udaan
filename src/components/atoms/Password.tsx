import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
	FormHelperText,
	IconButton,
	InputAdornment,
	OutlinedInput,
} from "@mui/material";
import { useState } from "react";

interface PasswordProps {
	id?: string;
	name?: string;
	value?: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	error?: boolean;
	helperText?: string;
	placeholder?: string;
}

export default function Password({
	id,
	name = "password",
	value,
	onChange,
	onBlur,
	error = false,
	helperText = "",
	placeholder = "Enter your Password",
}: PasswordProps) {
	const [showPassword, setShowPassword] = useState(false);

	const handleTogglePassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		event.preventDefault();
	};

	return (
		<>
			<OutlinedInput
				fullWidth
				id={id || name}
				name={name}
				type={showPassword ? "text" : "password"}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				placeholder={placeholder}
				error={error}
				endAdornment={
					<InputAdornment position="end">
						<IconButton
							aria-label="toggle password visibility"
							onClick={handleTogglePassword}
							onMouseDown={handleMouseDownPassword}
							edge="end"
							sx={{ p: 0 }}>
							{showPassword ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</InputAdornment>
				}
			/>
			{helperText && (
				<FormHelperText error={error} sx={{ mt: 0.5 }}>
					{helperText}
				</FormHelperText>
			)}
		</>
	);
}
