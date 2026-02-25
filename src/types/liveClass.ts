import * as Yup from "yup";
import type { Pagination } from "./roleAndPermission";
import type { RegisterUserProps } from "./user";

export interface LiveClassPayload {
    id?: number;
    name: string;
    account_id: number | null;
    agenda: string;
    description?: string;
    schedule_date: string;
    duration: number;
    is_recurring: boolean;
    recurring_type: 1 | 2 | 3;            // 1=daily, 2=weekly, 3=monthly
    repeat_interval: number;
    weekly_days: number[];                // only for weekly (1=Sun ... 7=Sat)
    monthly_day: number | null;
    end_date?: string | null;
    teacher_ids: number[];
    courses: number[];
    registration_type?: 1 | 2 | 3 | 99;        // only for weekly (free paid pre-approval)
    is_enable_recording: boolean;
    auto_recording?: "local" | "cloud" | "none";
    attendee?: number | null;
    enable_qa?: boolean;
    enable_chat?: boolean;
    required_registration?: boolean;
    created_at?: string;
    teachers?: RegisterUserProps[]
    status?: "ongoing" | "upcoming" | "ended",
    start_url?: string;
    join_url?: string;
    start_time?: string;
    end_time?: string;
    active_students?: number;
    enrolled_students?: number;
}


export const initialLiveClassState: LiveClassPayload = {
    name: "",
    agenda: "",
    account_id: null,
    duration: 60,
    description: "",
    schedule_date: "",
    is_recurring: false,
    recurring_type: 1,
    repeat_interval: 1,
    weekly_days: [],
    monthly_day: null,
    end_date: null,
    teacher_ids: [],
    courses: [],
    registration_type: 99,
    is_enable_recording: true,
    auto_recording: "none",
};


export const liveClassValidationSchema = Yup.object({
    id: Yup.number().optional(),
    name: Yup.string().required("Name is required"),
    account_id: Yup.number().required("Account is required"),
    agenda: Yup.string().required("Agenda is required"),
    description: Yup.string().optional(),

    schedule_date: Yup.string().required("Date and Time is required"),
    duration: Yup.number()
        .required("Duration is required")
        .min(1, "Duration must be at least 1 minute"),

    is_recurring: Yup.boolean().required(),

    recurring_type: Yup.mixed<1 | 2 | 3>()
        .oneOf([1, 2, 3], "Invalid recurring type")
        .when("is_recurring", {
            is: true,
            then: (schema) => schema.required("Recurring type is required"),
            otherwise: (schema) => schema.optional(),
        }),

    repeat_interval: Yup.number()
        .min(1, "Repeat interval must be at least 1")
        .when("is_recurring", {
            is: true,
            then: (schema) => schema.required("Repeat interval is required"),
            otherwise: (schema) => schema.optional(),
        }),

    // WEEKLY
    weekly_days: Yup.array()
        .of(Yup.number().oneOf([1, 2, 3, 4, 5, 6, 7]))
        .when(["is_recurring", "recurring_type"], {
            is: (is_recurring: boolean, recurring_type: 1 | 2 | 3) => is_recurring && recurring_type === 2,
            then: (schema) =>
                schema.min(1, "At least one weekday is required").required("Weekly days are required"),
            otherwise: (schema) => schema.optional(),
        }),

    // MONTHLY
    monthly_day: Yup.number()
        .nullable()
        .when(["is_recurring", "recurring_type"], {
            is: (is_recurring: boolean, recurring_type: 1 | 2 | 3) => is_recurring && recurring_type === 3,
            then: (schema) => schema.required("Monthly date is required"),
            otherwise: (schema) => schema.nullable().optional(),
        }),

    end_date: Yup.string()
        .nullable()
        .when("is_recurring", {
            is: true,
            then: (schema) => schema.required("End date is required"),
            otherwise: (schema) => schema.nullable().optional(),
        }),

    teacher_ids: Yup.array()
        .of(Yup.number())
        .min(1, "At least one teacher is required")
        .required("Teacher selection is required"),

    courses: Yup.array()
        .min(1, "At least one course is required")
        .required("At least one course is required"),

    registration_type: Yup.mixed<1 | 2 | 3 | 99>()
        .oneOf([1, 2, 3, 99])
        .when(["is_recurring", "recurring_type"], {
            is: (is_recurring: boolean, recurring_type: 1 | 2 | 3) =>
                is_recurring && recurring_type === 2,
            then: (schema) =>
                schema.required("Registration type is required"),
            otherwise: (schema) => schema.optional(),
        }),


    is_enable_recording: Yup.boolean().required(),

    auto_recording: Yup.mixed<"local" | "cloud" | "none">()
        .oneOf(["local", "cloud", "none"])
        .when("is_enable_recording", {
            is: true,
            then: (schema) => schema.required("Recording type is required"),
            otherwise: (schema) => schema.optional(),
        }),
});


export interface LiveClassList {
    data: {
        data: LiveClassPayload[];
        pagination: Pagination;
    }
}


export type liveClassTabType = "ongoing" | "upcoming" | "ended"

