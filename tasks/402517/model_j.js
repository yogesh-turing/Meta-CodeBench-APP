const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function validateInput(year, month) {
    if (year == null || month == null || isNaN(year) || isNaN(month)) throw new Error("Year and month must be valid numbers");
    if (year <= 0 || month <= 0 || month > 12) throw new Error("Invalid year or month value");
}

function getPreviousMonthDays(year, month) {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const previousMonthDays = [];
    for (let i = firstDayOfMonth.getDay() - 1; i >= 0; i--) {
        const date = new Date(year, month - 1, 0).getDate() - i;
        const day = daysInWeek[(firstDayOfMonth.getDay() - i - 1 + 7) % 7];
        const monthValue = month - 1 === 0 ? 12 : month - 1;
        const yearValue = month - 1 === 0 ? year - 1 : year;
        previousMonthDays.push({ date, day, month: monthValue, year: yearValue });
    }
    return previousMonthDays;
}

function getCurrentMonthDays(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const currentMonthDays = [];
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = daysInWeek[date.getDay()];
        currentMonthDays.push({ date: day, day: dayOfWeek, month, year });
    }
    return currentMonthDays;
}

function getNextMonthDays(year, month, totalDays) {
    const nextMonthDays = [];
    for (let i = 1; i <= (42 - totalDays); i++) {
        const date = new Date(year, month, i);
        const dayOfWeek = daysInWeek[date.getDay()];
        const monthValue = month + 1 > 12 ? 1 : month + 1;
        const yearValue = month + 1 > 12 ? year + 1 : year;
        nextMonthDays.push({ date: i, day: dayOfWeek, month: monthValue, year: yearValue });
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