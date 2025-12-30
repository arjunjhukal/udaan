import type { Pagination } from "./roleAndPermission";

export interface ActivityProps {
    id: number;
    username: string;
    email: string;
    phone: string;
    status: "success" | "failed",
    log: string;
    type: "settings" | "notifications" | "subjective_user" | "courses";
    timestamp: string;
    device_type: "mobile" | "web"
}

export interface ActivityList {
    data: {
        data: ActivityProps[],
        pagination: Pagination
    }
}