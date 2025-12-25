import { createApi } from "@reduxjs/toolkit/query/react";
import type { BannerList, FeaturedCourseList, FeaturedCourseProps } from "../types/content";
import type { GlobalResponse } from "../types/user";
import { baseQuery } from "./baseQuery";

export const contentApi = createApi({
    reducerPath: "contentApi",
    baseQuery: baseQuery,
    tagTypes: ['Banner', 'Page', 'Welcome', 'Splash', "Course"],
    endpoints: (builder) => ({
        addOrUpdateBanner: builder.mutation<GlobalResponse, FormData>({
            query: (body) => ({
                url: `/admin/content/banner`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Banner", id: "LIST" }]
        }),
        getAllBanner: builder.query<BannerList, void>({
            query: () => ({
                url: `/admin/content/banner`,
                method: "GET",
            }),
            providesTags: [{ type: "Banner", id: "LIST" }]
        }),
        addOrUpdateFeaturedCourse: builder.mutation<GlobalResponse, { featured: FeaturedCourseProps[] }>({
            query: (body) => ({
                url: `/admin/content/featured`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Course", id: "LIST" }]
        }),
        getAllFeaturedCourse: builder.query<FeaturedCourseList, void>({
            query: () => ({
                url: `/admin/content/featured`,
                method: "GET",
            }),
            providesTags: [{ type: "Course", id: "LIST" }]
        }),
    })
});

export const {
    useAddOrUpdateBannerMutation,
    useGetAllBannerQuery,
    useAddOrUpdateFeaturedCourseMutation,
    useGetAllFeaturedCourseQuery
} = contentApi;