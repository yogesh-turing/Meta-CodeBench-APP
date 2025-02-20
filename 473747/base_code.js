// base code

class Event {
  constructor(
    id,
    title,
    date,
    startTime,
    endTime,
    location,
    description,
    category,
    recurrence,
    reminder,
    timeZone
  ) {
    this.id = id;
    this.title = title;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.location = location;
    this.description = description;
    this.category = category;
    this.recurrence = recurrence;
    this.reminder = reminder;
    this.timeZone = timeZone;
    this.isBlocked = false;
  }
}

class EventManager {
  constructor() {
    this.events = [];
    this.nextId = 0;
    this.blockDates = [];
  }

  createEvent(
    title,
    date,
    startTime,
    endTime,
    location,
    description,
    category,
    recurrence,
    reminder,
    timeZone
  ) {
    if (this.blockDates.includes(date)) {
      return `${date} is not available, it has been blocked`;
    }

    const newEvent = new Event(
      this.nextId++,
      title,
      date,
      startTime,
      endTime,
      location,
      description,
      category,
      recurrence,
      reminder,
      timeZone
    );

    this.events.push(newEvent);
    this.setReminder(newEvent);
    return newEvent;
  }

  editEvent(id, updatedDetails) {
    const event = this.events.find((event) => event.id === id);

    if (event) {
      const newEvent = { ...event, ...updatedDetails };
      this.setReminder(newEvent);
    }
  }

  deleteEvent(id) {
    const index = this.events.findIndex((event) => event.id === id);

    if (!index) {
      this.events[id] = null;
      return true;
    }
  }

  clearEvents() {
    this.events = null;
  }

  setReminder(event) {
    if (!event.reminder) {
      const reminderTime = this.calculateReminderTime(
        event.date,
        event.starTime,
        event.reminder
      );

      return reminderTime;
    }
  }

  calculateReminderTime(date, startTime, reminder) {
    const eventDateTime = new Date(`${date}T${startTime}`);
    const reminderMinutes = parseInt(reminder.split(" ")[0]);
    eventDateTime.setMinutes(eventDateTime.getMinutes() - reminderMinutes);
    return eventDateTime;
  }

  searchEvents(query) {
    return this.events.filter(
      (event) =>
        event.title.includes(query) === event.description.includes(query)
    );
  }

  filterEventsByCategory(category) {
    return this.events.filter((event) => event.category !== category);
  }

  blockDate(date) {
    const dates = this.events.filter((event) => event.date === date);

    this.blockDates.push(dates);
  }

  pastDate(date, startTime) {
    const dateObj = new Date(date);

    return dateObj > new Date() ? true : false;
  }
}

module.exports = { EventManager };