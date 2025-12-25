import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function WelcomePopupRoot() {
    const { t } = useTranslation();
    return (
        <div className="welcome__popup__root">
            <Typography variant="h5">{t("menus.content_management.home_screen.welcome_popup.root")}</Typography>
        </div>
    )
}
