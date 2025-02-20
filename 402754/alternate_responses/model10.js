class EventScheduler {
  constructor() {
    this.events = [];
  }

  addEvent(start, end, title) {
    // Check if the new event overlaps with any existing event
    if (this.events.some((event) => this.isOverlapping(start, end, event.start, event.end))) {
      return false; // Reject overlapping event
    }

    // Add the new event to the list
    this.events.push({ title, start, end });

    // Sort the events by start time
    this.events.sort((a, b) => a.start - b.start);

    return true; // Event added successfully
  }

  removeEvent(title) {
    // Find the index of the event with the given title
    const index = this.events.findIndex((event) => event.title === title);

    if (index !== -1) {
      // Remove the event if found
      this.events.splice(index, 1);
    }
  }

  getSchedule() {
    // Return a copy of the sorted events array
    return [...this.events];
  }

  isOverlapping(start1, end1, start2, end2) {
    // Check if two events overlap
    return !(end1 <= start2 || end2 <= start1);
  }
}

module.exports = { EventScheduler };