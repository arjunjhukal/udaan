import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { MediaList } from "../types/media";
import type { GlobalResponse } from "../types/user";
import { baseQuery } from "./baseQuery";

export const mediaApi = createApi({
    reducerPath: "mediaApi",
    baseQuery: baseQuery,
    tagTypes: ["Media", "Notes", "Audio", "Video", "Images"],
    endpoints: (builder) => ({
        uploadMedia: builder.mutation<GlobalResponse, { type: string, body: FormData }>({
            query: ({ type, body }) => ({
                url: `/admin/media/${type}`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Media", id: "LIST" }]
        }),
        getallMedia: builder.query<MediaList, QueryParams & { type: string }>({
            query: ({ pageIndex, pageSize, search, type }) => {
                const params = new URLSearchParams();

                if (pageIndex) {
                    params.append('page', (pageIndex).toString());
                }
                if (pageSize) {
                    params.append('page_size', pageSize.toString());
                }
                if (search) {
                    params.append('search', search.toString());
                }
                return {
                    url: `/admin/media/${type}?${params.toString()}`,
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
    })
})

export const { useUploadMediaMutation, useGetallMediaQuery, useUploadMediaImageMutation } = mediaApi;