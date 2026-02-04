import { createApi } from "@reduxjs/toolkit/query/react";
import type { CategoryFilterParams, QueryParams } from "../types";
import type { QuestionList, QuestionProps, QuestionTypeProps, StudentSubmitTestList, StudentSubmitTestProps, TestList, TestOverviewResponse, TestProps, TestTypeProps } from "../types/question";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const questionApi = createApi({
    reducerPath: "questionApi",
    baseQuery: baseQuery,
    tagTypes: ["Questions", "Test", "Results"],
    endpoints: (builder) => ({
        uploadQuestionPaper: builder.mutation<GlobalResponse & {
            data: QuestionProps[]
        }, { body: FormData }>({
            query: ({ body }) => ({
                url: `admin/questions/file`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Questions", id: "LIST" }]
        }),
        saveUploadedQuestions: builder.mutation<GlobalResponse, { question: any[] }>({
            query: (body) => ({
                url: `admin/questions/import`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Questions", id: "LIST" }]
        }),
        EditOrCreateQuestion: builder.mutation<GlobalResponse, { body: QuestionProps }>({
            query: ({ body }) => ({
                url: `admin/questions`,
                method: "POST",
                body
            }),
            invalidatesTags: (_result, _error, { body }) => [
                { type: "Questions", id: "LIST" },
                ...(body.id ? [{ type: "Questions" as const, id: body.id }] : [])
            ]
        }),
        getAllQuestion: builder.query<QuestionList, QueryParams & { type?: QuestionTypeProps; days?: number | null; }>({
            query: ({ type, pageIndex, pageSize, search, days, startDate, endDate }) => {
                const queryString = buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search: search,
                    type: type,
                    start_date: startDate,
                    end_date: endDate,
                    days: days,
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
        getAllTest: builder.query<TestList, QueryParams & { type?: TestTypeProps; days?: number | null; categoryFilter?: CategoryFilterParams; }>({
            query: ({ pageIndex, pageSize, search, type, days, startDate, endDate, categoryFilter }) => {
                const queryString = buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search: search,
                    type: type,
                    start_date: startDate,
                    end_date: endDate,
                    days: days,
                    mega_categories: categoryFilter?.mega_category,
                    categories: categoryFilter?.category,
                    sub_categories: categoryFilter?.sub_category,
                    positions: categoryFilter?.positions,
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
        downloadResult: builder.mutation<Blob & GlobalResponse, { testId: number; resultId: number }>({
            query: ({ testId, resultId }) => ({
                url: `/admin/test/${testId}/result/${resultId}/download`,
                method: "GET",
                responseHandler: (response) => response.blob(),
            }),
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
                video_url: string;
            }
        }, { id?: number, resultId?: number }>({
            query: ({ id, resultId }) => ({
                url: `/admin/test/${id}/result/${resultId}/feedback`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Test", id }]
        }),
        submitTestSample: builder.mutation<GlobalResponse, { id?: number, body: FormData }>({
            query: ({ id, body }) => ({
                url: `/admin/test/${id}/sample`,
                method: "POST",
                body
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Test", id }]
        }),
        getTestSample: builder.query<GlobalResponse & {
            data: {
                sample: File | null;
                sample_url: string;
                video_url: string;
            }
        }, { id?: number, resultId?: number }>({
            query: ({ id }) => ({
                url: `/test/${id}/sample`,
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
    useSaveUploadedQuestionsMutation,
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
    usePublishTestResultsMutation,
    useSubmitTestSampleMutation,
    useGetTestSampleQuery,
    useDownloadResultMutation
} = questionApi;