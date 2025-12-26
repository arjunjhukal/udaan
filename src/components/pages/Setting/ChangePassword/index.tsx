import { Divider, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function ChangePassword() {
    const { t } = useTranslation();
    return (
        <div className="change__password__page__root">
            <Typography variant="h5">{t("messages.change_password")}</Typography>
            <Divider className="mt-4! mb-6!" />
        </div>
    )
}
