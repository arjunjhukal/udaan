import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams, UserStatus } from "../types";
import type { GlobalResponse, RegisterUserProps, UserList } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
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

        getAllUser: builder.query<UserList, QueryParams & { role?: number | string; status?: UserStatus; days?: number | null; }>({
            query: ({ pageIndex, pageSize, search, role, status, days, startDate, endDate }) => {
                const params = buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search: search,
                    role: role,
                    status: status,
                    start_date: startDate,
                    end_date: endDate,
                    days: days,
                });

                return {
                    url: `/admin/user?${params}`,
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
        suspendUser: builder.mutation<GlobalResponse, { body: string[] }>({
            query: ({ body }) => ({
                url: `/admin/user/suspend`,
                method: "DELETE",
                body: { users: body }
            }),
            invalidatesTags: (_result, _error,) => [
                { type: "User", id: "LIST" }
            ],
        }),
        generateOTP: builder.mutation<GlobalResponse & { data: { otp: string } }, { id: number }>({
            query: ({ id }) => ({
                url: `/admin/user/${id}/generate-otp`,
                method: "POST",
            })
        })
    })
})

export const {
    useCreateUserMutation,
    useGetAllUserQuery,
    useEditUserMutation,
    useDeleteUserMutation,
    useGetUserByIdQuery,
    useSuspendUserMutation,
    useGenerateOTPMutation
} = userApi;