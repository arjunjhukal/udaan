import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

type Tone = "primary" | "success" | "warning" | "error" | "info" | "secondary";

interface Props {
    title: string;
    description?: string;
    right?: React.ReactNode;
    icon?: React.ReactNode;
    tone?: Tone;
    children: React.ReactNode;
}

export default function Section({ title, description, right, icon, tone = "primary", children }: Props) {
    const theme = useTheme();
    const palette = theme.palette[tone];
    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            sx={{
                position: "relative",
                p: { xs: 2, sm: 2.5 },
                borderRadius: "16px",
                border: `1px solid ${alpha(palette.main, 0.25)}`,
                background: theme.palette.background.paper,
                overflow: "hidden",
                transition: "box-shadow 0.2s ease",
                "&:hover": {
                    boxShadow: `0 8px 28px ${alpha(palette.main, 0.1)}`,
                },
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: `linear-gradient(90deg, ${palette.main}, ${alpha(palette.main, 0.3)})`,
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 1,
                    mb: 2,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
                    {icon && (
                        <Box
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: "10px",
                                background: alpha(palette.main, isDark ? 0.24 : 0.14),
                                color: palette.main,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            {icon}
                        </Box>
                    )}
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 800, color: "text.primary", lineHeight: 1.2 }}>
                            {title}
                        </Typography>
                        {description && (
                            <Typography sx={{ fontSize: "12px", color: "text.secondary", mt: "2px" }}>
                                {description}
                            </Typography>
                        )}
                    </Box>
                </Box>
                {right && <Box>{right}</Box>}
            </Box>
            {children}
        </Box>
    );
}
