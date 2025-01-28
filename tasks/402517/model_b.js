const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKS_IN_CALENDAR = 6;
const DAYS_IN_WEEK = 7;

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

function getAdjustedYearMonth(year, month, monthOffset) {
    const newMonth = month + monthOffset;
    return {
        year: year + Math.floor((newMonth - 1) / 12),
        month: ((newMonth - 1) % 12) + 1
    };
}

function getDaysFromPreviousMonth(firstDayOfMonth, year, month) {
    const prevMonthInfo = getAdjustedYearMonth(year, month, -1);
    const lastDayOfPrevMonth = new Date(prevMonthInfo.year, prevMonthInfo.month, 0).getDate();
    const daysNeeded = firstDayOfMonth.getDay();
    
    return Array.from({ length: daysNeeded }, (_, index) => {
        const date = lastDayOfPrevMonth - daysNeeded + index + 1;
        return {
            date,
            day: daysInWeek[new Date(prevMonthInfo.year, prevMonthInfo.month - 1, date).getDay()],
            month: prevMonthInfo.month,
            year: prevMonthInfo.year
        };
    });
}

function getDaysFromCurrentMonth(year, month, totalDays) {
    return Array.from({ length: totalDays }, (_, index) => {
        const date = index + 1;
        return {
            date,
            day: daysInWeek[new Date(year, month - 1, date).getDay()],
            month,
            year
        };
    });
}

function getDaysFromNextMonth(remainingDays, year, month) {
    const nextMonthInfo = getAdjustedYearMonth(year, month, 1);
    
    return Array.from({ length: remainingDays }, (_, index) => {
        const date = index + 1;
        return {
            date,
            day: daysInWeek[new Date(nextMonthInfo.year, nextMonthInfo.month - 1, date).getDay()],
            month: nextMonthInfo.month,
            year: nextMonthInfo.year
        };
    });
}

function getMonthlyCalendar(year, month) {
    validateInput(year, month);

    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();
    
    const calendar = [
        ...getDaysFromPreviousMonth(firstDayOfMonth, year, month),
        ...getDaysFromCurrentMonth(year, month, totalDaysInMonth)
    ];
    
    const remainingDays = (WEEKS_IN_CALENDAR * DAYS_IN_WEEK) - calendar.length;
    calendar.push(...getDaysFromNextMonth(remainingDays, year, month));

    return calendar;
}

module.exports = { getMonthlyCalendar };