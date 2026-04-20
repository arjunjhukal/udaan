export interface ActivityHeartbeatPayload {
    session_id: string;
    duration_seconds: number;
    activity_type: ActivityType;
}

export type ActivityType = "video" | "quiz" | "reading" | "general";

export interface ActivityHeartbeatResponse {
    status: number;
    message: string;
}
