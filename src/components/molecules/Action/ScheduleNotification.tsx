import { Send } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import type { NotificationPayload } from '../../../types/notification'
import { formatDateCustom } from '../../../utils/dateFormat'
import { formatTimeAMPM } from '../../../utils/getTimeDifference'

export default function ScheduleNotification({ data }: { data: NotificationPayload }) {

    if (data?.scheduled_date) {
        return <Typography>{formatDateCustom(data?.scheduled_date, { shortMonth: true })}, {data?.scheduled_time ? formatTimeAMPM(data?.scheduled_time || "") : ""}</Typography>
    }
    return (
        <Button startIcon={<Send />} color='primary' variant='contained' fullWidth className='justify-center!'>Send</Button>
    )
}
