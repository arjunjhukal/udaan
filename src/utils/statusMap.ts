export type StatusVariant = "success" | "info" | "warning" | "error";

export function statusMap<T extends string>(map: Record<T, StatusVariant>) {
    return (key: T): StatusVariant => {
        return map[key] ?? "info";
    };
}

import type { TransactionCourseStatus } from "../types/transaction";

export const getTransactionStatusVariant = statusMap<TransactionCourseStatus>({
    purchase: "success",
    free_trial: "success",
    free_trial_expired: "error",
    purchase_expired: "error",
});
