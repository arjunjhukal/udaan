import { useGetMenuCountsQuery } from "../services/menuApi";

export function useMenuCounts() {
    const { data } = useGetMenuCountsQuery(undefined, {
        pollingInterval: 60_000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    return {
        discussion: data?.data?.discussion ?? 0,
        supportTicket: data?.data?.support_ticket ?? 0,
        deviceReset: data?.data?.device_reset ?? 0,
        transaction: data?.data?.transaction ?? 0,
        notification: data?.data?.notification ?? 0,
        activityLog: data?.data?.activity_log ?? 0,
        newUsers: data?.data?.new_users ?? 0,
    };
}
