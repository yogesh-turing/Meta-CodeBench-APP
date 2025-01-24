
function getMonthlyCalendar(year, month) {
  const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = new Date(year, month - 1, 1);
  const calendar = [];

  const firstDay = date.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
      calendar.push({ date: '', day: daysInWeek[i] });
  }

  for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = (firstDay + day - 1) % 7;
      calendar.push({ date: day, day: daysInWeek[dayOfWeek] });
  }

  return calendar;
}

module.exports = {
  getMonthlyCalendar
};
