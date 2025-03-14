Base Code:
```javascript
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
  const event = manager.createEvent('Event 1', '2030-01-01T10:00:00', 'Texas');
  console.log("Created Event:", event);
  manager.updateEvent(event.id, { location: 'NYC' }, 1);
  
  
  // Invite users
  manager.inviteUser(event.id, "user1");
  manager.inviteUser(event.id, "user2");
  
  // Users respond to invitations
  manager.acceptInvitation(event.id, "user1");
  manager.declineInvitation(event.id, "user2");
  
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

```
Stack Trace:
```javascript
  EventManager
    createEvent
      × should create an event with valid parameters (21 ms)
      √ should throw an error if any required parameter is missing (16 ms)
      √ should throw an error for an invalid date format (2 ms)
    deleteEvent
      √ should delete an existing event (2 ms)
      √ should throw an error when attempting to delete a non-existent event (1 ms)
    updateEvent
      × should update event details successfully (1 ms)
      × should throw an error if the expected version does not match (optimistic concurrency) (2 ms)
      √ should throw an error when updating a non-existent event (2 ms)
      × should throw an error for an invalid date format on update (2 ms)
    inviteUser
      × should successfully invite a user (2 ms)
      √ should throw an error when inviting a user to a non-existent event (1 ms)
      √ should throw an error if the same user is invited twice (1 ms)
      × should throw an error if userId is missing (1 ms)
    acceptInvitation
      × should mark a user invitation as accepted (2 ms)
      √ should throw an error if a non-invited user attempts to accept (2 ms)
    declineInvitation
      × should mark a user invitation as declined (2 ms)
      √ should throw an error if a non-invited user attempts to decline (1 ms)
    getUpcomingEvents
      √ should return only future events sorted by date (1 ms)
    getEventDetails
      √ should throw an error if the event does not exist (1 ms)
      × should return event details if the event exists (8 ms)
    getAttendeeList
      √ should return a list of users who accepted invitations (2 ms)
      √ should throw an error if the event does not exist (1 ms)
    sendReminder
      √ should resolve false if no accepted attendees exist (32 ms)
      √ should send reminders to accepted attendees and update remindersSent count (117 ms)
    replayEvents
      × should rebuild the aggregate state from the event store (1 ms)
      × should rebuild the aggregate state from the event store (add event, update event, invite user, accept 
invitation) (1 ms)
      × should rebuild the aggregate state from the event store (add event, update event, invite user, decline invitation) (1 ms)
    subscribe
      × should notify subscribers on event creation (2 ms)

  ● EventManager › createEvent › should create an event with valid parameters

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: undefined

      19 |       expect(new Date(event.date)).toEqual(new Date('2030-01-01T10:00:00'));
      20 |       expect(event.location).toBe('Test Location');
    > 21 |       expect(event.version).toBe(1);
         |                             ^
      22 |       expect(event.invitations).toEqual({});
      23 |       expect(event.remindersSent).toBe(0);
      24 |     });

      at Object.toBe (tasks/1171523/index.test.js:21:29)

  ● EventManager › updateEvent › should update event details successfully

    expect(received).toBe(expected) // Object.is equality

    Expected: 2
    Received: undefined

      73 |       );
      74 |       expect(updated.location).toBe('New Location');
    > 75 |       expect(updated.version).toBe(2);
         |                               ^
      76 |     });
      77 |
      78 |     it('should throw an error if the expected version does not match (optimistic concurrency)', () 
=> {

      at Object.toBe (tasks/1171523/index.test.js:75:31)

  ● EventManager › updateEvent › should throw an error if the expected version does not match (optimistic concurrency)

    expect(received).toThrow(expected)

    Expected pattern: /Version conflict/

    Received function did not throw

      88 |           2
      89 |         )
    > 90 |       ).toThrow(/Version conflict/);
         |         ^
      91 |     });
      92 |
      93 |     it('should throw an error when updating a non-existent event', () => {

      at Object.toThrow (tasks/1171523/index.test.js:90:9)

  ● EventManager › updateEvent › should throw an error for an invalid date format on update

    expect(received).toThrow(expected)

    Expected substring: "Invalid date format provided."

    Received function did not throw

      103 |       expect(() =>
      104 |         manager.updateEvent(event.id, { date: 'invalid date' }, 1)
    > 105 |       ).toThrow('Invalid date format provided.');
          |         ^
      106 |     });
      107 |   });
      108 |

      at Object.toThrow (tasks/1171523/index.test.js:105:9)

  ● EventManager › inviteUser › should successfully invite a user

    expect(received).toBe(expected) // Object.is equality

    Expected: "pending"
    Received: undefined

      116 |       expect(manager.inviteUser(event.id, 'user1')).toBe(true);
      117 |       const details = manager.getEventDetails(event.id);
    > 118 |       expect(details.invitations['user1']).toBe('pending');
          |                                            ^
      119 |     });
      120 |
      121 |     it('should throw an error when inviting a user to a non-existent event', () => {

      at Object.toBe (tasks/1171523/index.test.js:118:44)

  ● EventManager › inviteUser › should throw an error if userId is missing

    expect(received).toThrow()

    Received function did not throw

      139 |         'Location'
      140 |       );
    > 141 |       expect(() => manager.inviteUser(event.id, null)).toThrow();
          |                                                        ^
      142 |     });
      143 |   });
      144 |

      at Object.toThrow (tasks/1171523/index.test.js:141:56)

  ● EventManager › acceptInvitation › should mark a user invitation as accepted

    expect(received).toBe(expected) // Object.is equality

    Expected: "accepted"
    Received: undefined

      153 |       expect(manager.acceptInvitation(event.id, 'user1')).toBe(true);
      154 |       const details = manager.getEventDetails(event.id);
    > 155 |       expect(details.invitations['user1']).toBe('accepted');
          |                                            ^
      156 |     });
      157 |
      158 |     it('should throw an error if a non-invited user attempts to accept', () => {

      at Object.toBe (tasks/1171523/index.test.js:155:44)

  ● EventManager › declineInvitation › should mark a user invitation as declined

    expect(received).toBe(expected) // Object.is equality

    Expected: "declined"
    Received: undefined

      176 |       expect(manager.declineInvitation(event.id, 'user1')).toBe(true);
      177 |       const details = manager.getEventDetails(event.id);
    > 178 |       expect(details.invitations['user1']).toBe('declined');
          |                                            ^
      179 |     });
      180 |
      181 |     it('should throw an error if a non-invited user attempts to decline', () => {

      at Object.toBe (tasks/1171523/index.test.js:178:44)

  ● EventManager › getEventDetails › should return event details if the event exists

    expect(received).toEqual(expected) // deep equality

    - Expected  - 4
    + Received  + 1

    - Object {
    -   "user1": "accepted",
    -   "user2": "declined",
    - }
    + Object {}

      236 |       expect(eventDetails.title).toBe('Event 1');
      237 |       expect(eventDetails.location).toBe('NYC');
    > 238 |       expect(eventDetails.invitations).toEqual({ 'user1': 'accepted', 'user2': 'declined' });     
          |                                        ^
      239 |       expect(eventDetails.remindersSent).toBe(0);
      240 |       expect(eventDetails.version).toBe(2);
      241 |

      at Object.toEqual (tasks/1171523/index.test.js:238:40)

  ● EventManager › replayEvents › should rebuild the aggregate state from the event store

    Event with id 1 does not exist.

      62 |     const event = this.#events.get(eventId);
      63 |     if (!event) {
    > 64 |       throw new Error(`Event with id ${eventId} does not exist.`);
         |             ^
      65 |     }
      66 |     if (event.invitations.has(userId)) {
      67 |       throw new Error(`User ${userId} has already been invited.`);

      at EventManager.inviteUser (tasks/1171523/base.js:64:13)
      at inviteUser (tasks/1171523/base.js:196:16)
          at Array.forEach (<anonymous>)
      at EventManager.forEach [as replayEvents] (tasks/1171523/base.js:180:15)
      at Object.replayEvents (tasks/1171523/index.test.js:304:15)

  ● EventManager › replayEvents › should rebuild the aggregate state from the event store (add event, update event, invite user, accept invitation)

    Event with id 1 does not exist.

      47 |     const event = this.#events.get(eventId);
      48 |     if (!event) {
    > 49 |       throw new Error(`Event with id ${eventId} does not exist.`);
         |             ^
      50 |     }
      51 |     Object.keys(newDetails).forEach((key) => {
      52 |       if (newDetails[key] !== undefined) {

      at EventManager.updateEvent (tasks/1171523/base.js:49:13)
      at updateEvent (tasks/1171523/base.js:193:16)
          at Array.forEach (<anonymous>)
      at EventManager.forEach [as replayEvents] (tasks/1171523/base.js:180:15)
      at Object.replayEvents (tasks/1171523/index.test.js:323:15)

  ● EventManager › replayEvents › should rebuild the aggregate state from the event store (add event, update event, invite user, decline invitation)

    Event with id 1 does not exist.

      47 |     const event = this.#events.get(eventId);
      48 |     if (!event) {
    > 49 |       throw new Error(`Event with id ${eventId} does not exist.`);
         |             ^
      50 |     }
      51 |     Object.keys(newDetails).forEach((key) => {
      52 |       if (newDetails[key] !== undefined) {

      at EventManager.updateEvent (tasks/1171523/base.js:49:13)
      at updateEvent (tasks/1171523/base.js:193:16)
          at Array.forEach (<anonymous>)
      at EventManager.forEach [as replayEvents] (tasks/1171523/base.js:180:15)
      at Object.replayEvents (tasks/1171523/index.test.js:343:15)

  ● EventManager › subscribe › should notify subscribers on event creation

    expect(received).toHaveProperty(path, value)

    Expected path: "type"
    Received path: []

    Expected value: "EVENT_CREATED"
    Received value: {"date": 2030-01-01T04:30:00.000Z, "id": 1, "invitations": Map {}, "location": "Location", "remindersSent": 0, "title": "Subscribe Event"}

      355 |       manager.createEvent('Subscribe Event', '2030-01-01T10:00:00', 'Location');
      356 |       expect(callback).toHaveBeenCalled();
    > 357 |       expect(callback.mock.calls[0][0]).toHaveProperty('type', 'EVENT_CREATED');
          |                                         ^
      358 |       expect(callback.mock.calls[0][0]).toHaveProperty('payload');
      359 |       expect(callback.mock.calls[0][0].payload).toHaveProperty('id');
      360 |       expect(callback.mock.calls[0][0].payload).toHaveProperty(

      at Object.toHaveProperty (tasks/1171523/index.test.js:357:41)

Test Suites: 1 failed, 1 total
Tests:       13 failed, 15 passed, 28 total
```
Prompt:
I'm building an EventManager class and is experiencing several functional issues that are impacting its performance and reliability. Detailed below are the problems currently identified and the expected outcomes 


