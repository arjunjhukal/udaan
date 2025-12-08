import dayjs from "dayjs";

/**
 * Formats start and end time into a readable time range string
 * @param startTime - ISO string or Date object for start time
 * @param endTime - ISO string or Date object for end time
 * @returns Formatted time range string (e.g., "10:00 AM - 11:30 AM")
 */
export const getTimeDifference = (
    startTime: string | Date,
    endTime: string | Date
): string => {
    const start = dayjs(startTime);
    const end = dayjs(endTime);

    const startFormatted = start.format("hh:mm A");
    const endFormatted = end.format("hh:mm A");

    return `${startFormatted} - ${endFormatted}`;
};


export const formatTimeAMPM = (time: string): string => {
    if (!time) return "";
    const date = dayjs(`1970-01-01T${time}`); // combine with a dummy date
    return date.isValid() ? date.format("hh:mm A") : "";
};