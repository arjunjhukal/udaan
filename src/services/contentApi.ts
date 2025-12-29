import { createApi } from "@reduxjs/toolkit/query/react";
import type { BannerList, FeaturedCourseList, FeaturedCourseProps, OnBoardingProps, SplashProps, WelcomePopupProps } from "../types/content";
import type { GlobalResponse } from "../types/user";
import { baseQuery } from "./baseQuery";

export const contentApi = createApi({
    reducerPath: "contentApi",
    baseQuery: baseQuery,
    tagTypes: ['Banner', 'Page', 'Welcome', 'Splash', "Course", "Onboarding"],
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
        addWelcomePopup: builder.mutation<GlobalResponse, FormData>({
            query: (body) => ({
                url: `/admin/content/home-popup`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Welcome", id: "LIST" }]
        }),
        getWelcomePopup: builder.query<{ data: WelcomePopupProps }, void>({
            query: () => ({
                url: `/content/home-popup`,
                method: "GET",
            }),
            providesTags: [{ type: "Welcome", id: "LIST" }]
        }),
        addOrUpdateSplashScreen: builder.mutation<GlobalResponse, FormData>({
            query: (body) => ({
                url: `/admin/content/splash`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Splash", id: "LIST" }]
        }),
        getSplashScreen: builder.query<{ data: SplashProps }, void>({
            query: () => ({
                url: `/content/splash`,
                method: "GET",
            }),
            providesTags: [{ type: "Splash", id: "LIST" }]
        }),
        addOrUpdateOnboardingScreen: builder.mutation<GlobalResponse, FormData>({
            query: (body) => ({
                url: `/admin/content/onboard`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Onboarding", id: "LIST" }]
        }),
        getOnboardingScreen: builder.query<{ data: OnBoardingProps[] }, void>({
            query: () => ({
                url: `/content/onboard`,
                method: "GET",
            }),
            providesTags: [{ type: "Onboarding", id: "LIST" }]
        }),
    })
});

export const {
    useAddOrUpdateBannerMutation,
    useGetAllBannerQuery,
    useAddOrUpdateFeaturedCourseMutation,
    useGetAllFeaturedCourseQuery,
    useAddWelcomePopupMutation,
    useGetWelcomePopupQuery,
    useGetSplashScreenQuery,
    useAddOrUpdateSplashScreenMutation,
    useAddOrUpdateOnboardingScreenMutation,
    useGetOnboardingScreenQuery
} = contentApi;