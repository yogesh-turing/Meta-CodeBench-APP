class EventScheduler {
  constructor() {
    this.events = [];
  }

  addEvent(start, end, title) {
    // Check if the event overlaps with any existing events
    if (this.events.some((event) => start < event.end && end > event.start)) {
      return false;
    }

    // Add the event to the list and sort it by start time
    this.events.push({ title, start, end });
    this.events.sort((a, b) => a.start - b.start);

    return true;
  }

  removeEvent(title) {
    // Find the index of the event with the given title
    const index = this.events.findIndex((event) => event.title === title);

    // If the event exists, remove it from the list
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }

  getSchedule() {
    // Return a sorted list of events in chronological order
    return this.events.slice();
  }
}

module.exports = { EventScheduler };