import CloseIcon from "@mui/icons-material/Close";
import {
	Box,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	Typography,
	useTheme,
} from "@mui/material";
import { format } from "date-fns";
import type { DeviceResetSingleRequest } from "../../../../types/deviceReset";
import { RequestStatusColor } from "../../../../utils/statusMap";
import ReviewActions from "./ReviewActions";

interface Props {
	open: boolean;
	onClose: () => void;
	request: DeviceResetSingleRequest;
	user: { id: number; name: string };
	userId: number;
	onReviewSuccess?: () => void;
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<Box>
			<Typography variant="caption" color="text.secondary" fontWeight={500}>
				{label}
			</Typography>
			<Typography variant="body2" fontWeight={400} mt={0.25}>
				{value}
			</Typography>
		</Box>
	);
}

export default function RequestDetailDialog({ open, onClose, request, user, userId, onReviewSuccess }: Props) {
	const theme = useTheme();
	const variant = RequestStatusColor(request.status);

	const paletteColor = {
		success: theme.palette.success,
		error: theme.palette.error,
		warning: theme.palette.warning,
		info: theme.palette.info,
		primary: theme.palette.primary,
	}[variant];

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
				<Typography variant="h6" fontWeight={700}>
					Request Details
				</Typography>
				<IconButton size="small" onClick={onClose}>
					<CloseIcon fontSize="small" />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={{ pt: 0 }}>
				<Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2.5, mb: 2 }}>
					<DetailField label="Full Name" value={user.name} />
					<DetailField label="User - ID" value={`UID${user.id}`} />
					<DetailField
						label="Submitted"
						value={format(new Date(request.created_at), "do MMM, yyyy")}
					/>
					<DetailField label="Old Token" value={request.old_token ?? "—"} />
					<DetailField label="New Token" value={request.new_token ?? "—"} />
					<Box>
						<Typography variant="caption" color="text.secondary" fontWeight={500}>
							Status
						</Typography>
						<Box mt={0.5}>
							<Chip
								label={request.status}
								size="small"
								sx={{
									bgcolor: paletteColor.light,
									border: `1px solid ${paletteColor.main}`,
									color: paletteColor.main,
									fontSize: 11,
									height: 22,
									textTransform: "capitalize",
								}}
							/>
						</Box>
					</Box>
					<Box sx={{ gridColumn: "1 / -1" }}>
						<DetailField label="Reason" value={request.reason} />
					</Box>
					<Box sx={{ gridColumn: "1 / -1" }}>
						<Typography variant="caption" color="text.secondary" fontWeight={500}>
							Situations
						</Typography>
						<Typography variant="body2" mt={0.25} sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
							{request.situation}
						</Typography>
					</Box>
				</Box>

				{request.reviewed_by && (
					<Typography variant="caption" color="text.secondary" display="block" mb={2}>
						Reviewed by: {request.reviewed_by}
					</Typography>
				)}

				{request.status === "pending" && (
					<>
						<Divider sx={{ mb: 2 }} />
						<ReviewActions requestId={request.id} userId={userId} onSuccess={() => { onClose(); onReviewSuccess?.(); }} />
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
