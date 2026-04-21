import { Box } from "@mui/material";

interface MenuBadgeProps {
    count: number;
}

export default function MenuBadge({ count }: MenuBadgeProps) {
    if (!count) return null;

    return (
        <Box
            component="span"
            sx={{
                ml: "auto",
                minWidth: 20,
                height: 20,
                px: "6px",
                borderRadius: "10px",
                backgroundColor: "primary.main",
                color: "white !important",
                fontSize: "11px",
                fontWeight: 600,
                lineHeight: "20px",
                textAlign: "center",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}
        >
            {count > 99 ? "99+" : count}
        </Box>
    );
}
