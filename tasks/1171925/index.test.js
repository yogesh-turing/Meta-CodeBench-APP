const { ReservationSystem } = require('./model_a');

describe("Reservation System", () => {
    let system;

    beforeEach(() => {
        system = new ReservationSystem();
    });

    test("Should successfully book a room and store the reservation", () => {
        const result = system.bookRoom("alice", "B202", "2025-03-25", "10:00", "12:00");
        expect(result).toBe(true);

        // Check reservation was actually stored
        const bookings = system.getRoomBookings("B202", "2025-03-25");
        expect(bookings.length).toBe(1);
        expect(bookings[0]).toMatchObject({ user: "alice", startTime: "10:00", endTime: "12:00" });
    });

    test.only("Should fail to book a full room", () => {
        system.bookRoom("alice", "B202", "2025-03-25", "10:00", "12:00");
        system.bookRoom("bob", "B202", "2025-03-25", "10:00", "12:00");
        const result = system.bookRoom("charlie", "B202", "2025-03-25", "10:00", "12:00");
        
        expect(result).toBe(false);
        
        // Verify no extra reservation exists
        const bookings = system.getRoomBookings("B202", "2025-03-25");
        expect(bookings.length).toBe(2);
    });

    test("Should cancel a booking and remove it from the list", () => {
        system.bookRoom("alice", "B202", "2025-03-25", "10:00", "12:00");
        const result = system.cancelBooking("alice", "B202", "2025-03-25", "10:00");
        
        expect(result).toBe(true);

        // Verify booking is removed
        const bookings = system.getRoomBookings("B202", "2025-03-25");
        expect(bookings.length).toBe(0);
    });

    test("Should not cancel a non-existent booking", () => {
        const result = system.cancelBooking("alice", "B202", "2025-03-25", "10:00");
        expect(result).toBe(false);
    });

    test("Should not cancel within 24 hours", () => {
        jest.useFakeTimers().setSystemTime(new Date("2025-03-24T09:00:00"));
        system.bookRoom("alice", "B202", "2025-03-25", "10:00", "12:00");

        jest.useFakeTimers().setSystemTime(new Date("2025-03-25T08:00:00")); // Only 2 hours left
        const result = system.cancelBooking("alice", "B202", "2025-03-25", "10:00");
        
        expect(result).toBe(false);
        jest.useRealTimers();
    });

    test("Should reschedule a booking correctly", () => {
        system.bookRoom("alice", "B202", "2025-03-25", "10:00", "12:00");
        const result = system.rescheduleBooking("alice", "B202", "2025-03-25", "10:00", "2025-03-26", "11:00", "13:00");

        expect(result).toBe(true);

        // Ensure old booking was removed
        expect(system.getRoomBookings("B202", "2025-03-25").length).toBe(0);

        // Ensure new booking was added
        const newBookings = system.getRoomBookings("B202", "2025-03-26");
        expect(newBookings.length).toBe(1);
        expect(newBookings[0]).toMatchObject({ user: "alice", startTime: "11:00", endTime: "13:00" });
    });

    test("Should not reschedule if the original booking doesn't exist", () => {
        const result = system.rescheduleBooking("alice", "B202", "2025-03-25", "10:00", "2025-03-26", "11:00", "13:00");
        expect(result).toBe(false);
    });
});