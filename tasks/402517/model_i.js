const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function validateInput(year, month) {
    if (year == null || month == null || isNaN(year) || isNaN(month)) {
        throw new Error("Year and month must be valid numbers");
    }
    if (year <= 0 || month <= 0 || month > 12) {
        throw new Error("Invalid year or month value");
    }
}

function getPreviousMonthDays(year, month) {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const previousMonthDays = [];
    for (let i = firstDayOfMonth.getDay() - 1; i >= 0; i--) {
        previousMonthDays.push({
            date: new Date(year, month - 1, 0).getDate() - i,
            day: daysInWeek[(firstDayOfMonth.getDay() - i - 1 + 7) % 7],
            month: month - 1 === 0 ? 12 : month - 1,
            year: month - 1 === 0 ? year - 1 : year
        });
    }
    return previousMonthDays;
}

function getCurrentMonthDays(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
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

function getNextMonthDays(year, month, currentMonthDays) {
    const nextMonthDays = [];
    const totalDays = 42 - currentMonthDays.length;
    for (let i = 1; i <= totalDays; i++) {
        nextMonthDays.push({
            date: i,
            day: daysInWeek[(new Date(year, month - 1, 1).getDay() + currentMonthDays.length + i - 1) % 7],
            month: month + 1 > 12 ? 1 : month + 1,
            year: month + 1 > 12 ? year + 1 : year
        });
    }
    return nextMonthDays;
}

function getMonthlyCalendar(year, month) {
    validateInput(year, month);
    const previousMonthDays = getPreviousMonthDays(year, month);
    const currentMonthDays = getCurrentMonthDays(year, month);
    const nextMonthDays = getNextMonthDays(year, month, currentMonthDays);
    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
}

module.exports = {
    getMonthlyCalendar
};