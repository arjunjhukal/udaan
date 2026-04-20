import { Box, LinearProgress, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { useGetRoleDistributionQuery } from "../../../../services/userApi";
import type { RoleDistributionItem } from "../../../../types/userAnalytics";

export default function RoleDistributionChart() {
    const theme = useTheme();
    const { data, isLoading } = useGetRoleDistributionQuery();

    const roles = (data?.data ?? []).filter((r) => r.value > 0);

    const getColor = (type: RoleDistributionItem["type"]) => {
        switch (type) {
            case "success":
                return theme.palette.success.main;
            case "error":
                return theme.palette.error.main;
            case "warning":
                return theme.palette.warning.main;
            default:
                return theme.palette.primary.main;
        }
    };

    return (
        <Box
            sx={{
                borderRadius: 3,
                p: 2.5,
                border: (t) => `1px solid ${t.palette.divider}`,
                minWidth: 0,
            }}
        >
            <Typography variant="h6" fontWeight={700} mb={2.5}>
                Role Distribution
            </Typography>

            {isLoading ? (
                <Stack gap={2.5} flexDirection={"column"}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Box key={i}>
                            <Stack direction="row" justifyContent="space-between" mb={0.75}>
                                <Skeleton width={80} height={20} />
                                <Skeleton width={36} height={20} />
                            </Stack>
                            <Skeleton variant="rounded" height={8} animation="wave" />
                        </Box>
                    ))}
                </Stack>
            ) : (
                <Stack gap={2.5} flexDirection={"column"} sx={{ overflowY: "auto", flexGrow: 1 }}>
                    {roles.map((role) => (
                        <Box key={role.title} sx={{ minWidth: 0 }}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                gap={1}
                                mb={0.75}
                            >
                                <Typography
                                    variant="body2"
                                    fontWeight={500}
                                    sx={{
                                        textTransform: "capitalize",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        minWidth: 0,
                                        flex: 1,
                                    }}
                                    title={role.title}
                                >
                                    {role.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    fontWeight={700}
                                    sx={{ flexShrink: 0, minWidth: 40, textAlign: "right" }}
                                >
                                    {role.percentage}%
                                </Typography>
                            </Stack>
                            <LinearProgress
                                variant="determinate"
                                value={Math.min(role.percentage, 100)}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: "action.hover",
                                    "& .MuiLinearProgress-bar": {
                                        bgcolor: getColor(role.type),
                                        borderRadius: 4,
                                    },
                                }}
                            />
                        </Box>
                    ))}

                    {roles.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                            No role data available
                        </Typography>
                    )}
                </Stack>
            )}
        </Box>
    );
}
