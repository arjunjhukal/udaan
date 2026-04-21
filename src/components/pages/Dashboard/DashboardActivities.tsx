import { Box, Stack, Typography } from "@mui/material";
import { Calendar } from "iconsax-reactjs";
import { useState } from "react";
import { PATH } from "../../../routes/PATH";
import { useGetAllActivityQuery } from "../../../services/activityApi";
import { formatDateForDisplay } from "../../../utils/dateFormat";
import TableFilter from "../../organism/TableFilter";

export default function DashboardActivities() {
    const [qp, _setQp] = useState({
        pageIndex: 1,
        pageSize: 20,
    });


    const { data } = useGetAllActivityQuery({
        ...qp,
    });

    return (
        <Box className="py-6 px-8 rounded-lg flex flex-col " sx={{
            height: "448px",
            overflow: "auto",
            background: (theme) => theme.palette.primary.contrastText
        }}>
            <TableFilter
                categoryLayout={true}
                title="Recent Activities"
                redirectUrl={PATH.ACTIVITY_LOG.ROOT}
            />
            <Box className="h-full overflow-auto">
                {data?.data?.data?.length ? data.data.data.map((activity) => (
                    <Box key={activity.id ?? activity.timestamp} className="activiti__card pb-4 mb-4 border-b " sx={{
                        borderColor: (theme) => theme.palette.separator.dark
                    }}>
                        <Typography variant="h6" className="mb-1.5!" fontWeight={500}>{activity?.log}- {activity.username}</Typography>
                        <Stack gap={1} alignItems={"center"}>
                            <Calendar size={16} />
                            <Typography variant="subtitle2" color="text.middle">
                                {formatDateForDisplay(activity?.timestamp)}</Typography>
                        </Stack>
                    </Box>
                )) : (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <Typography variant="subtitle2" color="text.light">No recent activities available</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    )
}
