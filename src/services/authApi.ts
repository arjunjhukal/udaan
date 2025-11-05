import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

interface RegisterBody {
    username: string;
    phone: string;
    email: string;
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        register: builder.mutation<void, RegisterBody>({
            query: (body) => ({
                url: "/auth/register",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useRegisterMutation } = authApi;
