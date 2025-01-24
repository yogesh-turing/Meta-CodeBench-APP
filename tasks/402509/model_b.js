function getMonthlyCalendar(year, month) {
    // Input validation
    if (year === null || year === undefined || typeof year !== 'number' || year <= 0) {
        throw new Error('Invalid year input');
    }
    if (month === null || month === undefined || typeof month !== 'number' || month <= 0 || month > 12) {
        throw new Error('Invalid month input');
    }

    const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const calendar = [];

    // Get the first day of the month
    const firstDay = new Date(year, month - 1, 1);
    const firstDayIndex = firstDay.getDay();

    // Get the last day of the previous month
    const lastDayPrevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = lastDayPrevMonth.getDate();

    // Get the number of days in the current month
    const daysInMonth = new Date(year, month, 0).getDate();

    // Fill in the days from the previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const date = daysInPrevMonth - i;
        const prevMonth = month - 1;
        const prevYear = prevMonth === 0 ? year - 1 : year;
        calendar.push({
            date: date,
            day: daysInWeek[(firstDayIndex - i - 1 + 7) % 7],
            month: prevMonth === 0 ? 12 : prevMonth,
            year: prevYear
        });
    }

    // Fill in the days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayOfWeek = (firstDayIndex + day - 1) % 7;
        calendar.push({
            date: day,
            day: daysInWeek[dayOfWeek],
            month: month,
            year: year
        });
    }

    // Fill in the remaining days from the next month
    const remainingDays = 42 - calendar.length;
    for (let i = 1; i <= remainingDays; i++) {
        const nextMonth = month + 1;
        const nextYear = nextMonth > 12 ? year + 1 : year;
        calendar.push({
            date: i,
            day: daysInWeek[(firstDayIndex + daysInMonth + i - 1) % 7],
            month: nextMonth > 12 ? 1 : nextMonth,
            year: nextYear
        });
    }

    return calendar;
}

module.exports = {
    getMonthlyCalendar
};