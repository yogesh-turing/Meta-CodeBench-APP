const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getMonthlyCalendar(year, month) {
    validateInput(year, month);
    const firstDate = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 0);

    const previousMonthDays = getPreviousMonthDays(firstDate, lastDate);
    const currentMonthDays = getCurrentMonthDays(firstDate, lastDate);
    const nextMonthDays = getNextMonthDays(firstDate, lastDate, previousMonthDays.length + currentMonthDays.length);

    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
}

function validateInput(year, month) {
    if (isNaN(year) || isNaN(month) || year <= 0 || month <= 0 || month > 12) {
        throw new Error("Invalid year or month value");
    }
}

function getPreviousMonthDays(firstDate, lastDate) {
    const previousMonthLastDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 0);
    const days = Array.from({ length: firstDate.getDay() }, (_, i) => ({
        date: previousMonthLastDate.getDate() - i,
        day: daysInWeek[(firstDate.getDay() - i - 1 + 7) % 7],
        month: previousMonthLastDate.getMonth() + 1,
        year: previousMonthLastDate.getFullYear()
    }));
    return days.reverse();
}

function getCurrentMonthDays(firstDate, lastDate) {
    return Array.from({ length: lastDate.getDate() }, (_, i) => ({
        date: i + 1,
        day: daysInWeek[(new Date(firstDate.getFullYear(), firstDate.getMonth(), i + 1)).getDay()],
        month: firstDate.getMonth() + 1,
        year: firstDate.getFullYear()
    }));
}

function getNextMonthDays(firstDate, lastDate, currentLength) {
    const nextMonthFirstDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + 1, 1);
    const daysNeeded = 42 - currentLength;
    return Array.from({ length: daysNeeded }, (_, i) => ({
        date: i + 1,
        day: daysInWeek[(nextMonthFirstDate.getDay() + i) % 7],
        month: nextMonthFirstDate.getMonth() + 1,
        year: nextMonthFirstDate.getFullYear()
    }));
}

module.exports = { getMonthlyCalendar };