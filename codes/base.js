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
      invitations: new Map(),
      remindersSent: 0,
    };

    this.#events.set(eventId, event);
    this.#logEvent('createEvent', event);
    this.#publish('EVENT_CREATED', event);
    return event;
  }

  deleteEvent(eventId) {
    if (!this.#events.has(eventId)) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    this.#events.delete(eventId);
    this.#logEvent('deleteEvent', { id: eventId });
    this.#publish('EVENT_DELETED', { id: eventId });
    return true;
  }

  updateEvent(eventId, newDetails) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    Object.keys(newDetails).forEach((key) => {
      if (newDetails[key] !== undefined) {
        event[key] = newDetails[key];
      }
    });
    this.#logEvent('updateEvent', { id: eventId, newDetails });
    this.#publish('EVENT_UPDATED', { id: eventId, newDetails });
    return event;
  }

  inviteUser(eventId, userId) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    if (event.invitations.has(userId)) {
      throw new Error(`User ${userId} has already been invited.`);
    }
    event.invitations.set(userId, 'pending');
    this.#logEvent('inviteUser', { eventId, userId });
    this.#publish('USER_INVITED', { eventId, userId });
    return true;
  }

  acceptInvitation(eventId, userId) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    if (!event.invitations.has(userId)) {
      throw new Error(`User ${userId} was not invited to the event.`);
    }
    event.invitations.set(userId, 'accepted');
    this.#logEvent('acceptInvitation', { eventId, userId });
    this.#publish('INVITATION_ACCEPTED', { eventId, userId });
    return true;
  }

  declineInvitation(eventId, userId) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    if (!event.invitations.has(userId)) {
      throw new Error(`User ${userId} was not invited to the event.`);
    }
    event.invitations.set(userId, 'declined');
    this.#logEvent('declineInvitation', { eventId, userId });
    this.#publish('INVITATION_DECLINED', { eventId, userId });
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
      console.log(
        `No accepted attendees to send reminders for event ${eventId}.`
      );
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
    this.#publish('REMINDER_SENT', { eventId });
    return true;
  }

  getAttendeeList(eventId) {
    const event = this.#events.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    const attendees = Array.from(event.invitations.entries())
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
          this.updateEvent(logEntry.details.id, logEntry.details.newDetails);
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

/* ==================== Usage Example ====================
  
  const manager = new EventManager();
  
  // Create an event
  const event = manager.createEvent("Annual Meeting", "2025-06-15T09:00:00", "Conference Hall A");
  console.log("Created Event:", event);
  
  // Invite users
  manager.inviteUser(event.id, "user123");
  manager.inviteUser(event.id, "user456");
  
  // Users respond to invitations
  manager.acceptInvitation(event.id, "user123");
  manager.declineInvitation(event.id, "user456");
  
  // Get upcoming events
  console.log("Upcoming Events:", manager.getUpcomingEvents());
  
  // Send reminders (simulate async email sending)
  manager.sendReminder(event.id).then(() => {
    console.log("Reminders sent!");
  });
  
  // Get event details and attendee list
  console.log("Event Details:", manager.getEventDetails(event.id));
  console.log("Attendee List:", manager.getAttendeeList(event.id));
  
  ========================================================== */

module.exports = { EventManager };
