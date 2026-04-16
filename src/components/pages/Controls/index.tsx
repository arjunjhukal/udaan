import BuildIcon from "@mui/icons-material/Build";
import SecurityIcon from "@mui/icons-material/Security";
import {
	Box,
	CircularProgress,
	Paper,
	Stack,
	Switch,
	Typography
} from "@mui/material";
import { useGetControlsQuery, useUpdateControlsMutation } from "../../../services/controlsApi";
import { showToast } from "../../../slice/toastSlice";
import { useAppDispatch } from "../../../store/hook";
import PageHeader from "../../organism/PageHeader";


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

	// Local draft for the discount form (needs a Save button)
	// const [discountDraft, setDiscountDraft] = useState<GlobalDiscount | null>(null);
	// const [savingDiscount, setSavingDiscount] = useState(false);

	const controls = data?.data;

	// Instant toggle handler for boolean controls
	const handleToggle = async (key: "screen_protection" | "maintenance_mode", value: boolean) => {
		try {
			await updateControls({ [key]: value }).unwrap();
			dispatch(showToast({ message: "Controls updated", severity: "success" }));
		} catch {
			dispatch(showToast({ message: "Failed to update controls", severity: "error" }));
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
			<div className="top__header">
				<PageHeader
					breadcrumb={[
						{
							icon: (
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#1D82F5" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
									<path d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z" stroke="#1D82F5" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							),
							title: "Controls",
						},
					]}
				/>
			</div>

			<Box flex={1} overflow="auto">
				<div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
					{/* Screen Protection */}
					<ControlCard
						icon={<SecurityIcon fontSize="small" />}
						title="Screen Protection"
						description="Block screenshots and screen recording across the mobile app."
						action={
							<Switch
								checked={controls?.screen_protection ?? false}
								onChange={(e) => handleToggle("screen_protection", e.target.checked)}
							/>
						}
					/>

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
