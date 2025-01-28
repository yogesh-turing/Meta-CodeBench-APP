const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function validateInput(year, month) {
    if (year == null || month == null || isNaN(year) || isNaN(month) || year <= 0 || month <= 0 || month > 12) {
        throw new Error("Invalid year or month value");
    }
}

function getPreviousMonthDays(year, month, firstDay) {
    const previousMonth = month - 1 === 0 ? 12 : month - 1;
    const previousYear = month - 1 === 0 ? year - 1 : year;
    const previousMonthDate = new Date(year, month - 1, 0);
    const previousMonthDays = Array(firstDay).fill(0).map((_, i) => {
        return {
            date: previousMonthDate.getDate() - i,
            day: daysInWeek[(previousMonthDate.getDay() - i - 1 + 7) % 7],
            month: previousMonth,
            year: previousYear
        };
    });
    return previousMonthDays;
}

function getCurrentMonthDays(year, month) {
    const currentMonthDate = new Date(year, month, 0);
    const currentMonthDays = Array(currentMonthDate.getDate()).fill(0).map((_, i) => {
        return {
            date: i + 1,
            day: daysInWeek[(new Date(year, month - 1, i + 1)).getDay()],
            month: month,
            year: year
        };
    });
    return currentMonthDays;
}

function getNextMonthDays(year, month, nextMonthDays) {
    const nextMonth = month + 1 > 12 ? 1 : month + 1;
    const nextYear = month + 1 > 12 ? year + 1 : year;
    const nextMonthDate = new Date(year, month - 1, 1);
    const nextMonthDaysArray = Array(nextMonthDays).fill(0).map((_, i) => {
        return {
            date: i + 1,
            day: daysInWeek[(nextMonthDate.getDay() + (new Date(year, month, 0).getDate()) + i) % 7],
            month: nextMonth,
            year: nextYear
        };
    });
    return nextMonthDaysArray;
}

function getMonthlyCalendar(year, month) {
    validateInput(year, month);
    const firstDay = (new Date(year, month - 1, 1).getDay());
    const previousMonthDays = getPreviousMonthDays(year, month, firstDay);
    const currentMonthDays = getCurrentMonthDays(year, month);
    const nextMonthDays = 42 - previousMonthDays.length - currentMonthDays.length;
    const nextMonthDaysArray = getNextMonthDays(year, month, nextMonthDays);
    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDaysArray];
}

module.exports = { getMonthlyCalendar };