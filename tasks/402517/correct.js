const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Validate the input year and month.
 * @param {number} year - The year to validate.
 * @param {number} month - The month to validate.
 */
function validateInput(year, month) {
    if (year == null || month == null || isNaN(year) || isNaN(month)) {
        throw new Error("Year and month must be valid numbers");
    }
    if (year <= 0 || month <= 0 || month > 12) {
        throw new Error("Invalid year or month value");
    }
}

/**
 * Fill the calendar with the previous month's days.
 * @param {number} year - The current year.
 * @param {number} month - The current month.
 * @param {Date} firstDayOfMonth - The first day of the current month.
 * @param {number} lastDayOfPrevMonth - The last day of the previous month.
 * @param {Array} calendar - The calendar array to fill.
 */
function fillPrevMonthDays(year, month, firstDayOfMonth, lastDayOfPrevMonth, calendar) {
    const prevMonthDays = firstDayOfMonth.getDay();
    const prevMonth = month - 1 <= 0 ? 12 : month - 1;
    const prevYear = month - 1 <= 0 ? year - 1 : year;

    Array.from({ length: prevMonthDays }).forEach((_, i) => {
        calendar.push({
            date: lastDayOfPrevMonth - (prevMonthDays - 1 - i),
            day: daysInWeek[(i + 7) % 7],
            month: prevMonth,
            year: prevYear
        });
    });

    return calendar;
}

/**
 * Fill the calendar with the current month's days.
 * @param {number} year - The current year.
 * @param {number} month - The current month.
 * @param {number} daysInMonth - The number of days in the current month.
 * @param {Array} calendar - The calendar array to fill.
 */
function fillCurrentMonthDays(year, month, daysInMonth, calendar) {
    Array.from({ length: daysInMonth }).forEach((_, i) => {
        const day = i + 1;
        const date = new Date(year, month - 1, day);
        calendar.push({
            date: day,
            day: daysInWeek[date.getDay()],
            month: month,
            year: year
        });
    });
    return calendar;
}

/**
 * Fill the calendar with the next month's days.
 * @param {number} year - The current year.
 * @param {number} month - The current month.
 * @param {Date} firstDayOfMonth - The first day of the current month.
 * @param {number} daysInMonth - The number of days in the current month.
 * @param {Array} calendar - The calendar array to fill.
 */
function fillNextMonthDays(year, month, firstDayOfMonth, daysInMonth, calendar) {
    const nextMonthDays = 42 - calendar.length;
    Array.from({ length: nextMonthDays }).forEach((_, i) => {
        const day = i + 1;
        const nextMonth = month + 1 > 12 ? 1 : month + 1;
        const nextYear = month + 1 > 12 ? year + 1 : year;
        calendar.push({
            date: day,
            day: daysInWeek[(firstDayOfMonth.getDay() + daysInMonth + i) % 7],
            month: nextMonth,
            year: nextYear
        });
    });
    return calendar;
}

/**
 * Get the monthly calendar for a given year and month.
 * @param {number} year - The year for the calendar.
 * @param {number} month - The month for the calendar.
 * @returns {Array} The calendar array.
 */
function getMonthlyCalendar(year, month) {
    validateInput(year, month);

    const calendar = [];
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const lastDayOfPrevMonth = new Date(year, month - 1, 0).getDate();

    fillPrevMonthDays(year, month, firstDayOfMonth, lastDayOfPrevMonth, calendar);
    fillCurrentMonthDays(year, month, daysInMonth, calendar);
    
    fillNextMonthDays(year, month, firstDayOfMonth, daysInMonth, calendar);
    return calendar;
}

let calendar;
calendar = getMonthlyCalendar(2023, 2);


module.exports = {
    getMonthlyCalendar,
    validateInput,
    fillPrevMonthDays,
    fillCurrentMonthDays,
    fillNextMonthDays
};
