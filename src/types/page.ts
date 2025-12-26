import type { Pagination } from "./roleAndPermission";

export interface GeneralPageProps {
    id?: number;
    heading: string;
    slug: string;
    content: string;
    created_at?: string;
}
export interface GeneralPageListing {
    data: {
        data: GeneralPageProps[],
        pagination: Pagination
    }
}