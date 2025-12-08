import dayjs, { Dayjs } from "dayjs";

export const parseDate = (value: string | undefined) => (value ? dayjs(value) : null);

export const parseTime = (time?: string | null): Dayjs | null => {
    if (!time) return null;
    return dayjs(time, "HH:mm");
};