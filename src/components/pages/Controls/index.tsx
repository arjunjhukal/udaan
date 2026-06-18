import BuildIcon from "@mui/icons-material/Build";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SecurityIcon from "@mui/icons-material/Security";
import SmsIcon from "@mui/icons-material/Sms";
import {
	Box,
	Button,
	CircularProgress,
	Divider,
	MenuItem,
	OutlinedInput,
	Paper,
	Select,
	Stack,
	Switch,
	Typography
} from "@mui/material";
import { useState } from "react";
import { useGetControlsQuery, useUpdateControlsMutation } from "../../../services/controlsApi";
import { showToast } from "../../../slice/toastSlice";
import { useAppDispatch } from "../../../store/hook";

const AUTO_ENABLE_DURATIONS: { label: string; value: number }[] = [
	{ label: "1 minute", value: 1 },
	{ label: "5 minutes", value: 5 },
	{ label: "1 hour", value: 60 },
	{ label: "1 day", value: 1440 },
	{ label: "7 days", value: 10080 },
];

const formatDuration = (mins: number) =>
	AUTO_ENABLE_DURATIONS.find((d) => d.value === mins)?.label ?? `${mins} minute${mins === 1 ? "" : "s"}`;


interface ControlCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	action: React.ReactNode;
}

function ControlCard({ icon, title, description, action }: ControlCardProps) {
	return (
		<Paper
			variant="outlined"
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: 2,
				p: "20px 24px",
				borderRadius: 2,
			}}
		>
			<Stack direction="row" alignItems="center" gap={2}>
				<Box
					sx={{
						width: 44,
						height: 44,
						borderRadius: 2,
						bgcolor: "primary.light",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "primary.main",
						flexShrink: 0,
					}}
				>
					{icon}
				</Box>
				<Box>
					<Typography variant="subtitle1" fontWeight={600}>
						{title}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{description}
					</Typography>
				</Box>
			</Stack>
			<Box sx={{ flexShrink: 0 }}>{action}</Box>
		</Paper>
	);
}


