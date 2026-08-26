import { Checkbox, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import { Repeat } from "iconsax-reactjs";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../../routes/PATH";
import { useDownloadTestResultsMutation, useGetListOfStudentSubmittedTestQuery, usePublishTestResultsMutation } from "../../../../../services/questionApi";
import { showToast } from "../../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../../store/hook";
import type { StudentSubmitTestProps, TestTypeProps } from "../../../../../types/question";
import { getApiErrorMessage } from "../../../../../utils/apiError";
import { msToHMS } from "../../../../../utils/parseDateTime";
import useServerSort from "../../../../../utils/useServerSort";
import ResultStatusIcon from "../../../../atoms/ResultStatusIcon";
import ActionIconVisible from "../../../../molecules/Action/ActionIconVisible";
import SortableHeader from "../../../../molecules/SortableHeader";
import UdaanTable from "../../../../molecules/Table";
import TablePagination from "../../../../molecules/Table/Pagination";
import ConfirmationDialog from "../../../../organism/ConfirmationDialog";
import EmptyRoute from "../../../../organism/EmptyRoute";
import TableFilter from "../../../../organism/TableFilter";
import OmrAttemptsDialog from "./OmrAttemptsDialog";

export default function StudentResult({ id, testType }: { id: string; testType?: TestTypeProps }) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const theme = useTheme();
	const [attemptsDialog, setAttemptsDialog] = useState<{ open: boolean; resultId: number; studentName: string }>({
		open: false, resultId: 0, studentName: ""
	});
	const [qp, setQp] = useState({
		pageIndex: 1,
		pageSize: 10,
	});
	const [search, setSearch] = useState("");
	const [selectedRows, setSelectedRows] = useState<Set<number | string>>(
		new Set(),
	);
	const [openConfirm, setOpenConfirm] = useState(false);

	const { sort, handleSortChange } = useServerSort();
	const onSort = (field: string, order: "asc" | "desc" | "") =>
		handleSortChange(field, order, () => setQp((prev) => ({ ...prev, pageIndex: 1 })));

	const { data, isLoading } = useGetListOfStudentSubmittedTestQuery(
		{ id: Number(id), qp: { ...qp, sort_field: sort.sort_field, sort_by: sort.sort_by }, search },
		{ skip: !id },
	);
	const [publishTestResults] = usePublishTestResultsMutation();
	const [downloadTestResults, { isLoading: isDownloading }] = useDownloadTestResultsMutation();
	// const [downloadResult] = useDownloadResultMutation();
	// const [downloadingResultId, setDownloadingResultId] = useState<number | null>(null);

	const results = data?.data?.data || [];
	const pagination = data?.data?.pagination;

	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			const allIds = new Set<number | string>(results.map((r) => r.id));
			setSelectedRows(allIds);
		} else {
			setSelectedRows(new Set());
		}
	};

	const handleSelectRow = (index: number | string, checked: boolean) => {
		const newSelected = new Set(selectedRows);
		if (checked) {
			newSelected.add(index);
		} else {
			newSelected.delete(index);
		}
		setSelectedRows(newSelected);
	};

	const isAllSelected =
		results.length > 0 && selectedRows.size === results.length;
	const isSomeSelected =
		selectedRows.size > 0 && selectedRows.size < results.length;

	const handleRoleDelete = async () => {
		try {

			dispatch(
				showToast({
					message: "Result deleted successfully",
					severity: "success",
				}),
			);

			setSelectedRows(new Set());
			setOpenConfirm(false);
		} catch (e) {
			dispatch(
				showToast({
					message: getApiErrorMessage(e, "Unable to delete result"),
					severity: "error",
				}),
			);
			setOpenConfirm(false);
		}
	};

	const columns = useMemo<ColumnDef<StudentSubmitTestProps>[]>(
		() => [
			{
				header: () => (
					<Stack sx={{ gap: "10px" }}>
						<Checkbox
							checked={isAllSelected}
							indeterminate={isSomeSelected}
							onChange={(e) => handleSelectAll(e.target.checked)}
							color="primary"
						/>
						<Typography fontWeight={500}>S.No.</Typography>
					</Stack>
				),
				accessorKey: "sno",
				cell: ({ row }) => (
					<Stack sx={{ gap: "10px" }}>
						<Checkbox
							checked={selectedRows.has(row.original.id || "")}
							onChange={(e) =>
								handleSelectRow(row.original.id || "", e.target.checked)
							}
							color="primary"
						/>
						<Typography fontWeight={500}> {row.index + 1}</Typography>
					</Stack>
				),
				size: 80,
			},
			{
				header: () => <SortableHeader field="name" label="Student Name" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
				accessorKey: "name",
				cell: ({ row }) => (
					<Typography variant="subtitle1">
						{row.original?.student?.name}
					</Typography>
				),
			},
			{
				header: () => <SortableHeader field="total_attempted" label="Answered" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
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
			...(testType === "mcq" || testType === "omr" ? [{
				header: () => <SortableHeader field="total_correct" label="Correct" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
				accessorKey: "total_correct",
				cell: ({ row }: { row: { original: StudentSubmitTestProps } }) => (
					<div className="flex justify-start items-center">
						<Typography variant="subtitle1" color="text.dark">
							{row.original?.total_correct}
						</Typography>

						<Typography variant="subtitle1" color="text.middle">
							/{row.original?.total_attempted}
						</Typography>
					</div>
				),
			}] : [{
				header: () => <SortableHeader field="checked_answers" label="Checked" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
				accessorKey: "checked_answers",
				cell: ({ row }: { row: { original: StudentSubmitTestProps } }) => (
					<div className="flex justify-start items-center">
						<Typography variant="subtitle1" color="text.dark">
							{row.original?.checked_answers}
						</Typography>

						<Typography variant="subtitle1" color="text.middle">
							/{row.original?.total_attempted}
						</Typography>
					</div>
				),
			}]),
			{
				header: () => <SortableHeader field="started_at" label="Started At" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
				accessorKey: "started_at",
				cell: ({ row }) => (
					<Typography variant="subtitle1">
						{row.original?.started_at}
					</Typography>
				),
			},
			{
				header: () => <SortableHeader field="finished_at" label="Finished At" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
				accessorKey: "finished_at",
				cell: ({ row }) => (
					<Typography variant="subtitle1">
						{row.original?.finished_at}
					</Typography>
				),
			},
			{
				header: () => <SortableHeader field="timer" label="Timer" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
				accessorKey: "timer",
				cell: ({ row }) => {
					const { hours, minutes, seconds } = msToHMS(row.original?.timer || 0);
					return (
						<Typography variant="subtitle1">
							{hours || minutes || seconds
								? `${hours} Hrs ${minutes} Min ${seconds} Sec`
								: "N/A"}
						</Typography>
					);
				},
			},
			{
				header: () => <SortableHeader field="status" label="Status" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
				accessorKey: "status",
				cell: ({ row }) => (
					<Typography
						variant="subtitle1"
						className="capitalize"
						color={
							row.original.status === "progress" ? "error.main" : "success.main"
						}>
						{row.original?.status}
					</Typography>
				),
			},
			{
				header: () => <SortableHeader field="result" label="Result" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
				accessorKey: "result",
				cell: ({ row }) => (
					<Typography
						variant="subtitle1"
						className="capitalize flex items-center justify-center rounded-md p-1 gap-2"
						color={
							row.original.result === "failed" ? "error.main" : "success.main"
						}
						bgcolor={
							row.original.result === "failed" ? "error.light" : "success.light"
						}>
						<ResultStatusIcon passed={row.original.result !== "failed"} />
						{row.original?.result}
					</Typography>
				),
			},
			{
				header: () => <SortableHeader field="score" label="Score" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
				accessorKey: "score",
				cell: ({ row }) => (
					<Typography variant="subtitle1">{row.original?.score}</Typography>
				),
			},
			...(testType === "omr" ? [{
				header: () => <SortableHeader field="attempt_number" label="Attempt" activeField={sort.sort_field} activeOrder={sort.sort_by} onSortChange={onSort} />,
				accessorKey: "attempt_number",
				cell: ({ row }: { row: { original: StudentSubmitTestProps } }) => (
					<Typography variant="subtitle1" fontWeight={500}>
						#{row.original?.attempt_number ?? 1}
					</Typography>
				),
				size: 80,
			}] : []),
			{
				header: "Action",
				accessorKey: "action",
				cell: ({ row }: { row: { original: StudentSubmitTestProps } }) => (
					<div className="flex items-center gap-1">
						<ActionIconVisible
							onView={() =>
								navigate(
									PATH.TEST_QUESTION_MANAGEMENT.TEST.CHECK_PAPER.ROOT(
										Number(id),
										row.original.id,
									),
								)
							}
						// onDownload={() =>
						// 	handleDownloadStudentResult(row.original.id, row.original?.student?.name)
						// }
						/>
						{testType === "omr" && (row.original?.attempt_number ?? 1) > 1 && (
							<Tooltip title="View All Attempts">
								<IconButton
									className="p-1.5 rounded-md!"
									sx={{
										border: `1px solid ${theme.palette.separator.darker}`,
										background: theme.palette.primary.contrastText,
										"&:hover": {
											color: theme.palette.primary.contrastText,
											background: theme.palette.primary.main,
										},
									}}
									onClick={() => setAttemptsDialog({
										open: true,
										resultId: row.original.id,
										studentName: row.original?.student?.name || "",
									})}
								>
									<Repeat size={16} />
								</IconButton>
							</Tooltip>
						)}
					</div>
				),
			},
		],
		[selectedRows, isAllSelected, isSomeSelected, testType, sort],
	);

	const handleDownloadResults = async (format?: string) => {
		try {
			const fmt = (format as "pdf" | "xlsx" | "csv" | undefined) ?? "pdf";
			const { blob, filename } = await downloadTestResults({ testId: Number(id), format: fmt }).unwrap();

			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");

			a.href = url;
			a.download = filename || `test-${id}-results.${fmt}`;
			document.body.appendChild(a);
			a.click();

			a.remove();
			window.URL.revokeObjectURL(url);
		}
		catch (e: any) {
			dispatch(
				showToast({
					message: e?.data?.message || "Unable to download results",
					severity: "error",
				}),
			);
		}
	}

	// const handleDownloadStudentResult = async (resultId: number, studentName?: string) => {
	// 	if (downloadingResultId) return;
	// 	try {
	// 		setDownloadingResultId(resultId);
	// 		const blob = await downloadResult({ testId: Number(id), resultId }).unwrap();

	// 		const url = window.URL.createObjectURL(blob);
	// 		const a = document.createElement("a");

	// 		a.href = url;
	// 		a.download = `${studentName || "student"}-result.pdf`;
	// 		document.body.appendChild(a);
	// 		a.click();

	// 		a.remove();
	// 		window.URL.revokeObjectURL(url);
	// 	}
	// 	catch (e: any) {
	// 		dispatch(
	// 			showToast({
	// 				message: e?.data?.message || "Unable to download result",
	// 				severity: "error",
	// 			}),
	// 		);
	// 	}
	// 	finally {
	// 		setDownloadingResultId(null);
	// 	}
	// }

	const handleTestResultPublish = async () => {
		try {
			const response = await publishTestResults({ id: Number(id) }).unwrap();
			dispatch(
				showToast({
					message: response?.message || "Test results published successfully",
					severity: "success",
				}),
			);
		}
		catch (e: any) {
			dispatch(
				showToast({
					message: e?.data?.message || "Unable to publish test result",
					severity: "error",
				}),
			);
		}
	}

	return (
		<div className="students__attended__test mt-8">
			<TableFilter
				search={search}
				setSearch={setSearch}
				selectedRows={new Set<number | string>([])}
				handleRoleDelete={() => { }}
				onFilter={() => { }}
				onPublish={handleTestResultPublish}
				onDownload={handleDownloadResults}
				downloadFormats={[
					{ label: "PDF", format: "pdf" },
					{ label: "Excel (.xlsx)", format: "xlsx" },
					{ label: "CSV", format: "csv" },
				]}
				donwloading={isDownloading}
			/>
			{!isLoading && !results.length ? (
				<EmptyRoute title="No Results Found" />
			) : (
				<UdaanTable loading={isLoading} data={results} columns={columns} />
			)}

			<TablePagination
				qp={qp}
				setQp={setQp}
				totalPages={pagination?.total_pages || 0}
			/>

			{testType === "omr" && (
				<OmrAttemptsDialog
					open={attemptsDialog.open}
					onClose={() => setAttemptsDialog({ open: false, resultId: 0, studentName: "" })}
					testId={id}
					resultId={attemptsDialog.resultId}
					studentName={attemptsDialog.studentName}
				/>
			)}
			<ConfirmationDialog
				open={openConfirm}
				setOpen={setOpenConfirm}
				title="Delete Role"
				description="Are you sure you want to delete the selected role(s)? This action cannot be undone."
				onSave={handleRoleDelete}
				icon={
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M21.0697 5.23C19.4597 5.07 17.8497 4.95 16.2297 4.86V4.85L16.0097 3.55C15.8597 2.63 15.6397 1.25 13.2997 1.25H10.6797C8.34967 1.25 8.12967 2.57 7.96967 3.54L7.75967 4.82C6.82967 4.88 5.89967 4.94 4.96967 5.03L2.92967 5.23C2.50967 5.27 2.20967 5.64 2.24967 6.05C2.28967 6.46 2.64967 6.76 3.06967 6.72L5.10967 6.52C10.3497 6 15.6297 6.2 20.9297 6.73C20.9597 6.73 20.9797 6.73 21.0097 6.73C21.3897 6.73 21.7197 6.44 21.7597 6.05C21.7897 5.64 21.4897 5.27 21.0697 5.23Z"
							fill="#1D82F5"
						/>
						<path
							d="M19.2297 8.14C18.9897 7.89 18.6597 7.75 18.3197 7.75H5.67975C5.33975 7.75 4.99975 7.89 4.76975 8.14C4.53975 8.39 4.40975 8.73 4.42975 9.08L5.04975 19.34C5.15975 20.86 5.29975 22.76 8.78975 22.76H15.2097C18.6997 22.76 18.8398 20.87 18.9497 19.34L19.5697 9.09C19.5897 8.73 19.4597 8.39 19.2297 8.14ZM13.6597 17.75H10.3297C9.91975 17.75 9.57975 17.41 9.57975 17C9.57975 16.59 9.91975 16.25 10.3297 16.25H13.6597C14.0697 16.25 14.4097 16.59 14.4097 17C14.4097 17.41 14.0697 17.75 13.6597 17.75ZM14.4997 13.75H9.49975C9.08975 13.75 8.74975 13.41 8.74975 13C8.74975 12.59 9.08975 12.25 9.49975 12.25H14.4997C14.9097 12.25 15.2497 12.59 15.2497 13C15.2497 13.41 14.9097 13.75 14.4997 13.75Z"
							fill="#1D82F5"
						/>
					</svg>
				}
			/>
		</div>
	);
}
