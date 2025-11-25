import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { QuestionList, QuestionProps, QuestionTypeProps, TestList, TestProps } from "../types/question";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const questionApi = createApi({
    reducerPath: "questionApi",
    baseQuery: baseQuery,
    tagTypes: ["Questions", "Test"],
    endpoints: (builder) => ({
        uploadQuestionPaper: builder.mutation<GlobalResponse, { body: FormData }>({
            query: ({ body }) => ({
                url: `admin/questions`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Questions", id: "LIST" }]
        }),
        EditOrCreateQuestion: builder.mutation<GlobalResponse, { body: QuestionProps }>({
            query: ({ body }) => ({
                url: body.id ? `admin/questions/${body.id}` : `admin/questions`,
                method: body.id ? "PUT" : "POST",
                body
            }),
            invalidatesTags: (_result, _error, { body }) => [
                { type: "Questions", id: "LIST" },
                ...(body.id ? [{ type: "Questions" as const, id: body.id }] : [])
            ]
        }),
        getAllQuestion: builder.query<QuestionList, QueryParams & { type?: QuestionTypeProps }>({
            query: ({ type, pageIndex, pageSize, search }) => {
                const queryString = buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search: search,
                    type: type
                });
                return {
                    url: `admin/questions?${queryString}`,
                    method: "GET",
                };
            },
            providesTags: [{ type: "Questions", id: "LIST" }]
        }),
        getQuestionById: builder.query<{ data: QuestionProps }, number>({
            query: (id) => ({
                url: `admin/questions/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Questions", id }]
        }),
        deleteQuestion: builder.mutation<GlobalResponse, { body: string[] }>({
            query: ({ body }) => ({
                url: `admin/questions`,
                method: "DELETE",
                body: {
                    questions: body
                }
            }),
        }),
        editOrCreateTest: builder.mutation<GlobalResponse, { body: TestProps }>({
            query: ({ body }) => ({
                url: `/admin/test`,
                method: "POST",
                body
            }),
            invalidatesTags: (_result, _error, { body }) => [
                { type: "Test", id: "LIST" },
                ...(body.id ? [{ type: "Test" as const, id: body.id }] : [])
            ]
        }),
        getAllTest: builder.query<TestList, QueryParams>({
            query: ({ pageIndex, pageSize, search }) => {
                const queryString = buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search: search,
                });
                return {
                    url: `admin/test?${queryString}`,
                    method: "GET",
                };
            },
            providesTags: [{ type: "Test", id: "LIST" }]
        }),
        getTestById: builder.query<{ data: TestProps }, number>({
            query: (id) => ({
                url: `admin/test/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Test", id }]
        }),
        deleteTest: builder.mutation<GlobalResponse, { body: string[] }>({
            query: ({ body }) => ({
                url: `admin/test`,
                method: "DELETE",
                body: {
                    tests: body
                }
            }),
            invalidatesTags: [{ type: "Test", id: "LIST" }]
        }),
    })
});

export const {
    useUploadQuestionPaperMutation,
    useEditOrCreateQuestionMutation,
    useGetAllQuestionQuery,
    useGetQuestionByIdQuery,
    useDeleteQuestionMutation,
    useEditOrCreateTestMutation,
    useGetAllTestQuery,
    useGetTestByIdQuery,
    useDeleteTestMutation
} = questionApi;