import { Avatar, Box, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import type { DeviceResetRequestProps } from "../../../../types/deviceReset";

interface Props {
	request: DeviceResetRequestProps;
	onClick?: () => void;
	active?: boolean;
}

export default function UserResetCard({ request, onClick, active = false }: Props) {
	const initials = request.name
		.split(" ")
		.map((n) => n[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<Box
			onClick={onClick}
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 1.5,
				px: 2,
				py: 1.75,
				bgcolor: active ? "primary.light" : "background.paper",
				borderRadius: "14px",
				border: "1px solid",
				borderColor: "divider",
				cursor: "pointer",
				transition: "box-shadow 0.18s ease, transform 0.18s ease",
				"&:hover": {
					boxShadow: "0 4px 16px rgba(29,130,245,0.10)",
					transform: "translateY(-1px)",
				},
				mb: 1,
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
					<Typography variant="subtitle2" fontWeight={600} noWrap>
						{request.name}
					</Typography>
					<Typography variant="caption" color="text.secondary">
						UD-{request.user_id}
					</Typography>
					<Box
						sx={{
							bgcolor: "primary.main",
							color: "#fff",
							fontSize: 11,
							fontWeight: 700,
							minWidth: 22,
							height: 22,
							borderRadius: "11px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							px: 0.75,
							flexShrink: 0,
						}}
					>
						{request.request_count}
					</Box>
				</Stack>
				<Typography variant="caption" color="text.secondary">
					Last: {format(new Date(request.updated_at), "MMM d, yyyy")}
				</Typography>
			</Box>
		</Box>
	);
}
