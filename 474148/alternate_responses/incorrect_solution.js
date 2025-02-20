class IBCCUser {
    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.appointments = [];
    }

    // 1. Create Account: Initializes a user account with provided email and password.
    createAccount(email, password) {
        if (!this.isValidEmail(email)) {
            throw new Error("Error Encountered");
        }
        if (password.length < 6) {
            throw new Error("Error Encountered");
        }
        this.email = email;
        this.password = password;
        return "Successful";
    }

    // 2. Request Appointment: Allows user to request an appointment at a specific date and time.
    requestAppointment(date, time) {
        if (!this.isValidDate(date)) {
            throw new Error("Error Encountered");
        }
        if (this.isSlotBooked(date, time)) {
            throw new Error("Error Encountered");
        }
        this.appointments.push({ date, time });
        return "Successful";
    }

    // 3. Edit Appointment: Allows user to edit an existing appointment.
    editAppointment(oldDate, oldTime, newDate, newTime) {
        if (!this.isValidDate(newDate)) {
            throw new Error("Error Encountered");
        }
        const appointmentIndex = this.appointments.findIndex(appointment => appointment.date === oldDate && appointment.time === oldTime);
        if (appointmentIndex === -1) {
            throw new Error("Error Encountered");
        }
        if (this.isSlotBooked(newDate, newTime)) {
            throw new Error("Error Encountered");
        }
        this.appointments[appointmentIndex] = { date: newDate, time: newTime };
        return "Successful";
    }

    // 4. Check Available Slots: Checks available appointment slots for a specific date.
    checkAvailableSlots(date) {
        if (!this.isValidDate(date)) {
            throw new Error("Error Encountered");
        }
        const availableSlots = this.getAvailableSlotsForDate(date);
        return availableSlots;
    }

    // 5. View Appointments: Displays all the appointments for the user.
    viewAppointments() {
        return this.appointments;
    }

    // 6. Delete Appointment: Deletes an appointment for the given date and time.
    deleteAppointment(date, time) {
        const appointmentIndex = this.appointments.findIndex(appointment => appointment.date === date && appointment.time === time);
        if (appointmentIndex === -1) {
            throw new Error("Error Encountered");
        }
        this.appointments.splice(appointmentIndex, 1);
        return "Successful";
    }

    // Helper Methods (used internally for validation)

    // Checks if the provided email is in a valid format.
    isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    // Checks if the provided date is in a valid format.
    isValidDate(date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(date);
    }

    // Checks if the provided time slot is available on the given date.
    isAvailableSlot(date, time) {
        const availableSlots = this.getAvailableSlotsForDate(date);
        return availableSlots.includes(time);
    }

    // Retrieves all available slots for a given date.
    getAvailableSlotsForDate(date) {
        // For demonstration purposes, assume available slots are from 9:00 to 17:00
        const availableSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
        const bookedSlots = this.appointments.filter(appointment => appointment.date === date).map(appointment => appointment.time);
        return availableSlots.filter(slot => !bookedSlots.includes(slot));
    }

    // Checks if the provided time slot is already booked for the given date.
    isSlotBooked(date, time) {
        return this.appointments.some(appointment => appointment.date === date && appointment.time === time);
    }
}

module.exports = { IBCCUser };