import type { LiveAnalyticsResponse } from "../types/liveAnalytics";
import { baseApi } from "./baseApi";

export const liveAnalyticsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getLiveAnalytics: builder.query<LiveAnalyticsResponse, void>({
            query: () => ({
                url: `/admin/live-analytics`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetLiveAnalyticsQuery } = liveAnalyticsApi;
