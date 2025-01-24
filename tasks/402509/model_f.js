function getMonthlyCalendar(year, month) {
    if (!year || !month) {
        throw new Error("Year and month are required");
    }

    if (typeof year !== "number" || typeof month !== "number") {
        throw new Error("Year and month must be numbers");
    }

    if (year < 1 || month < 1 || month > 12) {
        throw new Error("Invalid year or month");
    }

    const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const date = new Date(year, month - 1, 1);
    const calendar = [];

    const firstDay = date.getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    let day = 1;

    // Add last days of the previous month
    for (let i = 0; i < firstDay; i++) {
        const prevDate = new Date(date);
        prevDate.setDate(0);
        prevDate.setDate(prevDate.getDate() - firstDay + i + 1);
        calendar.push({
            date: prevDate.getDate(),
            day: daysInWeek[i],
            month: prevDate.getMonth() + 1,
            year: prevDate.getFullYear(),
        });
    }

    // Add days of the current month
    for (let i = firstDay; i < firstDay + daysInMonth; i++) {
        const dayOfWeek = i % 7;
        calendar.push({
            date: day,
            day: daysInWeek[dayOfWeek],
            month,
            year,
        });
        day++;
    }

    // Add days of the next month
    while (calendar.length < 42) {
        const nextDate = new Date(date);
        nextDate.setMonth(nextDate.getMonth() + 1);
        nextDate.setDate(day - daysInMonth);
        const dayOfWeek = (firstDay + day - 1) % 7;
        calendar.push({
            date: nextDate.getDate(),
            day: daysInWeek[dayOfWeek],
            month: nextDate.getMonth() + 1,
            year: nextDate.getFullYear(),
        });
        day++;
    }

    return calendar;
}

module.exports = {
    getMonthlyCalendar,
};