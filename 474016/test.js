const { FlightScheduler } = require("./solution.js");

describe("FlightScheduler", () => {
  let scheduler;

  beforeEach(() => {
    scheduler = new FlightScheduler();
    // Base flights
    scheduler.addFlight("AA101", "NYC", "LAX", 300);
    scheduler.addFlight("AA102", "LAX", "SFO", 90);
    scheduler.addFlight("AA103", "NYC", "SFO", 450);
    scheduler.addFlight("AA104", "NYC", "ORD", 180);
    scheduler.addFlight("AA105", "ORD", "SFO", 240);
    scheduler.addFlight("AA106", "SFO", "SEA", 120);
  });

  describe("Route Finding Tests", () => {
    test("should find shortest direct route when available", () => {
      expect(scheduler.findShortestRoute("NYC", "SFO")).toEqual(["AA103"]);
    });

    test("should find shortest route with multiple valid options", () => {
      const route = scheduler.findShortestRoute("NYC", "SEA");
      const validRoutes = [
        ["AA103", "AA106"],
        ["AA104", "AA105", "AA106"],
        ["AA101", "AA102", "AA106"],
      ];
      expect(validRoutes).toContainEqual(route);
    });

    test("should handle multiple layover scenarios", () => {
      scheduler.addFlight("AA107", "LAX", "DEN", 150);
      scheduler.addFlight("AA108", "DEN", "SEA", 180);
      const route = scheduler.findShortestRoute("NYC", "SEA");
      expect(route).toEqual(expect.arrayContaining(["AA103", "AA106"]));
    });

    test("should handle equal duration routes", () => {
      scheduler.addFlight("AA109", "NYC", "DEN", 240);
      scheduler.addFlight("AA110", "DEN", "SFO", 210);
      const route = scheduler.findShortestRoute("NYC", "SFO");
      const totalTime = scheduler.getTotalFlightTime(route);
      expect(totalTime).toBeLessThanOrEqual(450); // Duration of direct flight AA103
    });
  });

  describe("Edge Cases and Error Handling", () => {
    test("should handle empty flight list", () => {
      const emptyScheduler = new FlightScheduler();
      expect(emptyScheduler.findShortestRoute("NYC", "SFO")).toEqual([]);
    });

    test("should handle duplicate flights with different durations", () => {
      scheduler.addFlight("AA111", "NYC", "LAX", 290); // Faster than AA101
      expect(scheduler.findShortestRoute("NYC", "LAX")).toEqual(["AA111"]);
    });

    test("should validate flight data on addition", () => {
      expect(() => scheduler.addFlight("", "NYC", "LAX", 300)).toThrow();
      expect(() => scheduler.addFlight("AA112", "", "LAX", 300)).toThrow();
      expect(() => scheduler.addFlight("AA112", "NYC", "", 300)).toThrow();
      expect(() => scheduler.addFlight("AA112", "NYC", "LAX", -1)).toThrow();
    });

    test("should handle case sensitivity consistently", () => {
      expect(scheduler.hasDirectFlight("nyc", "lax")).toBe(true);
      expect(scheduler.getAllDestinationsFromCity("NYC")).toEqual(
        scheduler.getAllDestinationsFromCity("nyc")
      );
    });
  });

  describe("Complex Route Scenarios", () => {
    test("should handle complex multi-city routes", () => {
      scheduler.addFlight("AA120", "LAX", "CHI", 240);
      scheduler.addFlight("AA121", "CHI", "MIA", 180);
      scheduler.addFlight("AA122", "MIA", "NYC", 150);
      const route = scheduler.findShortestRoute("SFO", "NYC");
      expect(route).not.toEqual([]);
      expect(scheduler.getTotalFlightTime(route)).toBeDefined();
    });

    test("should prevent infinite loops in circular routes", () => {
      scheduler.addFlight("AA130", "SEA", "NYC", 300);
      scheduler.addFlight("AA131", "NYC", "SEA", 300);
      expect(() => scheduler.findShortestRoute("NYC", "SEA")).not.toThrow();
    });

    test("should handle multiple possible layover cities", () => {
      scheduler.addFlight("AA140", "NYC", "DFW", 200);
      scheduler.addFlight("AA141", "DFW", "SEA", 240);
      scheduler.addFlight("AA142", "NYC", "ATL", 150);
      scheduler.addFlight("AA143", "ATL", "SEA", 300);
      const route = scheduler.findShortestRoute("NYC", "SEA");
      expect(scheduler.getTotalFlightTime(route)).toBeDefined();
    });
  });

  describe("Data Validation Tests", () => {
    test("should validate flight numbers are unique", () => {
      expect(() => {
        scheduler.addFlight("AA101", "NYC", "BOS", 120);
      }).toThrow();
    });

    test("should validate city names contain only letters", () => {
      expect(() => {
        scheduler.addFlight("AA150", "NYC123", "BOS", 120);
      }).toThrow();
    });

    test("should validate duration is a positive number", () => {
      expect(() => {
        scheduler.addFlight("AA150", "NYC", "BOS", 0);
      }).toThrow();
      expect(() => {
        scheduler.addFlight("AA150", "NYC", "BOS", -120);
      }).toThrow();
    });
  });
});
