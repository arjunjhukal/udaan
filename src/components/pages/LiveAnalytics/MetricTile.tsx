import { Box, LinearProgress, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

type Tone = "primary" | "success" | "warning" | "error" | "info" | "secondary";

interface Props {
    label: string;
    value: React.ReactNode;
    sub?: React.ReactNode;
    percent?: number | null;
    tone?: Tone;
    icon?: React.ReactNode;
    accent?: boolean;
}

const toneFor = (percent: number | undefined | null, explicit?: Tone): Tone => {
    if (explicit) return explicit;
    if (percent == null) return "primary";
    if (percent >= 85) return "error";
    if (percent >= 65) return "warning";
    return "success";
};

export default function MetricTile({ label, value, sub, percent, tone, icon, accent = false }: Props) {
    const theme = useTheme();
    const resolvedTone = toneFor(percent, tone);
    const palette = theme.palette[resolvedTone];
    const isDark = theme.palette.mode === "dark";

    const accentBg = accent
        ? `linear-gradient(135deg, ${alpha(palette.main, isDark ? 0.22 : 0.12)} 0%, ${alpha(palette.main, isDark ? 0.08 : 0.04)} 100%)`
        : theme.palette.background.paper;

    return (
        <Box
            sx={{
                position: "relative",
                p: 1.5,
                pl: accent ? 1.8 : 1.5,
                borderRadius: 2,
                border: `1px solid ${alpha(palette.main, accent ? 0.35 : 0.18)}`,
                background: accentBg,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                minWidth: 0,
                overflow: "hidden",
                transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 10px 24px ${alpha(palette.main, 0.18)}`,
                    borderColor: alpha(palette.main, 0.55),
                },
                "&::before": accent ? {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    left: 0,
                    width: "3px",
                    background: palette.main,
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "8px",
                } : undefined,
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                <Typography
                    sx={{
                        fontSize: "11px",
                        color: alpha(palette.main, isDark ? 0.9 : 0.75),
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        lineHeight: 1.2,
                    }}
                >
                    {label}
                </Typography>
                {icon && (
                    <Box
                        sx={{
                            width: 26,
                            height: 26,
                            borderRadius: "8px",
                            background: alpha(palette.main, 0.18),
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
            </Box>

            <Typography
                sx={{
                    fontSize: { xs: "20px", sm: "22px" },
                    fontWeight: 800,
                    color: accent ? palette.main : "text.primary",
                    lineHeight: 1.15,
                    wordBreak: "break-word",
                    letterSpacing: "-0.01em",
                }}
            >
                {value}
            </Typography>

            {sub != null && (
                <Typography sx={{ fontSize: "11px", color: "text.secondary", lineHeight: 1.3 }}>
                    {sub}
                </Typography>
            )}

            {typeof percent === "number" && (
                <LinearProgress
                    variant="determinate"
                    value={Math.min(100, Math.max(0, percent))}
                    sx={{
                        mt: 0.75,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: alpha(palette.main, 0.18),
                        "& .MuiLinearProgress-bar": {
                            background: `linear-gradient(90deg, ${palette.main}, ${alpha(palette.main, 0.7)})`,
                            borderRadius: 3,
                        },
                    }}
                />
            )}
        </Box>
    );
}
