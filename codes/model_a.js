class EventManager {
  #events = new Map();
  #log = [];
  #subscribers = new Map();
  _eventIdCounter = 1;

  constructor() {}

  createEvent(title, date, location) {
    if (!title || !date || !location) {
      throw new Error('Missing required parameters: title, date, and location are required.');
    }
    const eventDate = new Date(date);
    if (isNaN(eventDate)) {
      throw new Error('Invalid date format provided.');
    }
    const eventId = this._eventIdCounter++;

    const event = {
      id: eventId,
      title,
      date: eventDate,
      location,
      invitations: {},
      remindersSent: 0,
      version: 1
    };

    this.#events.set(eventId, event);
    this.#logEvent('createEvent', event);
    this.#publish('EVENT_CREATED', {
      type: 'EVENT_CREATED',
      payload: { ...event }
    });
    return { ...event };
  }

  deleteEvent(eventId) {
    if (!this.#events.has(eventId)) {
      throw new Error('Event not found');
    }
    const event = this.#events.get(eventId);
    this.#events.delete(eventId);
    this.#logEvent('deleteEvent', { id: eventId, event });
    this.#publish('EVENT_DELETED', {
      type: 'EVENT_DELETED',
      payload: { id: eventId }
    });
    return true;
  }

  updateEvent(eventId, newDetails, expectedVersion) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }

    if (expectedVersion !== event.version) {
      throw new Error('Version conflict');
    }

    if (newDetails.date) {
      const newDate = new Date(newDetails.date);
      if (isNaN(newDate)) {
        throw new Error('Invalid date format provided.');
      }
      newDetails.date = newDate;
    }

    const updatedEvent = {
      ...event,
      ...newDetails,
      version: event.version + 1
    };

    this.#events.set(eventId, updatedEvent);
    this.#logEvent('updateEvent', { id: eventId, newDetails, version: updatedEvent.version });
    this.#publish('EVENT_UPDATED', {
      type: 'EVENT_UPDATED',
      payload: { ...updatedEvent }
    });
    return { ...updatedEvent };
  }

  inviteUser(eventId, userId) {
    if (!userId) {
      throw new Error('UserId is required');
    }

    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }

    if (event.invitations[userId]) {
      throw new Error(`User ${userId} has already been invited.`);
    }

    event.invitations[userId] = 'pending';
    this.#logEvent('inviteUser', { eventId, userId });
    this.#publish('USER_INVITED', {
      type: 'USER_INVITED',
      payload: { eventId, userId }
    });
    return true;
  }

  acceptInvitation(eventId, userId) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    if (!event.invitations[userId]) {
      throw new Error(`User ${userId} was not invited to the event.`);
    }
    event.invitations[userId] = 'accepted';
    this.#logEvent('acceptInvitation', { eventId, userId });
    this.#publish('INVITATION_ACCEPTED', {
      type: 'INVITATION_ACCEPTED',
      payload: { eventId, userId }
    });
    return true;
  }

  declineInvitation(eventId, userId) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    if (!event.invitations[userId]) {
      throw new Error(`User ${userId} was not invited to the event.`);
    }
    event.invitations[userId] = 'declined';
    this.#logEvent('declineInvitation', { eventId, userId });
    this.#publish('INVITATION_DECLINED', {
      type: 'INVITATION_DECLINED',
      payload: { eventId, userId }
    });
    return true;
  }

  getUpcomingEvents() {
    const now = new Date();
    const upcoming = Array.from(this.#events.values())
      .filter(event => event.date > now)
      .sort((a, b) => a.date - b.date);
    return upcoming.map(event => ({ ...event }));
  }

  getEventDetails(eventId) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    return { ...event };
  }

  async sendReminder(eventId) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    const acceptedUsers = this.getAttendeeList(eventId);
    if (acceptedUsers.length === 0) {
      return false;
    }

    const sendEmail = (userId, event) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`Reminder sent to user ${userId} for event "${event.title}" at ${event.date}`);
          resolve(true);
        }, 100);
      });
    };

    await Promise.all(acceptedUsers.map(userId => sendEmail(userId, event)));
    event.remindersSent++;
    this.#logEvent('sendReminder', { eventId });
    this.#publish('REMINDER_SENT', {
      type: 'REMINDER_SENT',
      payload: { eventId, remindersSent: event.remindersSent }
    });
    return true;
  }

  getAttendeeList(eventId) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    return Object.entries(event.invitations)
      .filter(([_, status]) => status === 'accepted')
      .map(([userId, _]) => userId);
  }

  #logEvent(action, details) {
    this.#log.push({
      action,
      details: { ...details },
      timestamp: new Date()
    });
  }

  #publish(eventType, data) {
    if (this.#subscribers.has(eventType)) {
      this.#subscribers.get(eventType).forEach(callback => callback(data));
    }
  }

  subscribe(eventType, callback) {
    if (!this.#subscribers.has(eventType)) {
      this.#subscribers.set(eventType, new Set());
    }
    this.#subscribers.get(eventType).add(callback);
  }

  replayEvents() {
    this.#events.clear();
    this._eventIdCounter = 1;
    
    this.#log.forEach(logEntry => {
      if (logEntry.action === 'createEvent') {
        const { title, date, location } = logEntry.details;
        this.createEvent(title, date, location);
      } else if (logEntry.action === 'updateEvent') {
        const { id, newDetails } = logEntry.details;
        if (this.#events.has(id)) {
          const event = this.#events.get(id);
          this.updateEvent(id, newDetails, event.version);
        }
      } else if (logEntry.action === 'inviteUser') {
        const { eventId, userId } = logEntry.details;
        if (this.#events.has(eventId)) {
          this.inviteUser(eventId, userId);
        }
      } else if (logEntry.action === 'acceptInvitation') {
        const { eventId, userId } = logEntry.details;
        if (this.#events.has(eventId)) {
          this.acceptInvitation(eventId, userId);
        }
      } else if (logEntry.action === 'declineInvitation') {
        const { eventId, userId } = logEntry.details;
        if (this.#events.has(eventId)) {
          this.declineInvitation(eventId, userId);
        }
      }
    });
  }
}

module.exports = { EventManager };