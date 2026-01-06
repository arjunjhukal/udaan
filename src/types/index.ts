import type { CourseTypeProps } from "./course";

export interface QueryParams {
    pageIndex?: number;
    pageSize?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
    sort_by?: "asc" | "desc" | ""
}


export interface CategoryFilterParams {
    mega_category?: number[];
    category?: number[];
    sub_category?: number[];
    positions?: number[];
    teachers?: number[];
    roles?: number[];
    course_type?: CourseTypeProps[];
}
