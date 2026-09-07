import type { Pagination } from "./roleAndPermission";

export type DeviceRequestStatus = "pending" | "approved" | "rejected";
export interface DeviceResetRequestProps {
    user_id: number;
    name: string | null;
    thumbnail_url: string | null;
    request_count: number;
    updated_at: string;
    created_at: string;
}

export interface DeviceResetRequestList {
    data: {
        data: DeviceResetRequestProps[];
        pagination: Pagination;
    };
}

export interface DeviceResetSingleRequest {
    id: number;
    code: string;
    device_name: string | null;
    device_type: string | null;
    reason: string;
    situation: string;
    status: DeviceRequestStatus;
    created_at: string;
    reviewed_by: string | null;
    old_token: string | null;
    new_token: string | null;
}

export interface DeviceResetUserStats {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
}

export interface DeviceResetUserInfo extends DeviceResetRequestProps {
    stats: DeviceResetUserStats;
}

export interface DeviceResetTimeline {
    data: {
        data: DeviceResetSingleRequest[];
        pagination: Pagination;
    };
}

export interface DeviceResetAnalytics {
    data: {
        totals: {
            total: number;
            approved: number;
            rejected: number;
            pending: number
        };
        platform_breakdown: {
            platform: string | null; count: number; percentage: number
        }[];
    };
}
