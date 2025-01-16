const { TicketBookingSystem } = require('./correct');

describe("TicketBookingSystem", () => {
  let system;

  beforeEach(() => {
    system = new TicketBookingSystem(["A1", "B1", "C1"], 2000);
    jest.restoreAllMocks();
  });

  describe("reserveTickets", () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });
    test("should reserve tickets and show available tickets", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1"]);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Reserved A1 tickets for user user1."
      );
      system.showAvailableTickets();
      expect(consoleSpy).toHaveBeenCalledWith("Available tickets: B1,C1");
    });

    test("should handle unavailable tickets", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1", "D1"]);
      expect(consoleSpy).toHaveBeenCalledWith("Tickets D1 are not available!");
    });

    test("should release reserved tickets after expiry", () => {
      jest.useFakeTimers();
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1"]);

      jest.advanceTimersByTime(5000);

      system.showAvailableTickets();
      expect(consoleSpy).toHaveBeenNthCalledWith(
        1,
        "Reserved A1 tickets for user user1."
      );
      expect(consoleSpy).toHaveBeenNthCalledWith(
        2,
        "Available tickets: B1,C1,A1"
      );
      jest.useRealTimers();
    });
  });

  describe("releaseTickets", () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });
    test("should not release tickets when there ara no reserved tickets", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.releaseTickets("user1");
      expect(consoleSpy).toHaveBeenCalledWith(
        "No tickets to release for user user1."
      );
    });

    test("should release tickets", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1"]);
      system.releaseTickets("user1");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Released A1 tickets for user user1."
      );
    });
  });

  describe("checkout", () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });
    test("should not checkout when there are no reserved tickets", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.checkout("user1");
      expect(consoleSpy).toHaveBeenCalledWith(
        "No reserved tickets found for user user1."
      );
    });

    test("should checkout", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1", "B1"]);
      system.checkout("user1");
      expect(consoleSpy).toHaveBeenCalledWith(
        "User user1 checked out with A1,B1 tickets."
      );
    });
  });

  describe("showAvailableTickets", () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });
    test("should show all available tickets", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.showAvailableTickets();
      expect(consoleSpy).toHaveBeenCalledWith("Available tickets: A1,B1,C1");
    });

    test("should show available tickets after tickets are reserved", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1"]);
      system.showAvailableTickets();
      expect(consoleSpy).toHaveBeenCalledWith("Available tickets: B1,C1");
      system.reserveTickets("user1", ["B1"]);
      system.showAvailableTickets();
      expect(consoleSpy).toHaveBeenCalledWith("Available tickets: C1");
    });
  });

  describe("showCart", () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });
    test("should show cart for a user", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1", "B1"]);
      system.checkout("user1");
      system.showCart("user1");
      expect(consoleSpy).toHaveBeenCalledWith("Cart: A1,B1");
    });

    test("should show empty cart for a user", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.showCart("user1");
      expect(consoleSpy).toHaveBeenCalledWith("Cart: ");
    });

    test("should show empty cart after expiry", () => {
      jest.useFakeTimers();
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1", "B1"]);
      jest.advanceTimersByTime(5000);

      system.checkout("user1");
      system.showCart("user1");
      expect(consoleSpy).toHaveBeenLastCalledWith("Cart: ");
      jest.useRealTimers();
    });
  });

  describe("Validate methods", () => {
    test("should validate TicketBookingSystem", () => {
      expect(() => new TicketBookingSystem(null, 2000)).toThrow(
        "Invalid Input"
      );
      expect(() => new TicketBookingSystem([], -2)).toThrow("Invalid Input");
      expect(() => new TicketBookingSystem([], 0)).toThrow("Invalid Input");
      expect(() => new TicketBookingSystem(["A1"], 2000)).not.toThrow();
      expect(() => new TicketBookingSystem()).toThrow("Invalid Input");
      expect(() => new TicketBookingSystem([1], -2)).toThrow("Invalid Input");
      expect(() => new TicketBookingSystem([""], -2)).toThrow("Invalid Input");
    });

    test("should validate reserveTickets method", () => {
      expect(() => system.reserveTickets("", ["A1", "D1"])).toThrow(
        "Invalid Input"
      );
      expect(() => system.reserveTickets("user1", [""])).toThrow(
        "Invalid Input"
      );
      expect(() => system.reserveTickets(null, ["A1", "D1"])).toThrow();
      expect(() => system.reserveTickets("user1", null)).toThrow();
      expect(() => system.reserveTickets("user1", ["A1", "D1"])).not.toThrow();
    });

    test("should validate releaseTickets method", () => {
      expect(() => system.releaseTickets("")).toThrow("Invalid Input");
      expect(() => system.releaseTickets(null)).toThrow();
      expect(() => system.releaseTickets("user1")).not.toThrow();
    });

    test("should validate checkout method", () => {
      expect(() => system.checkout("")).toThrow("Invalid Input");
      expect(() => system.checkout(null)).toThrow();
      expect(() => system.checkout("user1")).not.toThrow();
    });

    test("should validate showCart method", () => {
      expect(() => system.showCart("")).toThrow("Invalid Input");
      expect(() => system.showCart(null)).toThrow();
      expect(() => system.showCart("user1")).not.toThrow();
    });
  });

  describe("Edge cases", () => {
    test("mutiple users should be able to reserve tickets", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1"]);
      system.reserveTickets("user2", ["B1"]);
      system.showAvailableTickets();
      expect(consoleSpy).toHaveBeenCalledWith("Available tickets: C1");
    });

    test("mutiple users should be able to checkout", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1"]);
      system.reserveTickets("user2", ["B1"]);
      system.checkout("user1");
      system.checkout("user2");
      system.showAvailableTickets();
      system.showCart("user1");
      system.showCart("user2");
      expect(consoleSpy).toHaveBeenCalledWith("Available tickets: C1");
      expect(consoleSpy).toHaveBeenCalledWith("Cart: A1");
      expect(consoleSpy).toHaveBeenCalledWith("Cart: B1");
    });

    test("mutiple users should be able to release tickets", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1"]);
      system.reserveTickets("user2", ["B1"]);
      system.releaseTickets("user1");
      system.releaseTickets("user2");
      system.showAvailableTickets();
      expect(consoleSpy).toHaveBeenCalledWith("Available tickets: C1,A1,B1");
    });

    test("user should not be able to reserve other users reserved ticket", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1"]);
      system.reserveTickets("user2", ["A1"]);
      expect(consoleSpy).toHaveBeenCalledWith("Tickets A1 are not available!");
    });

    test("user should be able to reserve multiple tickets", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1", "B1", "C1"]);
      system.showAvailableTickets();
      expect(consoleSpy).toHaveBeenCalledWith("Available tickets: ");
    });

    test("user should be able to release multiple tickets", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1", "B1", "C1"]);
      system.releaseTickets("user1");
      system.showAvailableTickets();
      expect(consoleSpy).toHaveBeenCalledWith("Available tickets: A1,B1,C1");
    });

    test("user should be able to checkout multiple tickets", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1", "B1", "C1"]);
      system.checkout("user1");
      system.showCart("user1");
      expect(consoleSpy).toHaveBeenCalledWith("Cart: A1,B1,C1");
    });

    test("user should not be able to checkout other users reserved tickets", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1"]);
      system.checkout("user2");
      expect(consoleSpy).toHaveBeenCalledWith(
        "No reserved tickets found for user user2."
      );
    });

    test("user should not be able to release other users reserved tickets", () => {
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1"]);
      system.releaseTickets("user2");
      expect(consoleSpy).toHaveBeenCalledWith(
        "No tickets to release for user user2."
      );
    });

    test("user should be able to checkout before expiry", () => {
      jest.useFakeTimers();
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1"]);
      jest.advanceTimersByTime(1000);
      system.checkout("user1");
      expect(consoleSpy).toHaveBeenCalledWith(
        "User user1 checked out with A1 tickets."
      );
      jest.useRealTimers();
    });

    test("user should be able to reserve tickets after expiry", () => {
      jest.useFakeTimers();
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1"]);
      jest.advanceTimersByTime(5000);
      system.reserveTickets("user1", ["A1"]);
      expect(consoleSpy).toHaveBeenNthCalledWith(
        1,
        "Reserved A1 tickets for user user1."
      );
      expect(consoleSpy).toHaveBeenNthCalledWith(
        2,
        "Reserved A1 tickets for user user1."
      );
      jest.useRealTimers();
    });

    test("user should not be able to release tickets after expiry", () => {
      jest.useFakeTimers();
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1"]);
      jest.advanceTimersByTime(5000);
      system.releaseTickets("user1");
      expect(consoleSpy).toHaveBeenNthCalledWith(
        1,
        "Reserved A1 tickets for user user1."
      );
      expect(consoleSpy).toHaveBeenNthCalledWith(
        2,
        "No tickets to release for user user1."
      );
      jest.useRealTimers();
    });

    test("reserving tickets should reset expiry time", () => {
      jest.useFakeTimers();
      const consoleSpy = jest.spyOn(console, "log");
      system.reserveTickets("user1", ["A1"]);
      jest.advanceTimersByTime(1500);
      system.reserveTickets("user1", ["B1"]);
      jest.advanceTimersByTime(1500);
      system.reserveTickets("user1", ["C1"]);
      jest.advanceTimersByTime(1500);
      system.checkout("user1");
      system.showCart("user1");
      system.showAvailableTickets();

      expect(consoleSpy).toHaveBeenNthCalledWith(
        1,
        "Reserved A1 tickets for user user1."
      );
      expect(consoleSpy).toHaveBeenNthCalledWith(
        2,
        "Reserved B1 tickets for user user1."
      );
      expect(consoleSpy).toHaveBeenNthCalledWith(
        3,
        "Reserved C1 tickets for user user1."
      );
      expect(consoleSpy).toHaveBeenNthCalledWith(
        4,
        "User user1 checked out with A1,B1,C1 tickets."
      );
      expect(consoleSpy).toHaveBeenNthCalledWith(5, "Cart: A1,B1,C1");
      expect(consoleSpy).toHaveBeenNthCalledWith(6, "Available tickets: ");
      jest.useRealTimers();
    });
  });
});
