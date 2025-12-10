import { Send } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import { useSendNotificationMutation } from '../../../services/notificationApi'
import { showToast } from '../../../slice/toastSlice'
import { useAppDispatch } from '../../../store/hook'
import type { NotificationPayload } from '../../../types/notification'
import { formatDateCustom } from '../../../utils/dateFormat'
import { formatTimeAMPM } from '../../../utils/getTimeDifference'

export default function ScheduleNotification({ data }: { data: NotificationPayload }) {
    const dispatch = useAppDispatch();
    const [sendNotification, { isLoading }] = useSendNotificationMutation();

    if (data?.scheduled_date) {
        return <Typography>{formatDateCustom(data?.scheduled_date, { shortMonth: true })}, {data?.scheduled_time ? formatTimeAMPM(data?.scheduled_time || "") : ""}</Typography>
    }
    return (
        <Button startIcon={<Send />} color='primary' variant='contained' fullWidth className='justify-center!'
            onClick={async () => {
                try {
                    const response = await sendNotification({ id: Number(data.id) }).unwrap();
                    dispatch(
                        showToast({
                            message: response?.message || "Notification send successfully",
                            severity: "success"
                        })
                    )
                }
                catch (e: any) {
                    dispatch(
                        showToast({
                            message: e?.data?.message || "Unable to send Notification",
                            severity: "success"
                        })
                    )
                }
            }}
        >{isLoading ? "Sending" : "Send"}</Button>
    )
}
