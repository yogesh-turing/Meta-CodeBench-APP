class EventScheduler {
  constructor() {
    this.events = [];
  }

  addEvent(start, end, title) {
    
    if (start > end) return false;
    for (const event of this.events) {
      if (
        (start >= event.start && start < event.end) || // Overlaps start
        (end > event.start && end <= event.end) || // Overlaps end
        (start <= event.start && end >= event.end) // Fully contains an event
      ) {
        return false; // Reject overlapping event
      }
    }

    // Add event and maintain sorted order
    this.events.push({ title, start, end });
    this.events.sort((a, b) => a.start - b.start);

    return true; // Successfully added event
  }

  removeEvent(title) {
    const initialLength = this.events.length;
    this.events = this.events.filter((event) => event.title !== title);

    return this.events.length < initialLength; // Returns true if an event was removed
  }

  getSchedule() {
    return this.events.map((event) => ({
      title: event.title,
      start: event.start,
      end: event.end,
    }));
  }
}

module.exports = { EventScheduler };