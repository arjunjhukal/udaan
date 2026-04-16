import {
	Avatar,
	Badge,
	Box,
	Checkbox,
	Chip,
	Divider,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import { Calendar, Timer1 } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useDeleteTicketMutation, useUpdateTicketMutation } from "../../../../services/ticketApi";
import type { TicketPriority, TicketProps, TicketStatus } from "../../../../types/ticket";
import Actions from "../../../molecules/Action";
import ConfirmationDialog from "../../../organism/ConfirmationDialog";
import TicketSelectControls from "./TicketSelectControls";
import AssignedUsers from "../../../organism/ListWithPlusMore";

interface Props {
	ticket: TicketProps;
	checked: boolean;
	onSelect: (id: number, checked: boolean) => void;
	onStatusChange: (id: number, status: TicketStatus) => void;
	onPriorityChange?: (id: number, priority: string) => void;
	onDelete?: (id: number) => void;
	onClick: () => void;
}

function getInitials(name?: string) {
	if (!name) return "?";
	return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function formatShort(dateStr: string): string {
	const diff = Date.now() - new Date(dateStr).getTime();
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	const days = Math.floor(hrs / 24);
	if (days < 30) return `${days}d ago`;
	return `${Math.floor(days / 30)}mo ago`;
}

export default function TicketCard({ ticket, checked, onSelect, onStatusChange, onPriorityChange, onDelete, onClick }: Props) {
	const theme = useTheme();
	const status = (ticket.status ?? "open") as TicketStatus;
	const [localPriority, setLocalPriority] = useState<TicketPriority>((ticket.priority ?? "medium") as TicketPriority);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [updateTicket] = useUpdateTicketMutation();
	const [deleteTicket, { isLoading: deleting }] = useDeleteTicketMutation();

	useEffect(() => {
		setLocalPriority((ticket.priority ?? "medium") as TicketPriority);
	}, [ticket.priority]);

	const hasUnread = (ticket.unread_count ?? 0) > 0;
	const metaIconSize = 20;
	const metaFontSize = 12;
	const assignedNames = Array.isArray(ticket.assigned_to)
		? ticket.assigned_to
		: [];

	const handleDelete = async () => {
		await deleteTicket({ ids: [ticket.id!] }).unwrap().catch(() => { });
		setConfirmDelete(false);
		onDelete?.(ticket.id!);
	};

	const handlePriorityChange = async (newPriority: string) => {
		setLocalPriority(newPriority as TicketPriority);
		if (onPriorityChange) {
			onPriorityChange(ticket.id!, newPriority);
		} else {
			await updateTicket({ id: ticket.id!, body: { priority: newPriority } }).unwrap().catch(() => { });
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: { xs: "flex-start", sm: "center" },
				flexWrap: { xs: "wrap", sm: "nowrap" },
				px: { xs: 1.5, sm: 2.5 },
				py: 2,
				border: `1px solid ${theme.palette.divider}`,
				borderRadius: 2,
				mb: 1,
				gap: { xs: 1, sm: 2 },
				bgcolor: theme.palette.background.paper,
				transition: "box-shadow 0.15s",
				"&:hover": { boxShadow: 2 },
			}}
		>
			<Checkbox
				size="small"
				checked={checked}
				onChange={(e) => onSelect(ticket.id!, e.target.checked)}
				onClick={(e) => e.stopPropagation()}
				sx={{ flexShrink: 0, alignSelf: "center" }}
			/>

			<Avatar
				sx={{
					width: 42,
					height: 42,
					fontSize: 14,
					fontWeight: 600,
					bgcolor: "#3B82F6",
					flexShrink: 0,
					cursor: "pointer",
					alignSelf: "center",
				}}
				onClick={onClick}
			>
				{getInitials(ticket.created_by)}
			</Avatar>

			{/* Main content — takes available width */}
			<Box flex={1} minWidth={0} sx={{ cursor: "pointer" }} onClick={onClick}>
				<Stack direction="row" alignItems="center" spacing={1}>
					<Typography variant="body2" fontWeight={700} noWrap>
						{ticket.subject}
					</Typography>
					{ticket.ticket_number && (
						<Typography variant="caption" color="text.secondary" flexShrink={0}>
							#{ticket.ticket_number}
						</Typography>
					)}
					{hasUnread && (
						<Badge badgeContent={ticket.unread_count} color="primary" sx={{ flexShrink: 0, ml: 1 }} />
					)}
				</Stack>
				<Typography variant="caption" color="text.secondary" noWrap display="block" sx={{ mt: 0.25 }}>
					{ticket.last_reply?.body ?? ticket.description}
				</Typography>
				<Stack direction="row" spacing={0.75} mt={0.75} alignItems="center" flexWrap="wrap">
					<Typography className="capitalize!" variant="caption" sx={{ color: "primary.main", fontWeight: 500 }}>
						{ticket.created_by}
					</Typography>
					{ticket.type_name && (
						<Chip label={ticket.type_name} size="small" variant="outlined" sx={{ height: 18, fontSize: 10, fontWeight: 400 }} />
					)}
					{ticket.assigned_to && ticket.assigned_to.length > 0 && (
						ticket.assigned_to.map((name) => (
							<Chip
								avatar={
									<Avatar sx={{ width: 16, height: 16, fontSize: 8, bgcolor: "#8B5CF6" }}>
										{name.name?.toUpperCase()}
									</Avatar>
								}
								label={name.name}
								size="small"
								variant="outlined"
								sx={{ fontSize: 10, height: 18, display: { xs: "flex", sm: "none" } }}
							/>))
					)}
				</Stack>
			</Box>

			{/* Meta controls — wraps to its own row on mobile */}
			<Stack
				direction="row"
				alignItems="center"
				spacing={1.5}
				flexShrink={0}
				sx={{
					width: { xs: "100%", sm: "auto" },
					pl: { sm: 0 },
				}}
			>
				<TicketSelectControls
					status={status}
					priority={localPriority}
					onStatusChange={(s) => onStatusChange(ticket.id!, s)}
					onPriorityChange={handlePriorityChange}
					iconSize={metaIconSize}
					fontSize={metaFontSize}
					fontWeight={500}
					stopPropagation
					innerDivider
				/>

				{ticket.updated_at && (
					<>
						<Divider orientation="vertical" flexItem sx={{ my: 0.5, display: { xs: "none", md: "block" } }} />
						<Stack
							direction="row"
							alignItems="center"
							spacing={0.5}
							sx={{ display: { xs: "none", md: "flex" } }}
						>
							<Timer1 size={metaIconSize} color="#9CA3AF" variant="Bold" />
							<Typography sx={{ fontSize: metaFontSize, color: "text.secondary" }}>
								{formatShort(ticket.updated_at)}
							</Typography>
						</Stack>
					</>
				)}

				{ticket.created_at && (
					<>
						<Divider orientation="vertical" flexItem sx={{ my: 0.5, display: { xs: "none", md: "block" } }} />
						<Stack
							direction="row"
							alignItems="center"
							spacing={0.5}
							sx={{ display: { xs: "none", md: "flex" } }}
						>
							<Calendar size={metaIconSize} color="#9CA3AF" variant="Bold" />
							<Typography sx={{ fontSize: metaFontSize, color: "text.secondary" }}>
								{formatShort(ticket.created_at)}
							</Typography>
						</Stack>
					</>
				)}
			</Stack>

			{assignedNames.length > 0 && (
				<AssignedUsers
					users={ticket.assigned_to || []}
					maxVisible={1}
				/>
			)}

			<Box onClick={(e) => e.stopPropagation()} sx={{ flexShrink: 0, alignSelf: "center" }}>
				<Actions onDelete={() => setConfirmDelete(true)} />
			</Box>

			<ConfirmationDialog
				open={confirmDelete}
				setOpen={setConfirmDelete}
				title="Delete Ticket"
				description="Are you sure you want to delete this ticket? This action cannot be undone."
				onSave={handleDelete}
				isLoading={deleting}
			/>
		</Box>
	);
}