export default function ControlsRoot() {
	const dispatch = useAppDispatch();
	const { data, isLoading } = useGetControlsQuery();
	const [updateControls] = useUpdateControlsMutation();

	const [otpDraft, setOtpDraft] = useState<number | null>(null);
	const [savingOtp, setSavingOtp] = useState(false);

	const controls = data?.data;
	const otpLimit = otpDraft ?? controls?.otp_limit ?? 5;

	// Instant toggle handler for boolean controls
	const handleToggle = async (
		key: "screen_protection" | "maintenance_mode" | "auto_enable_screen_protection",
		value: boolean,
	) => {
		try {
			await updateControls({ [key]: value }).unwrap();
			dispatch(showToast({ message: "Controls updated", severity: "success" }));
		} catch {
			dispatch(showToast({ message: "Failed to update controls", severity: "error" }));
		}
	};

	const handleDurationChange = async (value: number) => {
		try {
			await updateControls({ auto_enable_after_minutes: value }).unwrap();
			dispatch(showToast({ message: "Auto re-enable duration updated", severity: "success" }));
		} catch {
			dispatch(showToast({ message: "Failed to update controls", severity: "error" }));
		}
	};

	const handleSaveOtpLimit = async () => {
		if (otpDraft === null) return;
		setSavingOtp(true);
		try {
			await updateControls({ otp_limit: otpDraft }).unwrap();
			setOtpDraft(null);
			dispatch(showToast({ message: "OTP limit updated", severity: "success" }));
		} catch {
			dispatch(showToast({ message: "Failed to update OTP limit", severity: "error" }));
		} finally {
			setSavingOtp(false);
		}
	};

	// Discount toggle — enable/disable instantly, open draft for editing
	// const handleDiscountToggle = async (enabled: boolean) => {
	// 	const current = controls?.global_discount ?? { enabled: false, percentage: 0, label: "" };
	// 	const updated = { ...current, enabled };
	// 	try {
	// 		await updateControls({ global_discount: updated }).unwrap();
	// 		dispatch(showToast({ message: "Controls updated", severity: "success" }));
	// 	} catch {
	// 		dispatch(showToast({ message: "Failed to update controls", severity: "error" }));
	// 	}
	// };

	// Save discount details (percentage + label)
	// const handleSaveDiscount = async () => {
	// 	if (!discountDraft) return;
	// 	setSavingDiscount(true);
	// 	try {
	// 		await updateControls({ global_discount: discountDraft }).unwrap();
	// 		setDiscountDraft(null);
	// 		dispatch(showToast({ message: "Discount saved", severity: "success" }));
	// 	} catch {
	// 		dispatch(showToast({ message: "Failed to save discount", severity: "error" }));
	// 	} finally {
	// 		setSavingDiscount(false);
	// 	}
	// };

	// Resolve discount — prefer in-progress draft, fall back to server value
	// const discount = discountDraft ?? controls?.global_discount ?? { enabled: false, percentage: 0, label: "" };

	if (isLoading) {
		return (
			<Box display="flex" alignItems="center" justifyContent="center" height="100%">
				<CircularProgress size={28} />
			</Box>
		);
	}

	return (
		<Box display="flex" flexDirection="column" height="100%" overflow="hidden">
			<Box flex={1} overflow="auto">
				<div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 ">
					{/* Screen Protection */}
					<Paper
						variant="outlined"
						sx={{ p: "20px 24px", borderRadius: 2, display: "flex", flexDirection: "column", gap: 2 }}
					>
						<Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
							<Stack direction="row" alignItems="center" gap={2}>
								<Box
									sx={{
										width: 44,
										height: 44,
										borderRadius: 2,
										bgcolor: "primary.light",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "primary.main",
										flexShrink: 0,
									}}
								>
									<SecurityIcon fontSize="small" />
								</Box>
								<Box>
									<Typography variant="subtitle1" fontWeight={600}>
										Screen Protection
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Block screenshots and screen recording across the mobile app.
									</Typography>
								</Box>
							</Stack>
							<Switch
								checked={controls?.screen_protection ?? false}
								onChange={(e) => handleToggle("screen_protection", e.target.checked)}
							/>
						</Stack>

						<Divider />

						<Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
							<Box>
								<Typography variant="subtitle2" fontWeight={600}>
									Auto re-enable
								</Typography>
								<Typography variant="caption" color="text.secondary">
									Automatically turn protection back on after it's disabled.
								</Typography>
							</Box>
							<Switch
								checked={controls?.auto_enable_screen_protection ?? false}
								onChange={(e) => handleToggle("auto_enable_screen_protection", e.target.checked)}
							/>
						</Stack>

						<Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
							<Typography variant="body2" color="text.secondary">
								Re-enable after
							</Typography>
							<Select
								size="small"
								value={controls?.auto_enable_after_minutes ?? 5}
								disabled={!(controls?.auto_enable_screen_protection ?? false)}
								onChange={(e) => handleDurationChange(Number(e.target.value))}
								sx={{ minWidth: 140 }}
							>
								{AUTO_ENABLE_DURATIONS.map((d) => (
									<MenuItem key={d.value} value={d.value}>
										{d.label}
									</MenuItem>
								))}
							</Select>
						</Stack>

						{!controls?.screen_protection && controls?.auto_enable_screen_protection && (
							<Stack
								direction="row"
								alignItems="center"
								gap={1}
								sx={{
									bgcolor: "warning.light",
									color: "warning.dark",
									p: "10px 14px",
									borderRadius: 1.5,
								}}
							>
								<InfoOutlinedIcon fontSize="small" />
								<Typography variant="body2">
									Will auto re-enable after {formatDuration(controls?.auto_enable_after_minutes ?? 5)}.
								</Typography>
							</Stack>
						)}
					</Paper>

					{/* Maintenance Mode */}
					<ControlCard
						icon={<BuildIcon fontSize="small" />}
						title="Maintenance Mode"
						description="Take the app offline for users and display a maintenance screen."
						action={
							<Switch
								checked={controls?.maintenance_mode ?? false}
								onChange={(e) => handleToggle("maintenance_mode", e.target.checked)}
							/>
						}
					/>

					{/* OTP Limit */}
					<Paper
						variant="outlined"
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: 2,
							p: "20px 24px",
							borderRadius: 2,
						}}
					>
						<Stack direction="row" alignItems="center" gap={2} flex={1}>
							<Box
								sx={{
									width: 44,
									height: 44,
									borderRadius: 2,
									bgcolor: "primary.light",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "primary.main",
									flexShrink: 0,
								}}
							>
								<SmsIcon fontSize="small" />
							</Box>
							<Box flex={1}>
								<Typography variant="subtitle1" fontWeight={600}>
									OTP Limit
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Maximum number of OTP requests a user can make per day.
								</Typography>
							</Box>
						</Stack>

						<OutlinedInput
							fullWidth
							type="number"
							size="small"
							value={otpLimit}
							inputProps={{ min: 1, max: 100 }}
							onChange={(e) =>
								setOtpDraft(Math.min(100, Math.max(1, Number(e.target.value))))
							}
						/>
						<Button
							variant="contained"
							size="small"
							disabled={savingOtp || otpDraft === null}
							onClick={handleSaveOtpLimit}
							startIcon={savingOtp ? <CircularProgress size={14} color="inherit" /> : undefined}
							sx={{ height: 40 }}
						>
							Save
						</Button>
					</Paper>

					{/* Global Discount */}
					{/* <Paper
						variant="outlined"
						sx={{ p: "20px 24px", borderRadius: 2 }}
					>
						<Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
							<Stack direction="row" alignItems="center" gap={2}>
								<Box
									sx={{
										width: 44,
										height: 44,
										borderRadius: 2,
										bgcolor: "primary.light",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "primary.main",
										flexShrink: 0,
									}}
								>
									<PercentIcon fontSize="small" />
								</Box>
								<Box>
									<Typography variant="subtitle1" fontWeight={600}>
										Global Discount
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Apply a platform-wide promotional discount to all purchases.
									</Typography>
								</Box>
							</Stack>
							<Switch
								checked={discount.enabled}
								onChange={(e) => handleDiscountToggle(e.target.checked)}
							/>
						</Stack>

						{discount.enabled && (
							<>
								<Divider sx={{ my: 2 }} />
								<Stack direction={{ xs: "column", sm: "row" }} gap={2} alignItems="flex-end">
									<Box flex={1}>
										<Typography variant="caption" color="text.secondary" fontWeight={500} display="block" mb={0.5}>
											Discount (%)
										</Typography>
										<OutlinedInput
											type="number"
											size="small"
											fullWidth
											value={discount.percentage}
											inputProps={{ min: 1, max: 100 }}
											endAdornment={<InputAdornment position="end">%</InputAdornment>}
											onChange={(e) =>
												setDiscountDraft({
													...discount,
													percentage: Math.min(100, Math.max(0, Number(e.target.value))),
												})
											}
										/>
									</Box>
									<Box flex={2}>
										<Typography variant="caption" color="text.secondary" fontWeight={500} display="block" mb={0.5}>
											Offer Label
										</Typography>
										<OutlinedInput
											size="small"
											fullWidth
											placeholder="e.g. Dashain Offer"
											value={discount.label}
											onChange={(e) =>
												setDiscountDraft({ ...discount, label: e.target.value })
											}
										/>
									</Box>
									<Button
										variant="contained"
										disabled={savingDiscount || !discountDraft}
										onClick={handleSaveDiscount}
										startIcon={savingDiscount ? <CircularProgress size={14} color="inherit" /> : undefined}
										sx={{ flexShrink: 0, height: 40 }}
									>
										Save
									</Button>
								</Stack>
							</>
						)}
					</Paper> */}
				</div>
			</Box>
		</Box>
	);
}
