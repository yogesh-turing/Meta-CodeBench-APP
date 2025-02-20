class EventScheduler {
  constructor() {
    this.events = [];
  }

  addEvent(start, end, title) {
    // Validate inputs
    if (!start || !end || !title || typeof title !== 'string') {
      return false;
    }

    if (start >= end) {
      return false;
    }

    // Check for overlaps with existing events
    const hasOverlap = this.events.some(event => {
      return (start < event.end && end > event.start);
    });

    if (hasOverlap) {
      return false;
    }

    // Check for duplicate titles
    if (this.events.some(event => event.title === title)) {
      return false;
    }

    // Add the new event
    this.events.push({ start, end, title });
    
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