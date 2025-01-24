function getMonthlyCalendar(year, month) {
    if (!Number.isInteger(year) || !Number.isInteger(month)) {
        throw new Error('Year and month should be integers');
    }

    if (year <= 0) {
        throw new Error('Year should be a positive integer');
    }

    if (month <= 0 || month > 12) {
        throw new Error('Month should be an integer between 1 and 12');
    }

    const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(year, month - 1, 1);
    const calendar = [];

    const firstDay = date.getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    const lastDateOfLastMonth = new Date(year, month - 1, 0);
    const lastMonth = lastDateOfLastMonth.getMonth() + 1;
    const lastYear = lastDateOfLastMonth.getFullYear();

    for (let i = 0; i < firstDay; i++) {
        const day = lastDateOfLastMonth.getDate() - firstDay + i + 1;
        const dayOfWeek = (firstDay + i - 1) % 7;
        calendar.push({ date: day, day: daysInWeek[dayOfWeek], month: lastMonth, year: lastYear });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayOfWeek = (firstDay + day - 1) % 7;
        calendar.push({ date: day, day: daysInWeek[dayOfWeek], month, year });
    }

    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const nextDate = new Date(nextYear, nextMonth - 1, 1);

    while (calendar.length < 42) {
        const day = nextDate.getDate();
        const dayOfWeek = nextDate.getDay();
        calendar.push({ date: day, day: daysInWeek[dayOfWeek], month: nextMonth, year: nextYear });
        nextDate.setDate(nextDate.getDate() + 1);
    }

    return calendar;
}

module.exports = {
    getMonthlyCalendar
};
