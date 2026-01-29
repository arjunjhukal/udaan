import { Box, Typography } from '@mui/material'
import type { StatusVariant } from '../../utils/statusMap'

export default function StatusPill({ status, variant }: { variant: StatusVariant, status: string }) {
    return (
        <Box className="p-1 rounded-full"
            sx={{
                color: (theme) => theme.palette[variant].main,
                background: (theme) => theme.palette[variant].light,
            }}
        >
            <Typography variant='subtitle2' className='text-center'>{status}</Typography>
        </Box>
    )
}
