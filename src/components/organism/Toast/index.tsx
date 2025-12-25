import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import { hideToast } from "../../../slice/toastSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
export default function Toast() {
	const dispatch = useAppDispatch();
	const theme = useTheme();

	const { open, message, severity } = useAppSelector((state) => state.toast);

	const handleClose = (reason: any) => {
		if (reason === "clickaway") return;
		dispatch(hideToast());
	};

	const borderColor =
		severity === "success"
			? theme.palette.success.main
			: severity === "warning"
				? theme.palette.warning.main
				: severity === "error"
					? theme.palette.error.main
					: "grey";
	const bgColor =
		severity === "success"
			? theme.palette.success.light
			: severity === "warning"
				? theme.palette.warning.light
				: severity === "error"
					? theme.palette.error.light
					: "grey";

	return (
		<Snackbar
			open={open}
			autoHideDuration={4000}
			onClose={handleClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			sx={{
				width: {
					xs: "100%",
					md: "500px",
				},
			}}>
			<Box
				className={`toast toast__${severity} p-4 rounded-md w-full border `}
				sx={{
					borderColor: borderColor,
					backgroundColor: bgColor,
				}}>
				<Stack justifyContent={"space-between"} alignItems={"center"}>
					<Stack className="!gap-3" alignItems="center">
						{severity === "success" && <CheckCircleIcon color="success" />}
						{severity === "warning" && <WarningIcon color="warning" />}
						{severity === "error" && <CancelIcon color="error" />}
						<Box>
							<Typography
								variant="h5"
								color="text.primary"
								className="capitalize">
								{severity}
							</Typography>
							<Typography variant="subtitle2" color="text.secondary">
								{message}
							</Typography>
						</Box>
					</Stack>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</Stack>
			</Box>
		</Snackbar>
	);
}
