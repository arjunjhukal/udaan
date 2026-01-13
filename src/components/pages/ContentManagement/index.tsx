import { Box, Collapse, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import CustomCollapseIcon from "../../atoms/CustomCollapseIcon";
import PageHeader from "../../organism/PageHeader";

export default function ContentManagementRoot() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [openHome, setOpenHome] = useState(false);

    return (
        <>
            <PageHeader
                breadcrumb={[{
                    title: t("menus.content_management.root"),
                    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.1 9.21945C18.29 9.21945 17.55 7.93945 18.45 6.36945C18.97 5.45945 18.66 4.29945 17.75 3.77945L16.02 2.78945C15.23 2.31945 14.21 2.59945 13.74 3.38945L13.63 3.57945C12.73 5.14945 11.25 5.14945 10.34 3.57945L10.23 3.38945C9.78 2.59945 8.76 2.31945 7.97 2.78945L6.24 3.77945C5.33 4.29945 5.02 5.46945 5.54 6.37945C6.45 7.93945 5.71 9.21945 3.9 9.21945C2.86 9.21945 2 10.0694 2 11.1194V12.8794C2 13.9194 2.85 14.7794 3.9 14.7794C5.71 14.7794 6.45 16.0594 5.54 17.6294C5.02 18.5394 5.33 19.6994 6.24 20.2194L7.97 21.2094C8.76 21.6794 9.78 21.3995 10.25 20.6094L10.36 20.4194C11.26 18.8494 12.74 18.8494 13.65 20.4194L13.76 20.6094C14.23 21.3995 15.25 21.6794 16.04 21.2094L17.77 20.2194C18.68 19.6994 18.99 18.5294 18.47 17.6294C17.56 16.0594 18.3 14.7794 20.11 14.7794C21.15 14.7794 22.01 13.9294 22.01 12.8794V11.1194C22 10.0794 21.15 9.21945 20.1 9.21945ZM12 15.2494C10.21 15.2494 8.75 13.7894 8.75 11.9994C8.75 10.2094 10.21 8.74945 12 8.74945C13.79 8.74945 15.25 10.2094 15.25 11.9994C15.25 13.7894 13.79 15.2494 12 15.2494Z" fill="#1D82F5" />
                    </svg>
                    )
                }]}
            />
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 h-full">
                <Box className="lg:col-span-4 2xl:col-span-3 lg:pr-8 2xl:pr-13.5 lg:mr-2 2xl:mr-7.5 " sx={{
                    borderRight: (theme) => `1px solid ${theme.palette.separator.dark}`
                }}>
                    <List className="flex flex-col gap-2">
                        <ListItem disablePadding className=" sub__menu">
                            <ListItemButton
                                onClick={() => navigate(PATH.CONTENT_MANAGEMENT.SPLASH_SCREEN.ROOT)}
                                className={`border-none! ${location.pathname.startsWith(PATH.CONTENT_MANAGEMENT.SPLASH_SCREEN.ROOT) ? "active" : ""}`}>
                                <ListItemText primary={t("menus.content_management.splash_screen.root")} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding className=" sub__menu">
                            <ListItemButton
                                onClick={() => navigate(PATH.CONTENT_MANAGEMENT.ONBOARDING_SCREEN.ROOT)}
                                className={`border-none! ${location.pathname.startsWith(PATH.CONTENT_MANAGEMENT.ONBOARDING_SCREEN.ROOT) ? "active" : ""}`}>
                                <ListItemText primary={t("menus.content_management.onboarding_screen.root")} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding className=" sub__menu">
                            <ListItemButton
                                onClick={() => {
                                    setOpenHome((prev) => !prev);
                                    // navigate(PATH.CONTENT_MANAGEMENT.HOME_SCREEN.WELCOME_POPUP.ROOT)
                                }}
                                className={`border-none! ${location.pathname.startsWith(PATH.CONTENT_MANAGEMENT.HOME_SCREEN.ROOT) ? "active" : ""}`}>
                                <ListItemText primary={t("menus.content_management.home_screen.root")} />
                                <CustomCollapseIcon isOpen={openHome} />
                            </ListItemButton>
                            <Collapse in={openHome} timeout="auto" unmountOnExit>
                                <List className="flex flex-col ">
                                    <ListItem disablePadding className="sub__menu">
                                        <ListItemButton
                                            onClick={() => navigate(PATH.CONTENT_MANAGEMENT.HOME_SCREEN.WELCOME_POPUP.ROOT)}
                                            className={`border-none! ${location.pathname.startsWith(PATH.CONTENT_MANAGEMENT.HOME_SCREEN.WELCOME_POPUP.ROOT) ? "active" : ""}`}>
                                            <ListItemText primary={t("menus.content_management.home_screen.welcome_popup.root")} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding className="sub__menu">
                                        <ListItemButton
                                            onClick={() => navigate(PATH.CONTENT_MANAGEMENT.HOME_SCREEN.BANNER.ROOT)}
                                            className={`border-none! ${location.pathname.startsWith(PATH.CONTENT_MANAGEMENT.HOME_SCREEN.BANNER.ROOT) ? "active" : ""}`}>
                                            <ListItemText primary={t("menus.content_management.home_screen.banner.root")} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding className="sub__menu">
                                        <ListItemButton
                                            onClick={() => navigate(PATH.CONTENT_MANAGEMENT.HOME_SCREEN.FEATURED_COURSE.ROOT)}
                                            className={`border-none! ${location.pathname.startsWith(PATH.CONTENT_MANAGEMENT.HOME_SCREEN.FEATURED_COURSE.ROOT) ? "active" : ""}`}>
                                            <ListItemText primary={t("menus.content_management.home_screen.featured_course.root")} />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </Collapse>
                        </ListItem>
                        <ListItem disablePadding className=" sub__menu">
                            <ListItemButton
                                onClick={() => navigate(PATH.CONTENT_MANAGEMENT.PAGES.ROOT)}
                                className={`border-none! ${location.pathname.startsWith(PATH.CONTENT_MANAGEMENT.PAGES.ROOT) ? "active" : ""}`}>
                                <ListItemText primary={t("menus.content_management.pages.root")} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
                <div className="lg:col-span-8 2xl:col-span-9 h-full overflow-hidden flex flex-col justify-start">
                    <Outlet />
                </div>
            </div>
        </>
    )
}
