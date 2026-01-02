import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { LiveClassList, LiveClassPayload, liveClassTabType } from "../types/liveClass";
import type { GlobalResponse } from "../types/user";
import { baseQuery } from "./baseQuery";

export const liveClassApi = createApi({
    reducerPath: "liveClassApi",
    baseQuery: baseQuery,
    tagTypes: ["Live_Class"],
    endpoints: (builder) => ({
        createLiveClass: builder.mutation<LiveClassList, { body: LiveClassPayload }>({
            query: ({ body }) => ({
                url: `/admin/course/live`,
                method: "POST",
                body
            }),
            invalidatesTags: (_result, _error,) => [
                { type: "Live_Class", id: "LIST" }
            ],
        }),
        getAllLiveClass: builder.query<LiveClassList, QueryParams & { status?: liveClassTabType }>({
            query: ({ pageIndex, pageSize, search, status }) => {
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
                if (status) {
                    params.append('status', status.toString());
                }

                return {
                    url: `/admin/course/live?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map((role) => ({ type: "Live_Class" as const, id: role.id })),
                        { type: "Live_Class", id: "LIST" },
                    ]
                    : [{ type: "Live_Class", id: "LIST" }],
        }),
        deleteLiveClass: builder.mutation<GlobalResponse, { body: string[] }>({
            query: ({ body }) => ({
                url: `/admin/course/live`,
                method: "DELETE",
                body: { live_classes: body }
            }),
            invalidatesTags: (_result, _error,) => [
                { type: "Live_Class", id: "LIST" }
            ],
        }),
        // Fetch a role by id
        getLiveClassById: builder.query<{ data: LiveClassPayload }, { id: number }>({
            query: ({ id }) => ({
                url: `/admin/course/live/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Live_Class", id }],
        }),
        editLiveClass: builder.mutation<GlobalResponse, { body: LiveClassPayload, id: number }>({
            query: ({ body, id }) => ({
                url: `/admin/course/live/${id}`,
                method: "POST",
                body
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Live_Class", id },
                { type: "Live_Class", id: "LIST" }
            ],
        })
    })
})

export const {
    useCreateLiveClassMutation,
    useGetAllLiveClassQuery,
    useEditLiveClassMutation,
    useGetLiveClassByIdQuery,
    useDeleteLiveClassMutation } = liveClassApi;