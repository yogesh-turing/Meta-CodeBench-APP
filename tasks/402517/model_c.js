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
    if (month <= 0 || month > 12) {
        throw new Error("Month must be between 1 and 12");
    }
}

function getDateInfo(year, month) {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const lastDayOfPrevMonth = new Date(year, month - 1, 0);
    
    return {
        firstDayOfMonth,
        lastDayOfMonth,
        lastDayOfPrevMonth,
        firstDayIndex: firstDayOfMonth.getDay(),
        totalDaysInMonth: lastDayOfMonth.getDate(),
        totalDaysInPrevMonth: lastDayOfPrevMonth.getDate()
    };
}

function getPreviousMonthDays(dateInfo, year, month) {
    const prevMonthDays = [];
    const daysToAdd = dateInfo.firstDayIndex;
    
    for (let i = daysToAdd - 1; i >= 0; i--) {
        const date = dateInfo.totalDaysInPrevMonth - i;
        const dayIndex = (dateInfo.firstDayIndex - i - 1 + 7) % 7;
        const prevMonth = month - 1 === 0 ? 12 : month - 1;
        const prevYear = month - 1 === 0 ? year - 1 : year;
        
        prevMonthDays.push({
            date,
            day: daysInWeek[dayIndex],
            month: prevMonth,
            year: prevYear
        });
    }
    
    return prevMonthDays;
}

function getCurrentMonthDays(dateInfo, year, month) {
    return Array.from({ length: dateInfo.totalDaysInMonth }, (_, index) => {
        const day = index + 1;
        const currentDate = new Date(year, month - 1, day);
        
        return {
            date: day,
            day: daysInWeek[currentDate.getDay()],
            month: month,
            year: year
        };
    });
}

function getNextMonthDays(calendar, dateInfo, year, month) {
    const remainingDays = 42 - calendar.length;
    const nextMonth = month + 1 > 12 ? 1 : month + 1;
    const nextYear = month + 1 > 12 ? year + 1 : year;
    
    return Array.from({ length: remainingDays }, (_, index) => {
        const day = index + 1;
        const dayIndex = (dateInfo.firstDayIndex + dateInfo.totalDaysInMonth + day - 1) % 7;
        
        return {
            date: day,
            day: daysInWeek[dayIndex],
            month: nextMonth,
            year: nextYear
        };
    });
}

function getMonthlyCalendar(year, month) {
    validateInput(year, month);
    
    const dateInfo = getDateInfo(year, month);
    let calendar = [];
    
    // Add days from previous month
    calendar = calendar.concat(getPreviousMonthDays(dateInfo, year, month));
    
    // Add days from current month
    calendar = calendar.concat(getCurrentMonthDays(dateInfo, year, month));
    
    // Add days from next month
    calendar = calendar.concat(getNextMonthDays(calendar, dateInfo, year, month));
    
    return calendar;
}

module.exports = { getMonthlyCalendar };