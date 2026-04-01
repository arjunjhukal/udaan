import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../services/baseApi";
import attachmentReducer from "../slice/attachmentSlice";
import authReducer from "../slice/authSlice";
import previewPdfReducer from "../slice/previewPdfSlice";
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
		previewPdf: previewPdfReducer,
		[baseApi.reducerPath]: baseApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(baseApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
