import { createApi } from "@reduxjs/toolkit/query/react";
import type {
	GlobalResponse,
	LoginUserProps,
	RegisterUserProps,
	UserResponse,
} from "../types/user";
import { baseQuery } from "./baseQuery";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: baseQuery,
	endpoints: (builder) => ({
		register: builder.mutation<UserResponse, RegisterUserProps>({
			query: (body) => ({
				url: "/auth/register",
				method: "POST",
				body,
			}),
		}),
		login: builder.mutation<UserResponse, LoginUserProps>({
			query: (body) => ({
				url: "/admin/auth/login",
				method: "POST",
				body,
			}),
		}),
		logout: builder.mutation<GlobalResponse, void>(
			{
				query: () => ({
					url: "/admin/auth/logout",
					method: "POST",
				})
			}
		)
	}),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } = authApi;
