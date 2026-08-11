import type { CategoryFilterParams, QueryParams } from "../types";
import type { EbookList, EbookProps, EbookQueryParams } from "../types/ebook";
import type { TransactionList } from "../types/transaction";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseApi } from "./baseApi";

export const ebookApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllEbook: builder.query<EbookList, EbookQueryParams & { categoryFilter?: CategoryFilterParams }>({
            query: ({ pageIndex, pageSize, search, status, is_downloadable, days, startDate, endDate, categoryFilter, sort_field, sort_by }) => {
                const params = buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search,
                    status,
                    is_downloadable: is_downloadable == null ? null : Number(is_downloadable),
                    days,
                    start_date: startDate,
                    end_date: endDate,
                    mega_categories: categoryFilter?.mega_category,
                    categories: categoryFilter?.category,
                    sub_categories: categoryFilter?.sub_category,
                    positions: categoryFilter?.positions,
                    sort_field,
                    sort_by,
                });

                return {
                    url: `/admin/ebook?${params}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map((ebook) => ({ type: "Ebook" as const, id: ebook.id })),
                        { type: "Ebook", id: "LIST" },
                    ]
                    : [{ type: "Ebook", id: "LIST" }],
        }),
        getEbookById: builder.query<{ data: EbookProps }, { id: number }>({
            query: ({ id }) => ({
                url: `/admin/ebook/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Ebook", id }],
        }),
        createEbook: builder.mutation<{ data: EbookProps; message: string }, FormData>({
            query: (body) => ({
                url: "/admin/ebook",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Ebook", id: "LIST" }],
        }),
        editEbook: builder.mutation<{ data: EbookProps; message: string }, { body: FormData; id: number }>({
            query: ({ body, id }) => ({
                url: `/admin/ebook/${id}`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Ebook", id },
                { type: "Ebook", id: "LIST" },
            ],
        }),
        deleteEbook: builder.mutation<GlobalResponse, { body: string[] }>({
            query: ({ body }) => ({
                url: `/admin/ebook`,
                method: "DELETE",
                body: { ebooks: body },
            }),
            invalidatesTags: [{ type: "Ebook", id: "LIST" }],
        }),
        changeEbookStatus: builder.mutation<GlobalResponse, { body: number[] }>({
            query: ({ body }) => ({
                url: `/admin/ebook/status`,
                method: "POST",
                body: { ebooks: body },
            }),
            invalidatesTags: [{ type: "Ebook", id: "LIST" }],
        }),
        getEnrolledUsersByEbook: builder.query<TransactionList, QueryParams & { id: number; type?: "active" | "archived" }>({
            query: ({ id, pageIndex, pageSize, search, type, sort_field, sort_by }) => ({
                url: `/admin/ebook/${id}/user?${buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search,
                    type,
                    sort_field,
                    sort_by,
                })}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [
                { type: "EbookEnrollment", id },
                { type: "EbookEnrollment", id: "LIST" },
            ],
        }),
        enrollStudentToEbook: builder.mutation<GlobalResponse, { id: number; user_id: number }>({
            query: ({ id, user_id }) => ({
                url: `/admin/ebook/${id}/user`,
                method: "POST",
                body: { user_id },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "EbookEnrollment", id },
                { type: "EbookEnrollment", id: "LIST" },
                { type: "Ebook", id },
                { type: "Ebook", id: "LIST" },
            ],
        }),
        archiveStudentFromEbook: builder.mutation<GlobalResponse, { id: number; transactionId: number }>({
            query: ({ id, transactionId }) => ({
                url: `/admin/ebook/${id}/user/archive/${transactionId}`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "EbookEnrollment", id },
                { type: "EbookEnrollment", id: "LIST" },
                { type: "Ebook", id },
                { type: "Ebook", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetAllEbookQuery,
    useGetEbookByIdQuery,
    useCreateEbookMutation,
    useEditEbookMutation,
    useDeleteEbookMutation,
    useChangeEbookStatusMutation,
    useGetEnrolledUsersByEbookQuery,
    useEnrollStudentToEbookMutation,
    useArchiveStudentFromEbookMutation,
} = ebookApi;
