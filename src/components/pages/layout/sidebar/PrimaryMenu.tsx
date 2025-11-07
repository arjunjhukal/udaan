import { ExpandLess, ExpandMore } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import {
    Box,
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";

export default function PrimaryMenu() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    // const [content, setContent] = React.useState<boolean>(false);
    const [course, setCourse] = React.useState<boolean>(false);

    const isActive = (path: string) => location.pathname === path;
    const isChildActive = (basePath: string) =>
        location.pathname.startsWith(basePath);

    // Auto-expand category management if any child is active
    // React.useEffect(() => {
    //     if (location.pathname.includes("/category")) {
    //         setContent(true);
    //     }
    // }, [location.pathname]);

    return (
        <Box sx={{ padding: "0 32px 32px" }}>
            {/* <Typography variant='body2' mb={1}>{t("messages.overview")}</Typography> */}
            <List>
                <ListItem disablePadding className="menu__item">
                    <ListItemButton
                        onClick={() => navigate(PATH.DASHBOARD.ROOT)}
                        className={isActive(PATH.DASHBOARD.ROOT) ? "active" : ""}>
                        <ListItemIcon>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.3333 9.08341V3.41675C18.3333 2.16675 17.8 1.66675 16.475 1.66675H13.1083C11.7833 1.66675 11.25 2.16675 11.25 3.41675V9.08341C11.25 10.3334 11.7833 10.8334 13.1083 10.8334H16.475C17.8 10.8334 18.3333 10.3334 18.3333 9.08341Z" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M18.3333 16.5833V15.0833C18.3333 13.8333 17.8 13.3333 16.475 13.3333H13.1083C11.7833 13.3333 11.25 13.8333 11.25 15.0833V16.5833C11.25 17.8333 11.7833 18.3333 13.1083 18.3333H16.475C17.8 18.3333 18.3333 17.8333 18.3333 16.5833Z" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M8.75 10.9167V16.5834C8.75 17.8334 8.21667 18.3334 6.89167 18.3334H3.525C2.2 18.3334 1.66667 17.8334 1.66667 16.5834V10.9167C1.66667 9.66675 2.2 9.16675 3.525 9.16675H6.89167C8.21667 9.16675 8.75 9.66675 8.75 10.9167Z" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M8.75 3.41675V4.91675C8.75 6.16675 8.21667 6.66675 6.89167 6.66675H3.525C2.2 6.66675 1.66667 6.16675 1.66667 4.91675V3.41675C1.66667 2.16675 2.2 1.66675 3.525 1.66675H6.89167C8.21667 1.66675 8.75 2.16675 8.75 3.41675Z" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </ListItemIcon>
                        <ListItemText primary={t("menus.dashboard")} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding className="menu__item">
                    <ListItemButton
                        onClick={() => setCourse((prev) => !prev)}
                        className={isActive(PATH.COURSE_MANAGEMENT.ROOT) ? "active" : ""}>
                        <ListItemIcon>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.3333 13.9501V3.89174C18.3333 2.89174 17.5167 2.15008 16.525 2.23341H16.475C14.725 2.38341 12.0667 3.27508 10.5833 4.20841L10.4417 4.30008C10.2 4.45008 9.8 4.45008 9.55833 4.30008L9.35 4.17508C7.86667 3.25008 5.21667 2.36674 3.46667 2.22508C2.475 2.14174 1.66667 2.89174 1.66667 3.88341V13.9501C1.66667 14.7501 2.31667 15.5001 3.11667 15.6001L3.35833 15.6334C5.16667 15.8751 7.95833 16.7917 9.55833 17.6667L9.59167 17.6834C9.81667 17.8084 10.175 17.8084 10.3917 17.6834C11.9917 16.8001 14.7917 15.8751 16.6083 15.6334L16.8833 15.6001C17.6833 15.5001 18.3333 14.7501 18.3333 13.9501Z" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M10 4.57495V17.075" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6.45833 7.07495H4.58333" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M7.08333 9.57495H4.58333" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                        </ListItemIcon>
                        <ListItemText primary={t("menus.course_management.root")} />
                        {course ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={course} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ pl: 3 }}>
                            <ListItem disablePadding className="menu__item">
                                <ListItemButton
                                    onClick={() => navigate(PATH.COURSE_MANAGEMENT.COURSES.ROOT)}
                                    className={isActive(PATH.COURSE_MANAGEMENT.COURSES.ROOT) ? "active-nested" : ""}>
                                    <ListItemText
                                        primary={t("menus.course_management.courses.root")}
                                    />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding className="menu__item">
                                <ListItemButton
                                    onClick={() => navigate(PATH.COURSE_MANAGEMENT.LIVE_CLASSES.ROOT)}
                                    className={isActive(PATH.COURSE_MANAGEMENT.LIVE_CLASSES.ROOT) ? "active-nested" : ""}>
                                    <ListItemText
                                        primary={t("menus.course_management.courses.root")}
                                    />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding className="menu__item">
                                <ListItemButton
                                    onClick={() => navigate(PATH.COURSE_MANAGEMENT.QUIZ.ROOT)}
                                    className={isActive(PATH.COURSE_MANAGEMENT.QUIZ.ROOT) ? "active-nested" : ""}>
                                    <ListItemText
                                        primary={t("menus.course_management.quiz.root")}
                                    />
                                </ListItemButton>
                            </ListItem>

                        </List>
                    </Collapse>
                </ListItem>
                <ListItem disablePadding className="menu__item">
                    <ListItemButton
                        onClick={() => navigate(PATH.ROLES.ROOT)}
                        className={isChildActive(PATH.ROLES.ROOT) ? "active" : ""}>
                        <ListItemIcon>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.1167 18.0166C14.3833 18.2333 13.5167 18.3333 12.5 18.3333H7.5C6.48333 18.3333 5.61667 18.2333 4.88334 18.0166C5.06667 15.85 7.29167 14.1416 10 14.1416C12.7083 14.1416 14.9333 15.85 15.1167 18.0166Z" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12.5 1.66675H7.5C3.33333 1.66675 1.66667 3.33341 1.66667 7.50008V12.5001C1.66667 15.6501 2.61667 17.3751 4.88334 18.0167C5.06667 15.8501 7.29167 14.1417 10 14.1417C12.7083 14.1417 14.9333 15.8501 15.1167 18.0167C17.3833 17.3751 18.3333 15.6501 18.3333 12.5001V7.50008C18.3333 3.33341 16.6667 1.66675 12.5 1.66675ZM10 11.8084C8.35 11.8084 7.01667 10.4668 7.01667 8.81676C7.01667 7.16676 8.35 5.83341 10 5.83341C11.65 5.83341 12.9833 7.16676 12.9833 8.81676C12.9833 10.4668 11.65 11.8084 10 11.8084Z" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12.9833 8.8166C12.9833 10.4666 11.65 11.8082 10 11.8082C8.35 11.8082 7.01667 10.4666 7.01667 8.8166C7.01667 7.1666 8.35 5.83325 10 5.83325C11.65 5.83325 12.9833 7.1666 12.9833 8.8166Z" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </ListItemIcon>
                        <ListItemText primary={t("menus.role_permission.root")} />
                    </ListItemButton>
                </ListItem>


                <ListItem disablePadding className="menu__item">
                    <ListItemButton
                        onClick={() => navigate("/content")}
                        className={isActive("/content") ? "active" : ""}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary={t("menus.content.root")} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding className="menu__item">
                    <ListItemButton
                        onClick={() => navigate("/teachers")}
                        className={isActive("/teachers") ? "active" : ""}>
                        <ListItemIcon>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.16667 8.33341H5.83333C7.5 8.33341 8.33333 7.50008 8.33333 5.83341V4.16675C8.33333 2.50008 7.5 1.66675 5.83333 1.66675H4.16667C2.5 1.66675 1.66667 2.50008 1.66667 4.16675V5.83341C1.66667 7.50008 2.5 8.33341 4.16667 8.33341Z" stroke="#9CA3B0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M14.1667 8.33341H15.8333C17.5 8.33341 18.3333 7.50008 18.3333 5.83341V4.16675C18.3333 2.50008 17.5 1.66675 15.8333 1.66675H14.1667C12.5 1.66675 11.6667 2.50008 11.6667 4.16675V5.83341C11.6667 7.50008 12.5 8.33341 14.1667 8.33341Z" stroke="#9CA3B0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M14.1667 18.3334H15.8333C17.5 18.3334 18.3333 17.5001 18.3333 15.8334V14.1667C18.3333 12.5001 17.5 11.6667 15.8333 11.6667H14.1667C12.5 11.6667 11.6667 12.5001 11.6667 14.1667V15.8334C11.6667 17.5001 12.5 18.3334 14.1667 18.3334Z" stroke="#9CA3B0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M4.16667 18.3334H5.83333C7.5 18.3334 8.33333 17.5001 8.33333 15.8334V14.1667C8.33333 12.5001 7.5 11.6667 5.83333 11.6667H4.16667C2.5 11.6667 1.66667 12.5001 1.66667 14.1667V15.8334C1.66667 17.5001 2.5 18.3334 4.16667 18.3334Z" stroke="#9CA3B0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </ListItemIcon>
                        <ListItemText
                            primary={t("menus.category_management.root")}
                        />
                    </ListItemButton>
                </ListItem>
            </List>

            {/* <Typography variant='body2' my={1}>{t("messages.master_data")}</Typography> */}
        </Box>
    );
}
