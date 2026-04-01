import type { AnalyticsList } from "../types/dashboard";
import { baseApi } from "./baseApi";

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAnalytics: builder.query<AnalyticsList, void>({
            query: () => ({
                url: `/admin/analytics`,
                method: "GET"
            })
        }),
    })
})

export const {
    useGetAnalyticsQuery,
} = dashboardApi;
