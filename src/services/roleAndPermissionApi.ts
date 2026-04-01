import type { QueryParams } from "../types";
import type { PermissionList, PermissionProps, RoleList, RoleProps } from "../types/roleAndPermission";
import type { GlobalResponse } from "../types/user";
import { baseApi } from "./baseApi";

export const roleAndPermissionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPermissions: builder.query<PermissionList, void>({
            query: () => ({
                url: "/admin/permissions",
                method: "GET",
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map((perm: PermissionProps) => ({ type: "Permission" as const, id: perm.id })),
                        { type: "Permission", id: "LIST" },
                    ]
                    : [{ type: "Permission", id: "LIST" }],
        }),
        getAllRoles: builder.query<RoleList, QueryParams>({
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
                    url: `/admin/roles?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map((role) => ({ type: "Role" as const, id: role.id })),
                        { type: "Role", id: "LIST" },
                    ]
                    : [{ type: "Role", id: "LIST" }],
        }),
        createNewRole: builder.mutation<RoleProps & { message: string }, RoleProps>({
            query: (body) => ({
                url: "/admin/roles",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Role", id: "LIST" }],
        }),
        editRole: builder.mutation<{ data: RoleProps, message: string }, { body: RoleProps; id: string }>({
            query: ({ body, id }) => ({
                url: `/admin/roles/${id}`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Role", id },
                { type: "Role", id: "LIST" }
            ],
        }),
        deleteRole: builder.mutation<GlobalResponse, { body: string[] }>({
            query: ({ body }) => ({
                url: `/admin/roles/`,
                method: "DELETE",
                body: { roles: body }
            }),
            invalidatesTags: (_result, _error,) => [
                { type: "Role", id: "LIST" }
            ],
        }),
        getRoleById: builder.query<{ data: RoleProps }, { id: string }>({
            query: ({ id }) => ({
                url: `/admin/roles/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Role", id }],
        }),
    }),
});

export const {
    useGetAllPermissionsQuery,
    useCreateNewRoleMutation,
    useGetAllRolesQuery,
    useEditRoleMutation,
    useDeleteRoleMutation,
    useGetRoleByIdQuery
} = roleAndPermissionApi;
