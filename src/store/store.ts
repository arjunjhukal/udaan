import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { roleAndPermissionApi } from "../services/roleAndPermissionApi";
import { userApi } from "../services/userApi";
import authReducer from "../slice/authSlice";
import themeReducer from "../slice/themeSlice";
import toastReducer from "../slice/toastSlice";
import { categoryApi } from "../services/categoryApi";
import { positionApi } from "../services/positionApi";
import { courseApi } from "../services/courseApi";
export const store = configureStore({
	reducer: {
		theme: themeReducer,
		auth: authReducer,
		toast: toastReducer,
		[authApi.reducerPath]: authApi.reducer,
		[roleAndPermissionApi.reducerPath]: roleAndPermissionApi.reducer,
		[userApi.reducerPath]: userApi.reducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
		[positionApi.reducerPath]: positionApi.reducer,
		[courseApi.reducerPath]: courseApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(authApi.middleware)
			.concat(roleAndPermissionApi.middleware)
			.concat(userApi.middleware)
			.concat(categoryApi.middleware)
			.concat(positionApi.middleware)
			.concat(courseApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
