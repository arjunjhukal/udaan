import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { ActivityList, ActivityType } from "../types/activity";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const activitiyApi = createApi({
    reducerPath: "activityApi",
    baseQuery: baseQuery,
    tagTypes: ["Activity"],
    endpoints: (builder) => ({
        getAllActivity: builder.query<ActivityList, QueryParams & {
            type: ActivityType
        }>({
            query: ({ pageIndex, pageSize, search, startDate, endDate, sort_by, type }) => ({
                url: `/admin/activity-log?${buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search: search,
                    start_date: startDate,
                    end_date: endDate,
                    sort_by: sort_by,
                    type: type
                })}`,
                method: "GET"
            })
        })
    })
})

export const { useGetAllActivityQuery } = activitiyApi;