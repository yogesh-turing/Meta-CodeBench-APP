const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function validateInput(year, month) {
    if (year == null || month == null) {
        throw new Error("Year and month are required");
    }
    if (isNaN(year) || isNaN(month)) {
        throw new Error("Year and month must be numbers");
    }
    if (year <= 0) {
        throw new Error("Year must be positive");
    }
    if (month < 1 || month > 12) {
        throw new Error("Month must be between 1 and 12");
    }
}

function getAdjustedYearMonth(year, month) {
    return {
        prevMonth: month - 1 === 0 ? 12 : month - 1,
        prevYear: month - 1 === 0 ? year - 1 : year,
        nextMonth: month + 1 > 12 ? 1 : month + 1,
        nextYear: month + 1 > 12 ? year + 1 : year
    };
}

function getPreviousMonthDays(firstDayOfMonth, lastDayOfPrevMonth, prevMonth, prevYear) {
    const previousDays = [];
    const startDay = firstDayOfMonth.getDay();
    
    for (let i = startDay - 1; i >= 0; i--) {
        previousDays.push({
            date: lastDayOfPrevMonth - i,
            day: daysInWeek[(startDay - i - 1 + 7) % 7],
            month: prevMonth,
            year: prevYear
        });
    }
    return previousDays;
}

function getCurrentMonthDays(year, month, lastDayOfMonth) {
    return Array.from({ length: lastDayOfMonth }, (_, index) => {
        const currentDate = new Date(year, month - 1, index + 1);
        return {
            date: index + 1,
            day: daysInWeek[currentDate.getDay()],
            month: month,
            year: year
        };
    });
}

function getNextMonthDays(remainingDays, firstDayNextMonth, nextMonth, nextYear) {
    return Array.from({ length: remainingDays }, (_, index) => ({
        date: index + 1,
        day: daysInWeek[(firstDayNextMonth.getDay() + index) % 7],
        month: nextMonth,
        year: nextYear
    }));
}

function getMonthlyCalendar(year, month) {
    validateInput(year, month);

    // Calculate important dates
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const lastDayOfPrevMonth = new Date(year, month - 1, 0).getDate();
    const firstDayNextMonth = new Date(year, month, 1);

    // Get adjusted year and month values
    const { prevMonth, prevYear, nextMonth, nextYear } = getAdjustedYearMonth(year, month);

    // Generate calendar days
    const calendar = [
        ...getPreviousMonthDays(firstDayOfMonth, lastDayOfPrevMonth, prevMonth, prevYear),
        ...getCurrentMonthDays(year, month, lastDayOfMonth)
    ];

    // Calculate and add remaining days from next month
    const remainingDays = 42 - calendar.length;
    calendar.push(...getNextMonthDays(remainingDays, firstDayNextMonth, nextMonth, nextYear));

    return calendar;
}

module.exports = { getMonthlyCalendar };