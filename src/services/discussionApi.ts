import type { QueryParams } from "../types";
import type { DiscussionList, DiscussionSingle } from "../types/discussion";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseApi } from "./baseApi";

export const discussionApi = baseApi.injectEndpoints({
	// reducerPath: "discussionApi",
	// baseQuery: baseQuery,
	// tagTypes: ["Discussion"],
	endpoints: (builder) => ({
		getAllDiscussions: builder.query<DiscussionList, QueryParams & { mega_category_id?: number | null; status?: "" | "visible" | "hidden" }>({
			query: ({ pageIndex, pageSize, search, status, mega_category_id, sort_field, sort_by }) => {
				const params = buildQueryParams({
					page: pageIndex,
					page_size: pageSize,
					search: search,
					status: status,
					mega_category_id: mega_category_id,
					sort_field,
					sort_by,
				});
				return {
					url: `/discussions?${params}`,
					method: "GET",
				};
			},
			providesTags: (result) =>
				result?.data?.data
					? [
						...result.data.data.map((discussion) => ({ type: "Discussion" as const, id: discussion.id })),
						{ type: "Discussion", id: "LIST" },
					]
					: [{ type: "Discussion", id: "LIST" }],
		}),
		getDiscussionById: builder.query<DiscussionSingle, { id: number }>({
			query: ({ id }) => ({
				url: `/discussions/${id}`,
				method: "GET",
			}),
			providesTags: (_result, _error, { id }) => [{ type: "Discussion", id }],
		}),
		createDiscussion: builder.mutation<GlobalResponse, { title: string; description: string; mega_category_id: number | null; status: string }>({
			query: (body) => ({
				url: "/discussions",
				method: "POST",
				body,
			}),
			invalidatesTags: [{ type: "Discussion", id: "LIST" }, { type: "MenuCounts", id: "ALL" }],
		}),
		updateDiscussion: builder.mutation<GlobalResponse, { id: number; body: { title: string; description: string; mega_category_id: number | null; status: string } }>({
			query: ({ id, body }) => ({
				url: `/discussions/${id}`,
				method: "PUT",
				body,
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: "Discussion", id },
				{ type: "Discussion", id: "LIST" },
				{ type: "MenuCounts", id: "ALL" },
			],
		}),
		deleteDiscussion: builder.mutation<GlobalResponse, { ids: number[] }>({
			query: ({ ids }) => ({
				url: `/discussions`,
				method: "DELETE",
				body: { discussions: ids },
			}),
			invalidatesTags: [{ type: "Discussion", id: "LIST" }, { type: "MenuCounts", id: "ALL" }],
		}),
		toggleDiscussionVisibility: builder.mutation<GlobalResponse, { id: number; status: "visible" | "hidden" }>({
			query: ({ id, status }) => ({
				url: `/discussions/${id}/status`,
				method: "POST",
				body: { status },
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: "Discussion", id },
				{ type: "Discussion", id: "LIST" },
				{ type: "MenuCounts", id: "ALL" },
			],
		}),
		likeDiscussion: builder.mutation<GlobalResponse, { id: number }>({
			query: ({ id }) => ({
				url: `/discussions/${id}/like`,
				method: "POST",
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: "Discussion", id },
				{ type: "Discussion", id: "LIST" },
			],
		}),
		dislikeDiscussion: builder.mutation<GlobalResponse, { id: number }>({
			query: ({ id }) => ({
				url: `/discussions/${id}/dislike`,
				method: "POST",
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: "Discussion", id },
				{ type: "Discussion", id: "LIST" },
			],
		}),
	}),
});

export const {
	useGetAllDiscussionsQuery,
	useGetDiscussionByIdQuery,
	useCreateDiscussionMutation,
	useUpdateDiscussionMutation,
	useDeleteDiscussionMutation,
	useToggleDiscussionVisibilityMutation,
	useLikeDiscussionMutation,
	useDislikeDiscussionMutation,
} = discussionApi;
