import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { categoryApi } from "../services/categoryApi";
import { courseApi } from "../services/courseApi";
import { liveClassApi } from "../services/liveClass";
import { mediaApi } from "../services/mediaApi";
import { positionApi } from "../services/positionApi";
import { questionApi } from "../services/questionApi";
import { roleAndPermissionApi } from "../services/roleAndPermissionApi";
import { subscriptionPlanApi } from "../services/subscriptionPlanApi";
import { userApi } from "../services/userApi";
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
		[userApi.reducerPath]: userApi.reducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
		[positionApi.reducerPath]: positionApi.reducer,
		[courseApi.reducerPath]: courseApi.reducer,
		[subscriptionPlanApi.reducerPath]: subscriptionPlanApi.reducer,
		[mediaApi.reducerPath]: mediaApi.reducer,
		[liveClassApi.reducerPath]: liveClassApi.reducer,
		[questionApi.reducerPath]: questionApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(authApi.middleware)
			.concat(roleAndPermissionApi.middleware)
			.concat(userApi.middleware)
			.concat(categoryApi.middleware)
			.concat(positionApi.middleware)
			.concat(courseApi.middleware)
			.concat(subscriptionPlanApi.middleware)
			.concat(mediaApi.middleware)
			.concat(liveClassApi.middleware)
			.concat(questionApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
