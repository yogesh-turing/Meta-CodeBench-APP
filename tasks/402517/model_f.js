
const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function validateInput(year, month) {
    if (year == null || month == null || isNaN(year) || isNaN(month)) throw new Error("Year and month must be valid numbers");
    if (year <= 0 || month <= 0 || month > 12) throw new Error("Invalid year or month value");
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month - 1, 1).getDay();
}

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function getPreviousMonthDays(year, month, firstDayOfMonth) {
    let previousMonthDays = [];
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        previousMonthDays.push({
            date: new Date(year, month - 1, 0).getDate() - i,
            day: daysInWeek[(new Date(year, month - 1, 1).getDay() - i - 1 + 7) % 7],
            month: month - 1 === 0 ? 12 : month - 1,
            year: month - 1 === 0 ? year - 1 : year
        });
    }
    return previousMonthDays;
}

function getCurrentMonthDays(year, month) {
    let currentMonthDays = [];
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

function getNextMonthDays(year, month, totalDays) {
    let nextMonthDays = [];
    for (let i = 1; i <= (42 - totalDays); i++) {
        nextMonthDays.push({
            date: i,
            day: daysInWeek[(new Date(year, month - 1, 1).getDay() + getDaysInMonth(year, month) + i - 1) % 7],
            month: month + 1 > 12 ? 1 : month + 1,
            year: month + 1 > 12 ? year + 1 : year
        });
    }
    return nextMonthDays;
}

function getMonthlyCalendar(year, month) {
    validateInput(year, month);
    let firstDayOfMonth = getFirstDayOfMonth(year, month);
    let previousMonthDays = getPreviousMonthDays(year, month, firstDayOfMonth);
    let currentMonthDays = getCurrentMonthDays(year, month);
    let totalDays = previousMonthDays.length + currentMonthDays.length;
    let nextMonthDays = getNextMonthDays(year, month, totalDays);
    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
}

module.exports = {
    getMonthlyCalendar
};
