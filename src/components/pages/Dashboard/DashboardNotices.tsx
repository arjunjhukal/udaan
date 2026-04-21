import { Box, Stack, Typography } from "@mui/material";
import { Calendar } from "iconsax-reactjs";
import { useState } from "react";
import { PATH } from "../../../routes/PATH";
import { useGetAllNotificationQuery } from "../../../services/notificationApi";
import { formatDateForDisplay } from "../../../utils/dateFormat";
import { renderHtml } from "../../../utils/renderHtml";
import TableFilter from "../../organism/TableFilter";

export default function DashboardNotices() {
    const [qp, _setQp] = useState({
        pageIndex: 1,
        pageSize: 20,
    });

    const { data } = useGetAllNotificationQuery({
        ...qp,
        delivey_method: "notice_board"
    });

    return (
        <Box className="py-6 px-8 rounded-lg flex flex-col" sx={{
            height: "448px",
            overflow: "auto",
            background: (theme) => theme.palette.primary.contrastText
        }}>
            <TableFilter
                title="Recent Notices"
                categoryLayout={true}
                redirectUrl={PATH.NOTIFICATION_MANAGEMENT.ROOT}
            />
            <Box className="h-full overflow-auto">
                {data?.data?.data?.length ? data.data.data.map((notice) => (
                    <Box key={notice.id} className="activiti__card pb-4 mb-4 border-b " sx={{
                        borderColor: (theme) => theme.palette.separator.dark
                    }}>
                        <Typography variant="h6" className="capitalize mb-1.5!" fontWeight={500}>{notice.name}</Typography>
                        <Typography variant="subtitle2" className="capitalize mb-1.5! line-clamp-1" color="text.middle">{renderHtml(notice.description)}</Typography>
                        <Stack gap={1} alignItems={"center"}>
                            <Calendar size={16} />
                            <Typography variant="subtitle2" color="text.middle">
                                {formatDateForDisplay(notice?.updated_at)}</Typography>
                        </Stack>
                    </Box>
                )) : (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <Typography variant="subtitle2" color="text.light">No notices available</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    )
}
