import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";
import type { DeviceResetSingleRequest } from "../../../../types/deviceReset";
import RequestDetailDialog from "./RequestDetailDialog";

interface Props {
	request: DeviceResetSingleRequest;
	user: { id: number; name: string };
	userId: number;
	isLast: boolean;
}

const statusColor: Record<string, string> = {
	pending: "#F59E0B",
	approved: "#10B981",
	rejected: "#EF4444",
};

export default function RequestTimelineItem({ request, user, userId, isLast }: Props) {
	const theme = useTheme();
	const [dialogOpen, setDialogOpen] = useState(false);
	const dotColor = statusColor[request.status] ?? "#9CA3AF";

	return (
		<>
			<Stack direction="row" gap={2}>
				{/* Timeline line + dot */}
				<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 0.5 }}>
					<Box
						sx={{
							width: 12,
							height: 12,
							borderRadius: "50%",
							bgcolor: dotColor,
							flexShrink: 0,
							border: "2px solid",
							borderColor: "background.paper",
							boxShadow: `0 0 0 2px ${dotColor}40`,
						}}
					/>
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
				<Box
					onClick={() => setDialogOpen(true)}
					sx={{
						flex: 1,
						mb: isLast ? 0 : 2,
						p: 2,
						borderRadius: 2,
						border: "1px solid",
						borderColor: "divider",
						bgcolor: "background.paper",
						cursor: "pointer",
						transition: "box-shadow 0.18s ease",
						"&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
					}}
				>
					<Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
						<Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
							<Typography variant="subtitle2" fontWeight={700} color="primary">
								{request.code}
							</Typography>
							{request.device_name && (
								<Typography variant="caption" color="text.secondary">
									{request.device_name}
								</Typography>
							)}
						</Stack>
						<Stack direction="row" gap={1} alignItems="center">
							<Chip
								label={request.status}
								size="small"
								sx={{
									bgcolor: `${dotColor}20`,
									color: dotColor,
									fontWeight: 600,
									fontSize: 11,
									height: 22,
									textTransform: "capitalize",
								}}
							/>
							<Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
								{format(new Date(request.created_at), "MMM d, yyyy")}
							</Typography>
						</Stack>
					</Stack>

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
			</Stack>

			<RequestDetailDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				request={request}
				user={user}
				userId={userId}
			/>
		</>
	);
}
