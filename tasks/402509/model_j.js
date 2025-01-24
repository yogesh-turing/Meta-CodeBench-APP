function getMonthlyCalendar(year, month) {
    if (year === null || year === undefined || typeof year !== 'number' || year <= 0) {
        throw new Error('Invalid year');
    }

    if (month === null || month === undefined || typeof month !== 'number' || month < 1 || month > 12) {
        throw new Error('Invalid month');
    }

    const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(year, month - 1, 1);
    const calendar = [];

    const firstDay = date.getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const lastDateOfMonth = new Date(year, month, 0);
    const lastDateOfLastMonth = new Date(year, month - 1, 0);

    // fill the first week with the last days of last month
    for (let i = 0; i < firstDay; i++) {
        const day = lastDateOfLastMonth.getDate() - firstDay + i + 1;
        calendar.push({ date: day, day: daysInWeek[i], month: month - 1, year });
    }

    // fill the calendar with the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayOfWeek = (firstDay + day - 1) % 7;
        calendar.push({ date: day, day: daysInWeek[dayOfWeek], month, year });
    }

    // fill the rest of the calendar with the days of the next month
    let nextMonthDay = 1;
    while (calendar.length < 42) {
        const dayOfWeek = (firstDay + daysInMonth + nextMonthDay - 1) % 7;
        calendar.push({ date: nextMonthDay, day: daysInWeek[dayOfWeek], month: month + 1, year: month === 12 ? year + 1 : year });
        nextMonthDay++;
    }

    return calendar;
}

module.exports = {
    getMonthlyCalendar
};