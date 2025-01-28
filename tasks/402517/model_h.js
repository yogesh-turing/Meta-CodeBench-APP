const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function validateInput(year, month) {
    if (year == null || month == null || isNaN(year) || isNaN(month) || year <= 0 || month <= 0 || month > 12) {
        throw new Error("Invalid year or month value");
    }
}

function getFirstDayOfWeek(year, month) {
    return new Date(year, month - 1, 1).getDay();
}

function getLastDateOfMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function getPreviousMonthDays(year, month, firstDayOfWeek) {
    const previousMonth = month - 1 === 0 ? 12 : month - 1;
    const previousYear = month - 1 === 0 ? year - 1 : year;
    const lastDateOfPreviousMonth = getLastDateOfMonth(year, month);

    return Array(firstDayOfWeek)
        .fill(null)
        .map((_, i) => ({
            date: lastDateOfPreviousMonth - i,
            day: daysInWeek[(firstDayOfWeek - i - 1 + 7) % 7],
            month: previousMonth,
            year: previousYear,
        }));
}

function getCurrentMonthDays(year, month) {
    const lastDateOfMonth = getLastDateOfMonth(year, month + 1);

    return Array(lastDateOfMonth)
        .fill(null)
        .map((_, i) => ({
            date: i + 1,
            day: daysInWeek[new Date(year, month - 1, i + 1).getDay()],
            month: month,
            year: year,
        }));
}

function getNextMonthDays(year, month, currentMonthDays) {
    const nextMonth = month + 1 > 12 ? 1 : month + 1;
    const nextYear = month + 1 > 12 ? year + 1 : year;
    const nextMonthDays = 42 - currentMonthDays.length;

    return Array(nextMonthDays)
        .fill(null)
        .map((_, i) => ({
            date: i + 1,
            day: daysInWeek[(new Date(year, month - 1, 1).getDay() + currentMonthDays.length + i) % 7],
            month: nextMonth,
            year: nextYear,
        }));
}

function getMonthlyCalendar(year, month) {
    validateInput(year, month);
    const firstDayOfWeek = getFirstDayOfWeek(year, month);
    const previousMonthDays = getPreviousMonthDays(year, month, firstDayOfWeek);
    const currentMonthDays = getCurrentMonthDays(year, month);
    const nextMonthDays = getNextMonthDays(year, month, currentMonthDays);

    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
}

module.exports = { getMonthlyCalendar };