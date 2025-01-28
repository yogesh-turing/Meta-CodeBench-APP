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
    const previousMonthLastDate = new Date(year, month - 1, 0).getDate();
    const previousMonth = month - 1 === 0 ? 12 : month - 1;
    const previousYear = month - 1 === 0 ? year - 1 : year;

    return Array.from({ length: firstDayWeekday }, (_, index) => ({
        date: previousMonthLastDate - firstDayWeekday + index + 1,
        day: DAYS_IN_WEEK[(index + 7) % 7],
        month: previousMonth,
        year: previousYear
    }));
}

function getCurrentMonthDates(year, month) {
    const lastDateOfMonth = new Date(year, month, 0).getDate();
    
    return Array.from({ length: lastDateOfMonth }, (_, index) => ({
        date: index + 1,
        day: DAYS_IN_WEEK[new Date(year, month - 1, index + 1).getDay()],
        month: month,
        year: year
    }));
}

function getNextMonthDates(year, month, currentCalendarLength) {
    const remainingDays = WEEKS_IN_CALENDAR - currentCalendarLength;
    const nextMonth = month + 1 > 12 ? 1 : month + 1;
    const nextYear = month + 1 > 12 ? year + 1 : year;
    const firstDayOfMonth = new Date(year, month - 1, 1);

    return Array.from({ length: remainingDays }, (_, index) => ({
        date: index + 1,
        day: DAYS_IN_WEEK[(firstDayOfMonth.getDay() + new Date(year, month, 0).getDate() + index) % 7],
        month: nextMonth,
        year: nextYear
    }));
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