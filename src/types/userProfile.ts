import type { Pagination } from "./roleAndPermission";

export interface UserRole {
    id: number;
    name: string;
    members: number;
    created_at: string;
}

export interface PersonalInfo {
    full_name: string;
    email: string;
    phone: string;
    address: string | null;
    is_active: boolean;
    role: UserRole;
}

export interface AccountInfo {
    user_id: string;
    joined_at: string;
    last_active: string | null;
    updated_at: string;
    active_sessions: number;
}

export interface Achievement {
    title: string;
    description: string;
    type: "success" | "error" | "info" | "warning";
}

export interface CourseProgress {
    title: string;
    progress: number;
    type?: string;
}

export interface UserProfileData {
    personal_info: PersonalInfo;
    account_info: AccountInfo;
    achievements: Achievement[];
    course_progresses: CourseProgress[];
}

export interface UserProfileResponse {
    status: number;
    data: UserProfileData;
    message: string;
}

export interface LoginHistoryItem {
    id: number;
    browser: string;
    os: string;
    ip: string;
    location: string;
    device_type: "web" | "mobile";
    status: "success" | "failed";
    created_at: string;
}

export interface LoginHistoryResponse {
    status: number;
    data: {
        data: LoginHistoryItem[];
        pagination: Pagination;
    };
    message: string;
}

export interface RecentActivityItem {
    id: number;
    title: string;
    description?: string;
    type: string;
    status: "success" | "failed" | "pending";
    created_at: string;
}

export interface RecentActivityResponse {
    status: number;
    data: {
        data: RecentActivityItem[];
        pagination: Pagination;
    };
    message: string;
}

export interface UserEnrolledTest {
    id: number;
    name: string;
    test_type: string;
    full_mark: number;
    pass_mark: number;
    progress?: number;
    status?: string;
    started_from?: string;
    ends_at?: string;
}

export interface UserEnrolledBundle {
    id: number;
    name: string;
    progress?: number;
    status?: string;
    started_from?: string;
    ends_at?: string;
}

export interface UserEnrolledTestResponse {
    status: number;
    data: {
        data: UserEnrolledTest[];
        pagination: Pagination;
    };
    message: string;
}

export interface UserEnrolledBundleResponse {
    status: number;
    data: {
        data: UserEnrolledBundle[];
        pagination: Pagination;
    };
    message: string;
}

export interface CourseAnalyticsItem {
    title: string;
    value: number;
    type: "success" | "error" | "info" | "warning";
}

export interface CourseAnalyticsResponse {
    status: number;
    data: CourseAnalyticsItem[];
    message: string;
}

export interface PerformanceAnalyticsItem {
    title: string;
    value: number;
    type: "success" | "error" | "info" | "warning";
}

export interface PerformanceAnalyticsResponse {
    status: number;
    data: PerformanceAnalyticsItem[];
    message: string;
}

export interface TrackPerformanceItem {
    title: string;
    value: number;
    type: "success" | "error" | "info" | "warning";
}

export interface TrackPerformanceResponse {
    status: number;
    data: TrackPerformanceItem[];
    message: string;
}

export interface MonthlyActivityItem {
    label: string;
    hours: number;
}

export interface MonthlyActivityResponse {
    status: number;
    data: MonthlyActivityItem[];
    message: string;
}
