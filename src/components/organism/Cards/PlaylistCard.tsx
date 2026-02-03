import { Box } from "@mui/material";

export default function PlaylistCard() {
    return (
        <div className="playlist__card relative pt-4">
            <Box className="list__1 absolute " sx={{
                background: (theme) => theme.palette.separator.dark
            }}></Box>
            <Box className="list__2 absolute " sx={{
                background: (theme) => theme.palette.separator.darker
            }}></Box>
        </div>
    )
}
