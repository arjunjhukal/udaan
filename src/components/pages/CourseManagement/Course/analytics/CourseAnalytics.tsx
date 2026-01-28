import { Paper, useTheme } from "@mui/material";
import { Book1, BookSaved, CardSend, Courthouse, Key } from "iconsax-reactjs";
import { useGetCourseAnalyticsQuery } from "../../../../../services/courseApi";
import AnalyticsCard from "../../../../organism/Cards/AnalyticsCard";

export default function CourseAnalytics({ id }: { id: number }) {
  const { data } = useGetCourseAnalyticsQuery({ id });
  const theme = useTheme();
  const analytics = data?.data || [];

  const getIcons = (type: "success" | "error" | "info" | "warning") => {
    switch (type) {
      case "success":
        return <BookSaved color={theme.palette.success.main} />;
      case "info":
        return <CardSend color={theme.palette.info.main} />;
      case "error":
        return <Book1 color={theme.palette.error.main} />;
      case "warning":
        return <Courthouse color={theme.palette.warning.main} />;
      default:
        return <Key color={theme.palette.warning.main} />;
    }
  }
  return (
    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mb-6">
      {
        analytics.map((item) => (
          <Paper sx={{
            boxShadow: (theme) => `0 0 2px ${theme.palette.separator.dark}`
          }} className="col-span-1">
            <AnalyticsCard key={item.description} title={item.title} value={item.value} description={item.description} icon={getIcons(item.type)} type={item.type} />
          </Paper >
        ))
      }
    </div>
  )
}
