import { configureStore } from '@reduxjs/toolkit';
import themeReducer from "../slice/themeSlice";
export const store = configureStore({
    reducer: {
        theme: themeReducer,
        // [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    // .concat(authApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch