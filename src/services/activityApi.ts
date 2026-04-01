import type { DeviceType, QueryParams, Status } from "../types";
import type { ActivityList, ActivityType } from "../types/activity";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseApi } from "./baseApi";

export const activitiyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllActivity: builder.query<ActivityList, QueryParams & {
            type?: ActivityType,
            days?: number | null,
            device_type?: DeviceType;
            status?: Status;
        }>({
            query: ({ pageIndex, pageSize, search, startDate, endDate, sort_by, type, days, device_type, status }) => ({
                url: `/admin/activity-log?${buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search: search,
                    start_date: startDate,
                    end_date: endDate,
                    days: days,
                    sort_by: sort_by,
                    type: type,
                    device_type: device_type,
                    status: status
                })}`,
                method: "GET"
            })
        }),
        downloadCsv: builder.mutation<Blob & GlobalResponse, { type: "users" | "activity_logs" | "transactions" }>({
            query: ({ type }) => ({
                url: `/admin/csv?${buildQueryParams({ module: type })}`,
                method: "GET",
                responseHandler: (response) => response.blob()
            })
        })
    })
})

export const { useGetAllActivityQuery, useDownloadCsvMutation } = activitiyApi;
