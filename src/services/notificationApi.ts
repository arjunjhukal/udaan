import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { NotificationList, NotificationPayload } from "../types/notification";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery: baseQuery,
    tagTypes: ["Notifications"],
    endpoints: (builder) => ({
        createNotification: builder.mutation<GlobalResponse, { body: FormData }>({
            query: ({ body }) => ({
                url: `/admin/notification`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Notifications", id: "LIST" }],
        }),
        getAllNotification: builder.query<NotificationList, QueryParams>({
            query: ({ pageIndex, pageSize }) => {
                const queryParams = buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize
                })
                return {
                    url: `/admin/notification?${queryParams}`,
                    method: "GET",
                }
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.data.map(({ id }) => ({
                            type: "Notifications" as const,
                            id
                        })),
                        { type: "Notifications", id: "LIST" },
                    ]
                    : [{ type: "Notifications", id: "LIST" }],
        }),
        getNotificationById: builder.query<GlobalResponse & { data: NotificationPayload }, { id: number }>({
            query: ({ id }) => ({
                url: `/admin/notification/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [
                { type: "Notifications", id }
            ],
        }),
        updateNotificationById: builder.mutation<GlobalResponse & { data: NotificationPayload }, { id: number, body: FormData }>({
            query: ({ id, body }) => ({
                url: `/admin/notification/${id}`,
                method: "POST",
                body
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Notifications", id },
                { type: "Notifications", id: "LIST" },
            ],
        }),
        deleteNotification: builder.mutation<GlobalResponse, { body: string[] }>({
            query: ({ body }) => ({
                url: `/admin/notification/`,
                method: "DELETE",
                body: {
                    notification_ids: body
                }
            }),
            invalidatesTags: (_result, _error, { body }) => [
                ...body.map((id) => ({
                    type: "Notifications" as const,
                    id: Number(id)
                })),
                { type: "Notifications", id: "LIST" },
            ],
        }),
    })
})

export const {
    useCreateNotificationMutation,
    useGetAllNotificationQuery,
    useGetNotificationByIdQuery,
    useUpdateNotificationByIdMutation,
    useDeleteNotificationMutation
} = notificationApi;