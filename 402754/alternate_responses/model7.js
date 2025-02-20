class EventScheduler {
  constructor() {
    this.events = [];
  }

  addEvent(start, end, title) {
    // Check if the event overlaps with any existing event
    for (let i = 0; i < this.events.length; i++) {
      if (start < this.events[i].end && end > this.events[i].start) {
        return false; // Event overlaps, reject it
      }
    }

    // Add the event to the list
    this.events.push({ title, start, end });

    // Sort the events by start time
    this.events.sort((a, b) => a.start - b.start);

    return true; // Event added successfully
  }

  removeEvent(title) {
    // Find the event with the matching title
    const index = this.events.findIndex(event => event.title === title);

    // If the event exists, remove it
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }

  getSchedule() {
    // Return a copy of the sorted events array
    return [...this.events];
  }
}

module.exports = { EventScheduler };