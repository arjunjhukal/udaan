// import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type { RootState } from "../store/store";

// export const baseQuery = fetchBaseQuery({
// 	baseUrl: (import.meta.env.VITE_API_BASE_URL || "") + "/api/v1",
// 	credentials: "include",
// 	prepareHeaders: (headers, { getState }) => {
// 		// Get access_token from the auth slice
// 		const accessToken = (getState() as RootState).auth?.token;

// 		if (accessToken) {
// 			headers.set("Authorization", `Bearer ${accessToken?.access_token}`);
// 		}

// 		return headers;
// 	},
// });

// api/baseQuery.ts
import type {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { showSessionExpired } from "../slice/sessionSlice";
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
		const state = api.getState() as RootState;

		if (!state.session?.showSessionExpiredPopup) {
			api.dispatch(
				showSessionExpired(
					"Your session has expired due to a login from another device. Please verify it's you to continue."
				)
			);
		}
	}

	return result;
};