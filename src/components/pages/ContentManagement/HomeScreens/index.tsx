import { Divider, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

export default function HomeScreens() {
    const { t } = useTranslation();

    return (
        <div className="home__screen__layout">
            <div className="page__header flex flex-col gap-1.5">
                <Typography variant="h5">{t("menus.content_management.home_screen.root")}</Typography>
                <Typography variant="subtitle2" color="text.middle">{t("menus.content_management.home_screen.message")}</Typography>
            </div>
            <Divider className="mt-4! mb-6!" />
            <Outlet />
        </div>
    )
}
