import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import { useGetTicketByIdQuery } from "../../../../services/ticketApi";
import TicketChatPanel from "../allTickets/TicketChatPanel";

export default function TicketChatPage() {
	const { ticketId } = useParams<{ ticketId: string }>();
	const navigate = useNavigate();
	const { setOpen } = useOutletContext<{ setOpen: React.Dispatch<React.SetStateAction<boolean>> }>();

	const { data, isLoading, isError, refetch } = useGetTicketByIdQuery(
		{ id: Number(ticketId) },
		{ skip: !ticketId }
	);

	const ticket = data?.data;

	if (isLoading) {
		return (
			<Box display="flex" alignItems="center" justifyContent="center" height="100%">
				<CircularProgress size={28} />
			</Box>
		);
	}

	if (isError || !ticket) {
		return (
			<Box display="flex" alignItems="center" justifyContent="center" height="100%">
				<Typography variant="body2" color="text.secondary">
					Ticket not found.
				</Typography>
			</Box>
		);
	}

	return (
		<TicketChatPanel
			ticket={ticket}
			onTicketUpdated={() => {
				refetch();
				navigate(PATH.TICKET.CHATS.ROOT);
			}}
			setOpen={setOpen}
		/>
	);
}
