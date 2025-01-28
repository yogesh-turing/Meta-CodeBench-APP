const DAYS_IN_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKS_IN_CALENDAR = 42; // 6 weeks * 7 days

function validateInput(year, month) {
    if (year == null || month == null || isNaN(year) || isNaN(month)) {
        throw new Error("Year and month must be valid numbers");
    }
    if (year <= 0 || month <= 0 || month > 12) {
        throw new Error("Invalid year or month value");
    }
}

function getPreviousMonthDays(year, month) {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    if (firstDayWeekday === 0) return [];
    
    const previousMonth = month - 1;
    const previousMonthYear = previousMonth === 0 ? year - 1 : year;
    const previousMonthValue = previousMonth === 0 ? 12 : previousMonth;
    const lastDayPrevMonth = new Date(year, month - 1, 0).getDate();
    
    return Array.from({ length: firstDayWeekday }, (_, index) => ({
        date: lastDayPrevMonth - firstDayWeekday + index + 1,
        day: DAYS_IN_WEEK[(index + 7) % 7],
        month: previousMonthValue,
        year: previousMonthYear
    }));
}

function getCurrentMonthDays(year, month) {
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    
    return Array.from({ length: lastDayOfMonth }, (_, index) => ({
        date: index + 1,
        day: DAYS_IN_WEEK[new Date(year, month - 1, index + 1).getDay()],
        month: month,
        year: year
    }));
}

function getNextMonthDays(year, month, currentCalendarLength) {
    const remainingDays = WEEKS_IN_CALENDAR - currentCalendarLength;
    if (remainingDays <= 0) return [];
    
    const nextMonth = month + 1;
    const nextMonthYear = nextMonth > 12 ? year + 1 : year;
    const nextMonthValue = nextMonth > 12 ? 1 : nextMonth;
    const firstDayNextMonth = new Date(year, month, 1);
    
    return Array.from({ length: remainingDays }, (_, index) => ({
        date: index + 1,
        day: DAYS_IN_WEEK[(firstDayNextMonth.getDay() + index) % 7],
        month: nextMonthValue,
        year: nextMonthYear
    }));
}

function getMonthlyCalendar(year, month) {
    validateInput(year, month);
    
    const previousMonthDays = getPreviousMonthDays(year, month);
    const currentMonthDays = getCurrentMonthDays(year, month);
    const nextMonthDays = getNextMonthDays(
        year, 
        month, 
        previousMonthDays.length + currentMonthDays.length
    );
    
    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
}

module.exports = { getMonthlyCalendar };