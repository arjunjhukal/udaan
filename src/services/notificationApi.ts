import type { QueryParams } from "../types";
import type { CompletionStatus, DeliveryMethodsType, NotificationList, NotificationListResponse, NotificationPayload, TargetStudentType } from "../types/notification";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseApi } from "./baseApi";

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createNotification: builder.mutation<GlobalResponse, { body: FormData }>({
            query: ({ body }) => ({
                url: `/admin/notification`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Notifications", id: "LIST" }],
        }),
        getAllNotification: builder.query<NotificationList, QueryParams & { days?: number | null, status?: CompletionStatus, delivey_method: DeliveryMethodsType, target_audience?: TargetStudentType }>({
            query: ({ pageIndex, pageSize, startDate, endDate, days, status, delivey_method, target_audience, sort_field, sort_by }) => {
                const queryParams = buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    start_date: startDate,
                    end_date: endDate,
                    days: days,
                    status: status,
                    delivery_method: delivey_method,
                    target_audience: target_audience,
                    sort_field,
                    sort_by,
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
        sendNotification: builder.mutation<GlobalResponse, { id: number }>({
            query: ({ id }) => ({
                url: `/admin/notification/${id}/send`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Notifications", id }
            ],
        }),
        getAllNotifications: builder.query<NotificationListResponse, QueryParams & { type?: "notice_board" | "push_notification" }>({
            query: ({ pageIndex, pageSize, type, search }) => {
                const queryParams = buildQueryParams({ page: pageIndex, page_size: pageSize, type, search });
                return {
                    url: `/notification?${queryParams}`,
                    method: "GET",
                };
            },
            providesTags: [{ type: "Notifications", id: "LIST" }],
        }),
        readNotification: builder.mutation<GlobalResponse, { id?: number }>({
            query: ({ id }) => ({
                url: id ? `/notification/${id}` : `/notification`,
                method: "POST",
            }),
            invalidatesTags: [{ type: "Notifications", id: "LIST" }],
        }),
    })
})

export const {
    useCreateNotificationMutation,
    useGetAllNotificationQuery,
    useGetNotificationByIdQuery,
    useUpdateNotificationByIdMutation,
    useDeleteNotificationMutation,
    useSendNotificationMutation,
    useGetAllNotificationsQuery,
    useReadNotificationMutation,
} = notificationApi;
