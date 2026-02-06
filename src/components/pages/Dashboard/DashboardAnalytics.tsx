import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGetAnalyticsQuery } from '../../../services/dashboardApi';
import { useAppSelector } from '../../../store/hook';
import { formatDateCustom } from '../../../utils/dateFormat';
import { getGreetingKey } from '../../../utils/greeting';
import DashboardAnalyticsCard from '../../organism/Cards/DashboardAnalyticsCard';
import DashboardAnalyticsLoading from '../../organism/Cards/DashboardAnalyticsCard/Loading';

export default function DashboardAnalytics() {
    const user = useAppSelector((state) => state.auth.user);
    const { t } = useTranslation();
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const { data: analytics, isLoading } = useGetAnalyticsQuery();

    return (
        <Box className="dashboard__analytics rounded-lg p-4 pb-8 lg:p-8 2xl:p-12 mb-6 lg:mb-8" sx={{
            background: (theme) => theme.palette.primary.hover,
            color: (theme) => theme.palette.primary.contrastText
        }}>
            <div className="flex justify-between flex-wrap">
                <div className="user_message">
                    <Typography
                        className="w-full"
                        variant="h3"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            lineHeight: 1.25,
                            fontWeight: 600
                        }}
                    >
                        <span>
                            {t(getGreetingKey())},{" "}
                            <Box component="span" >
                                {user?.name}
                            </Box>
                            👋
                        </span>
                    </Typography>
                </div>
                <div className="date__today lg:text-right">
                    <Typography variant='h5' fontWeight={500}> {formatDateCustom(new Date(), { shortMonth: true })}</Typography>
                    <Typography variant='subtitle1'> {days[new Date().getDay()]}</Typography>
                </div>
            </div>
            <Divider className='my-4! lg:mt-4! lg:mb-8!' sx={{
                background: "rgba(255,255,255,0.3)"
            }} />

            <div className="gap-4 grid grid-cols-2 2xl:grid-cols-4 2xl:gap-8">
                {isLoading ? Array.from({ length: 4 }).map((_, index) => <DashboardAnalyticsLoading key={index + "Analytics"} />) : analytics?.data?.map((item) => (
                    <div className="col-span-1">
                        <DashboardAnalyticsCard data={item} key={item.description + item.value} />
                    </div>
                ))}
            </div>
        </Box>
    )
}
