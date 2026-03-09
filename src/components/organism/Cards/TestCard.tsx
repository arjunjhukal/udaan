import { ChevronRight } from '@mui/icons-material';
import { Box, Button, Divider, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../../routes/PATH';
import type { TestProps } from '../../../types/question';
import { formatDateCustom } from '../../../utils/dateFormat';

export default function TestCard({ test, showActions = true }: { test: TestProps, showActions?: boolean }) {
    const theme = useTheme();
    const navigate = useNavigate();
    return (
        <Box className="test__card rounded-md p-3 flex flex-col justify-between" sx={{
            border: `1px solid ${theme.palette.separator.dark}`
        }}>
            <div className="test__card__top flex justify-start itesm-center gap-3">
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
                <Box className="">
                    <Typography variant='subtitle1' fontWeight={500} color='text.dark' className='capitalize mb-1!'>{test?.name}</Typography>
                    <div className="flex items-center flex-wrap gap-2">
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
                                <Divider orientation='vertical' sx={{
                                    height: 16
                                }} />
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
                            <Divider orientation='vertical' sx={{
                                height: 16
                            }} />

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
                        {test?.created_at ? <>
                            <Divider orientation='vertical' sx={{
                                height: 16
                            }} />

                            <Typography className="flex items-center gap-2" variant='caption' color='text.middle'>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.66406 3.35352C4.4249 3.35352 4.22656 3.15518 4.22656 2.91602V1.16602C4.22656 0.926849 4.4249 0.728516 4.66406 0.728516C4.90323 0.728516 5.10156 0.926849 5.10156 1.16602V2.91602C5.10156 3.15518 4.90323 3.35352 4.66406 3.35352Z" fill="#111827" />
                                    <path d="M9.33594 3.35352C9.09677 3.35352 8.89844 3.15518 8.89844 2.91602V1.16602C8.89844 0.926849 9.09677 0.728516 9.33594 0.728516C9.5751 0.728516 9.77344 0.926849 9.77344 1.16602V2.91602C9.77344 3.15518 9.5751 3.35352 9.33594 3.35352Z" fill="#111827" />
                                    <path d="M11.9557 5.74023L2.03906 5.74023C1.7999 5.74023 1.60156 5.5419 1.60156 5.30273C1.60156 5.06357 1.7999 4.86523 2.03906 4.86523L11.9557 4.86523C12.1949 4.86523 12.3932 5.06357 12.3932 5.30273C12.3932 5.5419 12.1949 5.74023 11.9557 5.74023Z" fill="#111827" />
                                    <path d="M9.33333 13.2702H4.66667C2.5375 13.2702 1.3125 12.0452 1.3125 9.91602L1.3125 4.95768C1.3125 2.82852 2.5375 1.60352 4.66667 1.60352L9.33333 1.60352C11.4625 1.60352 12.6875 2.82852 12.6875 4.95768V9.91602C12.6875 12.0452 11.4625 13.2702 9.33333 13.2702ZM4.66667 2.47852C2.99833 2.47852 2.1875 3.28935 2.1875 4.95768L2.1875 9.91602C2.1875 11.5843 2.99833 12.3952 4.66667 12.3952H9.33333C11.0017 12.3952 11.8125 11.5843 11.8125 9.91602V4.95768C11.8125 3.28935 11.0017 2.47852 9.33333 2.47852L4.66667 2.47852Z" fill="#111827" />
                                    <path d="M4.95833 8.45769C4.8825 8.45769 4.80666 8.4402 4.73666 8.41103C4.66666 8.38186 4.6025 8.34102 4.54417 8.28852C4.49167 8.23018 4.45083 8.16603 4.42166 8.09603C4.39249 8.02603 4.375 7.95019 4.375 7.87436C4.375 7.72269 4.43917 7.57103 4.54417 7.46019C4.6025 7.40769 4.66666 7.36685 4.73666 7.33768C4.84166 7.29101 4.95834 7.27935 5.07501 7.30268C5.11001 7.30852 5.145 7.32018 5.18 7.33768C5.215 7.34935 5.25 7.36686 5.285 7.3902C5.31417 7.41353 5.34333 7.43686 5.37249 7.46019C5.39583 7.48936 5.42499 7.51852 5.44249 7.54769C5.46583 7.58269 5.48334 7.61769 5.49501 7.65269C5.51251 7.68769 5.52417 7.72268 5.53001 7.75768C5.53584 7.79852 5.54167 7.83352 5.54167 7.87436C5.54167 8.02602 5.47749 8.17768 5.37249 8.28852C5.26166 8.39352 5.11 8.45769 4.95833 8.45769Z" fill="#111827" />
                                    <path d="M6.9974 8.45899C6.84573 8.45899 6.69407 8.39482 6.58323 8.28982C6.5599 8.26065 6.53657 8.23149 6.51324 8.20232C6.4899 8.16732 6.47239 8.13233 6.46072 8.09733C6.44322 8.06233 6.43156 8.02733 6.42572 7.99233C6.41989 7.9515 6.41406 7.91649 6.41406 7.87566C6.41406 7.79983 6.43155 7.72399 6.46072 7.65399C6.48989 7.58399 6.53073 7.51983 6.58323 7.4615C6.74657 7.29816 7.00907 7.24565 7.21907 7.33898C7.2949 7.36815 7.35322 7.409 7.41156 7.4615C7.51656 7.57233 7.58073 7.72399 7.58073 7.87566C7.58073 7.91649 7.5749 7.9515 7.56907 7.99233C7.56324 8.02733 7.55157 8.06233 7.53407 8.09733C7.5224 8.13233 7.50489 8.16732 7.48155 8.20232C7.45822 8.23149 7.43489 8.26065 7.41156 8.28982C7.35322 8.34232 7.2949 8.38317 7.21907 8.41233C7.14907 8.4415 7.07323 8.45899 6.9974 8.45899Z" fill="#111827" />
                                    <path d="M4.95833 10.5C4.8825 10.5 4.80666 10.4825 4.73666 10.4533C4.66666 10.4242 4.6025 10.3833 4.54417 10.3308C4.49167 10.2725 4.45083 10.2142 4.42166 10.1383C4.39249 10.0683 4.375 9.99251 4.375 9.91667C4.375 9.76501 4.43917 9.61335 4.54417 9.50251C4.6025 9.45001 4.66666 9.40917 4.73666 9.38C4.9525 9.28667 5.20916 9.33918 5.37249 9.50251C5.39583 9.53168 5.42499 9.56084 5.44249 9.59001C5.46583 9.62501 5.48334 9.66 5.49501 9.695C5.51251 9.73 5.52417 9.76501 5.53001 9.80584C5.53584 9.84084 5.54167 9.88167 5.54167 9.91667C5.54167 10.0683 5.47749 10.22 5.37249 10.3308C5.26166 10.4358 5.11 10.5 4.95833 10.5Z" fill="#111827" />
                                </svg>

                                {formatDateCustom(test?.created_at || "")}
                            </Typography>
                        </> : ""}
                    </div>
                </Box>
            </div>
            {showActions ? <div className="bottom__wrapper">
                <Divider className='my-3!' />

                <div className="flex items-center justify-between w-full">
                    {test.no_of_students ? <Typography variant='caption' color='text.dark'>{test.no_of_students} Students Enrolled</Typography> : <Typography variant='caption' color='text.dark'>Created on {formatDateCustom(test?.created_at || "")}</Typography>}
                    <Button variant='text' color='primary' className='text-[12px]!' endIcon={<ChevronRight />} onClick={() => navigate(PATH.TEST_QUESTION_MANAGEMENT.TEST.VIEW_TEST.ROOT(Number(test?.id)))}>View More</Button>
                </div>
            </div> : ""}
        </Box>
    )
}
