import { Divider, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function LinkedDevices() {
    const { t } = useTranslation();
    return (
        <div className="linked__devices__page__root">
            <Typography variant="h5">{t("messages.linked_devices")}</Typography>
            <Divider className="mt-4! mb-6!" />
        </div>
    )
}
