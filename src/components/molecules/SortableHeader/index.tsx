import { Typography } from "@mui/material";
import { ArrowDown, ArrowUp } from "iconsax-reactjs";

export default function SortableHeader({ column, label }: { column: any; label: string }) {
    const sortState = column.getIsSorted();
    const arrow =
        sortState === "asc" ? <ArrowUp size={14} /> :
            sortState === "desc" ? <ArrowDown size={14} /> : null;

    return (
        <Typography
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 cursor-pointer"
        >
            {label} {arrow}
        </Typography>
    );
};
