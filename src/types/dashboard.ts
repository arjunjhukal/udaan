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