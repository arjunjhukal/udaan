import { createApi } from "@reduxjs/toolkit/query/react";
import type { ChangePasswordProps, LinkedDeviceList } from "../types/setting";
import type { GlobalResponse } from "../types/user";
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

        getAllLinkedDevices: builder.query<LinkedDeviceList, void>({
            query: () => ({
                url: "/admin/settings/linked-device",
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
    }),
});

export const {
    useChangePasswordMutation,
    useGetAllLinkedDevicesQuery,
    useLogoutFromLinkedDeviceMutation,
} = settingApi;
