import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";

export const baseQuery = fetchBaseQuery({
	baseUrl: (import.meta.env.VITE_API_BASE_URL || "") + "/api/v1",
	credentials: "include",
	prepareHeaders: (headers, { getState }) => {
		// Get access_token from the auth slice
		const accessToken = (getState() as RootState).auth?.token;

		if (accessToken) {
			headers.set("Authorization", `Bearer ${accessToken?.access_token}`);
		}

		return headers;
	},
});
