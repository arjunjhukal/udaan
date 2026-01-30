import type { Pagination } from "./roleAndPermission";

export type GorkhapatraTypes = "descriptive" | "mcqs"

export interface GorkhapatraProps {
    id?: number;
    title: string;
    type: GorkhapatraTypes;
    description: string;
    content: string;
    status: "draft" | "published";
    thumbnail: File | null;
    thumbnail_url?: string
    created_at?: string;
    views?: number;
}

export const gorkhapatraInitialState: GorkhapatraProps = {
    title: "",
    type: "descriptive",
    description: "",
    content: "",
    status: "draft",
    thumbnail: null,
}

export interface GorkhapatraList {
    data: {
        data: GorkhapatraProps[];
        pagination: Pagination;
    }
}