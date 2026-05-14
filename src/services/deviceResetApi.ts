import type { QueryParams } from "../types";
import type {
	DeviceResetAnalytics,
	DeviceResetRequestList,
	DeviceResetTimeline,
	DeviceResetUserInfo,
} from "../types/deviceReset";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseApi } from "./baseApi";

export const deviceResetApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getResetRequests: builder.query<
			DeviceResetRequestList,
			QueryParams & { days?: number | null; start_date?: string; end_date?: string }
		>({
			query: ({ pageIndex, pageSize, search, sort_by, sort_field, days, start_date, end_date }) => {
				const params = buildQueryParams({ page: pageIndex, page_size: pageSize, search, sort_by, sort_field, days, start_date, end_date });
				return { url: `/admin/reset-request?${params}`, method: "GET" };
			},
			providesTags: [{ type: "ResetRequest", id: "LIST" }],
		}),

		getResetRequestUserInfo: builder.query<{ data: DeviceResetUserInfo }, { userId: number }>({
			query: ({ userId }) => ({ url: `/admin/reset-request/${userId}`, method: "GET" }),
			providesTags: (_result, _error, { userId }) => [{ type: "ResetRequest", id: `INFO_${userId}` }],
		}),

		getResetRequestTimeline: builder.query<
			DeviceResetTimeline,
			{ userId: number; status?: string; search?: string; pageSize?: number; pageIndex?: number; sort_by?: string; sort_field?: string }
		>({
			query: ({ userId, status, search, pageSize, pageIndex, sort_by, sort_field }) => {
				const params = buildQueryParams({ status, search, page_size: pageSize, page: pageIndex, sort_by, sort_field });
				return { url: `/admin/reset-request/${userId}/timelines?${params}`, method: "GET" };
			},
			providesTags: (_result, _error, { userId }) => [{ type: "ResetRequest", id: `TIMELINE_${userId}` }],
		}),

		reviewResetRequest: builder.mutation<
			GlobalResponse,
			{ requestId: number; userId: number; status: "approved" | "rejected" }
		>({
			query: ({ requestId, status }) => ({
				url: `/admin/reset-request/${requestId}/review`,
				method: "POST",
				body: { status },
			}),
			invalidatesTags: (_result, _error, { userId }) => [
				{ type: "ResetRequest", id: "LIST" },
				{ type: "ResetRequest", id: `INFO_${userId}` },
				{ type: "ResetRequest", id: `TIMELINE_${userId}` },
				{ type: "ResetRequest", id: "ANALYTICS" },
				{ type: "MenuCounts", id: "ALL" },
			],
		}),

		getResetRequestAnalytics: builder.query<
			DeviceResetAnalytics,
			{ days?: number | null; start_date?: string; end_date?: string }
		>({
			query: ({ days, start_date, end_date } = {}) => {
				const params = buildQueryParams({ days, start_date, end_date });
				return { url: `/admin/reset-request/analytics?${params}`, method: "GET" };
			},
			providesTags: [{ type: "ResetRequest", id: "ANALYTICS" }],
		}),
	}),
});

export const {
	useGetResetRequestsQuery,
	useGetResetRequestUserInfoQuery,
	useGetResetRequestTimelineQuery,
	useReviewResetRequestMutation,
	useGetResetRequestAnalyticsQuery,
} = deviceResetApi;
