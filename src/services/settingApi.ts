import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { AppSettingProps, ChangePasswordProps, LinkedDeviceList } from "../types/setting";
import type { GlobalResponse, User } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const settingApi = createApi({
    reducerPath: "settingApi",
    baseQuery: baseQuery,
    tagTypes: ["LinkedDevice", "Profile"],
    endpoints: (builder) => ({
        changePassword: builder.mutation<GlobalResponse, ChangePasswordProps>({
            query: (body) => ({
                url: "/admin/settings/password",
                method: "POST",
                body,
            }),
        }),

        getAllLinkedDevices: builder.query<LinkedDeviceList, QueryParams>({
            query: ({ pageIndex, pageSize }) => ({
                url: `/admin/settings/linked-device?${buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize
                })}`,
                method: "GET",
            }),
            providesTags: ["LinkedDevice"],
        }),

        logoutFromLinkedDevice: builder.mutation<
            GlobalResponse,
            { id: number }
        >({
            query: ({ id }) => ({
                url: `/admin/settings/linked-device/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["LinkedDevice"],
        }),
        updateAppSetting: builder.mutation<GlobalResponse, FormData>({
            query: (body) => ({
                url: `/admin/settings/app-settings`,
                method: "POST",
                body
            }),
        }),
        getAppSettings: builder.query<GlobalResponse & { data: AppSettingProps }, void>({
            query: () => ({
                url: `/settings`,
                method: "GET",
            }),
        }),
        updatedProfile: builder.mutation<GlobalResponse, FormData>({
            query: (body) => ({
                url: `/admin/settings/profile`,
                method: "POST",
                body
            })
        }),
        getProfile: builder.query<GlobalResponse & { data: User }, void>({
            query: () => ({
                url: `/admin/settings/profile`,
                method: "GET",
            })
        })
    }),
});

export const {
    useChangePasswordMutation,
    useGetAllLinkedDevicesQuery,
    useLogoutFromLinkedDeviceMutation,
    useUpdateAppSettingMutation,
    useGetAppSettingsQuery,
    useUpdatedProfileMutation,
    useGetProfileQuery
} = settingApi;
