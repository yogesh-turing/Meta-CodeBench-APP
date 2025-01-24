function getMonthlyCalendar(year, month) {
    // Input validation
    if (year == null || month == null || isNaN(year) || isNaN(month)) {
        throw new Error("Invalid input: year and month must be numbers");
    }
    if (year <= 0 || month <= 0 || month > 12) {
        throw new Error("Invalid input: year must be positive, month must be between 1 and 12");
    }

    const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const calendar = [];

    // Get the first day of the month and number of days in the month
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();

    // Get the last day of the previous month
    const lastDayOfPrevMonth = new Date(year, month - 1, 0).getDate();

    // Fill in the days from the previous month
    let prevMonthDays = firstDayOfMonth.getDay();
    for (let i = prevMonthDays - 1; i >= 0; i--) {
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        calendar.push({
            date: lastDayOfPrevMonth - i,
            day: daysInWeek[(prevMonthDays - i - 1 + 7) % 7],
            month: prevMonth,
            year: prevYear
        });
    }

    // Fill in the days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        calendar.push({
            date: day,
            day: daysInWeek[date.getDay()],
            month: month,
            year: year
        });
    }

    // Fill in the days from the next month
    let nextMonthDays = 42 - calendar.length;
    for (let i = 1; i <= nextMonthDays; i++) {
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        const date = new Date(nextYear, nextMonth - 1, i);
        calendar.push({
            date: i,
            day: daysInWeek[date.getDay()],
            month: nextMonth,
            year: nextYear
        });
    }

    return calendar;
}

module.exports = {
    getMonthlyCalendar
};