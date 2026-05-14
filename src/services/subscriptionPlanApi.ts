import type { SubscriptionList, SubscriptionPlanProps } from "../types/subscriptionPlan";
import type { GlobalResponse } from "../types/user";
import type { QueryParams } from "../types";
import { baseApi } from "./baseApi";


export const subscriptionPlanApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSubscription: builder.mutation<GlobalResponse, { body: SubscriptionPlanProps }>({
            query: ({ body }) => ({
                url: "/admin/subscription",
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Subscription", id: "LIST" }]
        }),

        getAllSubscription: builder.query<SubscriptionList, QueryParams>({
            query: ({ pageIndex, pageSize, search, sort_field, sort_by }) => {
                const params = new URLSearchParams();

                if (pageIndex) {
                    params.append('page', pageIndex.toString());
                }
                if (pageSize) {
                    params.append('page_size', pageSize.toString());
                }
                if (search) {
                    params.append('search', search.toString());
                }
                if (sort_field) params.append("sort_field", sort_field);
                if (sort_by) params.append("sort_by", sort_by);

                return {
                    url: `/admin/subscription?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map((subscription) => ({
                            type: "Subscription" as const,
                            id: subscription.id
                        })),
                        { type: "Subscription", id: "LIST" },
                    ]
                    : [{ type: "Subscription", id: "LIST" }],
        }),

        getSubscriptionById: builder.query<SubscriptionList, { id: string }>({
            query: ({ id }) => ({
                url: `/admin/subscription/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Subscription", id }],
        }),

        editSubscription: builder.mutation<SubscriptionList, { body: SubscriptionPlanProps; id: number | string }>({
            query: ({ body, id }) => ({
                url: `/admin/subscription/${id}`,
                method: "PUT",
                body
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Subscription", id: "LIST" },
                { type: "Subscription", id }
            ]
        }),

        deleteSubscription: builder.mutation<GlobalResponse, { body: string[] | number[] }>({
            query: ({ body }) => ({
                url: `/admin/subscription`,
                method: "DELETE",
                body: { subscriptions: body }
            }),
            invalidatesTags: [{ type: "Subscription", id: "LIST" }],
        }),
    })
})

export const {
    useCreateSubscriptionMutation,
    useGetAllSubscriptionQuery,
    useGetSubscriptionByIdQuery,
    useEditSubscriptionMutation,
    useDeleteSubscriptionMutation
} = subscriptionPlanApi;
