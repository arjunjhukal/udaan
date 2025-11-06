import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../slice/themeSlice";
import authReducer from "../slice/authSlice";
import toastReducer from "../slice/toastSlice";
import { authApi } from "../services/authApi";
export const store = configureStore({
	reducer: {
		theme: themeReducer,
		auth: authReducer,
		toast: toastReducer,
		[authApi.reducerPath]: authApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
