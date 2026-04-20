import { Box } from "@mui/material";
import { useGetUserAnalyticsQuery } from "../../../../services/userApi";
import DashboardAnalyticsCard from "../../../organism/Cards/DashboardAnalyticsCard";
import DashboardAnalyticsLoading from "../../../organism/Cards/DashboardAnalyticsCard/Loading";

const TITLE_TO_FILTER: Record<string, string | null> = {
    "Total Users": null,
    "Active Users": "active_user",
    "Enrolled Students": "enrolled_user",
    "Unpurchased Students": "unpurchased_user",
};

interface Props {
    adminFilter: string | null;
    onFilterChange: (filter: string | null) => void;
}

export default function UserAnalyticsCards({ adminFilter, onFilterChange }: Props) {
    const { data, isLoading } = useGetUserAnalyticsQuery();

    return (
        <div className="gap-4 grid grid-cols-2 2xl:grid-cols-4 2xl:gap-8 mb-8 px-2 pt-2">
            {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <DashboardAnalyticsLoading key={i + "UserAnalytics"} />
                ))
                : data?.data?.map((item) => {
                    const filterKey = TITLE_TO_FILTER[item.title] ?? null;
                    const isSelected = adminFilter === filterKey;

                    return (
                        <Box
                            key={item.title}
                            onClick={() => onFilterChange(isSelected ? null : filterKey)}
                            sx={{
                                cursor: "pointer",
                                borderRadius: "12px",
                                transition: "all 0.2s ease",
                                outline: isSelected
                                    ? (t) => `2px solid ${t.palette.primary.main}`
                                    : "2px solid transparent",
                                outlineOffset: "2px",
                                transform: isSelected ? "scale(1.02)" : "scale(1)",
                                "&:hover": {
                                    transform: "scale(1.02)",
                                    opacity: 0.95,
                                },
                            }}
                        >
                            <DashboardAnalyticsCard
                                data={{
                                    title: item.title,
                                    value: item.value.toLocaleString(),
                                    description: item.description ?? "",
                                    type: item.type,
                                }}
                            />
                        </Box>
                    );
                })}
        </div>
    );
}
