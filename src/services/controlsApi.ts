import type { AppControls, AppControlsResponse } from "../types/controls";
import type { GlobalResponse } from "../types/user";
import { baseApi } from "./baseApi";

export const controlsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getControls: builder.query<AppControlsResponse, void>({
			query: () => ({ url: "/settings/controls", method: "GET" }),
			providesTags: [{ type: "Controls", id: "GLOBAL" }],
		}),

		updateControls: builder.mutation<GlobalResponse, Partial<AppControls>>({
			query: (body) => ({ url: "/admin/settings/controls", method: "PATCH", body }),
			invalidatesTags: [{ type: "Controls", id: "GLOBAL" }],
		}),
	}),
});

export const { useGetControlsQuery, useUpdateControlsMutation } = controlsApi;
