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

function getPreviousMonthDays(year, month, firstDay) {
    const previousMonth = month - 1 === 0 ? 12 : month - 1;
    const previousYear = month - 1 === 0 ? year - 1 : year;
    const previousMonthDays = getDaysInMonth(previousYear, previousMonth);
    const days = [];
    for (let i = previousMonthDays; i > previousMonthDays - firstDay; i--) {
        days.push({
            date: i,
            day: daysInWeek[(firstDay - (previousMonthDays - i) - 1 + 7) % 7],
            month: previousMonth,
            year: previousYear
        });
    }
    return days;
}

function getCurrentMonthDays(year, month) {
    const days = [];
    for (let day = 1; day <= getDaysInMonth(year, month); day++) {
        days.push({
            date: day,
            day: daysInWeek[new Date(year, month - 1, day).getDay()],
            month: month,
            year: year
        });
    }
    return days;
}

function getNextMonthDays(year, month, totalDays) {
    const nextMonth = month + 1 > 12 ? 1 : month + 1;
    const nextYear = month + 1 > 12 ? year + 1 : year;
    const days = [];
    for (let i = 1; i <= 42 - totalDays; i++) {
        days.push({
            date: i,
            day: daysInWeek[(getFirstDayOfMonth(year, month) + getDaysInMonth(year, month) + i - 1) % 7],
            month: nextMonth,
            year: nextYear
        });
    }
    return days;
}

function getMonthlyCalendar(year, month) {
    validateInput(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const previousMonthDays = getPreviousMonthDays(year, month, firstDay);
    const currentMonthDays = getCurrentMonthDays(year, month);
    const nextMonthDays = getNextMonthDays(year, month, previousMonthDays.length + currentMonthDays.length);
    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
}

module.exports = {
    getMonthlyCalendar
};