const DAYS_IN_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKS_IN_CALENDAR = 42; // 6 weeks * 7 days

const validateInput = (year, month) => {
    if (year == null || month == null || isNaN(year) || isNaN(month)) {
        throw new Error("Year and month must be valid numbers");
    }
    if (year <= 0 || month <= 0 || month > 12) {
        throw new Error("Invalid year or month value");
    }
};

const getAdjustedYearMonth = (year, month, adjustment) => {
    const adjustedMonth = month + adjustment;
    return {
        year: year + Math.floor((adjustedMonth - 1) / 12),
        month: ((adjustedMonth - 1 + 12) % 12) + 1
    };
};

const getDaysFromPreviousMonth = (year, month) => {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    if (firstDayWeekday === 0) return [];

    const { year: prevYear, month: prevMonth } = getAdjustedYearMonth(year, month, -1);
    const lastDayPrevMonth = new Date(year, month - 1, 0).getDate();
    
    return Array.from({ length: firstDayWeekday }, (_, index) => ({
        date: lastDayPrevMonth - firstDayWeekday + index + 1,
        day: DAYS_IN_WEEK[(index + 7) % 7],
        month: prevMonth,
        year: prevYear
    }));
};

const getDaysFromCurrentMonth = (year, month) => {
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    
    return Array.from({ length: lastDayOfMonth }, (_, index) => ({
        date: index + 1,
        day: DAYS_IN_WEEK[new Date(year, month - 1, index + 1).getDay()],
        month: month,
        year: year
    }));
};

const getDaysFromNextMonth = (year, month, currentCalendarLength) => {
    const remainingDays = WEEKS_IN_CALENDAR - currentCalendarLength;
    const { year: nextYear, month: nextMonth } = getAdjustedYearMonth(year, month, 1);
    
    return Array.from({ length: remainingDays }, (_, index) => ({
        date: index + 1,
        day: DAYS_IN_WEEK[new Date(year, month, index + 1).getDay()],
        month: nextMonth,
        year: nextYear
    }));
};

const getMonthlyCalendar = (year, month) => {
    validateInput(year, month);
    
    const previousMonthDays = getDaysFromPreviousMonth(year, month);
    const currentMonthDays = getDaysFromCurrentMonth(year, month);
    const nextMonthDays = getDaysFromNextMonth(
        year, 
        month, 
        previousMonthDays.length + currentMonthDays.length
    );
    
    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
};

module.exports = { getMonthlyCalendar };