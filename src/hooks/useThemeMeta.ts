import { useEffect } from "react";
import { useGetThemeSettingsQuery } from "../services/settingApi";

export function useThemeMeta() {
    const { data } = useGetThemeSettingsQuery();

    useEffect(() => {
        if (!data?.data) return;

        const { company_name, favicon_url } = data.data;

        if (company_name) {
            document.title = company_name;
        }

        if (favicon_url) {
            let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
            if (!link) {
                link = document.createElement("link");
                link.rel = "icon";
                document.head.appendChild(link);
            }
            link.href = favicon_url;
        }
    }, [data]);
}
