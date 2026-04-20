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
    status?: Status[];
    device?: DeviceType[];
}

export type Status = "success" | "failed" | "pending" | "completed" | "not_completed" | "approved" | "rejected";

export const StatusFilter: { label: string; value: Status }[] = [
    { label: "Success", value: "success" },
    { label: "Pending", value: "pending" },
    { label: "Failed", value: "failed" },
]

export type DeviceType = "web" | "mobile";

export const DeviceFilter: { label: string; value: DeviceType }[] = [
    { label: "Web", value: "web" },
    { label: "Mobile", value: "mobile" },
]

export type UserStatus = "all" | "suspended" | "active"

export const paymentOptions = [
    { label: "Esewa", value: "esewa" },
    { label: "Khalti", value: "khalti" },
    { label: "Cash", value: "cash" },
    { label: "Fonepay", value: "fonepay" },
];