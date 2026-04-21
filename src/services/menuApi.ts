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
    }),
});

export const { useGetMenuCountsQuery } = menuApi;
