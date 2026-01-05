import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { Provider } from "react-redux";
import "./App.css";
import Toast from "./components/organism/Toast/index.tsx";
import GlobalRoutes from "./routes/Routes.tsx";
import { store } from "./store/store.ts";
import UdaanThemeProvider from "./ThemeProvider.tsx";
import ScreenProtection from "./ScreenProtection.tsx";
i18n
	.use(HttpApi)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "en",
		debug: true,
		backend: {
			loadPath: "/languages/{{lng}}/index.json",
		},
		detection: {
			order: ["queryString", "cookie"],
			caches: ["cookie"],
		},
		interpolation: {
			escapeValue: false,
		},
		returnObjects: true,
		keySeparator: ".",
	});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			{/* <BrowserRouter> */}
			<I18nextProvider i18n={i18n}>
				<Suspense fallback={<div>Loading...</div>}>
					<UdaanThemeProvider>
						<ScreenProtection>
						<GlobalRoutes />
						<Toast />
						</ScreenProtection>
					</UdaanThemeProvider>
				</Suspense>
			</I18nextProvider>
			{/* </BrowserRouter> */}
		</Provider>
	</StrictMode>,
);
