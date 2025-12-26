import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { categoryApi } from "../services/categoryApi";
import { contentApi } from "../services/contentApi";
import { courseApi } from "../services/courseApi";
import { liveClassApi } from "../services/liveClass";
import { mediaApi } from "../services/mediaApi";
import { notificationApi } from "../services/notificationApi";
import { pageApi } from "../services/pageApi";
import { positionApi } from "../services/positionApi";
import { questionApi } from "../services/questionApi";
import { roleAndPermissionApi } from "../services/roleAndPermissionApi";
import { settingApi } from "../services/settingApi";
import { subscriptionPlanApi } from "../services/subscriptionPlanApi";
import { transactionApi } from "../services/transactionApi";
import { userApi } from "../services/userApi";
import attachmentReducer from "../slice/attachmentSlice";
import authReducer from "../slice/authSlice";
import sessionReducer from "../slice/sessionSlice";
import themeReducer from "../slice/themeSlice";
import toastReducer from "../slice/toastSlice";
export const store = configureStore({
	reducer: {
		theme: themeReducer,
		auth: authReducer,
		toast: toastReducer,
		session: sessionReducer,
		attachment: attachmentReducer,
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
		[transactionApi.reducerPath]: transactionApi.reducer,
		[notificationApi.reducerPath]: notificationApi.reducer,
		[contentApi.reducerPath]: contentApi.reducer,
		[pageApi.reducerPath]: pageApi.reducer,
		[settingApi.reducerPath]: settingApi.reducer,
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
			.concat(transactionApi.middleware)
			.concat(notificationApi.middleware)
			.concat(contentApi.middleware)
			.concat(pageApi.middleware)
			.concat(settingApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
