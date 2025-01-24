function getMonthlyCalendar(year, month) {
    // Input validation
    if (year == null || month == null || isNaN(year) || isNaN(month)) {
        throw new Error("Year and month must be valid numbers");
    }
    if (year <= 0 || month <= 0 || month > 12) {
        throw new Error("Invalid year or month. Year should be positive, and month should be between 1 and 12");
    }

    const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const calendar = [];

    // Get the first day of the month
    const firstDay = new Date(year, month - 1, 1);
    const firstDayIndex = firstDay.getDay();

    // Get the last day of the previous month
    const prevMonthLastDay = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonthLastDay.getDate();

    // Get the last day of the current month
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();

    // Fill in the days from the previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const date = daysInPrevMonth - i;
        const prevMonth = month - 1;
        const prevYear = prevMonth === 0 ? year - 1 : year;
        calendar.push({
            date,
            day: daysInWeek[(firstDayIndex - i - 1 + 7) % 7],
            month: prevMonth === 0 ? 12 : prevMonth,
            year: prevYear
        });
    }

    // Fill in the days of the current month
    for (let date = 1; date <= daysInMonth; date++) {
        const dayIndex = (firstDayIndex + date - 1) % 7;
        calendar.push({
            date,
            day: daysInWeek[dayIndex],
            month,
            year
        });
    }

    // Fill in the days from the next month
    let nextDate = 1;
    while (calendar.length < 42) {
        const dayIndex = (firstDayIndex + daysInMonth + nextDate - 1) % 7;
        const nextMonth = month + 1;
        const nextYear = nextMonth === 13 ? year + 1 : year;
        calendar.push({
            date: nextDate,
            day: daysInWeek[dayIndex],
            month: nextMonth === 13 ? 1 : nextMonth,
            year: nextYear
        });
        nextDate++;
    }

    return calendar;
}

module.exports = {
    getMonthlyCalendar
};