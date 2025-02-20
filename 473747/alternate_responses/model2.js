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

  formatDate(date) {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  isPastDate(date, startTime) {
    const eventDateTime = new Date(`${date}T${startTime}`);
    return eventDateTime < new Date();
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

    if (this.isPastDate(date, startTime)) {
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
    const eventIndex = this.events.findIndex(event => event.id === id);
    
    if (eventIndex === -1) {
      return `event with the id ${id} does not exists`;
    }

    if (updatedDetails.date) {
      const formattedDate = this.formatDate(updatedDetails.date);
      
      if (this.blockDates.includes(updatedDetails.date)) {
        return `${formattedDate} is not available, it has been blocked`;
      }

      if (this.isPastDate(updatedDetails.date, updatedDetails.startTime || this.events[eventIndex].startTime)) {
        return `${formattedDate} is a past date, cannot be scheduled`;
      }
    }

    this.events[eventIndex] = { ...this.events[eventIndex], ...updatedDetails };
    this.setReminder(this.events[eventIndex]);
    return this.events[eventIndex];
  }

  deleteEvent(id) {
    const eventIndex = this.events.findIndex(event => event.id === id);
    
    if (eventIndex === -1) {
      return `event with the id ${id} does not exists`;
    }

    this.events.splice(eventIndex, 1);
    return true;
  }

  clearEvents() {
    this.events = [];
  }

  setReminder(event) {
    if (event.reminder) {
      return this.calculateReminderTime(
        event.date,
        event.startTime,
        event.reminder
      );
    }
    return null;
  }

  calculateReminderTime(date, startTime, reminder) {
    const eventDateTime = new Date(`${date}T${startTime}`);
    const reminderMinutes = parseInt(reminder.split(" ")[0]);
    eventDateTime.setMinutes(eventDateTime.getMinutes() - reminderMinutes);
    return eventDateTime;
  }

  searchEvents(query) {
    const lowercaseQuery = query.toLowerCase();
    return this.events.filter(
      event =>
        event.title.toLowerCase().includes(lowercaseQuery) ||
        event.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  filterEventsByCategory(category) {
    return this.events.filter(event => event.category === category);
  }

  blockDate(date) {
    const formattedDate = this.formatDate(date);

    if (this.isPastDate(date, "00:00")) {
      return `${formattedDate} is a past date, cannot be blocked`;
    }

    if (this.blockDates.includes(date)) {
      return `${formattedDate} has already been blocked`;
    }

    const scheduledEvents = this.events.some(event => event.date === date);
    if (scheduledEvents) {
      return `event(s) already scheduled on ${formattedDate}`;
    }

    this.blockDates.push(date);
    return true;
  }
}

module.exports = { Event, EventManager };