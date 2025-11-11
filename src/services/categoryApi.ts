import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { CategoryProps, CategroyList } from "../types/category";
import type { GlobalResponse } from "../types/user";
import { baseQuery } from "./baseQuery";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: baseQuery,
    tagTypes: ["Category"],
    endpoints: (builder) => ({
        createCategory: builder.mutation({
            query: (body) => ({
                url: "/admin/category",
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Category", id: "LIST" }]
        }),
        getAllCategory: builder.query<CategroyList, QueryParams>({
            query: ({ pageIndex, pageSize, search }) => {
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
                    url: `/admin/category?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map((user) => ({ type: "Category" as const, id: user.id })),
                        { type: "Category", id: "LIST" },
                    ]
                    : [{ type: "Category", id: "LIST" }],
        }),
        editCategory: builder.mutation<{ data: CategoryProps; message: string }, { body: CategoryProps; id: string }>({
            query: ({ body, id }) => ({
                url: `/admin/category/${id}`,
                method: "POST",
                body
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Category", id },
                { type: "Category", id: "LIST" }
            ],
        }),
        deleteCategory: builder.mutation<GlobalResponse, { body: string[] }>({
            query: ({ body }) => ({
                url: `/admin/category/`,
                method: "DELETE",
                body: { categories: body }
            }),
            invalidatesTags: (_result, _error,) => [
                { type: "Category", id: "LIST" }
            ],
        }),
        getCategoryById: builder.query<{ data: CategoryProps }, { id: string }>({
            query: ({ id }) => ({
                url: `/admin/category/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Category", id }],
        }),
    })
})

export const { useCreateCategoryMutation, useGetAllCategoryQuery, useEditCategoryMutation, useDeleteCategoryMutation, useGetCategoryByIdQuery } = categoryApi;