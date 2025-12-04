import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { TransactionList, TransactionPayload } from "../types/transaction";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const transactionApi = createApi({
    reducerPath: "transactionApi",
    baseQuery: baseQuery,
    tagTypes: ["Transaction"],
    endpoints: (builder) => ({
        addTransaction: builder.mutation<GlobalResponse, { body: FormData }>({
            query: ({ body }) => ({
                url: `/admin/transaction`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Transaction", id: "LIST" }]
        }),
        getAllTransactions: builder.query<TransactionList, QueryParams>({
            query: ({ pageIndex, pageSize, search }) => {
                const queryString = buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search: search,
                });

                return {
                    url: `/admin/transaction?${queryString}`,
                    method: "GET",
                }
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map(({ id }) => ({ type: 'Transaction' as const, id })),
                        { type: 'Transaction', id: 'LIST' }
                    ]
                    : [{ type: 'Transaction', id: 'LIST' }]
        }),
        getTransactionById: builder.query<{ data: TransactionPayload }, number>({
            query: (id) => ({
                url: `admin/transaction/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Transaction", id }]
        }),
        updateTransactionById: builder.mutation<GlobalResponse, { id: number, body: FormData }>({
            query: ({ id, body }) => ({
                url: `admin/transaction/${id}`,
                method: "POST",
                body: body
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: "Transaction", id: arg.id },
                { type: "Transaction", id: "LIST" }
            ]
        }),
        deleteTransaction: builder.mutation<GlobalResponse, { body: string[] }>({
            query: ({ body }) => ({
                url: `admin/transaction`,
                method: "DELETE",
                body: {
                    transactions: body
                }
            }),
            invalidatesTags: [{ type: "Transaction", id: "LIST" }]
        }),
    })
})

export const {
    useAddTransactionMutation,
    useGetAllTransactionsQuery,
    useGetTransactionByIdQuery,
    useDeleteTransactionMutation,
    useUpdateTransactionByIdMutation
} = transactionApi;