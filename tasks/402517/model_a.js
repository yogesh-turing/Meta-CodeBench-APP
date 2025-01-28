const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKS_IN_CALENDAR = 6;
const DAYS_IN_WEEK = 7;
const TOTAL_DAYS = WEEKS_IN_CALENDAR * DAYS_IN_WEEK;

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
    if (month <= 0 || month > 12) {
        throw new Error("Month must be between 1 and 12");
    }
}

function getAdjustedYearMonth(year, month, adjustment) {
    const newMonth = month + adjustment;
    return {
        year: year + Math.floor((newMonth - 1) / 12),
        month: ((newMonth - 1 + 12) % 12) + 1
    };
}

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function getPreviousMonthDays(firstDayOfMonth, year, month) {
    const prevMonth = getAdjustedYearMonth(year, month, -1);
    const daysFromPrevMonth = firstDayOfMonth.getDay();
    const prevMonthDays = getDaysInMonth(prevMonth.year, prevMonth.month);
    
    return Array.from({ length: daysFromPrevMonth }, (_, index) => ({
        date: prevMonthDays - daysFromPrevMonth + index + 1,
        day: daysInWeek[(index + 7) % 7],
        month: prevMonth.month,
        year: prevMonth.year
    }));
}

function getCurrentMonthDays(firstDayOfMonth, daysInCurrentMonth, month, year) {
    return Array.from({ length: daysInCurrentMonth }, (_, index) => ({
        date: index + 1,
        day: daysInWeek[(firstDayOfMonth.getDay() + index) % 7],
        month: month,
        year: year
    }));
}

function getNextMonthDays(remainingDays, year, month, startingDayIndex) {
    const nextMonth = getAdjustedYearMonth(year, month, 1);
    
    return Array.from({ length: remainingDays }, (_, index) => ({
        date: index + 1,
        day: daysInWeek[(startingDayIndex + index) % 7],
        month: nextMonth.month,
        year: nextMonth.year
    }));
}

function getMonthlyCalendar(year, month) {
    validateInput(year, month);

    const firstDayOfMonth = new Date(year, month - 1, 1);
    const daysInCurrentMonth = getDaysInMonth(year, month);
    
    const calendar = [
        ...getPreviousMonthDays(firstDayOfMonth, year, month),
        ...getCurrentMonthDays(firstDayOfMonth, daysInCurrentMonth, month, year)
    ];
    
    const remainingDays = TOTAL_DAYS - calendar.length;
    const startingDayIndex = (firstDayOfMonth.getDay() + daysInCurrentMonth) % 7;
    
    return [
        ...calendar,
        ...getNextMonthDays(remainingDays, year, month, startingDayIndex)
    ];
}

module.exports = { getMonthlyCalendar };