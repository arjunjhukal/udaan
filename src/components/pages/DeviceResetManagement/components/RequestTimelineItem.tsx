import { Box, Chip, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { format } from "date-fns";
import { Clock, CloseCircle, TickCircle } from "iconsax-reactjs";
import { useState } from "react";
import type { DeviceResetSingleRequest } from "../../../../types/deviceReset";
import type { StatusVariant } from "../../../../utils/statusMap";
import { RequestStatusColor } from "../../../../utils/statusMap";
import RequestDetailDialog from "./RequestDetailDialog";
import ReviewActions from "./ReviewActions";

interface Props {
	request: DeviceResetSingleRequest;
	user: { id: number; name: string };
	userId: number;
	isLast: boolean;
	onReviewSuccess?: () => void;
}

const STATUS_ICON: Record<StatusVariant, React.ReactNode> = {
	success: <TickCircle />,
	error: <CloseCircle />,
	warning: <Clock />,
	info: <Clock />,
	primary: <Clock />,
};

export default function RequestTimelineItem({ request, user, userId, isLast, onReviewSuccess }: Props) {
	const theme = useTheme();
	const [dialogOpen, setDialogOpen] = useState(false);
	const variant = RequestStatusColor(request.status);

	const paletteColor = {
		success: theme.palette.success,
		error: theme.palette.error,
		warning: theme.palette.warning,
		info: theme.palette.info,
		primary: theme.palette.primary,
	}[variant];

	return (
		<>
			<Stack direction="row" gap={2}>
				<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 0.5 }}>
					<IconButton
						sx={{
							width: 40,
							height: 40,
							bgcolor: paletteColor.light,
							color: paletteColor.main,
						}}
					>
						{STATUS_ICON[variant]}
					</IconButton>
					{!isLast && (
						<Box
							sx={{
								width: 2,
								flex: 1,
								minHeight: 24,
								bgcolor: theme.palette.divider,
								mt: 0.5,
							}}
						/>
					)}
				</Box>

				{/* Content card */}
				<Box sx={{ flex: 1, mb: isLast ? 0 : 2 }}>
					<Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
						<Box>
							<Typography variant="subtitle2" fontWeight={500} color="primary">
								{request.code}
							</Typography>
							{request.device_name && (
								<Typography variant="caption" color="text.secondary">
									{request.device_name}
								</Typography>
							)}
						</Box>
						<Stack direction="row" gap={1} alignItems="center">
							<Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
								{format(new Date(request.created_at), "MMM d, yyyy")}
							</Typography>
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
						</Stack>
					</Stack>

					<Box
						onClick={() => setDialogOpen(true)}
						sx={{
							padding: "16px 24px",
							borderRadius: "16px",
							bgcolor: paletteColor.light,
							borderLeft: `4px solid ${paletteColor.main}`,
							cursor: "pointer",
							mb: 1.5,
							transition: "box-shadow 0.18s ease",
							"&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
						}}
					>
						<Typography variant="body2" fontWeight={600} mb={0.5}>
							{request.reason}
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
							{request.situation}
						</Typography>
						{request.reviewed_by && (
							<Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
								Reviewed by: {request.reviewed_by}
							</Typography>
						)}
					</Box>

					{request.status === "pending" && (
						<ReviewActions requestId={request.id} userId={userId} onSuccess={onReviewSuccess} />
					)}
				</Box>
			</Stack>

			<RequestDetailDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				request={request}
				user={user}
				userId={userId}
				onReviewSuccess={onReviewSuccess}
			/>
		</>
	);
}
