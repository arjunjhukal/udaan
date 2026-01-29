import type { Pagination } from "./roleAndPermission";

export type PaymentMethodProps = "esewa" | "khalti" | "cash" | "fonepay"
export type PaymentStatusProps = "success" | "installment"

export interface TransactionPayload {
    id?: number;
    student_id: number;
    course_id: number;
    subscription_id: number;
    invoice_id: string;
    transaction_id: string;
    payment_method: PaymentMethodProps;
    status: PaymentStatusProps;
    image: File | null;
    image_url?: string;
}
export const TransactionInitialState: TransactionPayload = {
    student_id: 0,
    course_id: 0,
    subscription_id: 0,
    invoice_id: "",
    transaction_id: "",
    payment_method: "cash",
    status: "success",
    image: null,
};

export type TransactionCourseStatus = "purchase" | "free_trial_expired" | "free_trial" | "purchase_expired";

export interface TransactionResponse extends TransactionPayload {
    name: string;
    added_by: string;
    course_name: string;
    email: string;
    contact: string;
    created_at: string;
    course_status?: TransactionCourseStatus
}

export interface TransactionList {
    data: {
        data: TransactionResponse[];
        pagination: Pagination;
    }
}