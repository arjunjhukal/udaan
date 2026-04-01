import type {
	GlobalResponse,
	LoginUserProps,
	RegisterUserProps,
	UserResponse,
} from "../types/user";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
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
