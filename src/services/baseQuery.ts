import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";

export const baseQuery = fetchBaseQuery({
    baseUrl: (process.env.VITE_API_BASE_URL || "") + "api/v1",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.access_token;

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        return headers;
    }
})