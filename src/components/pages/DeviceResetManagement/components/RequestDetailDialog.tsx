import {
	Box,
	Button,
	Chip,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	IconButton,
	Stack,
	Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";
import { useState } from "react";
import type { DeviceResetSingleRequest } from "../../../../types/deviceReset";
import { useReviewResetRequestMutation } from "../../../../services/deviceResetApi";

interface Props {
	open: boolean;
	onClose: () => void;
	request: DeviceResetSingleRequest;
	user: { id: number; name: string };
	userId: number;
}

const statusColor: Record<string, string> = {
	pending: "#F59E0B",
	approved: "#10B981",
	rejected: "#EF4444",
};

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<Box>
			<Typography variant="caption" color="text.secondary" fontWeight={500}>
				{label}
			</Typography>
			<Typography variant="body2" fontWeight={600} mt={0.25}>
				{value}
			</Typography>
		</Box>
	);
}

export default function RequestDetailDialog({ open, onClose, request, user, userId }: Props) {
	const [reviewRequest, { isLoading }] = useReviewResetRequestMutation();
	const [pendingAction, setPendingAction] = useState<"approved" | "rejected" | null>(null);

	const dotColor = statusColor[request.status] ?? "#9CA3AF";

	const handleReview = async (status: "approved" | "rejected") => {
		setPendingAction(status);
		try {
			await reviewRequest({ requestId: request.id, userId, status }).unwrap();
			onClose();
		} finally {
			setPendingAction(null);
		}
	};

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
				<Grid container spacing={2.5} mb={2}>
					<Grid item xs={6} sm={4}>
						<DetailField label="Full Name" value={user.name} />
					</Grid>
					<Grid item xs={6} sm={4}>
						<DetailField label="User - ID" value={`UID${user.id}`} />
					</Grid>
					<Grid item xs={6} sm={4}>
						<DetailField
							label="Submitted"
							value={format(new Date(request.created_at), "do MMM, yyyy")}
						/>
					</Grid>

					<Grid item xs={6} sm={4}>
						<DetailField label="Old Token" value={request.old_token ?? "—"} />
					</Grid>
					<Grid item xs={6} sm={4}>
						<DetailField label="New Token" value={request.new_token ?? "—"} />
					</Grid>
					<Grid item xs={6} sm={4}>
						<Box>
							<Typography variant="caption" color="text.secondary" fontWeight={500}>
								Status
							</Typography>
							<Box mt={0.5}>
								<Chip
									label={request.status}
									size="small"
									sx={{
										bgcolor: `${dotColor}20`,
										color: dotColor,
										fontWeight: 600,
										fontSize: 11,
										textTransform: "capitalize",
									}}
								/>
							</Box>
						</Box>
					</Grid>

					<Grid item xs={12}>
						<DetailField label="Reason" value={request.reason} />
					</Grid>

					<Grid item xs={12}>
						<Box>
							<Typography variant="caption" color="text.secondary" fontWeight={500}>
								Situations
							</Typography>
							<Typography
								variant="body2"
								mt={0.25}
								sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
							>
								{request.situation}
							</Typography>
						</Box>
					</Grid>
				</Grid>

				{request.reviewed_by && (
					<Typography variant="caption" color="text.secondary" display="block" mb={2}>
						Reviewed by: {request.reviewed_by}
					</Typography>
				)}

				{request.status === "pending" && (
					<>
						<Divider sx={{ mb: 2 }} />
						<Stack direction="row" gap={1.5} justifyContent="flex-end">
							<Button
								variant="contained"
								color="error"
								disabled={isLoading}
								onClick={() => handleReview("rejected")}
								startIcon={pendingAction === "rejected" && isLoading ? <CircularProgress size={14} color="inherit" /> : undefined}
								sx={{ minWidth: 100, fontWeight: 600 }}
							>
								Reject
							</Button>
							<Button
								variant="contained"
								color="success"
								disabled={isLoading}
								onClick={() => handleReview("approved")}
								startIcon={pendingAction === "approved" && isLoading ? <CircularProgress size={14} color="inherit" /> : undefined}
								sx={{ minWidth: 200, fontWeight: 600 }}
							>
								Approve and Sign out Old device
							</Button>
						</Stack>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
