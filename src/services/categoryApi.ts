import type { QueryParams } from "../types";
import type { CategoryProps, CategoryTypeResponse, CategroyList } from "../types/category";
import type { GlobalResponse } from "../types/user";
import { baseApi } from "./baseApi";

export const categoryApi = baseApi.injectEndpoints({
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
            query: ({ pageIndex, pageSize, search, sort_field, sort_by }) => {
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
                if (sort_field) params.append("sort_field", sort_field);
                if (sort_by) params.append("sort_by", sort_by);

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
        getAllMegaCategory: builder.query<CategoryTypeResponse, void>({
            query: () => ({
                url: `/course/category`,
                method: "GET",
            }),
            providesTags: () => [{ type: "Category", id: "LIST" }],
        }),
        getAllCategoryRelatedToMegaCategory: builder.query<CategoryTypeResponse, { currentCategory: string }>({
            query: ({ currentCategory }) => ({
                url: `/course/category/children?category=${currentCategory}`,
                method: "GET",
            }),
            providesTags: () => [{ type: "Category", id: "LIST" }],
        }),
        getAllSubCategoryRelatedToCategory: builder.query<CategoryTypeResponse, { currentCategory: string }>({
            query: ({ currentCategory }) => ({
                url: `/course/category/sub-children?category=${currentCategory}`,
                method: "GET",
            }),
            providesTags: () => [{ type: "Category", id: "LIST" }],
        }),
    })
})

export const {
    useCreateCategoryMutation,
    useGetAllCategoryQuery,
    useEditCategoryMutation,
    useDeleteCategoryMutation,
    useGetCategoryByIdQuery,
    useGetAllMegaCategoryQuery,
    useGetAllCategoryRelatedToMegaCategoryQuery,
    useGetAllSubCategoryRelatedToCategoryQuery
} = categoryApi;