Identified Issues and Expected Outcomes
- Create Event: createEvent(title, date, location)
  Issue: Events lack an initial version number.
  Expected Outcome: Initialize each event with a version property set to 1.

- Update Event: updateEvent(eventId, newDetails, expectedVersion)
  Issue: No version consistency check during updates.
  Expected Outcome: Include a version check. If versions do not match, abort the update and return "Version conflict."

- Delete Event: deleteEvent(eventId)
  Issue: Deletions without existence check.
  Expected Outcome: Check if the event exists before deletion. Return "Event not found" if it does not exist.

- Invite User: inviteUser(eventId, userId)
  Issue: Allows multiple invitations to the same user.
  Expected Outcome: Verify if the user is already invited. Return "User already invited" if so.

- Send Reminder: sendReminder(eventId)
  Issue: Unclear behavior when no attendees are present.
  Expected Outcome: Check for attendees. If none, return false and "No attendees to remind."

- Serialization of Invitations
  Issue: Invitations stored in a Map, complicating JSON serialization.
  Expected Outcome: Store invitations in an object for JSON compatibility.

- Replay Events Functionality
  Issue: Fails to accurately restore event details.
  Expected Outcome: Ensure replayEvents fully reconstructs event details (ID, title, location, invitations) exactly as they were before deletion.

- Notification Dispatch System
  Issue: Inconsistent notification structure.
  Expected Outcome: Ensure all notifications have a consistent structure:
    type: String indicating the event action (e.g., "EVENT_CREATED", "EVENT_UPDATED", "EVENT_DELETED").
    payload: Object with full event details.

Note: Please give me the full fixed code not snippets of the fix.