const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getMonthlyCalendar(year, month) {
    // Input validation
    if (year == null || month == null || isNaN(year) || isNaN(month)) throw new Error("Year and month must be valid numbers");
    if (year <= 0 || month <= 0 || month > 12) throw new Error("Invalid year or month value");
    const calendar = [];    
    for (let i = (new Date(year, month - 1, 1).getDay()) - 1; i >= 0; i--)  calendar.push({ date: (new Date(year, month - 1, 0).getDate()) - i, day: daysInWeek[((new Date(year, month - 1, 1).getDay()) - i - 1 + 7) % 7], month: (month - 1 === 0 ? 12 : month - 1), year: (month - 1 === 0 ? year - 1 : year) });
    for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) calendar.push({ date: day, day: daysInWeek[(new Date(year, month - 1, day)).getDay()], month: month, year: year });
    let nextMonthDays = 42 - calendar.length;
    for (let i = 1; i <= nextMonthDays; i++)  calendar.push({ date: i, day: daysInWeek[(new Date(year, month - 1, 1).getDay() + (new Date(year, month, 0).getDate()) + i - 1) % 7], month: (month + 1 > 12 ? 1 : month + 1), year: (month + 1 > 12 ? year + 1 : year)});
    return calendar;
}

module.exports = {
    getMonthlyCalendar
};
