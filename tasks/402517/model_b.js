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

function getPreviousMonthDates(year, month) {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    if (firstDayWeekday === 0) return [];

    const previousMonth = month - 1;
    const previousMonthYear = previousMonth === 0 ? year - 1 : year;
    const previousMonthValue = previousMonth === 0 ? 12 : previousMonth;
    const lastDayOfPreviousMonth = new Date(year, month - 1, 0).getDate();

    return Array.from({ length: firstDayWeekday }, (_, index) => {
        const date = lastDayOfPreviousMonth - firstDayWeekday + index + 1;
        return {
            date,
            day: DAYS_IN_WEEK[(firstDayWeekday + index) % 7],
            month: previousMonthValue,
            year: previousMonthYear
        };
    });
}

function getCurrentMonthDates(year, month) {
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    
    return Array.from({ length: lastDayOfMonth }, (_, index) => {
        const date = index + 1;
        return {
            date,
            day: DAYS_IN_WEEK[new Date(year, month - 1, date).getDay()],
            month,
            year
        };
    });
}

function getNextMonthDates(year, month, currentCalendarLength) {
    const remainingDays = WEEKS_IN_CALENDAR - currentCalendarLength;
    if (remainingDays <= 0) return [];

    const nextMonth = month + 1;
    const nextMonthYear = nextMonth > 12 ? year + 1 : year;
    const nextMonthValue = nextMonth > 12 ? 1 : nextMonth;
    const firstDayOfCurrentMonth = new Date(year, month - 1, 1);

    return Array.from({ length: remainingDays }, (_, index) => {
        const date = index + 1;
        const dayIndex = (firstDayOfCurrentMonth.getDay() + new Date(year, month, 0).getDate() + date - 1) % 7;
        return {
            date,
            day: DAYS_IN_WEEK[dayIndex],
            month: nextMonthValue,
            year: nextMonthYear
        };
    });
}

function getMonthlyCalendar(year, month) {
    validateInput(year, month);
    
    const previousMonthDates = getPreviousMonthDates(year, month);
    const currentMonthDates = getCurrentMonthDates(year, month);
    const nextMonthDates = getNextMonthDates(
        year, 
        month, 
        previousMonthDates.length + currentMonthDates.length
    );

    return [...previousMonthDates, ...currentMonthDates, ...nextMonthDates];
}

module.exports = { getMonthlyCalendar };