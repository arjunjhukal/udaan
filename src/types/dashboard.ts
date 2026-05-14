export interface Analytics {
    title: string;
    value: string;
    description: string;
    type: "success" | "error" | "info" | "warning"
    icon?: React.ReactNode;
}

export interface AnalyticsList {
    data: Analytics[];
}

export interface ActiveUserPoint {
    timestamp: string;
    count: number;
}

export interface ActiveUsersResponse {
    data: ActiveUserPoint[];
}