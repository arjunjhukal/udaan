export interface LiveClassPayload {
    name: string;
    agenda: string;
    duration: number;
    schedule_date: string;
    is_recurring: boolean;
    recurring_type: 1 | 2 | 3;            // 1=daily, 2=weekly, 3=monthly
    repeat_interval: number;
    weekly_days: number[];                // only for weekly (1=Sun ... 7=Sat)
    monthly_day: number | null;
    end_date?: string | null;
    teacher_ids: number[];
    courses: number[];
    registration_type: 1 | 2 | 3;
    is_enable_recording: boolean;
    auto_recording: "local" | "cloud" | "none";
}


export const initialLiveClassState: LiveClassPayload = {
    name: "",
    agenda: "",
    duration: 60,
    schedule_date: "",
    is_recurring: false,
    recurring_type: 1,
    repeat_interval: 1,
    weekly_days: [],
    monthly_day: null,
    end_date: null,
    teacher_ids: [],
    courses: [],
    registration_type: 1,
    is_enable_recording: false,
    auto_recording: "none",
};

