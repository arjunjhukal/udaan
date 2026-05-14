import { Box } from "@mui/material";
import { ArrowDown, ArrowUp } from "iconsax-reactjs";
import type { SortOrder } from "../../../types";

interface SortableHeaderProps {
    field: string;
    label: string;
    activeField?: string;
    activeOrder?: SortOrder;
    onSortChange?: (field: string, order: SortOrder) => void;
}

export default function SortableHeader({
    field,
    label,
    activeField,
    activeOrder,
    onSortChange,
}: SortableHeaderProps) {
    const isActive = activeField === field && (activeOrder === "asc" || activeOrder === "desc");
    const currentOrder: SortOrder = isActive ? (activeOrder as SortOrder) : "";

    const handleClick = () => {
        let nextOrder: SortOrder;
        if (currentOrder === "") nextOrder = "asc";
        else if (currentOrder === "asc") nextOrder = "desc";
        else nextOrder = "";

        onSortChange?.(nextOrder === "" ? "" : field, nextOrder);
    };

    return (
        <Box
            component="span"
            onClick={handleClick}
            className="inline-flex items-center gap-1 cursor-pointer select-none"
        >
            <Box component="span" className="text-nowrap">{label}</Box>
            {currentOrder === "asc" && <ArrowUp size={14} />}
            {currentOrder === "desc" && <ArrowDown size={14} />}
            {currentOrder === "" && (
                <Box
                    component="span"
                    sx={{ display: "inline-flex", alignItems: "center", opacity: 0.35 }}
                >
                    <ArrowUp size={12} />
                    <ArrowDown size={12} />
                </Box>
            )}
        </Box>
    );
}
