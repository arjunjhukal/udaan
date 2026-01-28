import { Box, Typography } from "@mui/material";

interface Props {
    icon: React.ReactElement;
    title: string;
    description: string;
    value: string;
    type?: "success" | "error" | "warning" | "info"
}
export default function AnalyticsCard({ icon, title, description, value, type }: Props) {
    return (
        <Box className="analytics-card p-4 rounded-lg flex justify-between items-center h-full" sx={{
            bgcolor: (theme) => theme.palette.primary.contrastText,
        }}>
            <div className="content__wrapper">
                <Typography variant="h6" color="text.middle" fontWeight={400}>{title}</Typography>
                <Typography variant="h4" fontWeight={600} className="mt-5.5!">{value}</Typography>
                <Typography variant="subtitle2" color="text.middle">{description}</Typography>
            </div>

            <Box className="min-w-16 min-h-16 aspect-square rounded-lg flex items-center justify-center" sx={{
                bgcolor: (theme) => type ? theme.palette[type].light : theme.palette.warning.light
            }}>
                {icon}
            </Box>
        </Box>
    )
}
