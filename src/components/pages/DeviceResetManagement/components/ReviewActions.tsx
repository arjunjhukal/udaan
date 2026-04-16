import { Button, CircularProgress, Stack } from "@mui/material";
import { useState } from "react";
import { useReviewResetRequestMutation } from "../../../../services/deviceResetApi";

interface Props {
	requestId: number;
	userId: number;
	onSuccess?: () => void;
}

export default function ReviewActions({ requestId, userId, onSuccess }: Props) {
	const [reviewRequest, { isLoading }] = useReviewResetRequestMutation();
	const [pendingAction, setPendingAction] = useState<"approved" | "rejected" | null>(null);

	const handleReview = async (status: "approved" | "rejected") => {
		setPendingAction(status);
		try {
			await reviewRequest({ requestId, userId, status }).unwrap();
			onSuccess?.();
		} finally {
			setPendingAction(null);
		}
	};

	return (
		<Stack direction="row" gap={1.5} justifyContent="flex-end">
			<Button
				variant="contained"
				color="error"
				disabled={isLoading}
				onClick={(e) => { e.stopPropagation(); handleReview("rejected"); }}
				startIcon={pendingAction === "rejected" && isLoading ? <CircularProgress size={14} color="inherit" /> : undefined}
				sx={{ minWidth: 100 }}
			>
				Reject
			</Button>
			<Button
				variant="contained"
				color="success"
				disabled={isLoading}
				onClick={(e) => { e.stopPropagation(); handleReview("approved"); }}
				startIcon={pendingAction === "approved" && isLoading ? <CircularProgress size={14} color="inherit" /> : undefined}
				sx={{ minWidth: 200 }}
			>
				Approve and Sign out Old device
			</Button>
		</Stack>
	);
}
