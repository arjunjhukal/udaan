import type { QueryParams } from "../types";
import type { ModerationList, ModerationSingleResponse } from "../types/moderation";
import { baseApi } from "./baseApi";

export const moderationApi = baseApi.injectEndpoints({
    // reducerPath: "moderationApi",
    // baseQuery: baseQuery,
    // tagTypes: ["Moderation"],
    endpoints: (builder) => ({
        getModerationWords: builder.query<ModerationList, QueryParams & { page?: number }>({
            query: ({ pageIndex = 1, pageSize = 20, search = "", page }) => {
                const params = new URLSearchParams();
                params.append("page", String(page ?? pageIndex));
                params.append("page_size", String(pageSize));
                if (search) params.append("search", search);
                return {
                    url: `/admin/moderation?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map((item) => ({
                            type: "Moderation" as const,
                            id: item.id,
                        })),
                        { type: "Moderation", id: "LIST" },
                    ]
                    : [{ type: "Moderation", id: "LIST" }],
        }),
        createModerationWord: builder.mutation<ModerationSingleResponse, { name: string }>({
            query: (body) => ({
                url: "/admin/moderation",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Moderation", id: "LIST" }],
        }),
        updateModerationWord: builder.mutation<ModerationSingleResponse, { id: number; name: string }>({
            query: ({ id, name }) => ({
                url: `/admin/moderation/${id}`,
                method: "POST",
                body: { name },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Moderation", id },
                { type: "Moderation", id: "LIST" },
            ],
        }),
        deleteModerationWord: builder.mutation<void, { ids: number[] }>({
            query: (body) => ({
                url: "/admin/moderation",
                method: "DELETE",
                body,
            }),
            invalidatesTags: [{ type: "Moderation", id: "LIST" }],
        }),
    }),
});

export const {
    useGetModerationWordsQuery,
    useCreateModerationWordMutation,
    useUpdateModerationWordMutation,
    useDeleteModerationWordMutation,
} = moderationApi;
