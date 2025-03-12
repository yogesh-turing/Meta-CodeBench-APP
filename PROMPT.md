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

```
Stack Trace:
```javascript
Testing implementation: base_code
========================================
  console.log
    No accepted attendees to send reminders for event 1.

      at EventManager.log [as sendReminder] (1171523/base_code.js:127:15)

  console.log
    Reminder sent to user user1 for event "Reminder Event" at Tue Jan 01 2030 10:00:00 GMT+0300 (East Africa Time)

      at Timeout.log [as _onTimeout] (1171523/base_code.js:136:19)

 FAIL  1171523/index.test.js
  EventManager
    createEvent
      ✕ should create an event with valid parameters (4 ms)
      ✓ should throw an error if any required parameter is missing (8 ms)
      ✓ should throw an error for an invalid date format (1 ms)
    deleteEvent
      ✓ should delete an existing event (1 ms)
      ✓ should throw an error when attempting to delete a non-existent event
    updateEvent
      ✕ should update event details successfully
      ✕ should throw an error if the expected version does not match (optimistic concurrency) (1 ms)
      ✓ should throw an error when updating a non-existent event (1 ms)
      ✕ should throw an error for an invalid date format on update
    inviteUser
      ✕ should successfully invite a user (1 ms)
      ✓ should throw an error when inviting a user to a non-existent event (1 ms)
      ✓ should throw an error if the same user is invited twice
      ✕ should throw an error if userId is missing (1 ms)
    acceptInvitation
      ✕ should mark a user invitation as accepted
      ✓ should throw an error if a non-invited user attempts to accept
    declineInvitation
      ✕ should mark a user invitation as declined (1 ms)
      ✓ should throw an error if a non-invited user attempts to decline
    getUpcomingEvents
      ✓ should return only future events sorted by date
    getEventDetails
      ✓ should throw an error if the event does not exist (1 ms)
    getAttendeeList
      ✓ should return a list of users who accepted invitations
    sendReminder
      ✓ should resolve false if no accepted attendees exist (15 ms)
      ✓ should send reminders to accepted attendees and update remindersSent count (103 ms)
    replayEvents
      ✕ should rebuild the aggregate state from the event store (1 ms)
    subscribe
      ✕ should notify subscribers on event creation (3 ms)

  ● EventManager › createEvent › should create an event with valid parameters

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: undefined

      20 |       expect(new Date(event.date)).toEqual(new Date('2030-01-01T10:00:00'));
      21 |       expect(event.location).toBe('Test Location');
    > 22 |       expect(event.version).toBe(1);
         |                             ^
      23 |       expect(event.invitations).toEqual({});
      24 |       expect(event.remindersSent).toBe(0);
      25 |     });

      at Object.toBe (1171523/index.test.js:22:29)

  ● EventManager › updateEvent › should update event details successfully

    expect(received).toBe(expected) // Object.is equality

    Expected: NaN
    Received: undefined

      73 |       );
      74 |       expect(updated.location).toBe('New Location');
    > 75 |       expect(updated.version).toBe(event.version + 1);
         |                               ^
      76 |     });
      77 |
      78 |     it('should throw an error if the expected version does not match (optimistic concurrency)', () => {

      at Object.toBe (1171523/index.test.js:75:31)

  ● EventManager › updateEvent › should throw an error if the expected version does not match (optimistic concurrency)

    expect(received).toThrow(expected)

    Expected pattern: /Version conflict/

    Received function did not throw

      88 |           event.version + 1
      89 |         )
    > 90 |       ).toThrow(/Version conflict/);
         |         ^
      91 |     });
      92 |
      93 |     it('should throw an error when updating a non-existent event', () => {

      at Object.toThrow (1171523/index.test.js:90:9)

  ● EventManager › updateEvent › should throw an error for an invalid date format on update

    expect(received).toThrow(expected)

    Expected substring: "Invalid date format provided."

    Received function did not throw

      103 |       expect(() =>
      104 |         manager.updateEvent(event.id, { date: 'invalid date' }, event.version)
    > 105 |       ).toThrow('Invalid date format provided.');
          |         ^
      106 |     });
      107 |   });
      108 |

      at Object.toThrow (1171523/index.test.js:105:9)

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

      at Object.toBe (1171523/index.test.js:118:44)

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

      at Object.toThrow (1171523/index.test.js:141:56)

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

      at Object.toBe (1171523/index.test.js:155:44)

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

      at Object.toBe (1171523/index.test.js:178:44)

  ● EventManager › replayEvents › should rebuild the aggregate state from the event store

    Event with id 1 does not exist.

      62 |     const event = this.#events.get(eventId);
      63 |     if (!event) {
    > 64 |       throw new Error(`Event with id ${eventId} does not exist.`);
         |             ^
      65 |     }
      66 |     if (event.invitations.has(userId)) {
      67 |       throw new Error(`User ${userId} has already been invited.`);

      at EventManager.inviteUser (1171523/base_code.js:64:13)
      at inviteUser (1171523/base_code.js:196:16)
          at Array.forEach (<anonymous>)
      at EventManager.forEach [as replayEvents] (1171523/base_code.js:180:15)
      at Object.replayEvents (1171523/index.test.js:279:15)

  ● EventManager › subscribe › should notify subscribers on event creation

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"payload": ObjectContaining {"id": 1}, "type": "EVENT_CREATED"}
    Received: {"date": 2030-01-01T07:00:00.000Z, "id": 1, "invitations": Map {}, "location": "Location", "remindersSent": 0, "title": "Subscribe Event"}

    Number of calls: 1

      293 |         'Location'
      294 |       );
    > 295 |       expect(callback).toHaveBeenCalledWith(
          |                        ^
      296 |         expect.objectContaining({
      297 |           type: 'EVENT_CREATED',
      298 |           payload: expect.objectContaining({ id: event.id }),

      at Object.toHaveBeenCalledWith (1171523/index.test.js:295:24)

Test Suites: 1 failed, 1 total
Tests:       10 failed, 14 passed, 24 total
Snapshots:   0 total
Time:        0.851 s
Ran all test suites matching /1171523/i.
```
Prompt:
I'm building EventManager class and is experiencing several functional issues that are impacting its performance and reliability. Detailed below are the problems currently identified and expected outcomes 

Identified Issues and Expected Outcomes:
- createEvent(title, date, location)
Issue: Currently, events are created without an initial version number, essential for tracking changes through updates.
Expected Outcome: Each event should be created with a version property initialized at 1. This should be explicitly verified during event creation to facilitate change management.

- updateEvent(eventId, newDetails, expectedVersion)
Issue: Event updates do not verify version consistency prior to application, leading to potential overwrites or conflicts.
Expected Outcome: The update process must include a version check: it should compare the provided expectedVersion with the event's stored version. If the versions do not match, the update should be aborted, and a specific error message, "Version conflict," should be returned.

- deleteEvent(eventId)
Issue: Deletions are attempted without checking if the event actually exists, resulting in misleading successes.
Expected Outcome: Implement a pre-deletion check to confirm the event's existence. If the event is not found, the method should return a clear error message, "Event not found," to prevent confusion.

- inviteUser(eventId, userId)
Issue: The system allows multiple invitations to be sent to the same user for an event, which can lead to redundant data.
Expected Outcome: Before adding a user to the event’s invitations, verify that the user has not already been invited. If already invited, the system should return an error, "User already invited."

- sendReminder(eventId)
Issue: It's unclear what happens when there are no attendees to remind, which can lead to ambiguous outcomes.
Expected Outcome: Modify the sendReminder function to check the number of attendees who accepted the invitation. If no attendees are available, the function should return false and a clear message, "No attendees to remind."

- serialization of invitations
Issue: Invitations are stored in a Map, which cannot be directly serialized into JSON, complicating data handling and storage.
Expected Outcome: Change the storage of invitations from a Map to an object, which should be implemented before any operation requiring serialization, ensuring compatibility with JSON formats.

- Replay Events Functionality
Issue: The replayEvents method fails to restore event details accurately after deletions, indicating issues in logging or reconstructing events.
Expected Outcome: Modify the replayEvents method to ensure it can fully reconstruct an event’s details (ID, title, location, invitations) exactly as they were before deletion.

Revise the notification dispatch system in the EventManager to ensure that all notifications, regardless of the event action type, are sent with a consistent structure:
type: A string indicating the notification type, corresponding to the event action (e.g., "EVENT_CREATED", "EVENT_UPDATED", "EVENT_DELETED").
payload: An object containing the full details of the event involved in the action.

- please give me full fixed code not snippets of the fix.