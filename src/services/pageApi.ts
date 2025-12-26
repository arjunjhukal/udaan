import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { GeneralPageListing, GeneralPageProps } from "../types/page";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const pageApi = createApi({
    reducerPath: "pageApi",
    baseQuery: baseQuery,
    tagTypes: ["Pages"],
    endpoints: (builder) => ({
        createPage: builder.mutation<GlobalResponse, GeneralPageProps>({
            query: (body) => ({
                url: `/admin/content/page`,
                method: "POST",
                body
            }),
            invalidatesTags: ["Pages"]
        }),

        getAllPages: builder.query<GeneralPageListing, QueryParams & { search: string }>({
            query: ({ pageIndex, pageSize, search }) => ({
                url: `/admin/content/page?${buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search: search
                })}`,
                method: "GET",
            }),
            providesTags: ["Pages"]
        }),

        getSinglePageByIdentifier: builder.query<{ data: GeneralPageProps }, string>({
            query: (identifier) => ({
                url: `/admin/content/page/${identifier}`,
                method: "GET"
            }),
            providesTags: (_result, _error, identifier) => [{ type: "Pages", id: identifier }]
        }),

        updatePageByIdentifier: builder.mutation<
            GlobalResponse,
            { identifier: string; data: Partial<GeneralPageProps> }
        >({
            query: ({ identifier, data }) => ({
                url: `/admin/content/page/${identifier}`,
                method: "POST",
                body: data
            }),
            invalidatesTags: (_result, _error, { identifier }) => [
                "Pages",
                { type: "Pages", id: identifier }
            ]
        }),

        deletePages: builder.mutation<GlobalResponse, { page_ids: string[] }>({
            query: (body) => ({
                url: `/admin/content/page`,
                method: "DELETE",
                body
            }),
            invalidatesTags: ["Pages"]
        })
    })
});

export const {
    useCreatePageMutation,
    useGetAllPagesQuery,
    useGetSinglePageByIdentifierQuery,
    useUpdatePageByIdentifierMutation,
    useDeletePagesMutation
} = pageApi;