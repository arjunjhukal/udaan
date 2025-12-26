import { Divider, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function ProfilePageRoot() {
    const { t } = useTranslation();
    return (
        <div className="profile__page__root">
            <Typography variant="h5">{t("messages.profile")}</Typography>
            <Divider className="mt-4! mb-6!" />
        </div>
    )
}
