import { AccessTime } from '@mui/icons-material';
import { Box, Button, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import type { LiveClassPayload } from '../../../types/liveClass';

import { useGetStatusStyle } from '../../../utils/getStyleBasedOnStatus';
import { getTimeDifference } from '../../../utils/getTimeDifference';

dayjs.extend(durationPlugin);
export const getUpcomingTimeText = (startTime: string | Date): string => {
    const now = dayjs();
    const start = dayjs(startTime);
    const diff = start.diff(now);

    if (diff <= 0) return "Starting soon";

    const duration = dayjs.duration(diff);
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();

    // More than 1 day
    if (days > 0) {
        if (days === 1 && hours > 0) {
            return `In ${days} day ${hours}h`;
        }
        return `In ${days} day${days > 1 ? 's' : ''}`;
    }

    // Less than a day but more than 1 hour
    if (hours > 0) {
        if (minutes > 0 && hours < 5) {
            return `In ${hours}h ${minutes}m`;
        }
        return `In ${hours} hour${hours > 1 ? 's' : ''}`;
    }

    // Less than an hour
    if (minutes > 0) {
        return `In ${minutes} min${minutes > 1 ? 's' : ''}`;
    }

    return "Starting soon";
};
export default function LiveClassCard({ liveClass }: { liveClass: LiveClassPayload }) {
    const theme = useTheme();
    const getStatusStyle = useGetStatusStyle();

    return (
        <Box sx={{
            border: `1px solid ${theme.palette.separator.dark}`
        }} className="rounded-md p-4 flex flex-col gap-3">
            <div className="live__class__card__title flex justify-between items-start">
                <div className="class__title__wrapper flex items-center gap-4">
                    <Box className="min-w-12 h-12 aspect-square rounded-full flex justify-center items-center" sx={{
                        background: theme.palette.gray.gray1
                    }}>
                        <svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.137 11.75V2.75C18.137 2.21957 17.9263 1.71086 17.5512 1.33579C17.1761 0.960714 16.6674 0.75 16.137 0.75H4.13698C3.60655 0.75 3.09784 0.960714 2.72277 1.33579C2.3477 1.71086 2.13698 2.21957 2.13698 2.75V11.75M18.137 11.75H2.13698M18.137 11.75L19.417 14.3C19.4941 14.453 19.5306 14.6232 19.523 14.7944C19.5154 14.9655 19.464 15.1318 19.3736 15.2774C19.2833 15.4229 19.157 15.5428 19.007 15.6256C18.857 15.7084 18.6883 15.7512 18.517 15.75H1.75698C1.58567 15.7512 1.41693 15.7084 1.26693 15.6256C1.11693 15.5428 0.990705 15.4229 0.90036 15.2774C0.810015 15.1318 0.758579 14.9655 0.750983 14.7944C0.743388 14.6232 0.779888 14.453 0.856984 14.3L2.13698 11.75" stroke="#111827" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </Box>
                    <Box>
                        {/* <Tooltip title={liveClass.name}> */}
                        <Typography variant='subtitle2' color='text.dark' className='line-clamp-2 font-medium'>{liveClass.name}</Typography>
                        {/* </Tooltip> */}
                        <Typography variant='caption' color='text.middle' className='line-clamp-2'>{liveClass?.teachers?.map((item) => item.name).join(",")}</Typography>
                    </Box>
                </div>
                {liveClass.status && (
                    <Typography
                        variant='caption'
                        className={`status py-0.5 px-2 rounded-md text-nowrap capitalize `}
                        sx={{
                            ...getStatusStyle(liveClass.status),
                        }}
                    >
                        {liveClass.status}
                    </Typography>
                )}
            </div>
            <div className="flex justify-between items-center">
                {liveClass.start_time && liveClass.end_time ? <div className="feature flex gap-1 items-center">
                    <AccessTime />
                    <Typography variant='subtitle2' color='text.middle'>  {getTimeDifference(liveClass.start_time, liveClass.end_time)}</Typography>
                </div> : ""}
                {liveClass.active_students && liveClass?.active_students > 0 ? <div className="feature flex gap-1 items-center">
                    <Box sx={{
                        background: theme.palette.success.main,
                        minWidth: "8px",
                        height: "8px",
                        borderRadius: "50%"
                    }}></Box>
                    <Typography variant='subtitle2' color='text.middle'>{liveClass.active_students} students active</Typography>
                </div> : ""}
            </div>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={liveClass.status === "ended"}
                onClick={() => {
                    if (liveClass.status !== "ended" && liveClass?.start_url) {
                        window.open(liveClass.start_url, '_blank', 'noopener,noreferrer');
                    }
                }}
                startIcon={(
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 8L16 12L22 16V8Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 6H4C2.89543 6 2 6.89543 2 8V16C2 17.1046 2.89543 18 4 18H14C15.1046 18 16 17.1046 16 16V8C16 6.89543 15.1046 6 14 6Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            >
                <Typography variant='subtitle1'>Start Class</Typography>
            </Button>
        </Box>
    )
}
