import type { Pagination } from "./roleAndPermission";

export type ActivityType = "settings" | "notifications" | "subjective_user" | "courses"

export const ActivityTypes = ["settings", "notifications", "subjective_user", "courses"]
export interface ActivityProps {
    id: number;
    username: string;
    email: string;
    phone: string;
    status: "success" | "failed",
    log: string;
    type: ActivityType;
    timestamp: string;
    device_type: "mobile" | "web"
}

export interface ActivityList {
    data: {
        data: ActivityProps[],
        pagination: Pagination
    }
}