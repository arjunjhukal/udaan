import { Box, Divider, Typography } from "@mui/material";
import { Book, Money, Note, Profile2User } from "iconsax-reactjs";
import type { Analytics } from "../../../../types/dashboard";

export default function DashboardAnalyticsCard({ data }: { data: Analytics }) {
    const getIconsBasedOnType = (type: "success" | "error" | "info" | "warning") => {
        switch (type) {
            case "info":
                return <Book variant="Bold" />
            case "error":
                return <Profile2User variant="Bold" />
            case "warning":
                return <Note variant="Bold" />
            case "success":
                return <Money variant="Bold" />
            default:
                return <Money variant="Bold" />
        }
    }
    return (
        <Box
            className="dashboard__analytics__card relative rounded-xl lg:py-4 lg:px-6 px-3 py-2 backdrop-blur-2xl h-full"
            sx={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: `
      0 4px 30px rgba(0,0,0,0.1),
      inset 0 1px 0 rgba(255,255,255,0.4)
    `,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    padding: "1px",
                    borderRadius: "inherit",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.05))",
                    WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    pointerEvents: "none",
                },
            }}
        >
            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                <Box className="w-8 h-8 flex items-center justify-center rounded-md" sx={{
                    background: (theme) => theme.palette.primary.contrastText,
                    color: (theme) => theme.palette[data.type].main,
                }}>
                    {getIconsBasedOnType(data?.type)}
                </Box>
                <Typography variant="h6">{data?.title}</Typography>
            </div>
            <Divider className='my-4!' sx={{
                background: "rgba(255,255,255,0.3)"
            }} />
            <Typography variant="subtitle1">{data?.description}</Typography>
            <Typography variant="h3" fontWeight={600}>{data?.value}</Typography>
        </Box>
    )
}
