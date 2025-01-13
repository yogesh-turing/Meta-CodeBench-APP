const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function next(currentMonth, currentYear) {
  let updatedMonth = currentMonth + 1;
  let updatedYear = currentYear;

  if (updatedMonth > 11) {
    updatedMonth = 0;
    updatedYear++;
  }

  showCalendar(months[updatedMonth], updatedYear);
  return { updatedMonth: months[updatedMonth], updatedYear };
}

function previous(currentMonth, currentYear) {
  let updatedMonth = currentMonth - 1;
  let updatedYear = currentYear;

  if (updatedMonth < 0) {
    updatedMonth = 11;
    updatedYear--;
  }

  showCalendar(months[updatedMonth], updatedYear);
  return { updatedMonth: months[updatedMonth], updatedYear };
}

function jump(selectMonth, selectYear) {
  const isValidMonth = months.includes(selectMonth);
  const isValidYear = selectYear > 0;

  if (!isValidMonth || !isValidYear) {
    console.error("Invalid month or year selected");
    return;
  }

  showCalendar(selectMonth, selectYear);
  return { selectMonth, selectYear };
}

function showCalendar(month, year) {
  if (!months.includes(month) || year <= 0) {
    console.error("Invalid month or year");
    return;
  }

  const today = new Date();
  const currentMonth = months[today.getMonth()];
  const currentYear = today.getFullYear();
  const currentDay = today.getDate();

  console.log(`Calendar for ${month} ${year}`);

  // Generate the calendar grid
  const firstDayOfWeek = new Date(year, months.indexOf(month), 1).getDay();
  const daysInMonth = new Date(year, months.indexOf(month) + 1, 0).getDate();
  const weeks = Math.ceil((daysInMonth + firstDayOfWeek) / 7);

  for (let i = 0; i < weeks; i++) {
    let week = "";
    for (let j = 0; j < 7; j++) {
      const day = i * 7 + j - firstDayOfWeek + 1;
      if (day > 0 && day <= daysInMonth) {
        if (currentMonth === month && currentYear === year && currentDay === day) {
          week += `*${day} `;
        } else {
          week += `${day} `;
        }
      } else {
        week += "   ";
      }
    }
    console.log(week);
  }
}

module.exports = { next, previous, jump, showCalendar };