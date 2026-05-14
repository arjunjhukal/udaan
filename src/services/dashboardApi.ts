import type { ActiveUsersResponse, AnalyticsList } from "../types/dashboard";
import { baseApi } from "./baseApi";

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAnalytics: builder.query<AnalyticsList, void>({
            query: () => ({
                url: `/admin/analytics`,
                method: "GET"
            })
        }),
        getActiveUsers: builder.query<ActiveUsersResponse, { date?: string } | void>({
            query: (arg) => ({
                url: `/admin/analytics/active-users`,
                method: "GET",
                params: arg && arg.date ? { date: arg.date } : undefined,
            })
        }),
    })
})

export const {
    useGetAnalyticsQuery,
    useGetActiveUsersQuery,
} = dashboardApi;
