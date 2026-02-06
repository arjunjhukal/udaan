import { ChevronRight } from '@mui/icons-material';
import { Box, Button, Divider, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../../routes/PATH';
import type { TestProps } from '../../../types/question';
import { formatDateCustom } from '../../../utils/dateFormat';

export default function TestCard({ test }: { test: TestProps }) {
    const theme = useTheme();
    const navigate = useNavigate();
    return (
        <Box className="test__card rounded-md p-3 h-full flex flex-col justify-between" sx={{
            border: `1px solid ${theme.palette.separator.dark}`
        }}>
            <div className="test__card__top flex gap-3">
                <Box
                    className="min-w-12.5 h-12.5 rounded-md flex justify-center items-center"
                    sx={{
                        background: theme.palette.primary.main
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2V5" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M16 2V5" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M21 8.5V13.63C20.11 12.92 18.98 12.5 17.75 12.5C16.52 12.5 15.37 12.93 14.47 13.66C13.26 14.61 12.5 16.1 12.5 17.75C12.5 18.73 12.78 19.67 13.26 20.45C13.63 21.06 14.11 21.59 14.68 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M7 11H13" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M7 16H9.62" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M23 17.75C23 18.73 22.72 19.67 22.24 20.45C21.96 20.93 21.61 21.35 21.2 21.69C20.28 22.51 19.08 23 17.75 23C16.6 23 15.54 22.63 14.68 22C14.11 21.59 13.63 21.06 13.26 20.45C12.78 19.67 12.5 18.73 12.5 17.75C12.5 16.1 13.26 14.61 14.47 13.66C15.37 12.93 16.52 12.5 17.75 12.5C18.98 12.5 20.11 12.92 21 13.63C22.22 14.59 23 16.08 23 17.75Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M17.75 20.25C17.75 18.87 18.87 17.75 20.25 17.75C18.87 17.75 17.75 16.63 17.75 15.25C17.75 16.63 16.63 17.75 15.25 17.75C16.63 17.75 17.75 18.87 17.75 20.25Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </Box>
                <Box className="flex flex-col gap-2">
                    <Typography variant='subtitle1' fontWeight={500} color='text.dark' className='capitalize'>{test?.name}</Typography>
                    <div className="flex items-center gap-2">
                        {test?.question_ids?.length ?
                            <>
                                <Typography className="flex items-center gap-1" variant='caption' color='text.middle'>
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.8337 9.76466V2.72383C12.8337 2.02383 12.262 1.50466 11.5678 1.563H11.5328C10.3078 1.668 8.44699 2.29216 7.40866 2.9455L7.30949 3.00966C7.14033 3.11466 6.86033 3.11466 6.69116 3.00966L6.54533 2.92216C5.50699 2.27466 3.65199 1.65633 2.42699 1.55716C1.73283 1.49883 1.16699 2.02383 1.16699 2.718L1.16699 9.76466C1.16699 10.3247 1.62199 10.8497 2.18199 10.9197L2.35116 10.943C3.61699 11.1122 5.57116 11.7538 6.69116 12.3663L6.71449 12.378C6.87199 12.4655 7.12283 12.4655 7.27449 12.378C8.39449 11.7597 10.3545 11.1122 11.6262 10.943L11.8187 10.9197C12.3787 10.8497 12.8337 10.3247 12.8337 9.76466Z" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M7 3.20312L7 11.9531" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M4.52051 4.95312H3.20801" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M4.95801 6.70312H3.20801" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    {test?.question_ids?.length} Questions
                                </Typography>
                                <Divider orientation='vertical' />
                            </> : ""}
                        {test?.duration ? <>
                            <Typography className="flex items-center gap-2" variant='caption' color='text.middle'>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.8337 9.76466V2.72383C12.8337 2.02383 12.262 1.50466 11.5678 1.563H11.5328C10.3078 1.668 8.44699 2.29216 7.40866 2.9455L7.30949 3.00966C7.14033 3.11466 6.86033 3.11466 6.69116 3.00966L6.54533 2.92216C5.50699 2.27466 3.65199 1.65633 2.42699 1.55716C1.73283 1.49883 1.16699 2.02383 1.16699 2.718L1.16699 9.76466C1.16699 10.3247 1.62199 10.8497 2.18199 10.9197L2.35116 10.943C3.61699 11.1122 5.57116 11.7538 6.69116 12.3663L6.71449 12.378C6.87199 12.4655 7.12283 12.4655 7.27449 12.378C8.39449 11.7597 10.3545 11.1122 11.6262 10.943L11.8187 10.9197C12.3787 10.8497 12.8337 10.3247 12.8337 9.76466Z" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M7 3.20312L7 11.9531" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M4.52051 4.95312H3.20801" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M4.95801 6.70312H3.20801" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                {test?.duration?.hours} Hrs {test?.duration?.minutes} Mins
                            </Typography>
                        </> : ""}
                        {test?.test_type ? <>
                            <Divider orientation='vertical' />

                            <Typography className="flex items-center gap-2" variant='caption' color='text.middle'>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.8337 9.76466V2.72383C12.8337 2.02383 12.262 1.50466 11.5678 1.563H11.5328C10.3078 1.668 8.44699 2.29216 7.40866 2.9455L7.30949 3.00966C7.14033 3.11466 6.86033 3.11466 6.69116 3.00966L6.54533 2.92216C5.50699 2.27466 3.65199 1.65633 2.42699 1.55716C1.73283 1.49883 1.16699 2.02383 1.16699 2.718L1.16699 9.76466C1.16699 10.3247 1.62199 10.8497 2.18199 10.9197L2.35116 10.943C3.61699 11.1122 5.57116 11.7538 6.69116 12.3663L6.71449 12.378C6.87199 12.4655 7.12283 12.4655 7.27449 12.378C8.39449 11.7597 10.3545 11.1122 11.6262 10.943L11.8187 10.9197C12.3787 10.8497 12.8337 10.3247 12.8337 9.76466Z" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M7 3.20312L7 11.9531" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M4.52051 4.95312H3.20801" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M4.95801 6.70312H3.20801" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                {test?.test_type}
                            </Typography>
                        </> : ""}
                    </div>
                </Box>
            </div>
            <div className="bottom__wrapper">
                <Divider className='my-3!' />

                <div className="flex items-center justify-between w-full">
                    {test.no_of_students ? <Typography variant='caption' color='text.dark'>{test.no_of_students} Students Enrolled</Typography> : <Typography variant='caption' color='text.dark'>Created on {formatDateCustom(test?.created_at || "")}</Typography>}
                    <Button variant='text' color='primary' className='text-[12px]!' endIcon={<ChevronRight />} onClick={() => navigate(PATH.TEST_QUESTION_MANAGEMENT.TEST.VIEW_TEST.ROOT(Number(test?.id)))}>View More</Button>
                </div>
            </div>
        </Box>
    )
}
