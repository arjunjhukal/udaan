/**
 * Formats a date to "DDth Month, YYYY" format
 * Examples: "12th August, 2023", "1st January, 2024", "23rd December, 2025"
 * 
 * @param date - Date string, Date object, or timestamp
 * @returns Formatted date string
 */
export function formatDate(date: string | Date | number): string {
    if (!date) return '-';

    const dateObj = new Date(date);

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
        return '-';
    }

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'long' });
    const year = dateObj.getFullYear();

    // Get ordinal suffix (st, nd, rd, th)
    const suffix = getOrdinalSuffix(day);

    return `${day}${suffix} ${month}, ${year}`;
}

/**
 * Gets the ordinal suffix for a day (st, nd, rd, th)
 * @param day - Day of the month (1-31)
 * @returns Ordinal suffix
 */
function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th'; // 11th-20th

    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

/**
 * Alternative: Format date with custom options
 */
export function formatDateCustom(
    date: string | Date | number,
    options?: {
        includeOrdinal?: boolean;
        shortMonth?: boolean;
        format?: 'full' | 'short' | 'numeric';
    }
): string {
    if (!date) return '-';

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
        return '-';
    }

    const {
        includeOrdinal = true,
        shortMonth = false,
        format = 'full'
    } = options || {};

    const day = dateObj.getDate();
    const monthFormat = shortMonth ? 'short' : 'long';
    const month = dateObj.toLocaleString('en-US', { month: monthFormat });
    const year = dateObj.getFullYear();

    switch (format) {
        case 'full':
            {
                const suffix = includeOrdinal ? getOrdinalSuffix(day) : '';
                return `${day}${suffix} ${month}, ${year}`;
            }

        case 'short':
            return `${day} ${month.slice(0, 3)}, ${year}`;

        case 'numeric':
            {
                const monthNum = dateObj.getMonth() + 1;
                return `${monthNum}/${day}/${year}`;
            }

        default:
            return dateObj.toLocaleDateString();
    }
}

/**
 * Format date for display in tables or lists
 */
export function formatDateForDisplay(date: string | Date | number | null | undefined): string {
    if (!date) return '-';

    try {
        return formatDate(date);
    } catch (error) {
        console.error('Error formatting date:', error);
        return '-';
    }
}
