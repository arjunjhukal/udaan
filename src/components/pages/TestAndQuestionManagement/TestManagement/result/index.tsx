import { Divider, Typography } from "@mui/material";
import { ArrowRight2, UserSquare } from "iconsax-reactjs";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../../../routes/PATH";
import { useGetTestByIdQuery } from "../../../../../services/questionApi";
import { formatDate } from "../../../../../utils/dateFormat";

export default function ResultRoot() {
    const { id, resultId } = useParams();
    const { data } = useGetTestByIdQuery({ id: Number(id) }, { skip: !id });
    const navigate = useNavigate();
    return (
        <div className="result__layout">
            {resultId ? <div className="breadcrumb flex items-center gap-1.5 mb-4">
                <Typography variant="subtitle2" onClick={() => navigate(PATH.TEST_QUESTION_MANAGEMENT.TEST.VIEW_TEST.ROOT(Number(id)))} className="flex items-center gap-1 cursor-pointer" color="text.middle"><UserSquare /> Student Results</Typography>
                <Typography variant="subtitle2" color="text.middle"><ArrowRight2 size={16} /></Typography>
                <Typography variant="subtitle2" onClick={() => navigate(PATH.TEST_QUESTION_MANAGEMENT.TEST.VIEW_TEST.ROOT(Number(id)))} className="flex items-center gap-1 cursor-pointer" color="text.middle"><UserSquare />{data?.data?.name}</Typography>
                <Typography variant="subtitle2" color="text.middle"><ArrowRight2 size={16} /></Typography>
                <Typography variant="subtitle2" className="flex items-center gap-1" color="text.middle"><UserSquare />Results</Typography>
            </div> : ""}
            <div className="page__header flex items-center justify-start gap-3 mb-4">
                <Typography variant="h3">{data?.data?.name}</Typography>
                <Typography variant="subtitle2" className="capitalize py-1 px-2.5 rounded-md" sx={{
                    background: (theme) => theme.palette.separator.dark,
                }}>{data?.data?.test_type}</Typography>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                {data?.data?.question_ids?.length ?
                    <>
                        <Typography className="flex items-center gap-1" variant='subtitle1' color='text.middle'>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.6673 11.1605V3.11378C14.6673 2.31378 14.014 1.72045 13.2207 1.78712H13.1807C11.7807 1.90712 9.65398 2.62045 8.46732 3.36712L8.35398 3.44045C8.16065 3.56045 7.84065 3.56045 7.64732 3.44045L7.48065 3.34045C6.29398 2.60045 4.17398 1.89378 2.77398 1.78045C1.98065 1.71378 1.33398 2.31378 1.33398 3.10712L1.33398 11.1605C1.33398 11.8005 1.85398 12.4005 2.49398 12.4805L2.68732 12.5071C4.13398 12.7005 6.36732 13.4338 7.64732 14.1338L7.67398 14.1471C7.85398 14.2471 8.14065 14.2471 8.31398 14.1471C9.59398 13.4405 11.834 12.7005 13.2873 12.5071L13.5073 12.4805C14.1473 12.4005 14.6673 11.8005 14.6673 11.1605Z" stroke="#9CA3B0" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M8 3.66016L8 13.6602" stroke="#9CA3B0" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M5.16602 5.66016H3.66602" stroke="#9CA3B0" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M5.66602 7.66016H3.66602" stroke="#9CA3B0" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                            Total Questions :
                        </Typography>
                        <Typography className="flex items-center gap-1" variant='subtitle1' color='text.dark'>
                            {data?.data?.question_ids?.length} Questions
                        </Typography>
                        <Divider orientation='vertical' />
                    </> : ""}
                {data?.data?.duration ? <>
                    <Typography className="flex items-center gap-2" variant='subtitle1' color='text.middle'>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.8327 8.83333C13.8327 12.0533 11.2193 14.6667 7.99935 14.6667C4.77935 14.6667 2.16602 12.0533 2.16602 8.83333C2.16602 5.61333 4.77935 3 7.99935 3C11.2193 3 13.8327 5.61333 13.8327 8.83333Z" stroke="#9CA3B0" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M8 5.33301V8.66634" stroke="#9CA3B0" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M6 1.33301L10 1.33301" stroke="#9CA3B0" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        Timer:
                    </Typography>
                    <Typography className="flex items-center gap-2" variant='subtitle1' color='text.dark'>
                        {data?.data?.duration?.hours} Hrs {data?.data?.duration?.minutes} Mins
                    </Typography>
                </> : ""}
                {data?.data?.start_datetime ? <>
                    <Divider orientation='vertical' />

                    <Typography className="flex items-center gap-2" variant='subtitle1' color='text.middle'>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.33398 3.83301C5.06065 3.83301 4.83398 3.60634 4.83398 3.33301V1.33301C4.83398 1.05967 5.06065 0.833008 5.33398 0.833008C5.60732 0.833008 5.83398 1.05967 5.83398 1.33301V3.33301C5.83398 3.60634 5.60732 3.83301 5.33398 3.83301Z" fill="#9CA3B0" />
                            <path d="M10.666 3.83301C10.3927 3.83301 10.166 3.60634 10.166 3.33301V1.33301C10.166 1.05967 10.3927 0.833008 10.666 0.833008C10.9393 0.833008 11.166 1.05967 11.166 1.33301V3.33301C11.166 3.60634 10.9393 3.83301 10.666 3.83301Z" fill="#9CA3B0" />
                            <path d="M13.6673 6.55957L2.33398 6.55957C2.06065 6.55957 1.83398 6.3329 1.83398 6.05957C1.83398 5.78624 2.06065 5.55957 2.33398 5.55957L13.6673 5.55957C13.9406 5.55957 14.1673 5.78624 14.1673 6.05957C14.1673 6.3329 13.9406 6.55957 13.6673 6.55957Z" fill="#9CA3B0" />
                            <path d="M10.6667 15.1663H5.33333C2.9 15.1663 1.5 13.7663 1.5 11.333L1.5 5.66634C1.5 3.23301 2.9 1.83301 5.33333 1.83301L10.6667 1.83301C13.1 1.83301 14.5 3.23301 14.5 5.66634V11.333C14.5 13.7663 13.1 15.1663 10.6667 15.1663ZM5.33333 2.83301C3.42667 2.83301 2.5 3.75967 2.5 5.66634L2.5 11.333C2.5 13.2397 3.42667 14.1663 5.33333 14.1663H10.6667C12.5733 14.1663 13.5 13.2397 13.5 11.333V5.66634C13.5 3.75967 12.5733 2.83301 10.6667 2.83301L5.33333 2.83301Z" fill="#9CA3B0" />
                            <path d="M5.66667 9.66635C5.58 9.66635 5.49333 9.64636 5.41333 9.61302C5.33333 9.57969 5.26001 9.53301 5.19334 9.47301C5.13334 9.40634 5.08666 9.33302 5.05332 9.25302C5.01999 9.17302 5 9.08635 5 8.99968C5 8.82635 5.07334 8.65302 5.19334 8.52635C5.26001 8.46635 5.33333 8.41967 5.41333 8.38634C5.53333 8.33301 5.66667 8.31967 5.80001 8.34634C5.84001 8.35301 5.88 8.36634 5.92 8.38634C5.96 8.39967 6 8.41969 6.04 8.44636C6.07333 8.47302 6.10666 8.49969 6.13999 8.52635C6.16666 8.55969 6.19999 8.59302 6.21999 8.62635C6.24666 8.66635 6.26668 8.70635 6.28001 8.74635C6.30001 8.78635 6.31334 8.82634 6.32001 8.86634C6.32667 8.91301 6.33333 8.95302 6.33333 8.99968C6.33333 9.17302 6.25999 9.34634 6.13999 9.47301C6.01333 9.59301 5.84 9.66635 5.66667 9.66635Z" fill="#9CA3B0" />
                            <path d="M8.00065 9.66658C7.82732 9.66658 7.65399 9.59324 7.52732 9.47324C7.50066 9.43991 7.47399 9.40658 7.44733 9.37325C7.42066 9.33325 7.40064 9.29325 7.38731 9.25325C7.36731 9.21325 7.35398 9.17326 7.34731 9.13326C7.34064 9.08659 7.33398 9.04658 7.33398 8.99992C7.33398 8.91325 7.35398 8.82658 7.38731 8.74658C7.42064 8.66658 7.46732 8.59325 7.52732 8.52659C7.71399 8.33992 8.01399 8.27991 8.25399 8.38657C8.34065 8.41991 8.40731 8.46659 8.47398 8.52659C8.59398 8.65325 8.66732 8.82658 8.66732 8.99992C8.66732 9.04658 8.66066 9.08659 8.65399 9.13326C8.64733 9.17326 8.63399 9.21325 8.61399 9.25325C8.60066 9.29325 8.58064 9.33325 8.55398 9.37325C8.52731 9.40658 8.50065 9.43991 8.47398 9.47324C8.40731 9.53324 8.34065 9.57992 8.25399 9.61326C8.17399 9.64659 8.08732 9.66658 8.00065 9.66658Z" fill="#9CA3B0" />
                            <path d="M5.66667 11.9996C5.58 11.9996 5.49333 11.9796 5.41333 11.9463C5.33333 11.9129 5.26001 11.8663 5.19334 11.8063C5.13334 11.7396 5.08666 11.6729 5.05332 11.5863C5.01999 11.5063 5 11.4196 5 11.3329C5 11.1596 5.07334 10.9863 5.19334 10.8596C5.26001 10.7996 5.33333 10.7529 5.41333 10.7196C5.66 10.6129 5.95333 10.6729 6.13999 10.8596C6.16666 10.8929 6.19999 10.9263 6.21999 10.9596C6.24666 10.9996 6.26668 11.0396 6.28001 11.0796C6.30001 11.1196 6.31334 11.1596 6.32001 11.2063C6.32667 11.2463 6.33333 11.2929 6.33333 11.3329C6.33333 11.5063 6.25999 11.6796 6.13999 11.8063C6.01333 11.9263 5.84 11.9996 5.66667 11.9996Z" fill="#9CA3B0" />
                        </svg>
                        Started Date:
                    </Typography>
                    <Typography className="flex items-center gap-2" variant='subtitle1' color='text.dark'>
                        {formatDate(data?.data?.start_datetime || "")}
                    </Typography>
                </> : ""}
            </div>
            <Divider className="my-6!" />
            <Outlet />
        </div>
    )
}
