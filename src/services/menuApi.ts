import { baseApi } from "./baseApi";

export interface MenuCounts {
    data: {
        discussion: number;
        support_ticket: number;
        device_reset: number;
        transaction: number;
        notification: number;
        activity_log: number;
        new_users: number;
    };
}

export const menuApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMenuCounts: builder.query<MenuCounts, void>({
            query: () => ({
                url: "/admin/menu-counts",
                method: "GET",
            }),
            providesTags: [{ type: "MenuCounts", id: "ALL" }],
        }),
        markNewUsersSeen: builder.mutation<void, void>({
            query: () => ({ url: "/admin/menu-counts/new-users/seen", method: "PATCH" }),
            invalidatesTags: [{ type: "MenuCounts", id: "ALL" }],
        }),
        markTransactionSeen: builder.mutation<void, void>({
            query: () => ({ url: "/admin/menu-counts/transaction/seen", method: "PATCH" }),
            invalidatesTags: [{ type: "MenuCounts", id: "ALL" }],
        }),
    }),
});

export const { useGetMenuCountsQuery, useMarkNewUsersSeenMutation, useMarkTransactionSeenMutation } = menuApi;
