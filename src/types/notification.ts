import type { Pagination } from "./roleAndPermission";

export type TargetStudentType = "purchased" | "not_purchased" | "free_trial";

export type NotificationType = "all_course" | "specific_course";

export type CompletionStatus = "completed" | "not_complete";

export type DeliveryMethodsType = "push_notification" | "email_notification" | "notice_board" | "sms_notification"

export interface NotificationPayload {
    id?: number;
    name: string;
    description: string;
    external_link?: string;
    image: File | null,
    image_url?: string;
    target_students: TargetStudentType[]
    notification_type: NotificationType
    megacategory_ids?: number[];
    category_ids?: number[];
    subcategory_ids?: number[];
    level_ids?: number[];
    course_ids?: number[];
    completion_status?: CompletionStatus[];
    delivery_methods?: DeliveryMethodsType[];
    scheduled_date?: string;
    scheduled_time?: string;
}

export const NotificationInitialState: NotificationPayload = {
    name: "",
    description: "",
    external_link: "",
    image: null,
    image_url: "",
    target_students: [],
    notification_type: "all_course",
    megacategory_ids: [],
    category_ids: [],
    subcategory_ids: [],
    level_ids: [],
    course_ids: [],
    completion_status: [],
    delivery_methods: [],
    scheduled_date: "",
    scheduled_time: ""
}

import * as yup from "yup";

export const NotificationValidationSchema = yup.object({
    name: yup
        .string()
        .required("Notification name is required")
        .min(3, "Name must be at least 3 characters")
        .max(150, "Name must not exceed 150 characters"),

    description: yup
        .string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description must not exceed 1000 characters"),

    external_link: yup
        .string()
        .nullable()
    ,

    image: yup
        .mixed<File>()
        .nullable()
        .test("fileSize", "Image size must be under 5MB", (value) => {
            if (!value) return true;
            return value.size <= 5 * 1024 * 1024;
        })
    ,

    image_url: yup.string().nullable(),

    target_students: yup
        .array()
        .of(yup.mixed<TargetStudentType>().oneOf(["purchased", "not_purchased", "free_trial"]))
        .min(1, "Select at least one target student")
        .required("Target students is required"),

    notification_type: yup
        .mixed<"all_course" | "specific_cours">()
        .oneOf(["all_course", "specific_cours"])
        .required("Notification type is required"),

    megacategory_ids: yup.array().of(yup.number()),

    category_ids: yup.array().of(yup.number()),

    subcategory_ids: yup.array().of(yup.number()),

    level_ids: yup.array().of(yup.number()),

    course_ids: yup.array().of(yup.number()),

    completion_status: yup
        .array()
        .of(yup.mixed<"completed" | "not_complete">().oneOf(["completed", "not_complete"]))
    ,

    delivery_methods: yup
        .array()
        .of(
            yup
                .mixed<
                    "push_notification" |
                    "email_notification" |
                    "notice_board" |
                    "sms_notification"
                >()
                .oneOf([
                    "push_notification",
                    "email_notification",
                    "notice_board",
                    "sms_notification",
                ])
        )
    ,

    scheduled_date: yup.string().nullable(),

    schedule_time: yup.string().nullable(),
});

export interface NotificationList {
    data: {
        data: NotificationPayload[];
        pagination: Pagination;
    }
}