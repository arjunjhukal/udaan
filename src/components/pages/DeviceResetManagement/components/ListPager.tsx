import { Pagination, Stack, Typography } from "@mui/material";

interface Props {
	page: number;
	totalPages: number;
	totalRecords?: number;
	onChange: (page: number) => void;
}

export default function ListPager({ page, totalPages, totalRecords, onChange }: Props) {
	if (totalPages <= 1) return null;

	return (
		<Stack
			direction="row"
			alignItems="center"
			justifyContent="space-between"
			flexWrap="wrap"
			gap={1}
			pt={1.5}
			flexShrink={0}
		>
			<Typography variant="caption" color="text.secondary">
				Page {page} of {totalPages}
				{totalRecords ? ` · ${totalRecords} total` : ""}
			</Typography>
			<Pagination
				count={totalPages}
				page={page}
				onChange={(_, value) => onChange(value)}
				size="small"
				shape="rounded"
				color="primary"
				siblingCount={0}
				boundaryCount={1}
			/>
		</Stack>
	);
}
