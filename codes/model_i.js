class EventManager {
  #events = new Map();
  #log = [];
  #subscribers = new Map();
  _eventIdCounter = 1;

  constructor() {}

  createEvent(title, date, location) {
    if (!title || !date || !location) {
      throw new Error(
        'Missing required parameters: title, date, and location are required.'
      );
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
      version: 1,
    };

    this.#events.set(eventId, event);
    this.#logEvent('createEvent', event);
    this.#publish('EVENT_CREATED', { type: 'EVENT_CREATED', payload: event });
    return event;
  }

  deleteEvent(eventId) {
    if (!this.#events.has(eventId)) {
      throw new Error('Event not found');
    }
    this.#events.delete(eventId);
    this.#logEvent('deleteEvent', { id: eventId });
    this.#publish('EVENT_DELETED', { type: 'EVENT_DELETED', payload: { id: eventId } });
    return true;
  }

  updateEvent(eventId, newDetails, expectedVersion) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    if (event.version !== expectedVersion) {
      throw new Error('Version conflict');
    }
    Object.keys(newDetails).forEach((key) => {
      if (newDetails[key] !== undefined) {
        if (key === 'date') {
          const newDate = new Date(newDetails[key]);
          if (isNaN(newDate)) {
            throw new Error('Invalid date format provided.');
          }
          event[key] = newDate;
        } else {
          event[key] = newDetails[key];
        }
      }
    });
    event.version++;
    this.#logEvent('updateEvent', { id: eventId, newDetails });
    this.#publish('EVENT_UPDATED', { type: 'EVENT_UPDATED', payload: { id: eventId, newDetails } });
    return event;
  }

  inviteUser(eventId, userId) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    if (!userId) {
      throw new Error('User ID is required for invitation.');
    }
    if (event.invitations[userId]) {
      throw new Error('User already invited');
    }
    event.invitations[userId] = 'pending';
    this.#logEvent('inviteUser', { eventId, userId });
    this.#publish('USER_INVITED', { type: 'USER_INVITED', payload: { eventId, userId } });
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
    this.#publish('INVITATION_ACCEPTED', { type: 'INVITATION_ACCEPTED', payload: { eventId, userId } });
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
    this.#publish('INVITATION_DECLINED', { type: 'INVITATION_DECLINED', payload: { eventId, userId } });
    return true;
  }

  getUpcomingEvents() {
    const now = new Date();
    const upcoming = Array.from(this.#events.values()).filter(
      (event) => event.date > now
    );
    upcoming.sort((a, b) => a.date - b.date);
    return upcoming;
  }

  getEventDetails(eventId) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    return JSON.parse(JSON.stringify(event));
  }

  async sendReminder(eventId) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    const acceptedUsers = this.getAttendeeList(eventId);
    if (acceptedUsers.length === 0) {
      console.log(`No accepted attendees to send reminders for event ${eventId}.`);
      return false;
    }

    const sendEmail = (userId, event) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(
            `Reminder sent to user ${userId} for event "${event.title}" at ${event.date}`
          );
          resolve(true);
        }, 100);
      });
    };

    await Promise.all(acceptedUsers.map((userId) => sendEmail(userId, event)));
    event.remindersSent++;
    this.#logEvent('sendReminder', { eventId });
    this.#publish('REMINDER_SENT', { type: 'REMINDER_SENT', payload: { eventId } });
    return true;
  }

  getAttendeeList(eventId) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    const attendees = Object.entries(event.invitations)
      .filter(([_, status]) => status === 'accepted')
      .map(([userId, _]) => userId);
    return attendees;
  }

  #logEvent(action, details) {
    this.#log.push({ action, details, timestamp: new Date() });
  }

  #publish(eventType, data) {
    if (this.#subscribers.has(eventType)) {
      this.#subscribers.get(eventType).forEach((callback) => callback(data));
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
    this.#log.forEach((logEntry) => {
      switch (logEntry.action) {
        case 'createEvent':
          this.createEvent(
            logEntry.details.title,
            logEntry.details.date,
            logEntry.details.location
          );
          break;
        case 'deleteEvent':
          this.deleteEvent(logEntry.details.id);
          break;
        case 'updateEvent':
          this.updateEvent(logEntry.details.id, logEntry.details.newDetails, logEntry.details.version);
          break;
        case 'inviteUser':
          this.inviteUser(logEntry.details.eventId, logEntry.details.userId);
          break;
        case 'acceptInvitation':
          this.acceptInvitation(
            logEntry.details.eventId,
            logEntry.details.userId
          );
          break;
        case 'declineInvitation':
          this.declineInvitation(
            logEntry.details.eventId,
            logEntry.details.userId
          );
          break;
        case 'sendReminder':
          this.sendReminder(logEntry.details.eventId);
          break;
      }
    });
  }
}

module.exports = { EventManager };