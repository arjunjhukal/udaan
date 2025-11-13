import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { positionList, positionProps } from "../types/position";
import type { GlobalResponse } from "../types/user";
import { baseQuery } from "./baseQuery";



export const positionApi = createApi({
    reducerPath: "positionApi",
    baseQuery: baseQuery,
    tagTypes: ["Position"],
    endpoints: (builder) => ({
        getAllPosition: builder.query<positionList, QueryParams>({
            query: ({ pageIndex, pageSize, search }) => {
                const params = new URLSearchParams();

                if (pageIndex) params.append("page", pageIndex.toString());
                if (pageSize) params.append("page_size", pageSize.toString());
                if (search) params.append("search", search);

                return {
                    url: `/admin/position?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map((pos) => ({
                            type: "Position" as const,
                            id: pos.id,
                        })),
                        { type: "Position", id: "LIST" },
                    ]
                    : [{ type: "Position", id: "LIST" }],
        }),

        getPositionById: builder.query<{ data: positionProps }, { id: string }>({
            query: ({ id }) => ({
                url: `/admin/position/${id}`,
                method: "GET",
            }),
            providesTags: (_res, _err, { id }) => [{ type: "Position", id }],
        }),

        createPosition: builder.mutation<{ data: positionProps; message: string }, positionProps>({
            query: (body) => ({
                url: "/admin/position",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Position", id: "LIST" }],
        }),

        updatePosition: builder.mutation<
            { data: positionProps; message: string },
            { id: string; body: positionProps }
        >({
            query: ({ id, body }) => ({
                url: `/admin/position/${id}`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Position", id },
                { type: "Position", id: "LIST" },
            ],
        }),

        deletePosition: builder.mutation<GlobalResponse, { body: string[] }>({
            query: ({ body }) => ({
                url: `/admin/position`,
                method: "DELETE",
                body: { positions: body },
            }),
            invalidatesTags: [{ type: "Position", id: "LIST" }],
        }),
    }),
});

export const {
    useGetAllPositionQuery,
    useGetPositionByIdQuery,
    useCreatePositionMutation,
    useUpdatePositionMutation,
    useDeletePositionMutation,
} = positionApi;
