const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function next(currentMonth, currentYear) {
    let updatedMonth = currentMonth + 1;
    let updatedYear = currentYear;

    if (updatedMonth > 11) {
        updatedMonth = 0;
        updatedYear++;
    }

    showCalendar(updatedMonth, updatedYear);
    return { updatedMonth, updatedYear };
}

function previous(currentMonth, currentYear) {
    let updatedMonth = currentMonth - 1;
    let updatedYear = currentYear;

    if (updatedMonth < 0) {
        updatedMonth = 11;
        updatedYear--;
    }

    showCalendar(updatedMonth, updatedYear);
    return { updatedMonth, updatedYear };
}

function jump(selectMonth, selectYear) {
    if (selectMonth < 0 || selectMonth > 11 || selectYear < 1) {
        console.error("Invalid month or year selected");
        return;
    }

    showCalendar(selectMonth, selectYear);
    return { selectMonth, selectYear };
}

function showCalendar(month, year) {
    if (month < 0 || month > 11 || year < 1) {
        console.error("Invalid month or year");
        return;
    }

    console.log(`Calendar for ${months[month]} ${year}`);

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();

    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < 6; i++) {
        let week = "";
        for (let j = 0; j < 7; j++) {
            const day = i * 7 + j - firstDayOfWeek + 1;
            if (day > 0 && day <= daysInMonth) {
                if (currentMonth === month && currentYear === year && currentDay === day) {
                    week += `*${day}\t`;
                } else {
                    week += `${day}\t`;
                }
            } else {
                week += "\t";
            }
        }
        console.log(week);
    }
}

module.exports = { next, previous, jump, showCalendar };