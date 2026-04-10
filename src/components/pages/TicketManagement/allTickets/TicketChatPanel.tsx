import LockIcon from "@mui/icons-material/Lock";
import SendIcon from "@mui/icons-material/Send";
import {
	Avatar,
	Box,
	Chip,
	CircularProgress,
	Divider,
	IconButton,
	InputAdornment,
	List,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	OutlinedInput,
	Popover,
	Stack,
	Tooltip,
	Typography,
	useTheme
} from "@mui/material";
import { format } from "date-fns";
import { DocumentUpload, People, UserAdd } from "iconsax-reactjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTicketSocket } from "../../../../hooks/useTicketSocket";
import CAN from "../../../../routes/CAN";
import {
	useCreateTicketReplyMutation,
	useGetTicketRepliesQuery,
	useMarkRepliesAsReadMutation,
	useUpdateTicketMutation,
} from "../../../../services/ticketApi";
import { useGetAllUserExcludeStudentsQuery } from "../../../../services/userApi";
import { useAppSelector } from "../../../../store/hook";
import type { TicketProps, TicketReplyProps, TicketStatus } from "../../../../types/ticket";
import type { User } from "../../../../types/user";
import TicketSelectControls from "./TicketSelectControls";

interface Props {
	ticket: TicketProps;
	onTicketUpdated: () => void;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

function ReplyBubble({ reply, currentUserId }: { reply: TicketReplyProps; currentUserId?: number }) {
	const theme = useTheme();
	const isOwn = reply.created_by_id === currentUserId;
	const isUnread = !reply.is_read && !isOwn;

	return (
		<Stack
			direction="row"
			width={"100%"}
			justifyContent={isOwn ? "flex-end" : "flex-start"}
			sx={{ mb: 1.5 }}
		>
			{!isOwn && (
				<Avatar sx={{ width: 30, height: 30, fontSize: 12, mr: 1, mt: 0.5 }}>
					{(reply.created_by ?? "?")[0]?.toUpperCase()}
				</Avatar>
			)}
			<Box>
				{!isOwn && (
					<Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }} >
						{reply.created_by}
					</Typography>
				)}
				<Box
					sx={{
						px: 2,
						py: 1.25,
						borderRadius: isOwn ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
						bgcolor: isOwn
							? "#2563EB"
							: isUnread
								? theme.palette.mode === "dark"
									? "rgba(59,130,246,0.18)"
									: "#DBEAFE"
								: theme.palette.mode === "dark"
									? "rgba(255,255,255,0.08)"
									: "#F3F4F6",
						color: isOwn ? "#fff" : theme.palette.text.primary,
						border: isUnread && !isOwn ? "1px solid #93C5FD" : "none",
					}}
				>
					<Typography variant="body2" sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
						{reply.body}
					</Typography>
					{/* Render image attachment inline */}
					{reply.attachment_url && (
						<Box
							component="img"
							src={reply.attachment_url}
							alt="attachment"
							sx={{
								mt: 1,
								maxWidth: "100%",
								maxHeight: 220,
								borderRadius: 1,
								display: "block",
								cursor: "pointer",
								objectFit: "contain",
							}}
							onClick={() => window.open(reply.attachment_url!, "_blank")}
						/>
					)}
				</Box>
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ display: "block", mt: 0.25, textAlign: isOwn ? "right" : "left", ml: 0.5 }}
				>
					{reply.created_at
						? format(new Date(reply.created_at), "MMM d, h:mm a")
						: ""}
				</Typography>
			</Box>
		</Stack>
	);
}

