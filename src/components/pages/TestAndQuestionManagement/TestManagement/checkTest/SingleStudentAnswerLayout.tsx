import { Box, Divider, Typography } from '@mui/material';
import { Outlet, useParams } from 'react-router-dom';
import { useGetSingleStudentResultQuery } from '../../../../../services/questionApi';
import { msToHMS } from '../../../../../utils/parseDateTime';

export default function SingleStudentAnswerLayout() {
    const { id, resultId } = useParams();
    const { data, isLoading } = useGetSingleStudentResultQuery({ id: Number(id), resultId: Number(resultId) }, { skip: !id || !resultId });
    const { hours, minutes, seconds } = msToHMS(data?.data?.timer || 0);
    const overviewListing = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.7095 15.3914L16.3345 15.7164C16.0262 15.7914 15.7845 16.0248 15.7178 16.3331L15.4262 17.5581C15.2678 18.2248 14.4178 18.4331 13.9762 17.9081L11.4845 15.0414C11.2845 14.8081 11.3928 14.4414 11.6928 14.3664C13.1678 14.0081 14.4928 13.1831 15.4678 12.0081C15.6262 11.8164 15.9095 11.7914 16.0845 11.9664L17.9345 13.8164C18.5678 14.4498 18.3428 15.2414 17.7095 15.3914Z" fill="#F59F0A" />
                <path d="M2.24867 15.3914L3.62367 15.7164C3.932 15.7914 4.17367 16.0248 4.24034 16.3331L4.532 17.5581C4.69034 18.2248 5.54034 18.4331 5.982 17.9081L8.47367 15.0414C8.67367 14.8081 8.56534 14.4414 8.26534 14.3664C6.79034 14.0081 5.46534 13.1831 4.49034 12.0081C4.332 11.8164 4.04867 11.7914 3.87367 11.9664L2.02367 13.8164C1.39034 14.4498 1.61534 15.2414 2.24867 15.3914Z" fill="#F59F0A" />
                <path d="M9.99935 1.66699C6.77435 1.66699 4.16602 4.27533 4.16602 7.50033C4.16602 8.70866 4.52435 9.81699 5.14102 10.742C6.04102 12.0753 7.46602 13.017 9.12435 13.2587C9.40768 13.3087 9.69935 13.3337 9.99935 13.3337C10.2993 13.3337 10.591 13.3087 10.8743 13.2587C12.5327 13.017 13.9577 12.0753 14.8577 10.742C15.4743 9.81699 15.8327 8.70866 15.8327 7.50033C15.8327 4.27533 13.2243 1.66699 9.99935 1.66699ZM12.5493 7.31699L11.8577 8.00866C11.741 8.12533 11.6743 8.35033 11.716 8.51699L11.916 9.37533C12.0743 10.0503 11.716 10.317 11.116 9.95866L10.2827 9.46699C10.1327 9.37533 9.88268 9.37533 9.73268 9.46699L8.89935 9.95866C8.29935 10.3087 7.94102 10.0503 8.09935 9.37533L8.29935 8.51699C8.33268 8.35866 8.27435 8.12533 8.15768 8.00866L7.44935 7.31699C7.04102 6.90866 7.17435 6.50033 7.74102 6.40866L8.63268 6.25866C8.78268 6.23366 8.95768 6.10033 9.02435 5.96699L9.51602 4.98366C9.78268 4.45033 10.216 4.45033 10.4827 4.98366L10.9743 5.96699C11.041 6.10033 11.216 6.23366 11.3743 6.25866L12.266 6.40866C12.8243 6.50033 12.9577 6.90866 12.5493 7.31699Z" fill="#F59F0A" />
            </svg>, title: "Total Marks", value: `${(data?.data?.score || 0) * 100}%`
        },
        { title: "Answered", value: data?.data?.total_attempted },
        { title: "Submitted Time", value: data?.data?.finished_at },
        { title: "Started Time", value: data?.data?.started_at },
        { title: "Time Taken", value: `${hours}h ${minutes}m ${seconds}s` },
        { title: "Status", value: data?.data?.status },
    ]

    return (
        <div className="single__user__test__result__roto">
            <div className="2xl:flex justify-between items-end">
                <div className="user__info__wrapper flex justify-start items-center gap-2 mb-4">
                    <Box className="user__avatar flex items-center justify-center w-16 h-16 rounded-full" sx={{
                        background: (theme) => theme.palette.separator.dark
                    }}>
                        <Typography className="text-2xl" color='text.middle'> {data?.data?.student?.name ? data?.data?.student?.name.charAt(0).toUpperCase() : ""}</Typography>
                    </Box>
                    <Box className="flex flex-col gap-1">
                        <Typography variant="subtitle1">{data?.data?.student?.name}</Typography>
                        <Typography variant="subtitle2" color="text.middle">{data?.data?.student?.email}</Typography>
                        <Typography variant="subtitle2" color="text.middle">{data?.data?.student?.phone ? data?.data?.student?.phone : ""}</Typography>
                    </Box>
                </div>
                <div className='flex justify-start items-center gap-6 lg:gap-8 2xl:gap-14 flex-wrap'>
                    {overviewListing.map((overview) => (
                        <div className="card" key={overview.title}>
                            <Typography variant='subtitle2' color='text.middle' className='mb-1!'>{overview.title}</Typography>
                            <Typography variant='subtitle2' className='flex items-center gap-1 justify-start'>{overview?.icon}{overview.value || "N/A"}</Typography>
                        </div>
                    ))}
                </div>
            </div>
            <Divider className='mt-4! mb-6!' />
            <Outlet />
        </div>
    )
}
