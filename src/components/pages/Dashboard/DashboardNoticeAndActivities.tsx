import { Box } from "@mui/material";
import DashboardActivities from "./DashboardActivities";
import DashboardNotices from "./DashboardNotices";

export default function DashboardNoticeAndActivities() {
    return (
        <Box className="flex flex-col md:grid-cols-2 md:grid gap-4 lg:gap-6 mb-4 lg:mb-6" >
            <div className="cols-span-1">
                <DashboardActivities />
            </div>
            <div className="cols-span-1">
                <DashboardNotices />
            </div>
        </Box>
    )
}
