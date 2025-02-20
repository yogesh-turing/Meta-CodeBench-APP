class EventScheduler {
  constructor() {
    this.events = [];
  }

  addEvent(start, end, title) {
    if (this.events.some(event => event.start < end && event.end > start)) {
      return false;
    }

    this.events.push({ start, end, title });
    this.events.sort((a, b) => a.start - b.start);
    return true;
  }

  removeEvent(title) {
    this.events = this.events.filter(event => event.title !== title);
  }

  getSchedule() {
    return this.events.map(event => ({ title: event.title, start: event.start, end: event.end }));
  }
}

module.exports = { EventScheduler };