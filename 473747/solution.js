// solution code

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
    if (this.pastDate(date)) {
      return `${new Date(
        date
      ).toDateString()} is a past date, cannot be scheduled`;
    }

    if (this.blockDates.includes(date)) {
      return `${new Date(
        date
      ).toDateString()} is not available, it has been blocked`;
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

    if (this.pastDate(updatedDetails.date)) {
      return `${new Date(
        date
      ).toDateString()} is a past date, cannot be scheduled`;
    }

    if (updatedDetails.date && this.blockDates.includes(updatedDetails.date)) {
      return `${new Date(
        updatedDetails.date
      ).toDateString()} is not available, it has been blocked`;
    }

    if (event) {
      Object.assign(event, updatedDetails);
      this.setReminder(event);
      return event;
    }

    return null;
  }

  deleteEvent(id) {
    const index = this.events.findIndex((event) => event.id === id);

    if (index !== -1) {
      this.events.splice(index, 1);
      return true;
    }

    return `event with the id ${id} does not exists`;
  }

  clearEvents() {
    this.events = [];
  }

  setReminder(event) {
    if (event.reminder) {
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
        event.title.includes(query) || event.description.includes(query)
    );
  }

  filterEventsByCategory(category) {
    return this.events.filter((event) => event.category === category);
  }

  blockDate(date) {
    const dates = this.events.filter((event) => event.date === date);

    if (this.pastDate(date)) {
      console.log(
        `${new Date(date).toDateString()} is a past date, cannot be blocked`
      );
      return `${new Date(
        date
      ).toDateString()} is a past date, cannot be blocked`;
    }

    if (dates.length) {
      console.log(
        `event(s) already scheduled on ${new Date(date).toDateString()}`
      );

      return `event(s) already scheduled on ${new Date(date).toDateString()}`;
    }

    if (this.blockDates.includes(date)) {
      return `${new Date(date).toDateString()} has already been blocked`;
    }

    this.blockDates.push(date);
  }

  pastDate(date, startTime) {
    const dateObj = new Date(date);

    if (startTime) {
      const [hour, minute] = startTime.split(":");
      dateObj.setHours(hour);
      dateObj.setMinutes(minute);
    }

    return dateObj < new Date() ? true : false;
  }
}

module.exports = { EventManager };