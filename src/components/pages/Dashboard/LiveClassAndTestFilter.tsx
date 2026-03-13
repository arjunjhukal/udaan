import { Box, Divider, Typography } from "@mui/material";
import { t } from "i18next";
import { useState } from "react";
import { useGetAllLiveClassQuery } from "../../../services/liveClass";
import { useGetAllTestQuery } from "../../../services/questionApi";
import LiveClassCard from "../../organism/Cards/LiveClassCard";
import TestCard from "../../organism/Cards/TestCard";
import EmptyRoute from "../../organism/EmptyRoute";
import DashboardCalendar from "./DashboardCalendar";


export default function LiveClassAndTestFilter() {
    const today = new Date();
    const formatLocalDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [customRange, setCustomRange] = useState({
        startDate: today.toISOString().split("T")[0],
        endDate: ""
    });
    const [qp, _setQp] = useState({
        pageIndex: 1,
        pageSize: 12,
    })

    const { data } = useGetAllLiveClassQuery({
        ...qp,
        ...customRange,
    });
    const { data: tests } = useGetAllTestQuery({
        ...qp,
        ...customRange,
    });


    return (
        <Box className="liveclass__test__filter mb-4 lg:mb-6 py-6 px-8 rounded-lg " sx={{
            background: (theme) => theme.palette.primary.contrastText
        }}>
            <Typography variant="h4" fontWeight={600}>Calendar</Typography>
            <Divider className="my-4!" />
            <div className="2xl:grid 2xl:grid-cols-12 gap-6">
                <div className="col-span-12 2xl:col-span-4">
                    <DashboardCalendar onDateSelect={(adDate) => {
                        setCustomRange((prev) => ({
                            ...prev,
                            startDate: formatLocalDate(adDate),
                        }));
                    }} />
                </div>
                <div className=" lg:col-span-8 h-full">
                    <div className="grid lg:grid-cols-2 h-full gap-6">
                        <div className="col-span-1 h-full">
                            <Box sx={{
                                padding: "16px 4px",
                                border: (theme) => `1px solid ${theme.palette.separator.dark}`,
                                borderRadius: "8px",
                                height: "100%",
                                background: (theme) => theme.palette.primary.contrastText
                            }}>
                                <Typography variant="h5" fontWeight={600} className="px-4">{t("menus.course_management.live_classes.root")}</Typography>
                                <div className="mt-4 flex flex-col gap-4 max-h-[530px] px-4 overflow-auto">
                                    {data?.data?.data && data?.data?.data.length > 0 ? data?.data?.data?.map((item) => <LiveClassCard liveClass={item} />) : <EmptyRoute
                                        title="No Live Class Found"
                                        message="Start adding courses to organize your learning content. Use the button below to create your first course."
                                    />}
                                </div>
                            </Box>
                        </div>
                        <div className="col-span-1 h-full">
                            <Box sx={{
                                padding: "16px 4px",
                                border: (theme) => `1px solid ${theme.palette.separator.dark}`,
                                borderRadius: "8px",
                                height: "100%",
                                background: (theme) => theme.palette.primary.contrastText
                            }}>
                                <Typography variant="h5" fontWeight={600} className="px-4">{t("menus.test_question_management.test.root")}</Typography>
                                <div className="mt-4 flex flex-col gap-4 max-h-[530px] px-4 overflow-auto">
                                    {tests?.data?.data && tests?.data?.data.length > 0 ? tests?.data?.data?.map((item) => <TestCard test={item} />) : <EmptyRoute
                                        title='Test Not Found'
                                        message='Oops your test is empty. Please add question to help student gain knowlegde.'
                                        icon={(
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22 4.84969V16.7397C22 17.7097 21.21 18.5997 20.24 18.7197L19.93 18.7597C18.29 18.9797 15.98 19.6597 14.12 20.4397C13.47 20.7097 12.75 20.2197 12.75 19.5097V5.59969C12.75 5.22969 12.96 4.88969 13.29 4.70969C15.12 3.71969 17.89 2.83969 19.77 2.67969H19.83C21.03 2.67969 22 3.64969 22 4.84969Z" fill="#1D82F5" />
                                                <path d="M10.7102 4.70969C8.88023 3.71969 6.11023 2.83969 4.23023 2.67969H4.16023C2.96023 2.67969 1.99023 3.64969 1.99023 4.84969V16.7397C1.99023 17.7097 2.78023 18.5997 3.75023 18.7197L4.06023 18.7597C5.70023 18.9797 8.01023 19.6597 9.87023 20.4397C10.5202 20.7097 11.2402 20.2197 11.2402 19.5097V5.59969C11.2402 5.21969 11.0402 4.88969 10.7102 4.70969ZM5.00023 7.73969H7.25023C7.66023 7.73969 8.00023 8.07969 8.00023 8.48969C8.00023 8.90969 7.66023 9.23969 7.25023 9.23969H5.00023C4.59023 9.23969 4.25023 8.90969 4.25023 8.48969C4.25023 8.07969 4.59023 7.73969 5.00023 7.73969ZM8.00023 12.2397H5.00023C4.59023 12.2397 4.25023 11.9097 4.25023 11.4897C4.25023 11.0797 4.59023 10.7397 5.00023 10.7397H8.00023C8.41023 10.7397 8.75023 11.0797 8.75023 11.4897C8.75023 11.9097 8.41023 12.2397 8.00023 12.2397Z" fill="#1D82F5" />
                                            </svg>
                                        )}
                                    />}
                                </div>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    )
}
