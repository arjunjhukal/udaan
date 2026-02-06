import { createApi } from "@reduxjs/toolkit/query/react";
import type { AnalyticsList } from "../types/dashboard";
import { baseQuery } from "./baseQuery";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: baseQuery,
    tagTypes: ["Analytics"],
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