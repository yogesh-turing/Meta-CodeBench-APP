const { EventManager } = require('./solution');

describe("EventManager", () => {
  let eventManager;

  beforeEach(() => {
    eventManager = new EventManager();
  });

  test("should create an event successfully", () => {
    const event = eventManager.createEvent(
      "Meeting",
      "2025-03-10",
      "10:00",
      "11:00",
      "Conference Room",
      "Team sync-up",
      "Work",
      "None",
      "15 minutes before",
      "UTC"
    );

    expect(event).toBeDefined();
    expect(event.title).toBe("Meeting");
    expect(eventManager.events.length).toBe(1);
  });

  test("should not create an event on a blocked date", () => {
    eventManager.blockDate("2025-03-15");
    const event = eventManager.createEvent(
      "Conference",
      "2025-03-15",
      "09:00",
      "12:00",
      "Main Hall",
      "Annual conference",
      "Business",
      "None",
      "30 minutes before",
      "UTC"
    );

    expect(event).toBe("Sat Mar 15 2025 is not available, it has been blocked");
  });

  test("should not create an event on a past date", () => {
    const pastDate = "2023-01-01";
    const event = eventManager.createEvent(
      "Old Event",
      pastDate,
      "10:00",
      "11:00",
      "Old Location",
      "Old Description",
      "None",
      "None",
      "15 minutes before",
      "UTC"
    );

    expect(event).toBe(
      `${new Date(pastDate).toDateString()} is a past date, cannot be scheduled`
    );
  });

  test("should edit an existing event", () => {
    const event = eventManager.createEvent(
      "Meeting",
      "2025-03-10",
      "10:00",
      "11:00",
      "Room 101",
      "Sync-up",
      "Work",
      "None",
      "15 minutes before",
      "UTC"
    );

    const updatedEvent = eventManager.editEvent(event.id, {
      title: "Updated Meeting",
      location: "Room 102",
    });
    expect(updatedEvent).toBeDefined();
    expect(updatedEvent.title).toBe("Updated Meeting");
    expect(updatedEvent.location).toBe("Room 102");
  });

  test("should not edit an event to a blocked date", () => {
    const event = eventManager.createEvent(
      "Meeting",
      "2025-03-10",
      "10:00",
      "11:00",
      "Room 101",
      "Sync-up",
      "Work",
      "None",
      "15 minutes before",
      "UTC"
    );
    eventManager.blockDate("2025-03-15");

    const updatedEvent = eventManager.editEvent(event.id, {
      date: "2025-03-15",
    });
    expect(updatedEvent).toBe(
      "Sat Mar 15 2025 is not available, it has been blocked"
    );
  });

  test("should delete an existing event", () => {
    const event = eventManager.createEvent(
      "Meeting",
      "2025-03-10",
      "10:00",
      "11:00",
      "Room 101",
      "Sync-up",
      "Work",
      "None",
      "15 minutes before",
      "UTC"
    );
    const result = eventManager.deleteEvent(event.id);

    expect(result).toBe(true);
    expect(eventManager.events.length).toBe(0);
  });

  test("should return error when deleting non-existing event", () => {
    const result = eventManager.deleteEvent(999);
    expect(result).toBe("event with the id 999 does not exists");
  });

  test("should search for events by title and description", () => {
    eventManager.createEvent(
      "Standup",
      "2025-03-10",
      "09:00",
      "09:30",
      "Zoom",
      "Daily standup meeting",
      "Work",
      "None",
      "10 minutes before",
      "UTC"
    );
    eventManager.createEvent(
      "Workshop",
      "2025-03-11",
      "14:00",
      "16:00",
      "Main Hall",
      "Team workshop",
      "Work",
      "None",
      "30 minutes before",
      "UTC"
    );

    const results = eventManager.searchEvents("standup");
    expect(results.length).toBe(1);
    expect(results[0].title).toBe("Standup");
  });

  test("should filter events by category", () => {
    eventManager.createEvent(
      "Team Meeting",
      "2025-03-10",
      "10:00",
      "11:00",
      "Room 101",
      "Sync-up",
      "Work",
      "None",
      "15 minutes before",
      "UTC"
    );
    eventManager.createEvent(
      "Birthday Party",
      "2025-04-12",
      "18:00",
      "21:00",
      "Banquet Hall",
      "Celebration",
      "Personal",
      "None",
      "1 hour before",
      "UTC"
    );

    const workEvents = eventManager.filterEventsByCategory("Work");
    expect(workEvents.length).toBe(1);
    expect(workEvents[0].title).toBe("Team Meeting");
  });

  test("should block a date successfully", () => {
    const result = eventManager.blockDate("2025-05-01");
    expect(eventManager.blockDates.includes("2025-05-01")).toBe(true);
    expect(result).toBeUndefined();
  });

  test("should not block a past date", () => {
    const pastDate = "2023-01-01";
    const result = eventManager.blockDate(pastDate);
    expect(result).toBe(
      `${new Date(pastDate).toDateString()} is a past date, cannot be blocked`
    );
  });

  test("should not block a date that is already blocked", () => {
    eventManager.blockDate("2025-06-15");
    const result = eventManager.blockDate("2025-06-15");
    expect(result).toBe(
      `${new Date("2025-06-15").toDateString()} has already been blocked`
    );
  });
});