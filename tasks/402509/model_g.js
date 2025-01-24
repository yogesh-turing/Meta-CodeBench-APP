function getMonthlyCalendar(year, month) {
  if (typeof year !== 'number' || typeof month !== 'number') {
      throw new Error('Year and month must be numbers');
  }
  if (year < 1 || month < 1 || month > 12) {
      throw new Error('Invalid year or month');
  }

  const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = new Date(year, month - 1, 1);
  const calendar = [];

  const firstDay = date.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  // Add last days of last month
  if (firstDay > 0) {
      const lastMonthDate = new Date(year, month - 1, 0);
      const lastMonthDays = lastMonthDate.getDate();
      for (let i = 0; i < firstDay; i++) {
          calendar.push({
              date: lastMonthDays - firstDay + i + 1,
              day: daysInWeek[i],
              month: month - 1,
              year: year
          });
      }
  }

  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = (firstDay + day - 1) % 7;
      calendar.push({
          date: day,
          day: daysInWeek[dayOfWeek],
          month: month,
          year: year
      });
  }

  // Add days of next month
  while (calendar.length < 42) {
      const nextMonthDate = new Date(year, month, calendar.length - daysInMonth + 1);
      const nextMonthDay = nextMonthDate.getDate();
      const nextMonthDayOfWeek = nextMonthDate.getDay();
      calendar.push({
          date: nextMonthDay,
          day: daysInWeek[nextMonthDayOfWeek],
          month: month + 1,
          year: year
      });
  }

  return calendar;
}

module.exports = {
  getMonthlyCalendar
};