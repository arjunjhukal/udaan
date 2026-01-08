
import type {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../slice/authSlice";
import type { RootState } from "../store/store";

const baseQueryConfig = fetchBaseQuery({
	baseUrl: (import.meta.env.VITE_API_BASE_URL || "") + "/api/v1",
	credentials: "include",
	prepareHeaders: (headers, { getState }) => {
		const accessToken = (getState() as RootState).auth?.token;

		if (accessToken) {
			headers.set("Authorization", `Bearer ${accessToken?.access_token}`);
		}

		return headers;
	},
});

export const baseQuery: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	const result = await baseQueryConfig(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		api.dispatch(
			logout()
		)
	}

	return result;
};