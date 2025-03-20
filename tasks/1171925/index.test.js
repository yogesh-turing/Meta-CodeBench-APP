const { BusScheduleSystem } = require('./model_c');

describe("BusScheduleSystem", () => {
  let busSystem;

  beforeEach(() => {
    busSystem = new BusScheduleSystem();
  });

  describe("createBusSchedule", () => {
    it("should create a bus schedule successfully", () => {
      const schedule = busSystem.createBusSchedule({
        scheduleId: "1",
        route: "Route 101",
        busId: "B123",
        departureTime: "2025-06-15 08:00:00",
        arrivalTime: "2025-06-15 10:00:00",
        stops: [
          { stopId: "S1", stopName: "Central Station", stopTime: "08:30:00" },
          { stopId: "S2", stopName: "Park Avenue", stopTime: "09:00:00" },
        ],
        status: "scheduled",
      });

      expect(schedule).toHaveProperty("scheduleId", "1");
      expect(schedule).toHaveProperty("route", "Route 101");
      expect(busSystem.schedules.length).toBe(1);
    });

    it("should throw error for invalid departureTime format", () => {
      expect(() => {
        busSystem.createBusSchedule({
          scheduleId: "1",
          route: "Route 101",
          busId: "B123",
          departureTime: "invalid-time",
          arrivalTime: "2025-06-15 10:00:00",
          stops: [
            { stopId: "S1", stopName: "Central Station", stopTime: "08:30:00" },
          ],
          status: "scheduled",
        });
      }).toThrowError("Invalid date-time format");
    });

    it("should throw error for invalid stopTime format", () => {
      expect(() => {
        busSystem.createBusSchedule({
          scheduleId: "1",
          route: "Route 101",
          busId: "B123",
          departureTime: "2025-06-15 08:00:00",
          arrivalTime: "2025-06-15 10:00:00",
          stops: [
            {
              stopId: "S1",
              stopName: "Central Station",
              stopTime: "invalid-time",
            },
          ],
          status: "scheduled",
        });
      }).toThrowError("Invalid stop time format");
    });

    it("should throw error for invalid status", () => {
      expect(() => {
        busSystem.createBusSchedule({
          scheduleId: "1",
          route: "Route 101",
          busId: "B123",
          departureTime: "2025-06-15 08:00:00",
          arrivalTime: "2025-06-15 10:00:00",
          stops: [
            { stopId: "S1", stopName: "Central Station", stopTime: "08:30:00" },
          ],
          status: "invalid-status",
        });
      }).toThrowError("Invalid schedule status");
    });
  });

  describe("updateBusSchedule", () => {
    it("should throw error if schedule does not exist", () => {
      // This case is already covered, but it will explicitly cover line 80
      expect(() => {
        busSystem.updateBusSchedule("nonexistent-id", { status: "ongoing" });
      }).toThrowError("Schedule not found");
    });

    it("should throw error if no changes are detected", () => {
      // This case is already covered, but it will explicitly cover lines 86 and 91-95
      busSystem.createBusSchedule({
        scheduleId: "1",
        route: "Route 101",
        busId: "B123",
        departureTime: "2025-06-15 08:00:00",
        arrivalTime: "2025-06-15 10:00:00",
        stops: [
          { stopId: "S1", stopName: "Central Station", stopTime: "08:30:00" },
        ],
        status: "scheduled",
      });

      expect(() => {
        // Attempting to update with the same values, which should trigger the "No changes detected" error
        busSystem.updateBusSchedule("1", {
          departureTime: "2025-06-15 08:00:00", // Same value
          arrivalTime: "2025-06-15 10:00:00", // Same value
          stops: [
            { stopId: "S1", stopName: "Central Station", stopTime: "08:30:00" }, // Same value
          ],
          status: "scheduled", // Same value
        });
      }).toThrowError("No changes detected");
    });

    it("should throw error if no changes are detected", () => {
      // This case is already covered, but it will explicitly cover lines 86 and 91-95
      busSystem.createBusSchedule({
        scheduleId: "1",
        route: "Route 101",
        busId: "B123",
        departureTime: "2025-06-15 08:00:00",
        arrivalTime: "2025-06-15 10:00:00",
        stops: [
          { stopId: "S1", stopName: "Central Station", stopTime: "08:30:00" },
        ],
        status: "scheduled",
      });

      expect(() => {
        // Attempting to update with the same values, which should trigger the "No changes detected" error
        busSystem.updateBusSchedule("1", {
          departureTime: "2025-06-15 08:00:00", // Same value
          arrivalTime: "2025-06-15 10:00:00", // Same value
          stops: [
            { stopId: "S1", stopName: "Central Station", stopTime: "08:30:00" }, // Same value
          ],
          status: "scheduled", // Same value
        });
      }).toThrowError("No changes detected");
    });

    
    it("should update bus schedule successfully and merge details", () => {
      busSystem.createBusSchedule({
        scheduleId: "1",
        route: "Route 101",
        busId: "B123",
        departureTime: "2025-06-15 08:00:00",
        arrivalTime: "2025-06-15 10:00:00",
        stops: [
          { stopId: "S1", stopName: "Central Station", stopTime: "08:30:00" },
        ],
        status: "scheduled",
      });

      const updatedSchedule = busSystem.updateBusSchedule("1", {
        route: "Route 102", // Change the route
        departureTime: "2025-06-15 09:00:00", // Change the departure time
      });

      expect(updatedSchedule.route).toBe("Route 102");
      expect(updatedSchedule.departureTime).toBe("2025-06-15 09:00:00");
      expect(updatedSchedule.scheduleId).toBe("1"); // Ensure the scheduleId remains the same
    });
  });

  describe("getBusScheduleById", () => {
    it("should return bus schedule by scheduleId", () => {
      busSystem.createBusSchedule({
        scheduleId: "1",
        route: "Route 101",
        busId: "B123",
        departureTime: "2025-06-15 08:00:00",
        arrivalTime: "2025-06-15 10:00:00",
        stops: [
          { stopId: "S1", stopName: "Central Station", stopTime: "08:30:00" },
        ],
        status: "scheduled",
      });

      const schedule = busSystem.getBusScheduleById("1");
      expect(schedule.scheduleId).toBe("1");
    });

    it("should throw error if scheduleId does not exist", () => {
      expect(() => {
        busSystem.getBusScheduleById("nonexistent-id");
      }).toThrowError("Schedule not found");
    });
  });

  describe("getSchedulesByStatus", () => {
    it("should return schedules with a specific status", () => {
      busSystem.createBusSchedule({
        scheduleId: "1",
        route: "Route 101",
        busId: "B123",
        departureTime: "2025-06-15 08:00:00",
        arrivalTime: "2025-06-15 10:00:00",
        stops: [
          { stopId: "S1", stopName: "Central Station", stopTime: "08:30:00" },
        ],
        status: "scheduled",
      });

      busSystem.createBusSchedule({
        scheduleId: "2",
        route: "Route 102",
        busId: "B124",
        departureTime: "2025-06-15 09:00:00",
        arrivalTime: "2025-06-15 11:00:00",
        stops: [
          { stopId: "S2", stopName: "Park Avenue", stopTime: "09:30:00" },
        ],
        status: "completed",
      });

      const scheduledSchedules = busSystem.getSchedulesByStatus("scheduled");
      expect(scheduledSchedules.length).toBe(1);
      expect(scheduledSchedules[0].scheduleId).toBe("1");

      const completedSchedules = busSystem.getSchedulesByStatus("completed");
      expect(completedSchedules.length).toBe(1);
      expect(completedSchedules[0].scheduleId).toBe("2");
    });

    it("should throw error for invalid status", () => {
      expect(() => {
        busSystem.getSchedulesByStatus("invalid-status");
      }).toThrowError("Invalid schedule status");
    });
  });
});
