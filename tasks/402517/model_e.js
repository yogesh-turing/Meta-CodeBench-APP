const DAYS_IN_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CALENDAR_WEEKS = 6;
const DAYS_IN_CALENDAR = CALENDAR_WEEKS * 7;

function validateInput(year, month) {
    if (year == null || month == null || isNaN(year) || isNaN(month)) {
        throw new Error("Year and month must be valid numbers");
    }
    if (year <= 0 || month <= 0 || month > 12) {
        throw new Error("Invalid year or month value");
    }
}

function getAdjustedYearMonth(year, month, monthOffset) {
    const adjustedMonth = month + monthOffset;
    return {
        year: year + Math.floor((adjustedMonth - 1) / 12),
        month: ((adjustedMonth - 1) % 12) + 1
    };
}

function getPreviousMonthDates(year, month, firstDayOfMonth) {
    const prevDaysNeeded = firstDayOfMonth.getDay();
    if (prevDaysNeeded === 0) return [];

    const { year: prevYear, month: prevMonth } = getAdjustedYearMonth(year, month, -1);
    const lastDayPrevMonth = new Date(year, month - 1, 0).getDate();

    return Array.from({ length: prevDaysNeeded }, (_, index) => {
        const date = lastDayPrevMonth - prevDaysNeeded + index + 1;
        return {
            date,
            day: DAYS_IN_WEEK[new Date(prevYear, prevMonth - 1, date).getDay()],
            month: prevMonth,
            year: prevYear
        };
    });
}

function getCurrentMonthDates(year, month, daysInMonth) {
    return Array.from({ length: daysInMonth }, (_, index) => {
        const date = index + 1;
        return {
            date,
            day: DAYS_IN_WEEK[new Date(year, month - 1, date).getDay()],
            month,
            year
        };
    });
}

function getNextMonthDates(year, month, currentCalendarLength) {
    const nextDaysNeeded = DAYS_IN_CALENDAR - currentCalendarLength;
    if (nextDaysNeeded <= 0) return [];

    const { year: nextYear, month: nextMonth } = getAdjustedYearMonth(year, month, 1);

    return Array.from({ length: nextDaysNeeded }, (_, index) => {
        const date = index + 1;
        return {
            date,
            day: DAYS_IN_WEEK[new Date(nextYear, nextMonth - 1, date).getDay()],
            month: nextMonth,
            year: nextYear
        };
    });
}

function getMonthlyCalendar(year, month) {
    validateInput(year, month);

    const firstDayOfMonth = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();

    const previousMonthDates = getPreviousMonthDates(year, month, firstDayOfMonth);
    const currentMonthDates = getCurrentMonthDates(year, month, daysInMonth);
    const nextMonthDates = getNextMonthDates(
        year, 
        month, 
        previousMonthDates.length + currentMonthDates.length
    );

    return [...previousMonthDates, ...currentMonthDates, ...nextMonthDates];
}

module.exports = { getMonthlyCalendar };