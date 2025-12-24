import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { QuestionList, QuestionProps, QuestionTypeProps, StudentSubmitTestList, StudentSubmitTestProps, TestList, TestOverviewResponse, TestProps } from "../types/question";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const questionApi = createApi({
    reducerPath: "questionApi",
    baseQuery: baseQuery,
    tagTypes: ["Questions", "Test", "Results"],
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
            invalidatesTags: [{ type: "Questions", id: "LIST" }]
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
                    url: `/admin/test?${queryString}`,
                    method: "GET",
                };
            },
            providesTags: [{ type: "Test", id: "LIST" }]
        }),
        getTestById: builder.query<{ data: TestProps }, { id?: number }>({
            query: ({ id }) => ({
                url: `/admin/test/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Test", id }]
        }),
        deleteTest: builder.mutation<GlobalResponse, { body: string[] }>({
            query: ({ body }) => ({
                url: `/admin/test`,
                method: "DELETE",
                body: {
                    tests: body
                }
            }),
            invalidatesTags: [{ type: "Test", id: "LIST" }]
        }),
        getTestOverview: builder.query<TestOverviewResponse, { id?: number }>({
            query: ({ id }) => ({
                url: `/admin/test/${id}/overview`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Test", id }]
        }),
        getTestQuestions: builder.query<QuestionList, { id?: number }>({
            query: ({ id }) => ({
                url: `/admin/test/${id}/questions`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Test", id }]
        }),
        getListOfStudentSubmittedTest: builder.query<StudentSubmitTestList, { id?: number, qp: QueryParams, search: string }>({
            query: ({ id, qp, search }) => ({
                url: `/admin/test/${id}/result?${buildQueryParams({
                    page: qp.pageIndex,
                    page_size: qp.pageSize,
                    search: search
                })}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Test", id }]
        }),
        getSingleStudentResult: builder.query<{ data: StudentSubmitTestProps }, { id?: number, resultId?: number }>({
            query: ({ id, resultId }) => ({
                url: `/admin/test/${id}/result/${resultId}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Test", id }]
        }),
        submitTestFeedback: builder.mutation<GlobalResponse, { id?: number, resultId?: number, body: { feedback: string } }>({
            query: ({ id, resultId, body }) => ({
                url: `/admin/test/${id}/result/${resultId}/feedback`,
                method: "POST",
                body
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Test", id }]
        }),
        getTestFeedback: builder.query<GlobalResponse & {
            data: {
                feedback: string;
            }
        }, { id?: number, resultId?: number }>({
            query: ({ id, resultId }) => ({
                url: `/admin/test/${id}/result/${resultId}/feedback`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Test", id }]
        }),
        getQuestionsListInTest: builder.query<QuestionList, { id?: number, resultId?: number }>({
            query: ({ id, resultId }) => ({
                url: `/admin/test/${id}/result/${resultId}/question`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Test", id }]
        }),
        getSingleQuestionInTest: builder.query<{ data: QuestionProps }, { id?: number, resultId?: number, questionId?: number }>({
            query: ({ id, resultId, questionId }) => ({
                url: `/admin/test/${id}/result/${resultId}/question/${questionId}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Test", id }]
        }),

        markSubjectiveQuestion: builder.mutation<GlobalResponse,
            {
                id?: number,
                resultId?: number,
                questionId?: number,
                body: {
                    grade: number,
                    feedback: string,
                    checked_answer_media: Array<{
                        media_id: number,
                        media: string
                    }>
                }
            }
        >({
            query: ({ id, resultId, questionId, body }) => ({
                url: `/admin/test/${id}/result/${resultId}/feedback/question/${questionId}`,
                method: "POST",
                body
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Test", id }]
        }),
        getMarkedSubjectiveQuestion: builder.query<GlobalResponse & {
            data: {
                grade: number,
                feedback: string,
                checked_answer_media: Array<{
                    media_id: number,
                    media: string
                }>
            }
        },
            {
                id?: number,
                resultId?: number,
                questionId?: number
            }
        >({
            query: ({ id, resultId, questionId }) => ({
                url: `/admin/test/${id}/result/${resultId}/feedback/question/${questionId}`,
                method: "GET"
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Test", id }]
        }),
        publishTestResults: builder.mutation<GlobalResponse, { id?: number }>({
            query: ({ id }) => ({
                url: `/admin/test/${id}/publish`,
                method: "POST"
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Test", id }]
        })
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
    useDeleteTestMutation,
    useGetTestOverviewQuery,
    useGetTestQuestionsQuery,
    useGetListOfStudentSubmittedTestQuery,
    useGetSingleStudentResultQuery,
    useSubmitTestFeedbackMutation,
    useGetTestFeedbackQuery,
    useGetQuestionsListInTestQuery,
    useGetSingleQuestionInTestQuery,
    useMarkSubjectiveQuestionMutation,
    useGetMarkedSubjectiveQuestionQuery,
    usePublishTestResultsMutation
} = questionApi;