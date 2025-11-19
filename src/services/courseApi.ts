import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { CourseList, CourseProps, CurriculumList, CurriculumProps } from "../types/course";
import type { GlobalResponse } from "../types/user";
import { baseQuery } from "./baseQuery";

export const courseApi = createApi({
    reducerPath: "courseApi",
    baseQuery: baseQuery,
    tagTypes: ["Course", "Curriculum", "Notes", "Audio", "Videos"],
    endpoints: (builder) => ({
        createCourse: builder.mutation<{ data: CourseProps, message: string }, { body: FormData }>({
            query: ({ body }) => ({
                url: "/admin/course",
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Course", id: "LIST" }]
        }),
        getAllCourse: builder.query<CourseList, QueryParams>({
            query: ({ pageIndex, pageSize, search }) => {
                const params = new URLSearchParams();

                if (pageIndex) {
                    params.append('page', (pageIndex).toString());
                }
                if (pageSize) {
                    params.append('page_size', pageSize.toString());
                }
                if (search) {
                    params.append('search', search.toString());
                }

                return {
                    url: `/admin/course?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map((course) => ({ type: "Course" as const, id: course.id })),
                        { type: "Course", id: "LIST" },
                    ]
                    : [{ type: "Course", id: "LIST" }],
        }),
        editCourse: builder.mutation<{ data: CourseProps, message: string }, { body: FormData, id: number }>({
            query: ({ body, id }) => ({
                url: `/admin/course/${id}`,
                method: "POST",
                body
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Course", id: "LIST" },
                { type: "Course", id }
            ]
        }),
        getCourseById: builder.query<{ data: CourseProps }, { id: string }>({
            query: ({ id }) => ({
                url: `/admin/course/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Course", id }],
        }),
        deleteCourse: builder.mutation<GlobalResponse, { body: string[] }>({
            query: ({ body }) => ({
                url: `/admin/course/`,
                method: "DELETE",
                body: { courses: body }
            }),
            invalidatesTags: (_result, _error,) => [
                { type: "Course", id: "LIST" }
            ],
        }),
        addCurriculum: builder.mutation<GlobalResponse, { body: CurriculumProps, id: number }>({
            query: ({ body, id }) => ({
                url: `/admin/course/curriculum/${id}`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Curriculum", id: "LIST" }]
        }),
        getAllCurriculum: builder.query<CurriculumList, QueryParams & { id: number }>({
            query: ({ pageIndex, pageSize, search, id }) => {
                const params = new URLSearchParams();

                if (pageIndex) {
                    params.append('page', (pageIndex).toString());
                }
                if (pageSize) {
                    params.append('page_size', pageSize.toString());
                }
                if (search) {
                    params.append('search', search.toString());
                }

                return {
                    url: `/admin/course/curriculum/${id}?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map((curriculum) => ({ type: "Curriculum" as const, id: curriculum.id })),
                        { type: "Curriculum", id: "LIST" },
                    ]
                    : [{ type: "Curriculum", id: "LIST" }],
        }),
        getCourseCurriculumById: builder.query<{ data: CurriculumProps }, { id: number }>({
            query: ({ id }) => ({
                url: `/admin/course/curriculum/${id}`,
                method: "GET",
            }),
        }),
        deleteCourseCurriculum: builder.mutation<GlobalResponse, { id: number }>({
            query: ({ id }) => ({
                url: `/admin/course/curriculum/${id}`,
                method: "POST",
            }),
        })
    })
})

export const {
    useCreateCourseMutation,
    useGetAllCourseQuery,
    useEditCourseMutation,
    useGetCourseByIdQuery,
    useDeleteCourseMutation,
    useAddCurriculumMutation,
    useGetAllCurriculumQuery,
    useGetCourseCurriculumByIdQuery,
    useDeleteCourseCurriculumMutation
} = courseApi;