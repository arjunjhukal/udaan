import dayjs, { Dayjs } from "dayjs";

export const parseDate = (value: string | undefined) =>
	value ? dayjs(value) : null;

export const parseTime = (time?: string | null): Dayjs | null => {
	if (!time) return null;
	return dayjs(time, "HH:mm");
};
export function msToHMS(ms: number) {
	const totalSeconds = Math.floor(ms / 1000);

	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return { hours, minutes, seconds };
}