export default function TicketChatPanel({ ticket, onTicketUpdated, setOpen }: Props) {
	const { t } = useTranslation();
	const theme = useTheme();
	const currentUser = useAppSelector((state) => state.auth.user);
	const bottomRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const pendingResetRef = useRef(false);
	const [replyText, setReplyText] = useState("");
	const [attachment, setAttachment] = useState<File | null>(null);
	const [page, setPage] = useState(1);
	const [allReplies, setAllReplies] = useState<TicketReplyProps[]>([]);

	// Assign popover state
	const [assignAnchor, setAssignAnchor] = useState<HTMLElement | null>(null);
	const [assignSearch, setAssignSearch] = useState("");
	const [assignedUsers, setAssignedUsers] = useState<Array<{ id: number; name: string }>>([]);

	const isClosed = ticket?.status === "resolved";
	const [allowAttachment, setAllowAttachment] = useState(ticket.allow_attachment ?? false);

	useEffect(() => {
		setAllowAttachment(ticket.allow_attachment ?? false);
	}, [ticket.allow_attachment]);

	const { data: repliesData, isFetching } = useGetTicketRepliesQuery(
		{ ticket_id: ticket.id!, pageIndex: page, pageSize: 50 },
		{ skip: !ticket.id }
	);

	const [createReply, { isLoading: sending }] = useCreateTicketReplyMutation();
	const [updateTicket] = useUpdateTicketMutation();
	const [markAsRead] = useMarkRepliesAsReadMutation();

	const { data: usersData, isFetching: loadingUsers } = useGetAllUserExcludeStudentsQuery(
		{ pageIndex: 1, pageSize: 30, search: assignSearch },
		{ skip: !assignAnchor }
	);

	useEffect(() => {
		if (ticket.id && (ticket.unread_count ?? 0) > 0) {
			markAsRead({ ticket_id: ticket.id });
		}
	}, [ticket.id, ticket.unread_count, markAsRead]);

	useEffect(() => {
		const assignedNames: User[] = [];
		if (Array.isArray(ticket.assigned_to)) {
			assignedNames.push(...ticket.assigned_to);
		}

		const assignedIds: number[] = [];
		if (Array.isArray(ticket.assigned_to_id)) {
			assignedIds.push(...ticket.assigned_to_id);
		} else if (typeof ticket.assigned_to_id === "number") {
			assignedIds.push(ticket.assigned_to_id);
		}

		// const people = assignedNames.map((name, idx) => ({
		// 	id: assignedIds[idx] ?? 0,
		// 	name,
		// }));

		if (assignedNames.length > 0) {
			setAssignedUsers(assignedNames.map((name, idx) => ({
				id: assignedIds[idx] ?? 0,
				name: name.name,
			})));
		} else {
			setAssignedUsers([]);
		}
	}, [ticket.assigned_to, ticket.assigned_to_id]);

	useEffect(() => {
		if (page === 1) {
			bottomRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [allReplies, page]);

	useEffect(() => {
		pendingResetRef.current = true;
		setPage(1);
		setReplyText("");
		setAttachment(null);
	}, [ticket.id]);

	useEffect(() => {
		const incoming = repliesData?.data?.data;
		if (!incoming) return;

		if (pendingResetRef.current || page === 1) {
			pendingResetRef.current = false;
			setAllReplies(incoming);
		} else {
			setAllReplies((prev) => [...incoming, ...prev]);
		}
	}, [repliesData]);

	useTicketSocket({
		ticketId: ticket.id ?? null,
		callbacks: {
			onNewReply: useCallback((ticketId: number, reply: TicketReplyProps) => {
				if (ticketId === ticket.id) {
					setAllReplies((prev) => {
						if (prev.some((r) => r.id === reply.id)) return prev;
						return [...prev, reply];
					});
					setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
				}
			}, [ticket.id]),
			onStatusChange: useCallback((ticketId: number) => {
				if (ticketId === ticket.id) {
					onTicketUpdated();
				}
			}, [ticket.id, onTicketUpdated]),
		},
	});

	const pagination = repliesData?.data?.pagination;
	const hasMore = pagination && pagination.current_page < pagination.total_pages;
	;

	const handleSend = async () => {
		if (!replyText.trim() || !ticket.id || isClosed) return;
		try {
			await createReply({
				ticket_id: ticket.id,
				body: replyText.trim(),
				...(attachment ? { attachment } : {}),
			}).unwrap();
			setReplyText("");
			setAttachment(null);
		} catch {
			// error handled by toast in a higher layer
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleStatusChange = async (status: TicketStatus) => {
		if (!ticket.id) return;
		await updateTicket({ id: ticket.id, body: { status } }).unwrap();
		onTicketUpdated();
	};

	const handlePriorityChange = async (priority: string) => {
		if (!ticket.id) return;
		await updateTicket({ id: ticket.id, body: { priority } }).unwrap();
		onTicketUpdated();
	};

	const handleAssignToggle = async (user: { id: number; name: string }) => {
		if (!ticket.id) return;

		const found = assignedUsers.find((u) => u.id === user.id);
		const nextUsers = found
			? assignedUsers.filter((u) => u.id !== user.id)
			: [...assignedUsers, user];

		await updateTicket({
			id: ticket.id,
			body: {
				assigned_to_id: nextUsers.length ? nextUsers.map((u) => u.id) : null,
				status: nextUsers.length ? "assigned" : "open",
			},
		}).unwrap();

		setAssignedUsers(nextUsers);
		onTicketUpdated();
	};

	const handleRemoveAssignee = async (userId: number) => {
		if (!ticket.id) return;

		const nextUsers = assignedUsers.filter((u) => u.id !== userId);
		await updateTicket({
			id: ticket.id,
			body: {
				assigned_to_id: nextUsers.length ? nextUsers.map((u) => u.id) : null,
				status: nextUsers.length ? "assigned" : "open",
			},
		}).unwrap();

		setAssignedUsers(nextUsers);
		onTicketUpdated();
	};

	const handleToggleAttachment = async () => {
		if (!ticket.id) return;
		setAllowAttachment((prev) => !prev);
		await updateTicket({ id: ticket.id, body: { allow_attachment: !allowAttachment } }).unwrap();
		onTicketUpdated();
	};

	return (
		<Box
			display="flex"
			flexDirection="column"
			height="100%"
			width="100%"
		>
			{/* Header */}
			<Box
				sx={{
					px: 2.5,
					py: 1.75,
					borderBottom: `1px solid ${theme.palette.divider}`,
					flexShrink: 0,
				}}
			>
				<Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
					<Box>
						<Stack direction="row" alignItems="center" gap={1} flexWrap={"wrap"}>
							<Typography variant="h6" fontWeight={600}>
								{ticket.subject}
							</Typography>
							{ticket.ticket_number && (
								<Typography variant="caption" color="text.secondary">
									#{ticket.ticket_number}
								</Typography>
							)}
						</Stack>
						<Stack direction="row" gap={1} mt={0.5} flexWrap="wrap">
							<Stack direction="row" gap={1} mt={0.5} flexWrap="wrap">
								{ticket.type_name && (
									<Chip label={ticket.type_name} size="small" variant="outlined" />
								)}
								<Tooltip title="Assign to user">
									<Chip
										icon={<UserAdd size={14} />}
										label="Assign"
										size="small"
										variant="outlined"
										onClick={(e) => setAssignAnchor(e.currentTarget)}
										sx={{ fontSize: 12, cursor: "pointer" }}
									/>
								</Tooltip>
							</Stack>
							<Stack direction="row" gap={1} alignItems="center" flexWrap="wrap" >
								<CAN permissions={["edit_tickets"]}>
									<TicketSelectControls
										status={(ticket.status ?? "open") as TicketStatus}
										priority={(ticket.priority ?? "medium") as import("../../../../types/ticket").TicketPriority}
										onStatusChange={handleStatusChange}
										onPriorityChange={handlePriorityChange}
										iconSize={16}
										fontSize={13}
										fontWeight={600}
									/>

									{/* Assign user control */}
									{assignedUsers.length ? (
										<Stack direction="row" gap={0.5} flexWrap="wrap">
											{assignedUsers.map((user) => (
												<Chip
													key={user.id}
													avatar={
														<Avatar sx={{ width: 20, height: 20, fontSize: 9, bgcolor: "#8B5CF6" }}>
															{user.name[0]?.toUpperCase()}
														</Avatar>
													}
													label={user.name}
													size="small"
													variant="outlined"
													onDelete={() => handleRemoveAssignee(user.id)}
													onClick={(e) => setAssignAnchor(e.currentTarget)}
													sx={{ fontSize: 12, cursor: "pointer" }}
												/>
											))}
										</Stack>
									) : ""}


									<Popover
										open={Boolean(assignAnchor)}
										anchorEl={assignAnchor}
										onClose={() => { setAssignAnchor(null); setAssignSearch(""); }}
										anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
										transformOrigin={{ vertical: "top", horizontal: "right" }}
										PaperProps={{ sx: { mt: 0.5 } }}
									>
										<Box sx={{ p: 1.5, width: 300 }}>
											<OutlinedInput
												size="small"
												fullWidth
												placeholder="Search users..."
												value={assignSearch}
												onChange={(e) => setAssignSearch(e.target.value)}
												autoFocus
												sx={{
													padding: "4px 8px"
												}}
											/>
											<Box sx={{ mt: 1, maxHeight: 200, overflow: "auto" }}>
												{loadingUsers ? (
													<Box textAlign="center" py={2}>
														<CircularProgress size={20} />
													</Box>
												) : (
													<List disablePadding>
														{usersData?.data?.data?.map((user) => (
															<ListItemButton
																key={user.id}
																selected={assignedUsers.some((u) => u.id === Number(user.id))}
																onClick={() => handleAssignToggle({ id: Number(user.id), name: user.name })}
																sx={{
																	padding: "6px 8px",
																	borderRadius: 1,
																	gap: 1,
																	borderBottom: 0
																}}
															>
																<ListItemAvatar sx={{ minWidth: "unset" }}>
																	<Avatar sx={{ width: 28, height: 28, fontSize: 11 }}>
																		{user?.name[0]?.toUpperCase()}
																	</Avatar>
																</ListItemAvatar>
																<ListItemText
																	primary={user.name}
																	secondary={user.email}
																/>
															</ListItemButton>
														))}
														{usersData?.data?.data?.length === 0 && (
															<Typography variant="caption" color="text.secondary" sx={{ px: 1, py: 1, display: "block" }}>
																No users found
															</Typography>
														)}
													</List>
												)}
											</Box>
										</Box>
									</Popover>
								</CAN>
							</Stack>
						</Stack>
					</Box>

				</Stack>
			</Box>

			{/* Messages area */}
			<Box
				flex={1}
				overflow="auto"
				sx={{
					px: 2.5,
					pt: 2,
					pb: 1,
					display: "flex",
					flexDirection: "column",
				}}
			>
				{hasMore && (
					<Box textAlign="center" mb={1}>
						<Typography
							variant="caption"
							color="primary"
							sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
							onClick={() => setPage((p) => p + 1)}
						>
							{isFetching ? <CircularProgress size={14} /> : "Load earlier messages"}
						</Typography>
					</Box>
				)}

				<Box
					sx={{
						mb: 2,
						p: 2,
						borderRadius: 2,
						border: `1px solid ${theme.palette.divider}`,
					}}
				>
					<Stack direction="row" gap={1} mb={1} alignItems="center">
						<Avatar sx={{ width: 26, height: 26, fontSize: 11 }}>
							{(ticket.created_by ?? "?")[0]?.toUpperCase()}
						</Avatar>
						<Typography variant="caption" fontWeight={600}>
							{ticket.created_by}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							{ticket.created_at
								? format(new Date(ticket.created_at), "MMM d, yyyy h:mm a")
								: ""}
						</Typography>
					</Stack>
					<Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
						{ticket.description}
					</Typography>
				</Box>

				{allReplies.length > 0 && (
					<Divider sx={{ mb: 2 }}>
						<Typography variant="caption" color="text.secondary">
							Replies
						</Typography>
					</Divider>
				)}

				{allReplies.map((reply) => (
					<ReplyBubble
						key={reply.id}
						reply={reply}
						currentUserId={Number(currentUser?.id)}
					/>
				))}

				{allReplies.length === 0 && !isFetching && (
					<Box textAlign="center" mt="auto" mb={2}>
						<Typography variant="body2" color="text.secondary">
							{t("messages.empty_states.ticket_replies.description")}
						</Typography>
					</Box>
				)}

				<div ref={bottomRef} />
			</Box>

			<div className="flex items-center gap-1">
				<Box
					className="w-full"
					sx={{
						px: 1.5,
						py: 1.5,
						borderTop: `1px solid ${theme.palette.divider}`,
					}}
				>
					{isClosed ? (
						<Stack direction="row" gap={1} alignItems="center" justifyContent="center" py={1}>
							<LockIcon sx={{ fontSize: 16, color: "text.secondary" }} />
							<Typography variant="body2" color="text.secondary">
								{t("messages.ticket.closed_no_reply")}
							</Typography>
						</Stack>
					) : (
						<>
							{attachment && (
								<Stack direction="row" alignItems="center" gap={1} mb={1}>
									<Chip
										label={attachment.name}
										size="small"
										onDelete={() => setAttachment(null)}
									/>
								</Stack>
							)}
							<OutlinedInput
								fullWidth
								multiline
								minRows={1}
								maxRows={4}
								placeholder={t("messages.ticket.reply_placeholder")}
								value={replyText}
								onChange={(e) => setReplyText(e.target.value)}
								onKeyDown={handleKeyDown}
								disabled={sending}
								sx={{ borderRadius: 3, pr: 1 }}
								endAdornment={
									<InputAdornment position="end">
										<Stack direction="row" gap={0.5} alignItems="center">
											{/* Allow attachment toggle — admin only */}
											<CAN permissions={["edit_tickets"]}>
												<Tooltip title={allowAttachment ? "Disable user attachments" : "Allow user to attach files"}>
													<IconButton
														size="small"
														onClick={handleToggleAttachment}
														sx={{ color: allowAttachment ? "primary.main" : "text.disabled" }}
													>
														<DocumentUpload size={18} />
													</IconButton>
												</Tooltip>
											</CAN>

											{/* Attach image */}
											<input
												ref={fileInputRef}
												type="file"
												hidden
												accept="image/*"
												onChange={(e) => {
													const f = e.target.files?.[0];
													if (f && f.size <= 2 * 1024 * 1024) {
														setAttachment(f);
													}
													e.target.value = "";
												}}
											/>
											<Tooltip title="Attach image (max 2MB)">
												<IconButton
													size="small"
													onClick={() => fileInputRef.current?.click()}
												>
													<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.5972 21.9983 8.005 21.9983C6.41283 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.95 2.56C13.7006 1.80943 14.7186 1.38777 15.78 1.38777C16.8414 1.38777 17.8595 1.80943 18.61 2.56C19.3606 3.31056 19.7822 4.32862 19.7822 5.39C19.7822 6.45138 19.3606 7.46944 18.61 8.22L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95529 17.7853 6.58 17.41C6.20472 17.0347 5.99389 16.5257 5.99389 15.995C5.99389 15.4643 6.20472 14.9553 6.58 14.58L15.07 6.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</IconButton>
											</Tooltip>

											{/* Send */}
											<IconButton
												size="small"
												disabled={!replyText.trim() || sending}
												onClick={handleSend}
												sx={{
													width: 32,
													height: 32,
													backgroundColor: (theme) => theme.palette.primary.main,
													color: (theme) => theme.palette.primary.contrastText,
												}}
											>
												{sending ? (
													<CircularProgress size={18} />
												) : (
													<SendIcon fontSize="small" />
												)}
											</IconButton>
										</Stack>
									</InputAdornment>
								}
							/>

						</>
					)}
				</Box>
				<div className="lg:hidden">
					<IconButton sx={{
						bgcolor: (theme) => theme.palette.primary.main
					}}
						onClick={() => setOpen?.((prev) => !prev)}
					>
						<People />
					</IconButton>
				</div>
			</div>
			{!isClosed ? <Typography variant="caption" color="text.secondary" px={1.5} display="block">
				Press Enter to send · Shift+Enter for new line
			</Typography> : ""}
		</Box>
	);
}
