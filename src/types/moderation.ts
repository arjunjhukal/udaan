import type { Pagination } from "./roleAndPermission";
import type { GlobalResponse } from "./user";

export interface ModerationProps {
    id: number;
    name: string;
    created_at: string;
}

export interface ModerationList extends GlobalResponse {
    data: {
        data: ModerationProps[];
        pagination: Pagination;
    };
}

export interface ModerationSingleResponse extends GlobalResponse {
    data: ModerationProps;
}
