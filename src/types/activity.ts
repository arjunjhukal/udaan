import type { DeviceType, Status } from ".";
import type { Pagination } from "./roleAndPermission";

export type ActivityType = "users" | "tests" | "trial" | "registrations" | "purchase" | "courses" | "live_classes" | "curriculumns" | "notifications"

export const ActivityTypes = ["users", "tests", "trial", "registrations", "purchase", "courses", "live_classes", "curriculumns", "notifications"]


export interface ActivityProps {
    id: number;
    username: string;
    email: string;
    phone: string;
    status: Status,
    log: string;
    type: ActivityType;
    timestamp: string;
    device_type: DeviceType
}

export interface ActivityList {
    data: {
        data: ActivityProps[],
        pagination: Pagination
    }
}