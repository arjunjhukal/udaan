import type { QueryParams, UserStatus } from "../types";
import type { GlobalResponse, RegisterUserProps, UserList } from "../types/user";
import type { NewSignUpsResponse, RoleDistributionResponse, UserAnalyticsResponse } from "../types/userAnalytics";
import type { CourseAnalyticsResponse, LoginHistoryResponse, RecentActivityResponse, UserEnrolledBundleResponse, UserEnrolledTestResponse, UserProfileResponse } from "../types/userProfile";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createUser: builder.mutation<GlobalResponse, FormData>({
            query: (body) => ({
                url: "/admin/user",
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "User", id: "LIST" }]
        }),

        getAllUser: builder.query<UserList, QueryParams & { role?: number | string; status?: UserStatus; days?: number | null; admin_filter?: string | null; }>({
            query: ({ pageIndex, pageSize, search, role, status, days, startDate, endDate, admin_filter }) => {
                const params = buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search: search,
                    role: role,
                    status: status,
                    start_date: startDate,
                    end_date: endDate,
                    days: days,
                    admin_filter: admin_filter ?? undefined,
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
        getAllUserExcludeStudents: builder.query<UserList, QueryParams & { role?: number | string; status?: UserStatus; days?: number | null; }>({
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
                    url: `/admin/user/exclude-students?${params}`,
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
        }),

        getUserAnalytics: builder.query<UserAnalyticsResponse, void>({
            query: () => ({
                url: `/admin/user/analytics`,
                method: "GET",
            }),
            providesTags: [{ type: "Analytics" }],
        }),

        getNewSignUps: builder.query<NewSignUpsResponse, void>({
            query: () => ({
                url: `/admin/user/new-sign-ups`,
                method: "GET",
            }),
            providesTags: [{ type: "Analytics" }],
        }),

        getRoleDistribution: builder.query<RoleDistributionResponse, void>({
            query: () => ({
                url: `/admin/user/role-distribution`,
                method: "GET",
            }),
            providesTags: [{ type: "Analytics" }],
        }),

        getUserProfile: builder.query<UserProfileResponse, { id: number }>({
            query: ({ id }) => ({
                url: `/admin/user/${id}/profile`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "User", id }],
        }),

        getUserLoginHistory: builder.query<LoginHistoryResponse, { id: number; pageIndex?: number; pageSize?: number; search?: string }>({
            query: ({ id, pageIndex = 1, pageSize = 5, search }) => {
                const params = buildQueryParams({ page: pageIndex, page_size: pageSize, search });
                return { url: `/admin/user/${id}/login-history?${params}`, method: "GET" };
            },
            providesTags: (_result, _error, { id }) => [{ type: "User", id }],
        }),

        getUserRecentActivities: builder.query<RecentActivityResponse, { id: number; pageIndex?: number; pageSize?: number; search?: string }>({
            query: ({ id, pageIndex = 1, pageSize = 10, search }) => {
                const params = buildQueryParams({ page: pageIndex, page_size: pageSize, search });
                return { url: `/admin/user/${id}/recent-activities?${params}`, method: "GET" };
            },
            providesTags: (_result, _error, { id }) => [{ type: "User", id }],
        }),

        getUserTransactionAnalytics: builder.query<{ status: number; data: { title: string; value: number; type: "success" | "error" | "info" | "warning" }[]; message: string }, { id: number }>({
            query: ({ id }) => ({ url: `/admin/user/${id}/transaction/analytics`, method: "GET" }),
            providesTags: (_result, _error, { id }) => [{ type: "User", id }],
        }),

        getUserEnrolledCourseAnalytics: builder.query<CourseAnalyticsResponse, { id: number }>({
            query: ({ id }) => ({ url: `/admin/user/${id}/enrolled-courses/analytics`, method: "GET" }),
            providesTags: (_result, _error, { id }) => [{ type: "User", id }],
        }),

        getUserEnrolledTests: builder.query<UserEnrolledTestResponse, { id: number; pageIndex?: number; pageSize?: number; search?: string }>({
            query: ({ id, pageIndex = 1, pageSize = 10, search }) => {
                const params = buildQueryParams({ page: pageIndex, page_size: pageSize, search });
                return { url: `/admin/user/${id}/tests?${params}`, method: "GET" };
            },
            providesTags: (_result, _error, { id }) => [{ type: "User", id }],
        }),

        getUserEnrolledBundles: builder.query<UserEnrolledBundleResponse, { id: number; pageIndex?: number; pageSize?: number; search?: string }>({
            query: ({ id, pageIndex = 1, pageSize = 10, search }) => {
                const params = buildQueryParams({ page: pageIndex, page_size: pageSize, search });
                return { url: `/admin/user/${id}/bundles?${params}`, method: "GET" };
            },
            providesTags: (_result, _error, { id }) => [{ type: "User", id }],
        }),
    })
})

export const {
    useCreateUserMutation,
    useGetAllUserQuery,
    useGetAllUserExcludeStudentsQuery,
    useEditUserMutation,
    useDeleteUserMutation,
    useGetUserByIdQuery,
    useSuspendUserMutation,
    useGenerateOTPMutation,
    useGetUserAnalyticsQuery,
    useGetNewSignUpsQuery,
    useGetRoleDistributionQuery,
    useGetUserProfileQuery,
    useGetUserLoginHistoryQuery,
    useGetUserRecentActivitiesQuery,
    useGetUserTransactionAnalyticsQuery,
    useGetUserEnrolledCourseAnalyticsQuery,
    useGetUserEnrolledTestsQuery,
    useGetUserEnrolledBundlesQuery,
} = userApi;
