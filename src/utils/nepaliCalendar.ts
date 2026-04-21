// =============================================================================
// Bikram Sambat (BS) Calendar — Global Utility
// Month data personally verified from Nepali Patro by the project team.
// DO NOT modify BS_CALENDAR_DATA without a supporting reference from Nepali Patro.
// =============================================================================

export interface BSDate {
    year: number;
    month: number;
    day: number;
}

// Months: Baisakh, Jestha, Ashadh, Shrawan, Bhadra, Ashwin,
//         Kartik, Mangsir, Poush, Magh, Falgun, Chaitra
export const BS_CALENDAR_DATA: Readonly<Record<number, readonly number[]>> = {
    2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2084: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2085: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2086: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2087: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2088: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2089: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2090: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
} as const;

// Anchor: Baisakh 1, 2083 BS = April 14, 2026 AD (Tuesday)
// Verified: Baisakh 8, 2083 = April 21, 2026 (Tuesday)
export const BS_AD_ANCHOR = {
    bsYear: 2083,
    bsMonth: 1,
    bsDay: 1,
    adDate: new Date(2026, 3, 14), // April 14, 2026
} as const;

export const NEPALI_MONTHS = [
    'बैशाख', 'जेष्ठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन',
    'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र',
] as const;

export const ENGLISH_MONTHS = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra',
] as const;

export const SHORT_WEEKDAYS_NEPALI = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि'] as const;
export const SHORT_WEEKDAYS_ENGLISH = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export const toNepaliNumber = (num: number | string): string => {
    const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().split('').map(d =>
        d >= '0' && d <= '9' ? nepaliDigits[parseInt(d)] : d
    ).join('');
};

export const getDaysInBSMonth = (year: number, month: number): number => {
    const yearData = BS_CALENDAR_DATA[year];
    if (!yearData) throw new Error(`BS year ${year} is outside available calendar data (2082–2090).`);
    if (month < 1 || month > 12) throw new Error(`Month must be 1–12, got ${month}.`);
    return yearData[month - 1];
};

export const getTotalDaysInBSYear = (year: number): number =>
    BS_CALENDAR_DATA[year]?.reduce((a, b) => a + b, 0) ?? (() => { throw new Error(`BS year ${year} not in data.`); })();

// Count signed day difference: positive = toDate is after fromDate
const daysBetween = (
    fy: number, fm: number, fd: number,
    ty: number, tm: number, td: number,
): number => {
    if (fy === ty && fm === tm && fd === td) return 0;

    const forward = ty > fy || (ty === fy && tm > fm) || (ty === fy && tm === fm && td > fd);
    if (!forward) return -daysBetween(ty, tm, td, fy, fm, fd);

    // Same year + month: simple difference, no wrap-around needed
    if (fy === ty && fm === tm) return td - fd;

    let days = getDaysInBSMonth(fy, fm) - fd; // remaining days in from-month
    let y = fy, m = fm + 1;
    if (m > 12) { m = 1; y++; }

    while (y < ty || (y === ty && m < tm)) {
        days += getDaysInBSMonth(y, m);
        m++;
        if (m > 12) { m = 1; y++; }
    }

    days += td; // days in to-month up to target day
    return days;
};

export const bsToAd = (bsYear: number, bsMonth: number, bsDay: number): Date => {
    const { bsYear: ry, bsMonth: rm, bsDay: rd, adDate: refAd } = BS_AD_ANCHOR;
    const diff = daysBetween(ry, rm, rd, bsYear, bsMonth, bsDay);
    const result = new Date(refAd);
    result.setDate(result.getDate() + diff);
    return result;
};

export const adToBs = (adDate: Date): BSDate => {
    const { bsYear: ry, bsMonth: rm, bsDay: rd, adDate: refAd } = BS_AD_ANCHOR;

    const msPerDay = 1000 * 60 * 60 * 24;
    // Normalize to midnight to avoid DST skew
    const adMidnight = new Date(adDate.getFullYear(), adDate.getMonth(), adDate.getDate());
    const refMidnight = new Date(refAd.getFullYear(), refAd.getMonth(), refAd.getDate());
    const totalDiff = Math.round((adMidnight.getTime() - refMidnight.getTime()) / msPerDay);

    let y = ry, m = rm, d = rd;
    let remaining = totalDiff;

    if (remaining > 0) {
        while (remaining > 0) {
            const daysInMonth = getDaysInBSMonth(y, m);
            const daysLeft = daysInMonth - d;
            if (remaining > daysLeft) {
                remaining -= daysLeft + 1;
                d = 1;
                m++;
                if (m > 12) { m = 1; y++; }
            } else {
                d += remaining;
                remaining = 0;
            }
        }
    } else if (remaining < 0) {
        remaining = Math.abs(remaining);
        while (remaining > 0) {
            if (remaining >= d) {
                remaining -= d;
                m--;
                if (m < 1) { m = 12; y--; }
                d = getDaysInBSMonth(y, m);
            } else {
                d -= remaining;
                remaining = 0;
            }
        }
    }

    return { year: y, month: m, day: d };
};

export const getFirstDayOfBSMonth = (year: number, month: number): number =>
    bsToAd(year, month, 1).getDay();

export const isBSDateValid = (year: number, month: number, day: number): boolean => {
    if (!BS_CALENDAR_DATA[year]) return false;
    if (month < 1 || month > 12) return false;
    return day >= 1 && day <= getDaysInBSMonth(year, month);
};
