import { Add } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { PATH } from "../../../../../routes/PATH";
import PageHeader from "../../../../organism/PageHeader";
import AllLiveClassList from "./AllLiveClassList";

export default function AllLiveClass() {
    const { t } = useTranslation();
    return (
        <>
            <PageHeader
                breadcrumb={[
                    {
                        title: "Role & Permission Management",
                        icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM14.66 13.73L13.38 14.47L12.1 15.21C10.45 16.16 9.1 15.38 9.1 13.48V12V10.52C9.1 8.61 10.45 7.84 12.1 8.79L13.38 9.53L14.66 10.27C16.31 11.22 16.31 12.78 14.66 13.73Z" fill="#1D82F5" />
                        </svg>
                        ),
                        // url: PATH.ROLES.CREATE_ROLE.ROOT
                    }
                ]}
                cta={
                    {
                        icon: <Add />,
                        url: PATH.ROLES.CREATE_ROLE.ROOT,
                        label: t("messages.empty_states.live_class.action"),
                    }
                }
            />
            <AllLiveClassList />
        </>
    )
}
