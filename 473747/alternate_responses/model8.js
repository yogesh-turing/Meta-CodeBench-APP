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
    const formattedDate = this.formatDate(date);
    if (this.isPastDate(date)) {
      return `${formattedDate} is a past date, cannot be scheduled`;
    }
    if (this.blockDates.includes(date)) {
      return `${formattedDate} is not available, it has been blocked`;
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
      const formattedDate = this.formatDate(updatedDetails.date);
      if (this.blockDates.includes(updatedDetails.date)) {
        return `${formattedDate} is not available, it has been blocked`;
      }
      const newEvent = { ...event, ...updatedDetails };
      this.setReminder(newEvent);
      return newEvent;
    }
    return `Event with id ${id} does not exist`;
  }

  deleteEvent(id) {
    const index = this.events.findIndex((event) => event.id === id);
    if (index !== -1) {
      this.events.splice(index, 1);
      return true;
    }
    return `Event with id ${id} does not exist`;
  }

  clearEvents() {
    this.events = [];
  }

  setReminder(event) {
    if (event.reminder) {
      const reminderTime = this.calculateReminderTime(
        event.date,
        event.startTime,
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
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  filterEventsByCategory(category) {
    return this.events.filter((event) => event.category === category);
  }

  blockDate(date) {
    const formattedDate = this.formatDate(date);
    if (this.isPastDate(date)) {
      return `${formattedDate} is a past date, cannot be blocked`;
    }
    if (this.events.some((event) => event.date === date)) {
      return `Event(s) already scheduled on ${formattedDate}`;
    }
    if (this.blockDates.includes(date)) {
      return `${formattedDate} has already been blocked`;
    }
    this.blockDates.push(date);
    return true;
  }

  isPastDate(date) {
    const dateObj = new Date(date);
    return dateObj < new Date();
  }

  formatDate(date) {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}