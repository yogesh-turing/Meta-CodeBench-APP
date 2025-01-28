const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Function to validate the input year and month
function validateInput(year, month) {
    if (year == null || month == null || isNaN(year) || isNaN(month) || year <= 0 || month <= 0 || month > 12) {
        throw new Error("Invalid year or month value");
    }
}

// Function to get the number of days in the previous month
function getPreviousMonthDays(year, month) {
    const previousMonth = month - 1 === 0 ? 12 : month - 1;
    const previousYear = month - 1 === 0 ? year - 1 : year;
    return new Date(year, month - 1, 0).getDate();
}

// Function to get the number of days in the current month
function getCurrentMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
}

// Function to get the day of the week for the first day of the month
function getFirstDayOfWeek(year, month) {
    return new Date(year, month - 1, 1).getDay();
}

// Function to get the monthly calendar
function getMonthlyCalendar(year, month) {
    validateInput(year, month);

    const firstDayOfWeek = getFirstDayOfWeek(year, month);
    const currentMonthDays = getCurrentMonthDays(year, month);
    const previousMonthDays = getPreviousMonthDays(year, month);
    const nextMonthDays = 42 - firstDayOfWeek - currentMonthDays;

    const previousMonthCalendar = Array(firstDayOfWeek - 1).fill(0).map((_, index) => {
        const date = previousMonthDays - index;
        const day = daysInWeek[(firstDayOfWeek - index - 1 + 7) % 7];
        const previousMonth = month - 1 === 0 ? 12 : month - 1;
        const previousYear = month - 1 === 0 ? year - 1 : year;
        return { date, day, month: previousMonth, year: previousYear };
    });

    const currentMonthCalendar = Array(currentMonthDays).fill(0).map((_, index) => {
        const date = index + 1;
        const day = daysInWeek[(new Date(year, month - 1, date)).getDay()];
        return { date, day, month, year };
    });

    const nextMonthCalendar = Array(nextMonthDays).fill(0).map((_, index) => {
        const date = index + 1;
        const day = daysInWeek[(firstDayOfWeek + currentMonthDays + index - 1) % 7];
        const nextMonth = month + 1 > 12 ? 1 : month + 1;
        const nextYear = month + 1 > 12 ? year + 1 : year;
        return { date, day, month: nextMonth, year: nextYear };
    });

    return [...previousMonthCalendar, ...currentMonthCalendar, ...nextMonthCalendar];
}

module.exports = { getMonthlyCalendar };