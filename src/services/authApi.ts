import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type {
	LoginUserProps,
	RegisterUserProps,
	UserResponse,
} from "../types/user";

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
	}),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
