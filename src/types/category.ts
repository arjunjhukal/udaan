import type { Pagination } from "./roleAndPermission";
import type { GlobalResponse } from "./user";

export interface CategoryProps {
    id?: string | number;
    name: string;
    slug: string;
    parent_id: string | null;
    sub_category?: {
        id?: string;
        name: string;
        slug: string;
        parent_id: string | null;
    }[]
}

export interface CategroyList extends GlobalResponse {
    data: {
        data: CategoryProps[];
        pagination: Pagination;
    }
}