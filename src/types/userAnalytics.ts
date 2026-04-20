export interface UserAnalyticsItem {
    title: string;
    value: number;
    description: string | null;
    type: "success" | "error" | "info" | "warning";
}

export interface UserAnalyticsResponse {
    status: number;
    data: UserAnalyticsItem[];
    message: string;
}

export interface NewSignUpDataPoint {
    month: string;
    sign_ups: number;
}

export interface NewSignUpData {
    title: string;
    value: number;
    description: string;
    type: "success" | "error" | "info" | "warning";
    data: NewSignUpDataPoint[];
}

export interface NewSignUpsResponse {
    status: number;
    data: NewSignUpData;
    message: string;
}

export interface RoleDistributionItem {
    title: string;
    value: number;
    percentage: number;
    type: "success" | "error" | "info" | "warning";
}

export interface RoleDistributionResponse {
    status: number;
    data: RoleDistributionItem[];
    message: string;
}
