const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function next(currentMonth, currentYear) {
    let updatedMonth = currentMonth + 1;
    let updatedYear = currentYear;

    if (updatedMonth > 11) {
        updatedMonth = 0;
        updatedYear++;
    }

    showCalendar(updatedMonth, updatedYear);
    return { month: updatedMonth, year: updatedYear };
}

function previous(currentMonth, currentYear) {
    let updatedMonth = currentMonth - 1;
    let updatedYear = currentYear;

    if (updatedMonth < 0) {
        updatedMonth = 11;
        updatedYear--;
    }

    showCalendar(updatedMonth, updatedYear);
    return { month: updatedMonth, year: updatedYear };
}

function jump(selectMonth, selectYear) {
    if (selectMonth < 0 || selectMonth > 11 || selectYear < 1) {
        console.error("Invalid month or year selected");
        return;
    }

    showCalendar(selectMonth, selectYear);
    return { month: selectMonth, year: selectYear };
}

function showCalendar(month, year) {
    if (month < 0 || month > 11 || year < 1) {
        console.error("Invalid month or year");
        return;
    }

    console.log(`Calendar for ${months[month]} ${year}`);

    const today = new Date();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    const todayDay = today.getDate();

    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < 6; i++) {
        let row = "";
        for (let j = 0; j < 7; j++) {
            const day = i * 7 + j - firstDayOfWeek + 1;
            if (day < 1 || day > daysInMonth) {
                row += "   ";
            } else {
                if (todayMonth === month && todayYear === year && todayDay === day) {
                    row += `*${day.toString().padStart(2, " ")} `;
                } else {
                    row += `${day.toString().padStart(2, " ")} `;
                }
            }
        }
        console.log(row);
    }
}

module.exports = { next, previous, jump, showCalendar };