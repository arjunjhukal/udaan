import { useEffect, type ComponentType } from "react";
import { alpha } from "@mui/material/styles";
import { Box, IconButton, Paper, Typography, type SvgIconProps } from "@mui/material";
import { useTheme, type Theme } from "@mui/material/styles";
import {
    Close,
    NotificationsRounded,
    AssignmentRounded,
    LiveTvRounded,
    WifiOffRounded,
} from "@mui/icons-material";
import { useAdminNotification, type ToastNotification } from "../../context/AdminNotificationContext";
import type { NotifiableTypes } from "../../types/notification";

const TOAST_DURATION = 5000;
const MAX_VISIBLE = 3;

interface TypeConfig {
    color: string;
    Icon: ComponentType<SvgIconProps>;
}

function getTypeConfig(type: NotifiableTypes, theme: Theme): TypeConfig {
    switch (type) {
        case "live_class":
            return { color: theme.palette.success.main, Icon: LiveTvRounded };
        case "test":
            return { color: theme.palette.warning.main, Icon: AssignmentRounded };
        case "offline":
            return { color: theme.palette.error.main, Icon: WifiOffRounded };
        default:
            return { color: theme.palette.primary.main, Icon: NotificationsRounded };
    }
}

function SingleToast({ toast }: { toast: ToastNotification }) {
    const { removeToast } = useAdminNotification();
    const theme = useTheme();
    const { color, Icon } = getTypeConfig(toast.notification_type, theme);

    useEffect(() => {
        const timer = setTimeout(() => removeToast(toast.id), TOAST_DURATION);
        return () => clearTimeout(timer);
    }, [toast.id, removeToast]);

    return (
        <Paper
            elevation={0}
            sx={{
                display: "flex",
                alignItems: "flex-start",
                minWidth: 300,
                maxWidth: 360,
                overflow: "hidden",
                position: "relative",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
                "@keyframes toastSlideIn": {
                    from: { opacity: 0, transform: "translateY(10px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
                animation: "toastSlideIn 0.2s ease-out",
            }}
        >
            {/* Left accent bar */}
            <Box sx={{ width: 4, alignSelf: "stretch", bgcolor: color, flexShrink: 0 }} />

            {/* Icon circle */}
            <Box
                sx={{
                    mt: 1.5,
                    ml: 1.5,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: alpha(color, 0.12),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <Icon sx={{ fontSize: 16, color }} />
            </Box>

            {/* Text content */}
            <Box sx={{ flex: 1, minWidth: 0, py: 1.5, pl: 1.5 }}>
                <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.primary"
                    noWrap
                >
                    {toast.title}
                </Typography>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mt: 0.25,
                    }}
                >
                    {toast.description}
                </Typography>
            </Box>

            {/* Close button */}
            <IconButton
                size="small"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss"
                sx={{ mt: 0.75, mr: 0.5, flexShrink: 0, color: "text.secondary" }}
            >
                <Close sx={{ fontSize: 14 }} />
            </IconButton>

            {/* Progress bar */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: 2,
                    bgcolor: color,
                    "@keyframes toastProgress": {
                        from: { width: "100%" },
                        to: { width: "0%" },
                    },
                    animation: `toastProgress ${TOAST_DURATION}ms linear forwards`,
                }}
            />
        </Paper>
    );
}

export default function AdminNotificationToast() {
    const { toasts, clearAll } = useAdminNotification();

    if (toasts.length === 0) return null;

    const visible = toasts.slice(-MAX_VISIBLE);
    const hiddenCount = Math.max(0, toasts.length - MAX_VISIBLE);

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 24,
                right: 24,
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 1,
                pointerEvents: "none",
            }}
        >
            {/* Dismiss all — only shown when 2+ toasts */}
            {toasts.length >= 2 && (
                <Box sx={{ pointerEvents: "auto" }}>
                    <Typography
                        variant="caption"
                        onClick={clearAll}
                        sx={{
                            cursor: "pointer",
                            color: "text.secondary",
                            transition: "color 0.15s",
                            "&:hover": { color: "text.primary" },
                        }}
                    >
                        Dismiss all
                    </Typography>
                </Box>
            )}

            {/* Overflow pill */}
            {hiddenCount > 0 && (
                <Paper
                    elevation={0}
                    sx={{
                        pointerEvents: "auto",
                        px: 2,
                        py: 0.5,
                        borderRadius: 10,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        +{hiddenCount} more notification{hiddenCount > 1 ? "s" : ""}
                    </Typography>
                </Paper>
            )}

            {/* Visible toasts — oldest at top, newest at bottom */}
            {visible.map((toast) => (
                <Box key={toast.id} sx={{ pointerEvents: "auto" }}>
                    <SingleToast toast={toast} />
                </Box>
            ))}
        </Box>
    );
}
