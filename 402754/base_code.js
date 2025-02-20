class EventScheduler {
  constructor() {
    this.events = [];
  }

  addEvent(start, end, title) {
    // TODO: Implement logic to add an event without overlapping existing events
  }

  removeEvent(title) {
    // TODO: Implement logic to remove an event by its title
  }

  getSchedule() {
    // TODO: Return a sorted list of events in chronological order
  }
}

module.exports = { EventScheduler };