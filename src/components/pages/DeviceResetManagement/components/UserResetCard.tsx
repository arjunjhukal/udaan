import { Avatar, Box, Stack, Typography } from "@mui/material";
import type { DeviceResetRequestProps } from "../../../../types/deviceReset";
import { formatDatePattern } from "../../../../utils/dateFormat";
import { getInitials } from "../../../../utils/getInitials";

interface Props {
	request: DeviceResetRequestProps;
	onClick?: () => void;
	active?: boolean;
}

export default function UserResetCard({ request, onClick, active = false }: Props) {
	const initials = getInitials(request.name);

	return (
		<Box
			onClick={onClick}
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 1.5,
				px: 2,
				py: 1.75,
				color: active ? "primary.contrastText" : "",
				bgcolor: active ? "primary.main" : "transparent",
				borderRadius: "16px",
				cursor: "pointer",
				transition: "all 0.18s ease",
				"&:hover": {
					bgcolor: "primary.main",
					color: "primary.contrastText",
				},
				mb: "2px"
			}}
		>
			<Avatar
				src={request.thumbnail_url ?? undefined}
				sx={{
					width: 42,
					height: 42,
					bgcolor: "primary.light",
					color: "primary.main",
					fontSize: 13,
					fontWeight: 600,
					flexShrink: 0,
				}}
			>
				{initials}
			</Avatar>

			<Box flex={1} minWidth={0}>
				<Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.25}>
					<div className="requesting__user">

						<Typography variant="h5" fontWeight={500} noWrap>
							{request.name || "Unnamed user"}
						</Typography>
						<Typography variant="subtitle2" fontWeight={400}>
							UD-{request.user_id}
						</Typography>
						<Typography variant="caption" fontWeight={300} className="mt-1!">
							Last: {formatDatePattern(request.updated_at, "MMM d, yyyy")}
						</Typography>
					</div>

					<div className="request__wrapper">
						<Typography variant="h3" fontWeight={500}>{request.request_count}</Typography>
						<Typography variant="subtitle1" fontWeight={400}>Requests</Typography>
					</div>

				</Stack>

			</Box>
		</Box>
	);
}
