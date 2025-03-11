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
    if (typeof title !== 'string' || typeof location !== 'string') {
      throw new Error('Title and location must be strings.');
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
      version: 1,
      invitations: {},
      remindersSent: 0,
    };

    this.#events.set(eventId, event);
    this.#logEvent('createEvent', event);
    this.#publish('EVENT_CREATED', {
      type: 'EVENT_CREATED',
      payload: { ...event, date: event.date.toISOString() }
    });

    return this.#serializeEvent(event);
  }

  updateEvent(eventId, newDetails, expectedVersion) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }

    if (expectedVersion !== undefined && event.version !== expectedVersion) {
      throw new Error('Version conflict: Event has been modified by another user.');
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
      payload: { id: eventId, ...newDetails, version: updatedEvent.version }
    });

    return this.#serializeEvent(updatedEvent);
  }

  deleteEvent(eventId) {
    if (!this.#events.has(eventId)) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    this.#events.delete(eventId);
    this.#logEvent('deleteEvent', { id: eventId });
    this.#publish('EVENT_DELETED', {
      type: 'EVENT_DELETED',
      payload: { id: eventId }
    });
    return true;
  }

  inviteUser(eventId, userId) {
    if (!userId) {
      throw new Error('UserId is required.');
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
    return Array.from(this.#events.values())
      .filter(event => event.date > now)
      .sort((a, b) => a.date - b.date)
      .map(event => this.#serializeEvent(event));
  }

  getEventDetails(eventId) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    return this.#serializeEvent(event);
  }

  async sendReminder(eventId) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }

    const acceptedUsers = Object.entries(event.invitations)
      .filter(([_, status]) => status === 'accepted')
      .map(([userId]) => userId);

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
      payload: { eventId }
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
      .map(([userId]) => userId);
  }

  subscribe(eventType, callback) {
    if (!this.#subscribers.has(eventType)) {
      this.#subscribers.set(eventType, new Set());
    }
    this.#subscribers.get(eventType).add(callback);
  }

  #logEvent(action, details) {
    this.#log.push({
      action,
      details,
      timestamp: new Date()
    });
  }

  #publish(eventType, data) {
    if (this.#subscribers.has(eventType)) {
      this.#subscribers.get(eventType).forEach(callback => callback(data));
    }
  }

  #serializeEvent(event) {
    return {
      ...event,
      invitations: { ...event.invitations }
    };
  }

  replayEvents() {
    const tempEvents = new Map(this.#events);
    this.#events.clear();
    this._eventIdCounter = 1;

    this.#log.forEach(logEntry => {
      try {
        switch (logEntry.action) {
          case 'createEvent':
            this.createEvent(
              logEntry.details.title,
              logEntry.details.date,
              logEntry.details.location
            );
            break;
          case 'updateEvent':
            this.updateEvent(
              logEntry.details.id,
              logEntry.details.newDetails,
              logEntry.details.version - 1
            );
            break;
          case 'deleteEvent':
            this.deleteEvent(logEntry.details.id);
            break;
          case 'inviteUser':
            this.inviteUser(logEntry.details.eventId, logEntry.details.userId);
            break;
          case 'acceptInvitation':
            this.acceptInvitation(logEntry.details.eventId, logEntry.details.userId);
            break;
          case 'declineInvitation':
            this.declineInvitation(logEntry.details.eventId, logEntry.details.userId);
            break;
        }
      } catch (error) {
        this.#events = tempEvents;
        throw new Error(`Failed to replay events: ${error.message}`);
      }
    });
  }
}

module.exports = { EventManager };