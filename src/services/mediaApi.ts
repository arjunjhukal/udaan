import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { MediaList, MediaProps } from "../types/media";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const mediaApi = createApi({
    reducerPath: "mediaApi",
    baseQuery: baseQuery,
    tagTypes: ["Media", "Notes", "Audio", "Video", "Images"],
    endpoints: (builder) => ({
        uploadMedia: builder.mutation<GlobalResponse & { data: MediaProps[] }, { type: string, body: FormData }>({
            query: ({ type, body }) => ({
                url: `/admin/media/${type}`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Media", id: "LIST" }]
        }),
        getallMedia: builder.query<MediaList, QueryParams & { type: string }>({
            query: ({ pageIndex, pageSize, search, type }) => {
                return {
                    url: `/admin/media/${type}?${buildQueryParams({ page: pageIndex, page_size: pageSize, search: search })}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map((media) => ({ type: "Media" as const, id: media.id })),
                        { type: "Media", id: "LIST" },
                    ]
                    : [{ type: "Media", id: "LIST" }],
        }),
        uploadMediaImage: builder.mutation<
            GlobalResponse & {
                data: {
                    url: string;
                    media_id: number;
                };
            },
            { body: FormData }
        >({
            query: ({ body }) => ({
                url: `/admin/file/image`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Media", id: "LIST" }]
        }),
        getAllMediaIrrespectiveOfType: builder.query<MediaList, QueryParams>(({
            query: ({ pageIndex, pageSize, search }) => ({
                url: `/admin/media?${buildQueryParams({ page: pageIndex, page_size: pageSize, search: search })}`,
                method: "GET",
            })
        })),
        deleteMedia: builder.mutation<GlobalResponse, { media_ids: number[] }>({
            query: (body) => ({
                url: `/admin/media`,
                method: "DELETE",
                body
            }),
            invalidatesTags: [{ type: "Media", id: "LIST" }]
        }),
        useChangeMediaStatus: builder.mutation<GlobalResponse, { media_ids: number[] }>({
            query: (body) => ({
                url: `/admin/media/change-status`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Media", id: "LIST" }]
        }),
    })
})

export const {
    useUploadMediaMutation,
    useGetallMediaQuery,
    useUploadMediaImageMutation,
    useGetAllMediaIrrespectiveOfTypeQuery,
    useDeleteMediaMutation,
    useUseChangeMediaStatusMutation
} = mediaApi;