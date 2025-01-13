const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function next(currentMonth, currentYear) {
    let updatedMonth = currentMonth;
    let updatedYear = currentYear;

    if (currentMonth === 11) {
        updatedMonth = 0;
        updatedYear = currentYear + 1;
    } else {
        updatedMonth = currentMonth + 1;
    }

    showCalendar(updatedMonth, updatedYear);
    return { month: updatedMonth, year: updatedYear };
}

function previous(currentMonth, currentYear) {
    let updatedMonth = currentMonth;
    let updatedYear = currentYear;

    if (currentMonth === 0) {
        updatedMonth = 11;
        updatedYear = currentYear - 1;
    } else {
        updatedMonth = currentMonth - 1;
    }

    showCalendar(updatedMonth, updatedYear);
    return { month: updatedMonth, year: updatedYear };
}

function jump(selectMonth, selectYear) {
    // Validate month (0-11) and year (positive number)
    if (selectMonth < 0 || selectMonth > 11 || !Number.isInteger(selectYear) || selectYear < 0) {
        console.error("Invalid month or year selected");
        return null;
    }

    showCalendar(selectMonth, selectYear);
    return { month: selectMonth, year: selectYear };
}

function showCalendar(month, year) {
    // Validate inputs
    if (month < 0 || month > 11 || !Number.isInteger(year) || year < 0) {
        console.error("Invalid month or year");
        return;
    }

    console.log(`Calendar for ${months[month]} ${year}`);

    // Get first day of month and total days in month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    // Get current date for comparison
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Generate calendar days
    for (let day = 1; day <= totalDays; day++) {
        if (day === currentDay && month === currentMonth && year === currentYear) {
            console.log(`*Today's Date: ${day}`);
        } else {
            console.log(day);
        }
    }
}

module.exports = { next, previous, jump, showCalendar };