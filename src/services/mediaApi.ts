import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const mediaApi = createApi({
    reducerPath: "mediaApi",
    baseQuery: baseQuery,
    tagTypes: ["Media"],
    endpoints: (builder) => ({
        uploadMedia: builder.mutation({
            query: () => ({
                url: "",
                method: "POST",
            })
        })
    })
})