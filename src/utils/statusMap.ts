export type StatusVariant = "success" | "info" | "warning" | "error";

export type PublishedStatus = "draft" | "published"

export function statusMap<T extends string>(map: Record<T, StatusVariant>) {
    return (key: T): StatusVariant => {
        return map[key] ?? "info";
    };
}

import type { GorkhapatraTypes } from "../types/gorkhapatra";
import type { TransactionCourseStatus } from "../types/transaction";

export const getTransactionStatusVariant = statusMap<TransactionCourseStatus>({
    purchase: "success",
    free_trial: "success",
    free_trial_expired: "error",
    purchase_expired: "error",
});
export const getPublishedStatus = statusMap<PublishedStatus>({
    published: "success",
    draft: "warning",
});

export const getGorkhapatraStatus = statusMap<GorkhapatraTypes>({
    mcqs: "success",
    descriptive: "warning",
});

export const getTransactionStatus = statusMap<"failed" | "success" | "pending">({
    failed: "error",
    success: "success",
    pending: "warning",
});

export const getCourseStatus = (progress?: number): StatusVariant => {
    if (progress === 0) return "error";
    if (progress === 100) return "success";
    return "warning";
};