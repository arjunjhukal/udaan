import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { roleAndPermissionApi } from "../services/roleAndPermissionApi";
import authReducer from "../slice/authSlice";
import themeReducer from "../slice/themeSlice";
import toastReducer from "../slice/toastSlice";
export const store = configureStore({
	reducer: {
		theme: themeReducer,
		auth: authReducer,
		toast: toastReducer,
		[authApi.reducerPath]: authApi.reducer,
		[roleAndPermissionApi.reducerPath]: roleAndPermissionApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(authApi.middleware)
			.concat(roleAndPermissionApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
