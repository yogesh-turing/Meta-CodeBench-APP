const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function validateInput(year, month) {
    if (year == null || month == null || isNaN(year) || isNaN(month)) {
        throw new Error("Year and month must be valid numbers");
    }
    if (year <= 0 || month <= 0 || month > 12) {
        throw new Error("Invalid year or month value");
    }
}

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month - 1, 1).getDay();
}

function getLastDayOfMonth(year, month) {
    return new Date(year, month, 0).getDay();
}

function getPreviousMonthDays(year, month) {
    const firstDay = getFirstDayOfMonth(year, month);
    const previousMonth = month - 1 === 0 ? 12 : month - 1;
    const previousYear = month - 1 === 0 ? year - 1 : year;
    const daysInPreviousMonth = getDaysInMonth(previousYear, previousMonth);
    const previousMonthDays = [];

    for (let i = firstDay - 1; i >= 0; i--) {
        previousMonthDays.push({
            date: daysInPreviousMonth - i,
            day: daysInWeek[(firstDay - i - 1 + 7) % 7],
            month: previousMonth,
            year: previousYear
        });
    }

    return previousMonthDays;
}

function getCurrentMonthDays(year, month) {
    const daysInMonth = getDaysInMonth(year, month);
    const currentMonthDays = [];

    for (let day = 1; day <= daysInMonth; day++) {
        currentMonthDays.push({
            date: day,
            day: daysInWeek[new Date(year, month - 1, day).getDay()],
            month: month,
            year: year
        });
    }

    return currentMonthDays;
}

function getNextMonthDays(year, month, totalDays) {
    const nextMonth = month + 1 > 12 ? 1 : month + 1;
    const nextYear = month + 1 > 12 ? year + 1 : year;
    const nextMonthDays = [];

    for (let i = 1; i <= (42 - totalDays); i++) {
        nextMonthDays.push({
            date: i,
            day: daysInWeek[(getFirstDayOfMonth(year, month) + getDaysInMonth(year, month) + i - 1) % 7],
            month: nextMonth,
            year: nextYear
        });
    }

    return nextMonthDays;
}

function getMonthlyCalendar(year, month) {
    validateInput(year, month);
    const previousMonthDays = getPreviousMonthDays(year, month);
    const currentMonthDays = getCurrentMonthDays(year, month);
    const totalDays = previousMonthDays.length + currentMonthDays.length;
    const nextMonthDays = getNextMonthDays(year, month, totalDays);

    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
}

module.exports = {
    getMonthlyCalendar
};