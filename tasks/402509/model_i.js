function getMonthlyCalendar(year, month) {
    if (!year || !month) {
        throw new Error('Year and month are required');
    }

    if (typeof year !== 'number' || typeof month !== 'number') {
        throw new Error('Year and month must be numbers');
    }

    if (year < 1 || month < 1) {
        throw new Error('Year and month must be positive');
    }

    if (month > 12) {
        throw new Error('Month must be between 1 and 12');
    }

    const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(year, month - 1, 1);
    const calendar = [];

    const firstDay = date.getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    // Add last days of last month if first day is not Sunday
    for (let i = 0; i < firstDay; i++) {
        const lastDate = new Date(year, month - 1, 0);
        const lastDay = lastDate.getDate() - firstDay + i + 1;
        const lastMonth = month - 1;
        const lastYear = year;

        if (lastMonth === 0) {
            lastMonth = 12;
            lastYear -= 1;
        }

        calendar.push({
            date: lastDay,
            day: daysInWeek[i],
            month: lastMonth,
            year: lastYear
        });
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayOfWeek = (firstDay + day - 1) % 7;
        calendar.push({
            date: day,
            day: daysInWeek[dayOfWeek],
            month: month,
            year: year
        });
    }

    // Add days of next month if necessary
    while (calendar.length < 42) {
        const nextDate = new Date(year, month, calendar.length - firstDay + 1);
        const nextDay = nextDate.getDate();
        const nextMonth = nextDate.getMonth() + 1;
        const nextYear = nextDate.getFullYear();

        calendar.push({
            date: nextDay,
            day: daysInWeek[(firstDay + nextDay - 1) % 7],
            month: nextMonth,
            year: nextYear
        });
    }

    return calendar;
}

module.exports = {
    getMonthlyCalendar
};