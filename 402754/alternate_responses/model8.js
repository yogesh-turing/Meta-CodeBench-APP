class EventScheduler {
  constructor() {
    this.events = [];
  }

  addEvent(start, end, title) {
    // Check if the event overlaps with any existing events
    if (this.events.some((event) => start < event.end && end > event.start)) {
      return false; // Event overlaps, reject it
    }

    // Add the event to the list in chronological order
    this.events.push({ title, start, end });
    this.events.sort((a, b) => a.start - b.start);

    return true; // Event added successfully
  }

  removeEvent(title) {
    // Find the index of the event with the matching title
    const index = this.events.findIndex((event) => event.title === title);

    // If the event exists, remove it
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }

  getSchedule() {
    // Return a sorted list of events in chronological order
    return this.events.slice(); // Return a copy of the events array
  }
}

module.exports = { EventScheduler };