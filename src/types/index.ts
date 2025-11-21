
export interface QueryParams {
    pageIndex?: number;
    pageSize?: number;
    search?: string;
}


export interface CategoryFilterParams {
    mega_category: number[];
    category: number[];
    sub_category: number[];
    positions: number[];
}