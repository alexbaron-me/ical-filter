export function weekOfYear(date: Date): number {
	const onejan = new Date(date.getFullYear(), 0, 1);
	const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const dayOfYear = ((today - onejan + 86400000) / 86400000);

	return Math.ceil(dayOfYear / 7)
}

/**
	* Returns the monday of the provided calendar week. If no year is provided, the current year is used.
	*/
export function dateFromWeek(week: number, year: number = new Date().getFullYear()): Date {
	const day = 1 + (week - 1) * 7;
	return new Date(year, 0, day);
}

export function isToday(date: Date): boolean {
	return date.toDateString() === new Date().toDateString();
}

export const DAY_IN_MS = 86400000;
