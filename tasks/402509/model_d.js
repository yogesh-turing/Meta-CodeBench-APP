function getMonthlyCalendar(year, month) {
    // Input validation
    if (year === null || year === undefined || typeof year !== 'number' || year <= 0) {
        throw new Error("Invalid year input");
    }
    if (month === null || month === undefined || typeof month !== 'number' || month <= 0 || month > 12) {
        throw new Error("Invalid month input");
    }

    const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const calendar = [];

    // Get the first day of the month
    const firstDay = new Date(year, month - 1, 1).getDay();
    
    // Get the number of days in the current month
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Get the number of days in the previous month
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

    // Add days from the previous month
    for (let i = 0; i < firstDay; i++) {
        const prevMonthDay = daysInPrevMonth - firstDay + i + 1;
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        calendar.push({
            date: prevMonthDay,
            day: daysInWeek[i],
            month: prevMonth,
            year: prevYear
        });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayOfWeek = (firstDay + day - 1) % 7;
        calendar.push({
            date: day,
            day: daysInWeek[dayOfWeek],
            month: month,
            year: year
        });
    }

    // Add days from the next month to complete 6 weeks
    const remainingDays = 42 - calendar.length;
    for (let i = 1; i <= remainingDays; i++) {
        const dayOfWeek = (firstDay + daysInMonth + i - 1) % 7;
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        calendar.push({
            date: i,
            day: daysInWeek[dayOfWeek],
            month: nextMonth,
            year: nextYear
        });
    }

    return calendar;
}

module.exports = {
    getMonthlyCalendar
};