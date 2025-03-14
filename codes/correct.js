class EventManager {
  #events = new Map();
  #log = [];
  #subscribers = new Map();
  _eventIdCounter = 1;

  constructor() {
    [
      'EVENT_CREATED',
      'EVENT_DELETED',
      'EVENT_UPDATED',
      'USER_INVITED',
      'INVITATION_ACCEPTED',
      'INVITATION_DECLINED',
      'REMINDER_SENT',
    ].forEach((type) => this.#subscribers.set(type, new Set()));
  }

  createEvent(title, date, location) {
    if (!title || !date || !location)
      throw new Error(
        'Missing required parameters: title, date, and location are required.'
      );
    const eventDate = new Date(date);
    if (isNaN(eventDate)) throw new Error('Invalid date format provided.');
    const eventId = this._eventIdCounter++;
    const event = {
      id: eventId,
      title,
      date: eventDate,
      location,
      version: 1,
      invitations: {},
      remindersSent: 0,
    };
    this.#events.set(eventId, event);
    this.#logEvent('createEvent', event);
    this.#publish('EVENT_CREATED', {
      type: 'EVENT_CREATED',
      payload: this.#copyEvent(event),
    });
    return this.#copyEvent(event);
  }

  deleteEvent(eventId) {
    if (!this.#events.delete(eventId))
      throw new Error(`Event with id ${eventId} does not exist.`);
    this.#logEvent('deleteEvent', { id: eventId });
    this.#publish('EVENT_DELETED', {
      type: 'EVENT_DELETED',
      payload: { id: eventId },
    });
    return true;
  }

  updateEvent(eventId, newDetails, expectedVersion) {
    const event = this.#events.get(eventId);
    if (
      !event ||
      (expectedVersion !== undefined && event.version !== expectedVersion)
    )
      throw new Error(
        !event ? `Event with id ${eventId} does not exist.` : 'Version conflict'
      );
    if (newDetails.date) {
      const newDate = new Date(newDetails.date);
      if (isNaN(newDate)) throw new Error('Invalid date format provided.');
      event.date = newDate;
    }
    Object.assign(event, newDetails);
    event.version++;
    this.#logEvent('updateEvent', {
      id: eventId,
      newDetails,
      version: event.version,
    });
    this.#publish('EVENT_UPDATED', {
      type: 'EVENT_UPDATED',
      payload: this.#copyEvent(event),
    });
    return this.#copyEvent(event);
  }

  inviteUser(eventId, userId) {
    if (!userId) throw new Error('userId is required.');
    const event = this.#events.get(eventId);
    if (!event || event.invitations[userId])
      throw new Error(
        !event
          ? `Event with id ${eventId} does not exist.`
          : `User ${userId} has already been invited.`
      );
    event.invitations[userId] = 'pending';
    this.#logEvent('inviteUser', { eventId, userId });
    this.#publish('USER_INVITED', {
      type: 'USER_INVITED',
      payload: { eventId, userId },
    });
    return true;
  }

  acceptInvitation(eventId, userId) {
    const event = this.#events.get(eventId);
    if (!event || !event.invitations[userId])
      throw new Error(
        !event
          ? `Event with id ${eventId} does not exist.`
          : `User ${userId} was not invited to the event.`
      );
    event.invitations[userId] = 'accepted';
    this.#logEvent('acceptInvitation', { eventId, userId });
    this.#publish('INVITATION_ACCEPTED', {
      type: 'INVITATION_ACCEPTED',
      payload: { eventId, userId },
    });
    return true;
  }

  declineInvitation(eventId, userId) {
    const event = this.#events.get(eventId);
    if (!event || !event.invitations[userId])
      throw new Error(
        !event
          ? `Event with id ${eventId} does not exist.`
          : `User ${userId} was not invited to the event.`
      );
    event.invitations[userId] = 'declined';
    this.#logEvent('declineInvitation', { eventId, userId });
    this.#publish('INVITATION_DECLINED', {
      type: 'INVITATION_DECLINED',
      payload: { eventId, userId },
    });
    return true;
  }

  getUpcomingEvents() {
    const now = new Date();
    return Array.from(this.#events.values())
      .filter((event) => event.date > now)
      .sort((a, b) => a.date - b.date)
      .map((event) => this.#copyEvent(event));
  }

  getEventDetails(eventId) {
    const event = this.#events.get(eventId);
    if (!event) throw new Error(`Event with id ${eventId} does not exist.`);
    return this.#copyEvent(event);
  }

  async sendReminder(eventId) {
    const event = this.#events.get(eventId);
    if (!event) throw new Error(`Event with id ${eventId} does not exist.`);
    const acceptedUsers = this.getAttendeeList(eventId);
    if (!acceptedUsers.length) return false;
    await Promise.all(
      acceptedUsers.map((userId) => this.#simulateEmail(userId, event))
    );
    event.remindersSent++;
    this.#logEvent('sendReminder', { eventId });
    this.#publish('REMINDER_SENT', {
      type: 'REMINDER_SENT',
      payload: { eventId, remindersSent: event.remindersSent },
    });
    return true;
  }

  getAttendeeList(eventId) {
    const event = this.#events.get(eventId);
    if (!event) throw new Error(`Event with id ${eventId} does not exist.`);
    return Object.entries(event.invitations)
      .filter(([, status]) => status === 'accepted')
      .map(([userId]) => userId);
  }

  subscribe(eventType, callback) {
    this.#subscribers.get(eventType).add(callback);
  }

  replayEvents() {
    const actions = {
      createEvent: (d) => this.createEvent(d.title, d.date, d.location),
      updateEvent: (d) => this.updateEvent(d.id, d.newDetails, d.version-1),
      inviteUser: (d) => this.inviteUser(d.eventId, d.userId),
      acceptInvitation: (d) => this.acceptInvitation(d.eventId, d.userId),
      declineInvitation: (d) => this.declineInvitation(d.eventId, d.userId),
    };
    this.#events.clear();
    this._eventIdCounter = 1;
    this.#log.forEach(({ action, details }) => {
      actions[action]?.(details);
    });
  }

  #copyEvent(event) {
    return { ...event, date: event.date.toISOString() };
  }

  #logEvent(action, details) {
    this.#log.push({ action, details, timestamp: new Date() });
  }

  #publish(eventType, data) {
    this.#subscribers.get(eventType)?.forEach((callback) => callback(data));
  }

  async #simulateEmail(userId, event) {
    return new Promise((resolve) => setTimeout(resolve, 100));
  }
}

module.exports = { EventManager };