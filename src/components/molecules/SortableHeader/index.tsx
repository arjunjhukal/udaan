import { Typography } from "@mui/material";
import { ArrowDown, ArrowUp } from "iconsax-reactjs";

type SortOrder = "asc" | "desc";

interface SortableHeaderProps {
    column: any;
    label: string;
    onSortChange?: (order: SortOrder) => void;
}

export default function SortableHeader({
    column,
    label,
    onSortChange
}: SortableHeaderProps) {

    const sortState = column.getIsSorted() as SortOrder | false;

    const handleClick = () => {
        let nextOrder: SortOrder;

        if (sortState === "asc") {
            nextOrder = "desc";
        } else {
            nextOrder = "asc";
        }

        column.toggleSorting(nextOrder === "desc"); // tanstack expects boolean
        onSortChange?.(nextOrder);
    };

    return (
        <Typography

            onClick={handleClick}
            className="flex items-center gap-1 cursor-pointer select-none"
        >
            {label}
            {sortState === "asc" && <ArrowUp size={14} />}
            {sortState === "desc" && <ArrowDown size={14} />}
        </Typography>
    );
}
