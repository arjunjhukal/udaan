import { useTheme } from "@mui/material";
import React from "react";
import { useGetThemeSettingsQuery } from "../../../services/settingApi";

export default function SingleFormAuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const theme = useTheme();
	const { data: themeSettings } = useGetThemeSettingsQuery();
	const isDark = theme.palette.mode === "dark";
	const logoSrc = isDark
		? (themeSettings?.data?.logo_url || "/logo.svg")
		: (themeSettings?.data?.logo_dark_url || "/logo.svg");

	return (
		<>
			<img src={logoSrc} alt={themeSettings?.data?.company_name || ""} width={132} height={70} className="mb-8" />
			{children}
		</>
	);
}
