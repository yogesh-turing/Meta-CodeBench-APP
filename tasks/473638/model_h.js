const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function next(currentMonth, currentYear) {
    let updatedMonth, updatedYear;

    // If the current month is December, reset to January and increment the year
    if (currentMonth === 11) {
        updatedMonth = 0;
        updatedYear = currentYear + 1;
    } else {
        updatedMonth = currentMonth + 1;
        updatedYear = currentYear;
    }

    showCalendar(updatedMonth, updatedYear);

    return { updatedMonth: months[updatedMonth], updatedYear };
}

function previous(currentMonth, currentYear) {
    let updatedMonth, updatedYear;

    // If the current month is January, reset to December and decrement the year
    if (currentMonth === 0) {
        updatedMonth = 11;
        updatedYear = currentYear - 1;
    } else {
        updatedMonth = currentMonth - 1;
        updatedYear = currentYear;
    }

    showCalendar(updatedMonth, updatedYear);

    return { updatedMonth: months[updatedMonth], updatedYear };
}

function jump(selectMonth, selectYear) {
    // Validate the selected month and year
    if (selectMonth < 0 || selectMonth > 11 || selectYear < 1) {
        console.error("Invalid month or year selected");
        return;
    }

    showCalendar(selectMonth, selectYear);

    return { selectMonth: months[selectMonth], selectYear };
}

function showCalendar(month, year) {
    // Validate the input for the month and year
    if (month < 0 || month > 11 || year < 1) {
        console.error("Invalid month or year");
        return;
    }

    // Display the calendar for the given month and year
    console.log(`Calendar for ${months[month]} ${year}`);

    // Get the current date
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Generate the calendar grid
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    let day = 1;

    for (let i = 0; i < 6; i++) {
        let week = "";
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDayOfWeek) {
                week += "   ";
            } else if (day > lastDayOfMonth) {
                week += "   ";
            } else {
                // Check if today is the selected day
                if (day === currentDay && month === currentMonth && year === currentYear) {
                    week += `*${day.toString().padStart(2, " ")} `;
                } else {
                    week += `${day.toString().padStart(2, " ")} `;
                }
                day++;
            }
        }
        console.log(week);
    }
}

// Example usage:
// const { next, previous, jump, showCalendar } = module.exports;

// showCalendar(0, 2024);
// jump(5, 2024);
// next(5, 2024);
// previous(5, 2024);

module.exports = { next, previous, jump, showCalendar };