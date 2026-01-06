import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { ActivityList } from "../types/activity";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const activitiyApi = createApi({
    reducerPath: "activityApi",
    baseQuery: baseQuery,
    tagTypes: ["Activity"],
    endpoints: (builder) => ({
        getAllActivity: builder.query<ActivityList, QueryParams>({
            query: ({ pageIndex, pageSize, search, startDate, endDate }) => ({
                url: `/admin/activity-log?${buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search: search,
                    start_date: startDate,
                    end_date: endDate
                })}`,
                method: "GET"
            })
        })
    })
})

export const { useGetAllActivityQuery } = activitiyApi;