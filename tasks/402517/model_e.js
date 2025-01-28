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

function getDateInfo(date) {
    return {
        date: date.getDate(),
        day: daysInWeek[date.getDay()],
        month: date.getMonth() + 1,
        year: date.getFullYear()
    };
}

function getPreviousMonthDays(firstDayOfMonth, lastDayPrevMonth) {
    const previousDays = [];
    const daysToAdd = firstDayOfMonth.getDay();
    
    for (let i = daysToAdd - 1; i >= 0; i--) {
        const prevDate = new Date(firstDayOfMonth);
        prevDate.setDate(lastDayPrevMonth.getDate() - i);
        previousDays.push(getDateInfo(prevDate));
    }
    return previousDays;
}

function getCurrentMonthDays(firstDayOfMonth, lastDayOfMonth) {
    const currentDays = [];
    const totalDays = lastDayOfMonth.getDate();
    
    for (let day = 1; day <= totalDays; day++) {
        const currentDate = new Date(firstDayOfMonth);
        currentDate.setDate(day);
        currentDays.push(getDateInfo(currentDate));
    }
    return currentDays;
}

function getNextMonthDays(lastDayOfMonth, remainingDays) {
    const nextDays = [];
    const nextMonth = new Date(lastDayOfMonth);
    nextMonth.setDate(lastDayOfMonth.getDate() + 1);
    
    for (let day = 1; day <= remainingDays; day++) {
        const nextDate = new Date(nextMonth);
        nextDate.setDate(day);
        nextDays.push(getDateInfo(nextDate));
    }
    return nextDays;
}

function getMonthlyCalendar(year, month) {
    validateInput(year, month);
    
    // Create date objects for key dates
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const lastDayPrevMonth = new Date(year, month - 1, 0);
    
    // Get calendar days for previous, current, and next month
    const previousMonthDays = getPreviousMonthDays(firstDayOfMonth, lastDayPrevMonth);
    const currentMonthDays = getCurrentMonthDays(firstDayOfMonth, lastDayOfMonth);
    const remainingDays = 42 - (previousMonthDays.length + currentMonthDays.length);
    const nextMonthDays = getNextMonthDays(lastDayOfMonth, remainingDays);
    
    // Combine all days into a single calendar array
    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
}

module.exports = { getMonthlyCalendar };