import type { QueryParams } from ".";
import type { DiscountTypeProps, SelectionType } from "./course";
import type { Pagination } from "./roleAndPermission";
import type { GlobalResponse } from "./user";

export type EbookStatus = "draft" | "published";

export interface EbookProps {
    id?: number;
    title: string;
    author: string;
    publisher: string;
    published_date: string;
    description: string;
    price: string;
    discount: number;
    discount_type: DiscountTypeProps;
    is_downloadable: boolean;
    status: EbookStatus;
    thumbnail: File | null;
    thumbnail_url?: string;
    file: File | null;
    file_url?: string;
    file_name?: string;
    file_size?: number;
    selections: SelectionType;
    marked_price?: string;
    sale_price?: string;
    total_pages?: number;
    downloads?: number;
    purchased_count?: number;
    assigned_count?: number;
    created_at?: string;
}

export const ebookInitialState: EbookProps = {
    title: "",
    author: "",
    publisher: "",
    published_date: "",
    description: "",
    price: "",
    discount: 0,
    discount_type: "percentage",
    is_downloadable: true,
    status: "draft",
    thumbnail: null,
    thumbnail_url: "",
    file: null,
    file_url: "",
    selections: {
        mega_category: [],
        category: {},
        sub_category: {},
        position_ids: [],
    },
};

export interface EbookList extends GlobalResponse {
    data: {
        data: EbookProps[];
        pagination: Pagination;
    };
}

export type EbookQueryParams = QueryParams & {
    status?: "" | EbookStatus;
    is_downloadable?: boolean | null;
    days?: number | null;
};
