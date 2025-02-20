const { IBCCUser } = require('./solution'); // Make sure to import your class

describe('IBCCUser Class', () => {

    // 1. Test createAccount with valid inputs
    test('createAccount should create a new account successfully', () => {
        const user = new IBCCUser();
        const result = user.createAccount("user@example.com", "password123");
        expect(result).toBe("Successful");
    });

    // 2. Test createAccount with invalid email format
    test('createAccount should throw error for invalid email format', () => {
        const user = new IBCCUser();
        expect(() => {
            user.createAccount("invalid-email", "password123");
        }).toThrow("Error Encountered");
    });

    // 3. Test createAccount with password shorter than 6 characters
    test('createAccount should throw error for short password', () => {
        const user = new IBCCUser();
        expect(() => {
            user.createAccount("user@example.com", "pass");
        }).toThrow("Error Encountered");
    });

    // 4. Test requestAppointment with valid date and time
    test('requestAppointment should successfully create an appointment', () => {
        const user = new IBCCUser();
        user.createAccount("user@example.com", "password123");
        const result = user.requestAppointment("2025-02-18", "10:00");
        expect(result).toBe("Successful");
    });

    // 5. Test requestAppointment with invalid date format
    test('requestAppointment should throw error for invalid date format', () => {
        const user = new IBCCUser();
        user.createAccount("user@example.com", "password123");
        expect(() => {
            user.requestAppointment("2025-18-02", "10:00");
        }).toThrow("Error Encountered");
    });

    // 6. Test requestAppointment with invalid time format
    test('requestAppointment should throw error for invalid time format', () => {
        const user = new IBCCUser();
        user.createAccount("user@example.com", "password123");
        expect(() => {
            user.requestAppointment("2025-02-18", "10:60");
        }).toThrow("Error Encountered");
    });

    // 7. Test requestAppointment when slot is unavailable
    test('requestAppointment should throw error when slot is unavailable', () => {
        const user = new IBCCUser();
        user.createAccount("user@example.com", "password123");
        user.requestAppointment("2025-02-18", "10:00");
        expect(() => {
            user.requestAppointment("2025-02-18", "10:00"); // Same slot
        }).toThrow("Error Encountered");
    });

    // 8. Test editAppointment with valid details
    test('editAppointment should successfully edit an existing appointment', () => {
        const user = new IBCCUser();
        user.createAccount("user@example.com", "password123");
        user.requestAppointment("2025-02-18", "10:00");
        const result = user.editAppointment("2025-02-18", "10:00", "2025-02-18", "11:00");
        expect(result).toBe("Successful");
    });

    // 9. Test editAppointment with non-existent appointment
    test('editAppointment should throw error if appointment doesn’t exist', () => {
        const user = new IBCCUser();
        user.createAccount("user@example.com", "password123");
        expect(() => {
            user.editAppointment("2025-02-18", "10:00", "2025-02-19", "10:00"); // Non-existent appointment
        }).toThrow("Error Encountered");
    });

    // 10. Test editAppointment with invalid new date or time
    test('editAppointment should throw error for invalid new date/time', () => {
        const user = new IBCCUser();
        user.createAccount("user@example.com", "password123");
        user.requestAppointment("2025-02-18", "10:00");
        expect(() => {
            user.editAppointment("2025-02-18", "10:00", "2025-02-18", "25:00"); // Invalid time
        }).toThrow("Error Encountered");
    });

    // 11. Test checkAvailableSlots with valid date
    test('checkAvailableSlots should return available slots for a valid date', () => {
        const user = new IBCCUser();
        user.createAccount("user@example.com", "password123");
        const slots = user.checkAvailableSlots("2025-02-18");
        expect(Array.isArray(slots)).toBe(true); // Check if slots is an array
    });

    // 12. Test checkAvailableSlots with invalid date format
    test('checkAvailableSlots should throw error for invalid date format', () => {
        const user = new IBCCUser();
        user.createAccount("user@example.com", "password123");
        expect(() => {
            user.checkAvailableSlots("2025-18-02"); // Invalid date format
        }).toThrow("Error Encountered");
    });

    // 13. Test viewAppointments should return current appointments
    test('viewAppointments should return the user’s current appointments', () => {
        const user = new IBCCUser();
        user.createAccount("user@example.com", "password123");
        user.requestAppointment("2025-02-18", "10:00");
        const appointments = user.viewAppointments();
        expect(appointments.length).toBe(1);
        expect(appointments[0].date).toBe("2025-02-18");
        expect(appointments[0].time).toBe("10:00");
    });

    // 14. Test deleteAppointment with valid details
    test('deleteAppointment should successfully delete an existing appointment', () => {
        const user = new IBCCUser();
        user.createAccount("user@example.com", "password123");
        user.requestAppointment("2025-02-18", "10:00");
        const result = user.deleteAppointment("2025-02-18", "10:00");
        expect(result).toBe("Successful");
    });

    // 15. Test deleteAppointment with non-existent appointment
    test('deleteAppointment should throw error if the appointment doesn’t exist', () => {
        const user = new IBCCUser();
        user.createAccount("user@example.com", "password123");
        expect(() => {
            user.deleteAppointment("2025-02-18", "10:00"); // Non-existent appointment
        }).toThrow("Error Encountered");
    });

    // 16. Test getAvailableSlotsForDate when slots are available
    test('getAvailableSlotsForDate should return available slots for a date', () => {
        const user = new IBCCUser();
        user.createAccount("user@example.com", "password123");
        const slots = user.getAvailableSlotsForDate("2025-02-18");
        expect(slots.length).toBeGreaterThan(0); // Should return at least one slot
    });

});