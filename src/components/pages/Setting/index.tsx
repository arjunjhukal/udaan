import { Box, Typography, useTheme } from "@mui/material";
import {
    Book1,
    Category,
    Devices,
    DirectboxNotif,
    Global,
    Lock,
    LoginCurve,
    MessageText1,
    Profile,
    Setting2,
} from "iconsax-reactjs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import PageHeader from "../../organism/PageHeader";

const tabs = [
    { label: "Profile", value: "profile", redirect_url: PATH.SETTINGS.SYSTEM.PROFILE.ROOT, icon: Profile },
    { label: "Change Password", value: "change-password", redirect_url: PATH.SETTINGS.SYSTEM.CHANGE_PASSWORD.ROOT, icon: Lock },
    { label: "Site Info", value: "site-info", redirect_url: PATH.SETTINGS.SYSTEM.SITE_INFO.ROOT, icon: Global },
    { label: "SMTP", value: "smtp", redirect_url: PATH.SETTINGS.SYSTEM.SMTP.ROOT, icon: DirectboxNotif },
    { label: "General", value: "general", redirect_url: PATH.SETTINGS.SYSTEM.GENERAL.ROOT, icon: Setting2 },
    { label: "Linked Devices", value: "linked-devices", redirect_url: PATH.SETTINGS.SYSTEM.LINKED_DEVICE.ROOT, icon: Devices },
    { label: "Email Templates", value: "email-templates", redirect_url: PATH.SETTINGS.SYSTEM.EMAIL_TEMPLATES.ROOT, icon: MessageText1 },
    { label: "Course Setting", value: "course-setting", redirect_url: PATH.SETTINGS.SYSTEM.COURSE_SETTING.ROOT, icon: Book1 },
    { label: "Login Type", value: "login-type", redirect_url: PATH.SETTINGS.SYSTEM.LOGIN_TYPE.ROOT, icon: LoginCurve },
];

export default function SettingRoot() {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();

    const activeTab = tabs.find((t) => location.pathname.startsWith(t.redirect_url))?.value ?? "profile";

    return (
        <div className="setting__root flex flex-col h-full">
            <PageHeader
                breadcrumb={[
                    {
                        title: "System Setting",
                        icon: (
                            <Category size={20} color={theme.palette.primary.main} />
                        ),
                    },
                ]}
            />
            <div className="flex flex-1 gap-4 overflow-hidden">
                <Box
                    sx={{
                        width: 220,
                        flexShrink: 0,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: "hidden",
                        height: "fit-content",
                    }}
                >
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.value;
                        const Icon = tab.icon;
                        return (
                            <Box
                                key={tab.value}
                                onClick={() => navigate(tab.redirect_url)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    px: 2,
                                    py: 1.25,
                                    cursor: "pointer",
                                    bgcolor: isActive ? "primary.main" : "transparent",
                                    color: isActive ? "primary.contrastText" : "text.primary",
                                    transition: "background-color 0.15s, color 0.15s",
                                    "&:hover": {
                                        bgcolor: isActive ? "primary.main" : "action.hover",
                                    },
                                }}
                            >
                                <Icon
                                    size={18}
                                    color={isActive ? theme.palette.primary.contrastText : theme.palette.text.secondary}
                                    variant="Linear"
                                />
                                <Typography
                                    variant="body2"
                                    fontWeight={400}
                                    sx={{ color: "inherit" }}
                                >
                                    {tab.label}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
