const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function validateInput(year, month) {
    if (year == null || month == null || isNaN(year) || isNaN(month) || year <= 0 || month <= 0 || month > 12) {
        throw new Error("Invalid year or month value");
    }
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month - 1, 1);
}

function getLastDayOfMonth(year, month) {
    return new Date(year, month, 0);
}

function getDaysInMonth(year, month) {
    return getLastDayOfMonth(year, month).getDate();
}

function getPreviousMonthDays(firstDayOfMonth, lastDayOfPreviousMonth) {
    const previousMonthDays = [];
    for (let i = firstDayOfMonth.getDay() - 1; i >= 0; i--) {
        previousMonthDays.push({
            date: lastDayOfPreviousMonth.getDate() - i,
            day: daysInWeek[(firstDayOfMonth.getDay() - i - 1 + 7) % 7],
            month: lastDayOfPreviousMonth.getMonth() + 1,
            year: lastDayOfPreviousMonth.getFullYear()
        });
    }
    return previousMonthDays;
}

function getCurrentMonthDays(year, month) {
    const currentMonthDays = [];
    for (let day = 1; day <= getDaysInMonth(year, month); day++) {
        currentMonthDays.push({
            date: day,
            day: daysInWeek[new Date(year, month - 1, day).getDay()],
            month: month,
            year: year
        });
    }
    return currentMonthDays;
}

function getNextMonthDays(firstDayOfMonth, currentMonthDays) {
    const nextMonthDays = [];
    const nextMonthYear = firstDayOfMonth.getMonth() + 1 > 11 ? firstDayOfMonth.getFullYear() + 1 : firstDayOfMonth.getFullYear();
    const nextMonth = firstDayOfMonth.getMonth() + 1 > 11 ? 1 : firstDayOfMonth.getMonth() + 2;
    for (let i = 1; i <= 42 - currentMonthDays.length - firstDayOfMonth.getDay() + 1; i++) {
        nextMonthDays.push({
            date: i,
            day: daysInWeek[(firstDayOfMonth.getDay() + currentMonthDays.length + i - 1) % 7],
            month: nextMonth,
            year: nextMonthYear
        });
    }
    return nextMonthDays;
}

function getMonthlyCalendar(year, month) {
    validateInput(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const lastDayOfPreviousMonth = new Date(year, month - 1, 0);
    const previousMonthDays = getPreviousMonthDays(firstDayOfMonth, lastDayOfPreviousMonth);
    const currentMonthDays = getCurrentMonthDays(year, month);
    const nextMonthDays = getNextMonthDays(firstDayOfMonth, currentMonthDays);
    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
}

module.exports = { getMonthlyCalendar };