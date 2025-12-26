import { Button, Divider, Typography } from "@mui/material";
import { Add } from "iconsax-reactjs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import PageListing from "./PageListing";

export default function PagesRoot() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <div className="page__root">
            <div className="flex justify-between items-center">
                <div className="page__header flex flex-col gap-1.5">
                    <Typography variant="h5">{t("menus.content_management.pages.root")}</Typography>
                    <Typography variant="subtitle2" color="text.middle">{t("menus.content_management.pages.message")}</Typography>
                </div>
                <Button
                 variant="contained"
                    onClick={() => navigate(PATH.CONTENT_MANAGEMENT.PAGES.CREATE_PAGE.ROOT)}
                    startIcon={<Add />}>Create Page</Button>
            </div>
            <Divider className="mt-4! mb-6!" />
            <PageListing />
        </div>
    )
}
