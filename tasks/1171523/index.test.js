const { EventManager } = require('./solution');

describe('EventManager', () => {
  let manager;

  beforeEach(() => {
    manager = new EventManager();
  });

  describe('createEvent', () => {
    it('should create an event with valid parameters', () => {
      const event = manager.createEvent(
        'Test Event',
        '2030-01-01T10:00:00',
        'Test Location'
      );
      expect(event).toHaveProperty('id');
      expect(event.title).toBe('Test Event');
      expect(new Date(event.date)).toEqual(new Date('2030-01-01T10:00:00'));
      expect(event.location).toBe('Test Location');
      expect(event.version).toBe(1);
      expect(event.invitations).toEqual({});
      expect(event.remindersSent).toBe(0);
    });

    it('should throw an error if any required parameter is missing', () => {
      expect(() =>
        manager.createEvent('Test Event', '2030-01-01T10:00:00', null)
      ).toThrow();
      expect(() =>
        manager.createEvent('Test Event', null, 'Test Location')
      ).toThrow();
      expect(() =>
        manager.createEvent(null, '2030-01-01T10:00:00', 'Test Location')
      ).toThrow();
    });

    it('should throw an error for an invalid date format', () => {
      expect(() =>
        manager.createEvent('Test Event', 'invalid date', 'Test Location')
      ).toThrow('Invalid date format provided.');
    });
  });

  describe('deleteEvent', () => {
    it('should delete an existing event', () => {
      const event = manager.createEvent(
        'Delete Event',
        '2030-01-01T10:00:00',
        'Delete Location'
      );
      expect(manager.deleteEvent(event.id)).toBe(true);
      expect(() => manager.getEventDetails(event.id)).toThrow();
    });

    it('should throw an error when attempting to delete a non-existent event', () => {
      expect(() => manager.deleteEvent(999)).toThrow();
    });
  });

  describe('updateEvent', () => {
    it('should update event details successfully', () => {
      const event = manager.createEvent(
        'Update Event',
        '2030-01-01T10:00:00',
        'Old Location'
      );
      
      const updated = manager.updateEvent(
        event.id,
        { location: 'New Location' },
        1
      );
      expect(updated.location).toBe('New Location');
      expect(updated.version).toBe(2);
    });

    it('should throw an error if the expected version does not match (optimistic concurrency)', () => {
      const event = manager.createEvent(
        'Conflict Event',
        '2030-01-01T10:00:00',
        'Location'
      );
      expect(() =>
        manager.updateEvent(
          event.id,
          { location: 'New Location' },
          2
        )
      ).toThrow(/Version conflict/);
    });

    it('should throw an error when updating a non-existent event', () => {
      expect(() => manager.updateEvent(999, { location: 'Nowhere' })).toThrow();
    });

    it('should throw an error for an invalid date format on update', () => {
      const event = manager.createEvent(
        'Invalid Date Update',
        '2030-01-01T10:00:00',
        'Location'
      );
      expect(() =>
        manager.updateEvent(event.id, { date: 'invalid date' }, 1)
      ).toThrow('Invalid date format provided.');
    });
  });

  describe('inviteUser', () => {
    it('should successfully invite a user', () => {
      const event = manager.createEvent(
        'Invite Event',
        '2030-01-01T10:00:00',
        'Location'
      );
      expect(manager.inviteUser(event.id, 'user1')).toBe(true);
      const details = manager.getEventDetails(event.id);
      expect(details.invitations['user1']).toBe('pending');
    });

    it('should throw an error when inviting a user to a non-existent event', () => {
      expect(() => manager.inviteUser(999, 'user1')).toThrow();
    });

    it('should throw an error if the same user is invited twice', () => {
      const event = manager.createEvent(
        'Double Invite',
        '2030-01-01T10:00:00',
        'Location'
      );
      manager.inviteUser(event.id, 'user1');
      expect(() => manager.inviteUser(event.id, 'user1')).toThrow();
    });

    it('should throw an error if userId is missing', () => {
      const event = manager.createEvent(
        'No userId Invite',
        '2030-01-01T10:00:00',
        'Location'
      );
      expect(() => manager.inviteUser(event.id, null)).toThrow();
    });
  });

  describe('acceptInvitation', () => {
    it('should mark a user invitation as accepted', () => {
      const event = manager.createEvent(
        'Accept Invitation',
        '2030-01-01T10:00:00',
        'Location'
      );
      manager.inviteUser(event.id, 'user1');
      expect(manager.acceptInvitation(event.id, 'user1')).toBe(true);
      const details = manager.getEventDetails(event.id);
      expect(details.invitations['user1']).toBe('accepted');
    });

    it('should throw an error if a non-invited user attempts to accept', () => {
      const event = manager.createEvent(
        'Accept without Invite',
        '2030-01-01T10:00:00',
        'Location'
      );
      expect(() => manager.acceptInvitation(event.id, 'user1')).toThrow();
    });
  });

  describe('declineInvitation', () => {
    it('should mark a user invitation as declined', () => {
      const event = manager.createEvent(
        'Decline Invitation',
        '2030-01-01T10:00:00',
        'Location'
      );
      manager.inviteUser(event.id, 'user1');
      expect(manager.declineInvitation(event.id, 'user1')).toBe(true);
      const details = manager.getEventDetails(event.id);
      expect(details.invitations['user1']).toBe('declined');
    });

    it('should throw an error if a non-invited user attempts to decline', () => {
      const event = manager.createEvent(
        'Decline without Invite',
        '2030-01-01T10:00:00',
        'Location'
      );
      expect(() => manager.declineInvitation(event.id, 'user1')).toThrow();
    });
  });

  describe('getUpcomingEvents', () => {
    it('should return only future events sorted by date', () => {
      const pastEvent = manager.createEvent(
        'Past Event',
        '2000-01-01T10:00:00',
        'Past Location'
      );
      const futureEvent1 = manager.createEvent(
        'Future Event 1',
        '2030-01-01T10:00:00',
        'Location 1'
      );
      const futureEvent2 = manager.createEvent(
        'Future Event 2',
        '2040-01-01T10:00:00',
        'Location 2'
      );
      const upcoming = manager.getUpcomingEvents();
      expect(upcoming.find((ev) => ev.id === pastEvent.id)).toBeUndefined();
      expect(upcoming[0].id).toBe(futureEvent1.id);
      expect(upcoming[1].id).toBe(futureEvent2.id);
    });
  });

  describe('getEventDetails', () => {
    it('should throw an error if the event does not exist', () => {
      expect(() => manager.getEventDetails(999)).toThrow();
    });

    it('should return event details if the event exists', () => {
      // Create an event
      const event = manager.createEvent('Event 1', '2030-01-01T10:00:00', 'Texas');
      manager.updateEvent(event.id, { location: 'NYC' }, 1);     
      
      // Invite users
      manager.inviteUser(event.id, "user1");
      manager.inviteUser(event.id, "user2");
      
      // Users respond to invitations
      manager.acceptInvitation(event.id, "user1");
      manager.declineInvitation(event.id, "user2");
      
      // Get event details
      const eventDetails = manager.getEventDetails(event.id);
      expect(eventDetails.id).toBe(event.id);
      expect(eventDetails.title).toBe('Event 1');
      expect(eventDetails.location).toBe('NYC');
      expect(eventDetails.invitations).toEqual({ 'user1': 'accepted', 'user2': 'declined' });
      expect(eventDetails.remindersSent).toBe(0);
      expect(eventDetails.version).toBe(2);

    });
  });

  describe('getAttendeeList', () => {
    it('should return a list of users who accepted invitations', () => {
      // Create an event
      const event = manager.createEvent('Event 1', '2030-01-01T10:00:00', 'Texas');
      manager.updateEvent(event.id, { location: 'NYC' }, 1);     
      
      // Invite users
      manager.inviteUser(event.id, "user1");
      manager.inviteUser(event.id, "user2");
      
      // Users respond to invitations
      manager.acceptInvitation(event.id, "user1");
      manager.declineInvitation(event.id, "user2");
      
      const attendees = manager.getAttendeeList(event.id);
      expect(attendees).toEqual(['user1']);
    });

    it('should throw an error if the event does not exist', () => {
      expect(() => manager.getAttendeeList(999)).toThrow();
    });
  });

  describe('sendReminder', () => {
    it('should resolve false if no accepted attendees exist', async () => {
      const event = manager.createEvent(
        'Reminder Event',
        '2030-01-01T10:00:00',
        'Location'
      );
      await expect(manager.sendReminder(event.id)).resolves.toBe(false);
    });

    it('should send reminders to accepted attendees and update remindersSent count', async () => {
      const event = manager.createEvent(
        'Reminder Event',
        '2030-01-01T10:00:00',
        'Location'
      );
      manager.inviteUser(event.id, 'user1');
      manager.acceptInvitation(event.id, 'user1');
      await expect(manager.sendReminder(event.id)).resolves.toBe(true);
      const details = manager.getEventDetails(event.id);
      expect(details.remindersSent).toBe(1);
    });
  });

  describe('replayEvents', () => {
    it('should rebuild the aggregate state from the event store', () => {
      const event = manager.createEvent(
        'Replay Event',
        '2030-01-01T10:00:00',
        'Location'
      );
      manager.inviteUser(event.id, 'user1');
      manager.acceptInvitation(event.id, 'user1');
      const stateBeforeReplay = manager.getEventDetails(event.id);
      manager.deleteEvent(event.id);
      expect(() => manager.getEventDetails(event.id)).toThrow();
      manager.replayEvents();
      const stateAfterReplay = manager.getEventDetails(event.id);
      expect(stateAfterReplay.id).toBe(event.id);
      expect(stateAfterReplay.invitations['user1']).toBe('accepted');
    });

    // add event, update event, invite user, accept invitation
    it('should rebuild the aggregate state from the event store (add event, update event, invite user, accept invitation)', () => {
      const event = manager.createEvent(
        'Event 1',
        '2030-01-01T10:00:00',
        'Location'
      );
      manager.updateEvent(event.id, { location: 'New Location' }, 1);
      manager.inviteUser(event.id, 'user1');
      manager.acceptInvitation(event.id, 'user1');
      const stateBeforeReplay = manager.getEventDetails(event.id);
      manager.deleteEvent(event.id);
      expect(() => manager.getEventDetails(event.id)).toThrow();
      manager.replayEvents();
      const stateAfterReplay = manager.getEventDetails(event.id);
      expect(stateAfterReplay.id).toBe(event.id);
      expect(stateAfterReplay.location).toBe('New Location');
      expect(stateAfterReplay.invitations['user1']).toBe('accepted');
    });

    // add event, update event, invite user, decline invitation
    it('should rebuild the aggregate state from the event store (add event, update event, invite user, decline invitation)', () => {
      const event = manager.createEvent(
        'Event 1',
        '2030-01-01T10:00:00',
        'Location'
      );
      manager.updateEvent(event.id, { location: 'New Location' }, 1);
      manager.inviteUser(event.id, 'user1');
      manager.declineInvitation(event.id, 'user1');
      const stateBeforeReplay = manager.getEventDetails(event.id);
      manager.deleteEvent(event.id);
      expect(() => manager.getEventDetails(event.id)).toThrow();
      manager.replayEvents();
      const stateAfterReplay = manager.getEventDetails(event.id);
      expect(stateAfterReplay.id).toBe(event.id);
      expect(stateAfterReplay.location).toBe('New Location');
      expect(stateAfterReplay.invitations['user1']).toBe('declined');
    });
  });

  describe('subscribe', () => {
    it('should notify subscribers on event creation', () => {
      const callback = jest.fn();
      manager.subscribe('EVENT_CREATED', callback);
      manager.createEvent('Subscribe Event', '2030-01-01T10:00:00', 'Location');
      expect(callback).toHaveBeenCalled();
      expect(callback.mock.calls[0][0]).toHaveProperty('type', 'EVENT_CREATED');
      expect(callback.mock.calls[0][0]).toHaveProperty('payload');
      expect(callback.mock.calls[0][0].payload).toHaveProperty('id');
      expect(callback.mock.calls[0][0].payload).toHaveProperty(
        'title',
        'Subscribe Event'
      );
    });
  });
});