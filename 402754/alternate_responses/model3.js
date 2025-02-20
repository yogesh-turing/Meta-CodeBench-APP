class EventScheduler {
  constructor() {
    this.events = [];
  }

  addEvent(start, end, title) {
    // Input validation
    if (!Number.isInteger(start) || !Number.isInteger(end)) {
      throw new Error('Start and end times must be integers (timestamps)');
    }
    if (typeof title !== 'string' || !title.trim()) {
      throw new Error('Title must be a non-empty string');
    }
    if (start >= end) {
      throw new Error('Start time must be before end time');
    }

    // Check for title uniqueness
    if (this.events.some(event => event.title === title)) {
      return false;
    }

    // Check for overlaps
    const hasOverlap = this.events.some(event => {
      return (start < event.end && end > event.start);
    });

    if (hasOverlap) {
      return false;
    }

    // Add the new event
    const newEvent = { start, end, title };
    this.events.push(newEvent);

    // Sort events by start time
    this.events.sort((a, b) => a.start - b.start);

    return true;
  }

  removeEvent(title) {
    const initialLength = this.events.length;
    this.events = this.events.filter(event => event.title !== title);
    return initialLength !== this.events.length;
  }

  getSchedule() {
    return [...this.events];
  }
}

module.exports = { EventScheduler };