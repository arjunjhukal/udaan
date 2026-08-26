import type { QueryParams } from "../types";
import type { GorkhapatraList, GorkhapatraProps, GorkhapatraShareLinkResponse, GorkhapatraTypes } from "../types/gorkhapatra";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseApi } from "./baseApi";

export const gorkhapatraApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createGorkhapatra: builder.mutation<GlobalResponse, FormData>({
            query: (body) => ({
                url: "/admin/gorkhapatra",
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Gorkhapatra", id: "LIST" }]
        }),
        getAllGorkhapatra: builder.query<GorkhapatraList, QueryParams & { type?: GorkhapatraTypes; days?: number | null; status?: "" | "draft" | "published" }>({
            query: ({ pageIndex, pageSize, search, status, type, days, startDate, endDate, sort_field, sort_by }) => {
                const params = buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search: search,
                    status: status,
                    type: type,
                    start_date: startDate,
                    end_date: endDate,
                    days: days,
                    sort_field,
                    sort_by,
                });

                return {
                    url: `/gorkhapatra?${params}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map((gorkhapatra) => ({ type: "Gorkhapatra" as const, id: gorkhapatra.id })),
                        { type: "Gorkhapatra", id: "LIST" },
                    ]
                    : [{ type: "Gorkhapatra", id: "LIST" }],
        }),
        editGorkhapatra: builder.mutation<{ data: GorkhapatraProps; message: string }, { body: FormData; id: number }>({
            query: ({ body, id }) => ({
                url: `/admin/gorkhapatra/${id}`,
                method: "POST",
                body
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Gorkhapatra", id },
                { type: "Gorkhapatra", id: "LIST" }
            ],
        }),
        deleteGorkhapatra: builder.mutation<GlobalResponse, { body: string[] }>({
            query: ({ body }) => ({
                url: `/admin/gorkhapatra`,
                method: "DELETE",
                body: { gorkhapatras: body }
            }),
            invalidatesTags: (_result, _error,) => [
                { type: "Gorkhapatra", id: "LIST" }
            ],
        }),
        getGorkhapatraById: builder.query<{ data: GorkhapatraProps }, { id: number }>({
            query: ({ id }) => ({
                url: `/gorkhapatra/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Gorkhapatra", id }],
        }),
        generateGorkhapatraShareLink: builder.query<GorkhapatraShareLinkResponse, { id: number }>({
            query: ({ id }) => ({
                url: `/admin/gorkhapatra/${id}/generate-share-link`,
                method: "GET",
            }),
        }),
        changeGorkhapatraStauts: builder.mutation<GlobalResponse, { body: number[] }>({
            query: ({ body }) => ({
                url: `/admin/gorkhapatra/status`,
                method: "POST",
                body: { gorkhapatras: body }
            }),
            invalidatesTags: (_result, _error,) => [
                { type: "Gorkhapatra", id: "LIST" }
            ],
        })
    })
})

export const {
    useCreateGorkhapatraMutation,
    useGetAllGorkhapatraQuery,
    useEditGorkhapatraMutation,
    useDeleteGorkhapatraMutation,
    useGetGorkhapatraByIdQuery,
    useChangeGorkhapatraStautsMutation,
    useLazyGenerateGorkhapatraShareLinkQuery
} = gorkhapatraApi;
