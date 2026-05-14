import { useState, useCallback } from "react";
import type { SortOrder } from "../types";

export interface ServerSortState {
    sort_field: string;
    sort_by: SortOrder;
}

export interface UseServerSortReturn {
    sort: ServerSortState;
    handleSortChange: (
        field: string,
        order: SortOrder,
        resetPage?: () => void
    ) => void;
    resetSort: () => void;
}

export default function useServerSort(
    initial: ServerSortState = { sort_field: "", sort_by: "" }
): UseServerSortReturn {
    const [sort, setSort] = useState<ServerSortState>(initial);

    const handleSortChange = useCallback(
        (field: string, order: SortOrder, resetPage?: () => void) => {
            setSort({ sort_field: order === "" ? "" : field, sort_by: order });
            resetPage?.();
        },
        []
    );

    const resetSort = useCallback(() => {
        setSort({ sort_field: "", sort_by: "" });
    }, []);

    return { sort, handleSortChange, resetSort };
}
