import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    LinearProgress,
    Skeleton,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { Book, Book1, Mobile, Monitor, VideoCircle } from "iconsax-reactjs";
import { useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../../../routes/PATH";
import { useGetUserLoginHistoryQuery, useGetUserProfileQuery, useGetUserRecentActivitiesQuery } from "../../../../../services/userApi";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>
                {label}
            </Typography>
            <Typography variant="body2" fontWeight={400} textAlign="right" sx={{ maxWidth: 200, wordBreak: "break-word" }}>
                {value ?? "—"}
            </Typography>
        </Box>
    );
}

function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: { label: string; onClick: () => void } }) {
    return (
        <Box sx={{ border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 3, p: 2.5, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Typography variant="h4" fontWeight={500}>{title}</Typography>
                {action && (
                    <Button size="small" variant="contained" onClick={action.onClick} >
                        {action.label}
                    </Button>
                )}
            </Stack>
            <Divider sx={{ mb: 1.5 }} />
            {children}
        </Box>
    );
}

const TYPE_COLORS: Record<string, "success" | "error" | "info" | "warning"> = {
    success: "success",
    error: "error",
    info: "info",
    warning: "warning",
};

function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return "—";
    return dayjs(dateStr).format("D MMM YYYY, h:mm A");
}

function formatDateShort(dateStr: string | null | undefined) {
    if (!dateStr) return "—";
    return dayjs(dateStr).format("D MMM YYYY");
}

export default function ProfileTab() {
    const { id } = useParams<{ id: string }>();
    const theme = useTheme();
    const navigate = useNavigate();
    const uid = Number(id);

    const { data: profileData, isLoading: profileLoading } = useGetUserProfileQuery({ id: uid }, { skip: !uid });
    const { data: loginData, isLoading: loginLoading } = useGetUserLoginHistoryQuery({ id: uid, pageSize: 5 }, { skip: !uid });
    const { data: activityData, isLoading: activityLoading } = useGetUserRecentActivitiesQuery({ id: uid, pageSize: 5 }, { skip: !uid });

    const profile = profileData?.data;
    const loginItems = loginData?.data?.data ?? [];
    const activityItems = activityData?.data?.data ?? [];

    const groupedActivities = activityItems.reduce<Record<string, typeof activityItems>>((acc, item) => {
        const date = dayjs(item.created_at);
        const today = dayjs().startOf("day");
        const yesterday = today.subtract(1, "day");
        let label: string;
        if (date.isAfter(today)) label = "Today";
        else if (date.isAfter(yesterday)) label = "Yesterday";
        else label = date.format("D MMM YYYY");
        (acc[label] ??= []).push(item);
        return acc;
    }, {});

    const ACTIVITY_ICON_CONFIG = [
        { Icon: Book1, colorKey: "primary" as const },
        { Icon: VideoCircle, colorKey: "error" as const },
        { Icon: Book, colorKey: "warning" as const },
        { Icon: Monitor, colorKey: "success" as const },
    ];

    if (profileLoading) {
        return (
            <Box display="flex" justifyContent="center" py={6}>
                <CircularProgress size={28} />
            </Box>
        );
    }

    if (!profile) return null;

    const { personal_info: pi, account_info: ai, achievements, course_progresses } = profile;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 4 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", xl: "1fr 1fr 1fr" }, gap: 2 }}>
                <SectionCard title="Personal Information">
                    <InfoRow label="Full Name" value={pi.full_name} />
                    <Divider />
                    <InfoRow label="Email" value={pi.email} />
                    <Divider />
                    <InfoRow label="Contact No." value={pi.phone} />
                    <Divider />
                    <InfoRow label="Address" value={pi.address} />
                    <Divider />
                    <InfoRow
                        label="Status"

                        value={
                            <Chip
                                size="small"
                                label={pi.is_active ? "Active" : "Suspended"}
                                sx={{
                                    bgcolor: pi.is_active ? theme.palette.success.light : theme.palette.error.light,
                                    color: pi.is_active ? theme.palette.success.main : theme.palette.error.main,
                                    border: `1px solid ${pi.is_active ? theme.palette.success.main : theme.palette.error.main}`,
                                    fontSize: 11,
                                }}
                            />
                        }
                    />
                    <Divider />
                    <InfoRow label="Role" value={<Typography className="capitalize">{pi.role?.name?.replace(/_/g, " ")}</Typography>} />
                </SectionCard>

                <SectionCard title="Account Information">
                    <InfoRow label="User ID" value={ai.user_id} />
                    <Divider />
                    <InfoRow label="Joined Date" value={formatDateShort(ai.joined_at)} />
                    <Divider />
                    <InfoRow label="Last Active" value={ai.last_active ? formatDate(ai.last_active) : "Never"} />
                    <Divider />
                    <InfoRow label="Profile Last Updated" value={formatDateShort(ai.updated_at)} />
                    <Divider />
                    <InfoRow label="Active Sessions" value={`${ai.active_sessions} Device${ai.active_sessions !== 1 ? "s" : ""}`} />
                </SectionCard>

                {/* Achievements & Course Progress */}
                <SectionCard title="Achievements and Badges">
                    {achievements.length > 0 ? (
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                            {achievements.map((ach, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 0.5,
                                        p: 1,
                                        flex: 1,
                                    }}
                                >
                                    <Box sx={{ width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: `${theme.palette[TYPE_COLORS[ach.type] ?? "info"].main}18` }}>
                                        {ach.type === "success" ? <img src="/trophy.png" className="w-8 h-8" alt="" /> : ach.type === "error" ? <img src="/fire.png" className="w-8 h-8" alt="" /> : ach.type === "info" ? <img src="/pc.png" className="w-8 h-8" alt="" /> : <img src="/star.png" className="w-8 h-8" alt="" />}
                                        <Typography fontSize={18}>
                                        </Typography>
                                    </Box>
                                    <Typography variant="subtitle2" textAlign="center" fontWeight={400} lineHeight={1.2}>
                                        {ach.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" textAlign="center" lineHeight={1.2} sx={{ fontSize: 10 }}>
                                        {ach.description}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary" mb={2}>No achievements yet.</Typography>
                    )}

                    {course_progresses.length > 0 && (
                        <>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                                Course Progress
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
                                {course_progresses.map((cp, i) => (
                                    <Box key={i}>
                                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                            <Typography variant="caption" noWrap sx={{ maxWidth: "75%" }}>{cp.title}</Typography>
                                            <Typography variant="caption" >{cp.progress}%</Typography>
                                        </Stack>
                                        <LinearProgress
                                            variant="determinate"
                                            value={cp.progress}
                                            sx={{ height: 6, borderRadius: 3 }}
                                            color={cp.progress >= 80 ? "success" : cp.progress >= 20 ? "info" : "error"}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </>
                    )}
                </SectionCard>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 2 }}>
                <SectionCard title="Login History" action={{ label: "View All", onClick: () => navigate(PATH.USER_MANAGEMENT.VIEW_USER.LOGIN_HISTORY.ROOT(id)) }}>
                    {loginLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={56} sx={{ mb: 1 }} />)
                    ) : loginItems.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">No login history found.</Typography>
                    ) : (
                        <>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                {loginItems.map((item) => {
                                    const isSuccess = item.status === "success";
                                    const statusColor = isSuccess ? theme.palette.success.main : theme.palette.error.main;
                                    const statusBg = isSuccess ? theme.palette.success.light : theme.palette.error.light;
                                    return (
                                        <Box
                                            key={item.id}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.5,
                                                py: 1.5,
                                                borderBottom: `1px solid ${theme.palette.divider}`,
                                                "&:last-child": { borderBottom: "none" },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 1,
                                                    bgcolor: statusBg,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                    color: statusColor,
                                                }}
                                            >
                                                {item.device_type === "web"
                                                    ? <Monitor size={20} />
                                                    : <Mobile size={20} />}
                                            </Box>
                                            <Box flex={1} minWidth={0}>
                                                <Typography variant="body2" fontWeight={500} noWrap>
                                                    {item.browser} · {item.os}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" noWrap>
                                                    {item.location} · {item.ip}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ flexShrink: 0, textAlign: "right" }}>
                                                <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                                                    {dayjs(item.created_at).format("D MMM, h:mm A")}
                                                </Typography>
                                                <Chip
                                                    size="small"
                                                    label={item.status}
                                                    sx={{
                                                        height: 24,
                                                        fontSize: 11,
                                                        fontWeight: 500,
                                                        textTransform: "capitalize",
                                                        borderRadius: 10,
                                                        bgcolor: statusBg,
                                                        color: statusColor,
                                                        border: `1px solid ${statusColor}`,
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </>
                    )}
                </SectionCard>

                {/* Recent Activity */}
                <SectionCard title="Recent Activity" action={{ label: "View All", onClick: () => navigate(PATH.USER_MANAGEMENT.VIEW_USER.ACTIVITY_HISTORY.ROOT(id)) }}>
                    {activityLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={48} sx={{ mb: 1 }} />)
                    ) : activityItems.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">No recent activity found.</Typography>
                    ) : (
                        <>
                            {Object.entries(groupedActivities).map(([label, items]) => (
                                <Box key={label} mb={1}>
                                    <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                                        <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                                            {label}
                                        </Typography>
                                        <Divider sx={{ flex: 1 }} />
                                    </Stack>
                                    <Box sx={{ display: "flex", flexDirection: "column", mt: 0.5 }}>
                                        {items.map((act, idx) => {
                                            const { Icon, colorKey } = ACTIVITY_ICON_CONFIG[idx % ACTIVITY_ICON_CONFIG.length];
                                            const iconColor = theme.palette[colorKey].main;
                                            const iconBg = theme.palette[colorKey].light;
                                            return (
                                                <Box
                                                    key={act.id}
                                                    sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}`, "&:last-child": { borderBottom: "none" } }}
                                                >
                                                    <Box sx={{ width: 44, height: 44, borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: iconBg, color: iconColor, flexShrink: 0 }}>
                                                        <Icon size={20} color={iconColor} />
                                                    </Box>
                                                    <Box flex={1} minWidth={0}>
                                                        <Typography variant="body2" fontWeight={500} noWrap>{act.title}</Typography>
                                                        <Typography variant="caption" color="text.secondary" noWrap>{act.type}</Typography>
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                                                        {dayjs(act.created_at).format("h:mm A")}
                                                    </Typography>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </Box>
                            ))}
                        </>
                    )}
                </SectionCard>
            </Box>
        </Box>
    );
}
