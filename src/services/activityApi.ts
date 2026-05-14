import type { DeviceType, QueryParams, Status } from "../types";
import type { ActivityList, ActivityType } from "../types/activity";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseApi } from "./baseApi";

export type BackupFile = {
    filename: string;
    size_bytes: number;
    last_modified: string;
};

type BackupListResponse = {
    data: BackupFile[];
    message: string;
};

type BackupDeleteResponse = {
    data: [];
    message: string;
};

export const activitiyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllActivity: builder.query<ActivityList, QueryParams & {
            type?: ActivityType,
            days?: number | null,
            device_type?: DeviceType;
            status?: Status;
        }>({
            query: ({ pageIndex, pageSize, search, startDate, endDate, sort_by, sort_field, type, days, device_type, status }) => ({
                url: `/admin/activity-log?${buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search: search,
                    start_date: startDate,
                    end_date: endDate,
                    days: days,
                    sort_by: sort_by,
                    sort_field: sort_field,
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
        }),
        getActivityLogBackups: builder.query<BackupListResponse, void>({
            query: () => ({
                url: `/admin/activity-log-backups`,
                method: "GET"
            }),
            providesTags: ["Archive"]
        }),
        downloadActivityLogBackup: builder.mutation<Blob, { filename: string }>({
            query: ({ filename }) => ({
                url: `/admin/activity-log-backups/${encodeURIComponent(filename)}/download`,
                method: "GET",
                responseHandler: (response) => response.blob()
            })
        }),
        deleteActivityLogBackup: builder.mutation<BackupDeleteResponse, { filename: string }>({
            query: ({ filename }) => ({
                url: `/admin/activity-log-backups/${encodeURIComponent(filename)}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Archive"]
        })
    })
})

export const {
    useGetAllActivityQuery,
    useDownloadCsvMutation,
    useGetActivityLogBackupsQuery,
    useDownloadActivityLogBackupMutation,
    useDeleteActivityLogBackupMutation,
} = activitiyApi;
