import UserAnalyticsCards from "./UserAnalyticsCards";

interface Props {
    adminFilter: string | null;
    onFilterChange: (filter: string | null) => void;
}

export default function UserAnalytics({ adminFilter, onFilterChange }: Props) {
    return (
        <UserAnalyticsCards adminFilter={adminFilter} onFilterChange={onFilterChange} />
    );
}
