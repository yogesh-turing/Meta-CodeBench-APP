class IBCCUser {
    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.appointments = [];
    }

    // 1. Create Account: Initializes a user account with provided email and password.
    createAccount(email, password) {
        // Account creation logic goes here
    }

    // 2. Request Appointment: Allows user to request an appointment at a specific date and time.
    requestAppointment(date, time) {
        // Logic to request an appointment goes here
    }

    // 3. Edit Appointment: Allows user to edit an existing appointment.
    editAppointment(oldDate, oldTime, newDate, newTime) {
        // Logic to edit an existing appointment goes here
    }

    // 4. Check Available Slots: Checks available appointment slots for a specific date.
    checkAvailableSlots(date) {
        // Logic to check available slots for the given date goes here
    }

    // 5. View Appointments: Displays all the appointments for the user.
    viewAppointments() {
        // Logic to view all appointments goes here
    }

    // 6. Delete Appointment: Deletes an appointment for the given date and time.
    deleteAppointment(date, time) {
        // Logic to delete an appointment goes here
    }

    // Helper Methods (used internally for validation)
    
    // Checks if the provided email is in a valid format.
    isValidEmail(email) {
        // Logic to validate email goes here
    }

    // Checks if the provided date is in a valid format.
    isValidDate(date) {
        // Logic to validate date goes here
    }

    // Checks if the provided time slot is available on the given date.
    isAvailableSlot(date, time) {
        // Logic to check if the slot is available goes here
    }

    // Retrieves all available slots for a given date.
    getAvailableSlotsForDate(date) {
        // Logic to retrieve available slots for the date goes here
    }

    // Checks if the provided time slot is already booked for the given date.
    isSlotBooked(date, time) {
        // Logic to check if the slot is already booked goes here
    }
}

module.exports= {IBCCUser};