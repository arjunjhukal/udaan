import { Divider, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function AppSettingRoot() {
    const { t } = useTranslation();
    return (
        <div className="app__settings__page__root">
            <Typography variant="h5">{t("messages.app_settings")}</Typography>
            <Divider className="mt-4! mb-6!" />
        </div>
    )
}
