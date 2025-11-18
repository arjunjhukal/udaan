import type { Pagination } from "./roleAndPermission";
import type { GlobalResponse } from "./user";

export interface SubscriptionPlanProps {
    id?: string;
    name: string;
    description: string;
}
export const subscriptionPlanInitialState: SubscriptionPlanProps = {
    name: "",
    description: ""
}
export interface SubscriptionList extends GlobalResponse {
    data: {
        data: SubscriptionPlanProps[];
        pagination: Pagination
    }
}