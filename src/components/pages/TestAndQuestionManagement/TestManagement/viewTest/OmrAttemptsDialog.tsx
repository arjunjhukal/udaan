import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import { CloseCircle } from "iconsax-reactjs";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../../routes/PATH";
import { useGetOmrResultAttemptsQuery } from "../../../../../services/questionApi";
import type { StudentSubmitTestProps } from "../../../../../types/question";
import { msToHMS } from "../../../../../utils/parseDateTime";
import ActionIconVisible from "../../../../molecules/Action/ActionIconVisible";
import UdaanTable from "../../../../molecules/Table";

interface OmrAttemptsDialogProps {
    open: boolean;
    onClose: () => void;
    testId: string;
    resultId: number;
    studentName: string;
}

export default function OmrAttemptsDialog({ open, onClose, testId, resultId, studentName }: OmrAttemptsDialogProps) {
    const navigate = useNavigate();
    const { data, isLoading } = useGetOmrResultAttemptsQuery(
        { testId: Number(testId), resultId },
        { skip: !open || !testId || !resultId }
    );

    const attempts = data?.data?.data || [];

    const columns = useMemo<ColumnDef<StudentSubmitTestProps>[]>(
        () => [
            {
                header: "Attempt",
                accessorKey: "attempt_number",
                cell: ({ row }) => (
                    <Typography variant="subtitle1" fontWeight={500}>
                        #{row.original?.attempt_number}
                    </Typography>
                ),
                size: 80,
            },
            {
                header: "Answered",
                accessorKey: "answered",
                cell: ({ row }) => (
                    <div className="flex justify-start items-center">
                        <Typography variant="subtitle1" color="text.dark">
                            {row.original?.total_attempted}
                        </Typography>
                        <Typography variant="subtitle1" color="text.middle">
                            /{row.original?.total_questions}
                        </Typography>
                    </div>
                ),
            },
            {
                header: "Correct",
                accessorKey: "total_correct",
                cell: ({ row }) => (
                    <div className="flex justify-start items-center">
                        <Typography variant="subtitle1" color="text.dark">
                            {row.original?.total_correct}
                        </Typography>
                        <Typography variant="subtitle1" color="text.middle">
                            /{row.original?.total_attempted}
                        </Typography>
                    </div>
                ),
            },
            {
                header: "Started At",
                accessorKey: "started_at",
                cell: ({ row }) => (
                    <Typography variant="subtitle1">{row.original?.started_at}</Typography>
                ),
            },
            {
                header: "Finished At",
                accessorKey: "finished_at",
                cell: ({ row }) => (
                    <Typography variant="subtitle1">{row.original?.finished_at}</Typography>
                ),
            },
            {
                header: "Timer",
                accessorKey: "timer",
                cell: ({ row }) => {
                    const { hours, minutes, seconds } = msToHMS(row.original?.timer || 0);
                    return (
                        <Typography variant="subtitle1">
                            {hours | minutes | seconds
                                ? `${hours} Hrs ${minutes} Min ${seconds} Sec`
                                : "N/A"}
                        </Typography>
                    );
                },
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ row }) => (
                    <Typography
                        variant="subtitle1"
                        className="capitalize"
                        color={row.original.status === "progress" ? "error.main" : "success.main"}>
                        {row.original?.status}
                    </Typography>
                ),
            },
            {
                header: "Result",
                accessorKey: "result",
                cell: ({ row }) => (
                    <Typography
                        variant="subtitle1"
                        className="capitalize flex items-center justify-center rounded-md p-1 gap-2"
                        color={row.original.result === "failed" ? "error.main" : "success.main"}
                        bgcolor={row.original.result === "failed" ? "error.light" : "success.light"}>
                        {!(row.original.result === "failed") ? (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.99935 1.66699C5.40768 1.66699 1.66602 5.40866 1.66602 10.0003C1.66602 14.592 5.40768 18.3337 9.99935 18.3337C14.591 18.3337 18.3327 14.592 18.3327 10.0003C18.3327 5.40866 14.591 1.66699 9.99935 1.66699ZM13.9827 8.08366L9.25768 12.8087C9.14102 12.9253 8.98268 12.992 8.81602 12.992C8.64935 12.992 8.49102 12.9253 8.37435 12.8087L6.01602 10.4503C5.77435 10.2087 5.77435 9.80866 6.01602 9.56699C6.25768 9.32533 6.65768 9.32533 6.89935 9.56699L8.81602 11.4837L13.0993 7.20033C13.341 6.95866 13.741 6.95866 13.9827 7.20033C14.2243 7.44199 14.2243 7.83366 13.9827 8.08366Z" fill="#059467" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.99935 1.66699C5.40768 1.66699 1.66602 5.40866 1.66602 10.0003C1.66602 14.592 5.40768 18.3337 9.99935 18.3337C14.591 18.3337 18.3327 14.592 18.3327 10.0003C18.3327 5.40866 14.591 1.66699 9.99935 1.66699ZM12.7993 11.917C13.041 12.1587 13.041 12.5587 12.7993 12.8003C12.6743 12.9253 12.516 12.9837 12.3577 12.9837C12.1993 12.9837 12.041 12.9253 11.916 12.8003L9.99935 10.8837L8.08268 12.8003C7.95768 12.9253 7.79935 12.9837 7.64102 12.9837C7.48268 12.9837 7.32435 12.9253 7.19935 12.8003C6.95768 12.5587 6.95768 12.1587 7.19935 11.917L9.11601 10.0003L7.19935 8.08366C6.95768 7.84199 6.95768 7.44199 7.19935 7.20033C7.44102 6.95866 7.84102 6.95866 8.08268 7.20033L9.99935 9.11699L11.916 7.20033C12.1577 6.95866 12.5577 6.95866 12.7993 7.20033C13.041 7.44199 13.041 7.84199 12.7993 8.08366L10.8827 10.0003L12.7993 11.917Z" fill="#E21D48" />
                            </svg>
                        )}
                        {row.original?.result}
                    </Typography>
                ),
            },
            {
                header: "Total Marks",
                accessorKey: "marks",
                cell: ({ row }) => (
                    <Typography variant="subtitle1">{row.original?.total_marks}</Typography>
                ),
            },
            {
                header: "Score",
                accessorKey: "score",
                cell: ({ row }) => (
                    <Typography variant="subtitle1">{row.original?.score}</Typography>
                ),
            },
            {
                header: "Action",
                accessorKey: "action",
                cell: ({ row }) => (
                    <ActionIconVisible
                        onView={() => {
                            onClose();
                            navigate(
                                PATH.TEST_QUESTION_MANAGEMENT.TEST.CHECK_PAPER.ROOT(
                                    Number(testId),
                                    row.original.id,
                                ),
                            );
                        }}
                    />
                ),
            },
        ],
        [],
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
            <DialogTitle className="flex justify-between items-center">
                <Typography variant="h4">OMR Attempts - {studentName}</Typography>
                <IconButton onClick={onClose}>
                    <CloseCircle size={24} />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <UdaanTable loading={isLoading} data={attempts} columns={columns} />
            </DialogContent>
        </Dialog>
    );
}
