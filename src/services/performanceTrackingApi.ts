import type { ActivityHeartbeatPayload, ActivityHeartbeatResponse } from "../types/activityTracking";
import { baseApi } from "./baseApi";

export const performanceTrackingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendActivityHeartbeat: builder.mutation<ActivityHeartbeatResponse, ActivityHeartbeatPayload>({
            query: (body) => ({
                url: `/user/activity/heartbeat`,
                method: "POST",
                body,
            }),
        }),

        flushActivity: builder.mutation<ActivityHeartbeatResponse, ActivityHeartbeatPayload>({
            query: (body) => ({
                url: `/user/activity/flush`,
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useSendActivityHeartbeatMutation,
    useFlushActivityMutation,
} = performanceTrackingApi;
