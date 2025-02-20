// IBCCUser class represents a user with the ability to manage appointments.
class IBCCUser {
    // Constructor to initialize the user with email, password, and an empty appointments list.
    constructor(email, password) {
        this.email = email; // User's email address.
        this.password = password; // User's password.
        this.appointments = []; // List of appointments for the user.
    }

    // Creates an account for the user after validating the email and password.
    createAccount(email, password) {
        // Check if the email is valid and password length is at least 6 characters.
        if (!this.isValidEmail(email) || password.length < 6) {
            throw new Error("Error Encountered"); // Throws error if validation fails.
        }
        this.email = email; // Set the email.
        this.password = password; // Set the password.
        return "Successful"; // Return success message.
    }

    // Allows the user to request an appointment at a specific date and time.
    requestAppointment(date, time) {
        // Validate the date and time format.
        if (!this.isValidDate(date) || !this.isValidTime(time)) {
            throw new Error("Error Encountered"); // Throws error if invalid format.
        }

        // Check if the requested date and time slot is available.
        if (!this.isAvailableSlot(date, time)) {
            throw new Error("Error Encountered"); // Throws error if slot is booked.
        }

        // Adds the appointment to the user's appointments list.
        this.appointments.push({ date, time });
        return "Successful"; // Return success message.
    }

    // Allows the user to edit an existing appointment with new date and time.
    editAppointment(oldDate, oldTime, newDate, newTime) {
        // Find the appointment to edit based on old date and time.
        const appointmentIndex = this.appointments.findIndex(
            app => app.date === oldDate && app.time === oldTime
        );

        if (appointmentIndex === -1) {
            throw new Error("Error Encountered"); // Appointment not found.
        }

        // Validate the new date and time.
        if (!this.isValidDate(newDate) || !this.isValidTime(newTime)) {
            throw new Error("Error Encountered"); // Invalid new date/time.
        }

        // Check if the new date and time slot is available.
        if (!this.isAvailableSlot(newDate, newTime)) {
            throw new Error("Error Encountered"); // Slot is already booked.
        }

        // Update the appointment in the list with the new date and time.
        this.appointments[appointmentIndex] = { date: newDate, time: newTime };
        return "Successful"; // Return success message.
    }

    // Allows the user to check available appointment slots for a given date.
    checkAvailableSlots(date) {
        // Validate the date format.
        if (!this.isValidDate(date)) {
            throw new Error("Error Encountered"); // Invalid date format.
        }
        return this.getAvailableSlotsForDate(date); // Return available slots for the date.
    }

    // Returns the list of the user's appointments.
    viewAppointments() {
        return this.appointments; // Return the list of appointments.
    }

    // Allows the user to delete an appointment at a specific date and time.
    deleteAppointment(date, time) {
        // Find the appointment to delete based on the date and time.
        const appointmentIndex = this.appointments.findIndex(
            app => app.date === date && app.time === time
        );

        if (appointmentIndex === -1) {
            throw new Error("Error Encountered"); // Appointment not found.
        }

        // Remove the appointment from the appointments list.
        this.appointments.splice(appointmentIndex, 1);
        return "Successful"; // Return success message.
    }

    // Validates the format of the provided email address.
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex to check email format.
        return emailRegex.test(email); // Return true if valid, else false.
    }

    // Validates the date format as YYYY-MM-DD and checks if the date is valid.
    isValidDate(date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Regex to check date format.
        if (!dateRegex.test(date)) return false; // If format is invalid, return false.

        const parsedDate = new Date(date); // Convert string to Date object.
        return parsedDate instanceof Date && !isNaN(parsedDate); // Return true if valid date.
    }

    // Validates the time format as HH:MM (24-hour clock).
    isValidTime(time) {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Regex to check time format.
        return timeRegex.test(time); // Return true if valid, else false.
    }

    // Checks if the provided date and time slot is available (not booked).
    isAvailableSlot(date, time) {
        return !this.isSlotBooked(date, time); // Return true if slot is not booked.
    }

    // Returns all available slots for a given date, excluding booked slots.
    getAvailableSlotsForDate(date) {
        const allSlots = [
            "09:00", "10:00", "11:00", "12:00", "13:00", 
            "14:00", "15:00", "16:00", "17:00"
        ]; // List of all possible slots.

        // Filter out the slots that are already booked.
        return allSlots.filter(time => !this.isSlotBooked(date, time));
    }

    // Checks if a specific time slot is already booked for a given date.
    isSlotBooked(date, time) {
        return this.appointments.some(
            app => app.date === date && app.time === time // Returns true if the slot is booked.
        );
    }
}

// Export the IBCCUser class to be used in other parts of the application.
module.exports = { IBCCUser };