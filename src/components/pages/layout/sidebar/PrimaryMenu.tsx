import { ExpandLess, ExpandMore } from "@mui/icons-material";
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
import CAN from "../../../../routes/CAN";
import { PATH } from "../../../../routes/PATH";

export default function PrimaryMenu() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [course, setCourse] = React.useState<boolean>(false);
    const [openCategory, setOpenCategory] = React.useState<boolean>(false);
    const [openTest, setOpenTest] = React.useState(false);

    const isActive = (path: string) => location.pathname === path;

    // Check if any of the child paths are active
    const isCourseManagementActive = () => {
        return location.pathname.startsWith(PATH.COURSE_MANAGEMENT.COURSES.ROOT) ||
            location.pathname.startsWith(PATH.COURSE_MANAGEMENT.LIVE_CLASSES.ROOT) ||
            location.pathname.startsWith(PATH.COURSE_MANAGEMENT.QUIZ.ROOT);
    };

    const isTestManagementActive = () => {
        return location.pathname.startsWith(PATH.TEST_QUESTION_MANAGEMENT.QUESTIONS.ROOT) ||
            location.pathname.startsWith(PATH.TEST_QUESTION_MANAGEMENT.TEST.ROOT);
    };

    const isCategoryManagementActive = () => {
        return location.pathname.startsWith(PATH.CATEGORY_LEVEL_MANAGEMENT.CATEGORY.ROOT) ||
            location.pathname.startsWith(PATH.CATEGORY_LEVEL_MANAGEMENT.LEVEL_POSITION.ROOT);
    };

    // Auto-expand menus if any child is active
    React.useEffect(() => {
        if (isCourseManagementActive()) {
            setCourse(true);
        }
        if (isTestManagementActive()) {
            setOpenTest(true);
        }
        if (isCategoryManagementActive()) {
            setOpenCategory(true);
        }
    }, [location.pathname]);

    return (
        <Box sx={{ padding: "0 32px 32px" }}>
            <List>
                <ListItem disablePadding className="menu__item">
                    <ListItemButton
                        onClick={() => navigate(PATH.DASHBOARD.ROOT)}
                        className={isActive(PATH.DASHBOARD.ROOT) ? "active" : ""}>
                        <ListItemIcon>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.3333 9.08341V3.41675C18.3333 2.16675 17.8 1.66675 16.475 1.66675H13.1083C11.7833 1.66675 11.25 2.16675 11.25 3.41675V9.08341C11.25 10.3334 11.7833 10.8334 13.1083 10.8334H16.475C17.8 10.8334 18.3333 10.3334 18.3333 9.08341Z" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M18.3333 16.5833V15.0833C18.3333 13.8333 17.8 13.3333 16.475 13.3333H13.1083C11.7833 13.3333 11.25 13.8333 11.25 15.0833V16.5833C11.25 17.8333 11.7833 18.3333 13.1083 18.3333H16.475C17.8 18.3333 18.3333 17.8333 18.3333 16.5833Z" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.75 10.9167V16.5834C8.75 17.8334 8.21667 18.3334 6.89167 18.3334H3.525C2.2 18.3334 1.66667 17.8334 1.66667 16.5834V10.9167C1.66667 9.66675 2.2 9.16675 3.525 9.16675H6.89167C8.21667 9.16675 8.75 9.66675 8.75 10.9167Z" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.75 3.41675V4.91675C8.75 6.16675 8.21667 6.66675 6.89167 6.66675H3.525C2.2 6.66675 1.66667 6.16675 1.66667 4.91675V3.41675C1.66667 2.16675 2.2 1.66675 3.525 1.66675H6.89167C8.21667 1.66675 8.75 2.16675 8.75 3.41675Z" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </ListItemIcon>
                        <ListItemText primary={t("menus.dashboard")} />
                    </ListItemButton>
                </ListItem>

                {/* Course Management Menu */}
                <CAN permissions={["add_courses", "edit_courses", "delete_courses", "view_courses", "add_live_classes", "edit_live_classes", "delete_live_classes", "view_live_classes"]}>
                    <ListItem disablePadding className="menu__item">
                        <ListItemButton
                            onClick={() => setCourse((prev) => !prev)}
                            className={isCourseManagementActive() ? "active" : ""}>
                            <ListItemIcon>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.3333 13.9501V3.89174C18.3333 2.89174 17.5167 2.15008 16.525 2.23341H16.475C14.725 2.38341 12.0667 3.27508 10.5833 4.20841L10.4417 4.30008C10.2 4.45008 9.8 4.45008 9.55833 4.30008L9.35 4.17508C7.86667 3.25008 5.21667 2.36674 3.46667 2.22508C2.475 2.14174 1.66667 2.89174 1.66667 3.88341V13.9501C1.66667 14.7501 2.31667 15.5001 3.11667 15.6001L3.35833 15.6334C5.16667 15.8751 7.95833 16.7917 9.55833 17.6667L9.59167 17.6834C9.81667 17.8084 10.175 17.8084 10.3917 17.6834C11.9917 16.8001 14.7917 15.8751 16.6083 15.6334L16.8833 15.6001C17.6833 15.5001 18.3333 14.7501 18.3333 13.9501Z" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 4.57495V17.075" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.45833 7.07495H4.58333" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7.08333 9.57495H4.58333" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </ListItemIcon>
                            <ListItemText primary={t("menus.course_management.root")} />
                            {course ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={course} timeout="auto" unmountOnExit>

                            <List component="div" disablePadding sx={{ pl: 3 }}>
                                <CAN permissions={["add_courses", "edit_courses", "delete_courses", "view_courses",]}>
                                    <ListItem disablePadding className="menu__item">
                                        <ListItemButton
                                            onClick={() => navigate(PATH.COURSE_MANAGEMENT.COURSES.ROOT)}
                                            className={location.pathname.startsWith(PATH.COURSE_MANAGEMENT.COURSES.ROOT) ? "active-nested" : ""}>
                                            <ListItemText
                                                primary={t("menus.course_management.courses.root")}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                </CAN>
                                <CAN permissions={["add_live_classes", "edit_live_classes", "delete_live_classes", "view_live_classes"]}>
                                    <ListItem disablePadding className="menu__item">
                                        <ListItemButton
                                            onClick={() => navigate(PATH.COURSE_MANAGEMENT.LIVE_CLASSES.ROOT)}
                                            className={location.pathname.startsWith(PATH.COURSE_MANAGEMENT.LIVE_CLASSES.ROOT) ? "active-nested" : ""}>
                                            <ListItemText
                                                primary={t("menus.course_management.live_classes.root")}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                </CAN>
                                <CAN permissions={["add_quizs", "edit_quizs", "delete_quizs", "view_quizs"]}>
                                    <ListItem disablePadding className="menu__item">
                                        <ListItemButton
                                            onClick={() => navigate(PATH.COURSE_MANAGEMENT.QUIZ.ROOT)}
                                            className={location.pathname.startsWith(PATH.COURSE_MANAGEMENT.QUIZ.ROOT) ? "active-nested" : ""}>
                                            <ListItemText
                                                primary={t("menus.course_management.quiz.root")}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                </CAN>
                            </List>
                        </Collapse>
                    </ListItem>
                </CAN>

                {/* Test & Question Management Menu */}
                <CAN permissions={["add_questions", "edit_questions", "delete_questions", "view_questions", "add_tests", "edit_tests", "delete_tests", "view_tests"]}>
                    <ListItem disablePadding className="menu__item">
                        <ListItemButton
                            onClick={() => setOpenTest((prev) => !prev)}
                            className={isTestManagementActive() ? "active" : ""}>
                            <ListItemIcon>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.3333 13.9501V3.89174C18.3333 2.89174 17.5167 2.15008 16.525 2.23341H16.475C14.725 2.38341 12.0667 3.27508 10.5833 4.20841L10.4417 4.30008C10.2 4.45008 9.8 4.45008 9.55833 4.30008L9.35 4.17508C7.86667 3.25008 5.21667 2.36674 3.46667 2.22508C2.475 2.14174 1.66667 2.89174 1.66667 3.88341V13.9501C1.66667 14.7501 2.31667 15.5001 3.11667 15.6001L3.35833 15.6334C5.16667 15.8751 7.95833 16.7917 9.55833 17.6667L9.59167 17.6834C9.81667 17.8084 10.175 17.8084 10.3917 17.6834C11.9917 16.8001 14.7917 15.8751 16.6083 15.6334L16.8833 15.6001C17.6833 15.5001 18.3333 14.7501 18.3333 13.9501Z" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 4.57495V17.075" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.45833 7.07495H4.58333" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7.08333 9.57495H4.58333" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </ListItemIcon>
                            <ListItemText primary={t("menus.test_question_management.root")} />
                            {openTest ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={openTest} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pl: 3 }}>
                                <CAN permissions={["add_questions", "edit_questions", "delete_questions", "view_questions"]}>
                                    <ListItem disablePadding className="menu__item">
                                        <ListItemButton
                                            onClick={() => navigate(PATH.TEST_QUESTION_MANAGEMENT.QUESTIONS.ROOT)}
                                            className={location.pathname.startsWith(PATH.TEST_QUESTION_MANAGEMENT.QUESTIONS.ROOT) ? "active-nested" : ""}>
                                            <ListItemText
                                                primary={t("menus.test_question_management.question.root")}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                </CAN>
                                <CAN permissions={["add_tests", "edit_tests", "delete_tests", "view_tests"]}>
                                    <ListItem disablePadding className="menu__item">
                                        <ListItemButton
                                            onClick={() => navigate(PATH.TEST_QUESTION_MANAGEMENT.TEST.ROOT)}
                                            className={location.pathname.startsWith(PATH.TEST_QUESTION_MANAGEMENT.TEST.ROOT) ? "active-nested" : ""}>
                                            <ListItemText
                                                primary={t("menus.test_question_management.test.root")}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                </CAN>
                            </List>
                        </Collapse>
                    </ListItem>
                </CAN>


                {/* Role Management */}
                <CAN permissions={["add_roles", "edit_roles", "delete_roles", "view_roles"]}>
                    <ListItem disablePadding className="menu__item">
                        <ListItemButton
                            onClick={() => navigate(PATH.ROLES.ROOT)}
                            className={location.pathname.startsWith(PATH.ROLES.ROOT) ? "active" : ""}>
                            <ListItemIcon>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.1167 18.0166C14.3833 18.2333 13.5167 18.3333 12.5 18.3333H7.5C6.48333 18.3333 5.61667 18.2333 4.88334 18.0166C5.06667 15.85 7.29167 14.1416 10 14.1416C12.7083 14.1416 14.9333 15.85 15.1167 18.0166Z" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12.5 1.66675H7.5C3.33333 1.66675 1.66667 3.33341 1.66667 7.50008V12.5001C1.66667 15.6501 2.61667 17.3751 4.88334 18.0167C5.06667 15.8501 7.29167 14.1417 10 14.1417C12.7083 14.1417 14.9333 15.8501 15.1167 18.0167C17.3833 17.3751 18.3333 15.6501 18.3333 12.5001V7.50008C18.3333 3.33341 16.6667 1.66675 12.5 1.66675ZM10 11.8084C8.35 11.8084 7.01667 10.4668 7.01667 8.81676C7.01667 7.16676 8.35 5.83341 10 5.83341C11.65 5.83341 12.9833 7.16676 12.9833 8.81676C12.9833 10.4668 11.65 11.8084 10 11.8084Z" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12.9833 8.8166C12.9833 10.4666 11.65 11.8082 10 11.8082C8.35 11.8082 7.01667 10.4666 7.01667 8.8166C7.01667 7.1666 8.35 5.83325 10 5.83325C11.65 5.83325 12.9833 7.1666 12.9833 8.8166Z" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </ListItemIcon>
                            <ListItemText primary={t("menus.role_permission.root")} />
                        </ListItemButton>
                    </ListItem>
                </CAN>

                {/* User Management */}
                <CAN permissions={["add_users", "edit_users", "delete_users", "view_users"]}>
                    <ListItem disablePadding className="menu__item">
                        <ListItemButton
                            onClick={() => navigate(PATH.USER_MANAGEMENT.ROOT)}
                            className={location.pathname.startsWith(PATH.USER_MANAGEMENT.ROOT) ? "active" : ""}>
                            <ListItemIcon>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.63333 9.05841C7.55 9.05008 7.45 9.05008 7.35833 9.05841C5.375 8.99175 3.8 7.36675 3.8 5.36675C3.8 3.32508 5.45 1.66675 7.5 1.66675C9.54167 1.66675 11.2 3.32508 11.2 5.36675C11.1917 7.36675 9.61667 8.99175 7.63333 9.05841Z" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M13.675 3.33325C15.2917 3.33325 16.5917 4.64159 16.5917 6.24992C16.5917 7.82492 15.3417 9.10825 13.7833 9.16659C13.7167 9.15825 13.6417 9.15825 13.5667 9.16659" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3.46667 12.1333C1.45 13.4833 1.45 15.6833 3.46667 17.0249C5.75833 18.5583 9.51667 18.5583 11.8083 17.0249C13.825 15.6749 13.825 13.4749 11.8083 12.1333C9.525 10.6083 5.76667 10.6083 3.46667 12.1333Z" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M15.2833 16.6667C15.8833 16.5417 16.45 16.3001 16.9167 15.9417C18.2167 14.9667 18.2167 13.3584 16.9167 12.3834C16.4583 12.0334 15.9 11.8001 15.3083 11.6667" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </ListItemIcon>
                            <ListItemText primary={t("menus.user_management.root")} />
                        </ListItemButton>
                    </ListItem>
                </CAN>

                {/* Category & Level Management */}
                <CAN permissions={["add_categories", "edit_categories", "delete_categories", "view_categories", "add_positions", "edit_positions", "delete_positions", "view_positions"]}>
                    <ListItem disablePadding className="menu__item">
                        <ListItemButton
                            onClick={() => setOpenCategory((prev) => !prev)}
                            className={isCategoryManagementActive() ? "active" : ""}>
                            <ListItemIcon>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.16667 8.33341H5.83333C7.5 8.33341 8.33333 7.50008 8.33333 5.83341V4.16675C8.33333 2.50008 7.5 1.66675 5.83333 1.66675H4.16667C2.5 1.66675 1.66667 2.50008 1.66667 4.16675V5.83341C1.66667 7.50008 2.5 8.33341 4.16667 8.33341Z" stroke="#9CA3B0" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14.1667 8.33341H15.8333C17.5 8.33341 18.3333 7.50008 18.3333 5.83341V4.16675C18.3333 2.50008 17.5 1.66675 15.8333 1.66675H14.1667C12.5 1.66675 11.6667 2.50008 11.6667 4.16675V5.83341C11.6667 7.50008 12.5 8.33341 14.1667 8.33341Z" stroke="#9CA3B0" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14.1667 18.3334H15.8333C17.5 18.3334 18.3333 17.5001 18.3333 15.8334V14.1667C18.3333 12.5001 17.5 11.6667 15.8333 11.6667H14.1667C12.5 11.6667 11.6667 12.5001 11.6667 14.1667V15.8334C11.6667 17.5001 12.5 18.3334 14.1667 18.3334Z" stroke="#9CA3B0" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4.16667 18.3334H5.83333C7.5 18.3334 8.33333 17.5001 8.33333 15.8334V14.1667C8.33333 12.5001 7.5 11.6667 5.83333 11.6667H4.16667C2.5 11.6667 1.66667 12.5001 1.66667 14.1667V15.8334C1.66667 17.5001 2.5 18.3334 4.16667 18.3334Z" stroke="#9CA3B0" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </ListItemIcon>
                            <ListItemText
                                primary={t("menus.category_level_management.root")}
                            />
                            {openCategory ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={openCategory} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pl: 3 }}>
                                <ListItem disablePadding className="menu__item">
                                    <ListItemButton
                                        onClick={() => navigate(PATH.CATEGORY_LEVEL_MANAGEMENT.CATEGORY.ROOT)}
                                        className={location.pathname.startsWith(PATH.CATEGORY_LEVEL_MANAGEMENT.CATEGORY.ROOT) ? "active-nested" : ""}>
                                        <ListItemText
                                            primary={t("menus.category_level_management.category.root")}
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding className="menu__item">
                                    <ListItemButton
                                        onClick={() => navigate(PATH.CATEGORY_LEVEL_MANAGEMENT.LEVEL_POSITION.ROOT)}
                                        className={location.pathname.startsWith(PATH.CATEGORY_LEVEL_MANAGEMENT.LEVEL_POSITION.ROOT) ? "active-nested" : ""}>
                                        <ListItemText
                                            primary={t("menus.category_level_management.level_position.root")}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Collapse>
                    </ListItem>
                </CAN>

                {/* Subscription Management */}
                <CAN permissions={["add_subscriptions", "edit_subscriptions", "delete_subscriptions", "view_subscriptions",]}>
                    <ListItem disablePadding className="menu__item">
                        <ListItemButton
                            onClick={() => navigate(PATH.SUBSCRIPTION_PLAN_MANAGEMENT.ROOT)}
                            className={location.pathname.startsWith(PATH.SUBSCRIPTION_PLAN_MANAGEMENT.ROOT) ? "active" : ""}>
                            <ListItemIcon>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.167 17.0832H5.83366C3.33366 17.0832 1.66699 15.8332 1.66699 12.9165V7.08317C1.66699 4.1665 3.33366 2.9165 5.83366 2.9165H14.167C16.667 2.9165 18.3337 4.1665 18.3337 7.08317V12.9165C18.3337 15.8332 16.667 17.0832 14.167 17.0832Z" stroke="#9CA3B0" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#9CA3B0" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4.58301 7.9165V12.0832" stroke="#9CA3B0" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M15.417 7.9165V12.0832" stroke="#9CA3B0" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </ListItemIcon>
                            <ListItemText primary={t("menus.subscription_plan.root")} />
                        </ListItemButton>
                    </ListItem>
                </CAN>
                {/* Transactions Management */}
                <CAN permissions={["add_transactions", "edit_transactions", "delete_transactions", "view_transactions",]}>
                    <ListItem disablePadding className="menu__item">
                        <ListItemButton
                            onClick={() => navigate(PATH.TRANSACTION_MANAGEMENT.ROOT)}
                            className={location.pathname.startsWith(PATH.TRANSACTION_MANAGEMENT.ROOT) ? "active" : ""}>
                            <ListItemIcon>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.0831 6.60023V10.8919C16.0831 13.4586 14.6165 14.5586 12.4165 14.5586H5.09147C4.71647 14.5586 4.35813 14.5253 4.0248 14.4503C3.81647 14.4169 3.61647 14.3586 3.43314 14.2919C2.18314 13.8253 1.4248 12.7419 1.4248 10.8919V6.60023C1.4248 4.03356 2.89147 2.93359 5.09147 2.93359H12.4165C14.2831 2.93359 15.6248 3.72526 15.9831 5.53359C16.0415 5.86692 16.0831 6.20856 16.0831 6.60023Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M18.5842 9.1018V13.3935C18.5842 15.9601 17.1176 17.0601 14.9176 17.0601H7.59254C6.97588 17.0601 6.41755 16.9768 5.93422 16.7935C4.94255 16.4268 4.26755 15.6685 4.02588 14.4518C4.35921 14.5268 4.71754 14.5601 5.09254 14.5601H12.4176C14.6176 14.5601 16.0842 13.4601 16.0842 10.8935V6.6018C16.0842 6.21013 16.0509 5.86016 15.9842 5.53516C17.5676 5.86849 18.5842 6.98513 18.5842 9.1018Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M8.74835 10.9508C9.96338 10.9508 10.9484 9.96582 10.9484 8.75079C10.9484 7.53577 9.96338 6.55078 8.74835 6.55078C7.53333 6.55078 6.54834 7.53577 6.54834 8.75079C6.54834 9.96582 7.53333 10.9508 8.74835 10.9508Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M3.98291 6.91797V10.5847" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M13.5181 6.91797V10.5847" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </ListItemIcon>
                            <ListItemText primary={t("menus.transaction_management.root")} />
                        </ListItemButton>
                    </ListItem>
                </CAN>
            </List>
        </Box>
    );
}