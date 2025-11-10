import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { GlobalResponse, RegisterUserProps, UserList } from "../types/user";
import { baseQuery } from "./baseQuery";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQuery,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        createUser: builder.mutation<GlobalResponse, FormData>({
            query: (body) => ({
                url: "/admin/user",
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "User", id: "LIST" }]
        }),
        getAllUser: builder.query<UserList, QueryParams>({
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
                    url: `/admin/user?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map((user) => ({ type: "User" as const, id: user.id })),
                        { type: "User", id: "LIST" },
                    ]
                    : [{ type: "User", id: "LIST" }],
        }),
        editUser: builder.mutation<{ data: RegisterUserProps; message: string }, { body: FormData; id: string }>({
            query: ({ body, id }) => ({
                url: `/admin/user/${id}`,
                method: "POST",
                body
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "User", id },
                { type: "User", id: "LIST" }
            ],
        }),
        deleteUser: builder.mutation<GlobalResponse, { body: string[] }>({
            query: ({ body }) => ({
                url: `/admin/user/`,
                method: "DELETE",
                body: { users: body }
            }),
            invalidatesTags: (_result, _error,) => [
                { type: "User", id: "LIST" }
            ],
        }),
        getUserById: builder.query<{ data: RegisterUserProps }, { id: string }>({
            query: ({ id }) => ({
                url: `/admin/user/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "User", id }],
        }),
    })
})

export const {
    useCreateUserMutation,
    useGetAllUserQuery,
    useEditUserMutation,
    useDeleteUserMutation,
    useGetUserByIdQuery } = userApi;