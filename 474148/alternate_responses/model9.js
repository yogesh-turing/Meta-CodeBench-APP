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
        if (!this.isAvailableSlot(date, time)) {
            throw new Error("Error Encountered");
        }
        this.appointments.push({ date, time });
        return "Successful";
    }

    // 3. Edit Appointment: Allows user to edit an existing appointment.
    editAppointment(oldDate, oldTime, newDate, newTime) {
        if (!this.isValidDate(oldDate) || !this.isValidDate(newDate)) {
            throw new Error("Error Encountered");
        }
        if (!this.isSlotBooked(oldDate, oldTime)) {
            throw new Error("Error Encountered");
        }
        if (!this.isAvailableSlot(newDate, newTime)) {
            throw new Error("Error Encountered");
        }
        const index = this.appointments.findIndex(appointment => appointment.date === oldDate && appointment.time === oldTime);
        if (index !== -1) {
            this.appointments[index] = { date: newDate, time: newTime };
            return "Successful";
        } else {
            throw new Error("Error Encountered");
        }
    }

    // 4. Check Available Slots: Checks available appointment slots for a specific date.
    checkAvailableSlots(date) {
        if (!this.isValidDate(date)) {
            throw new Error("Error Encountered");
        }
        return this.getAvailableSlotsForDate(date);
    }

    // 5. View Appointments: Displays all the appointments for the user.
    viewAppointments() {
        return this.appointments;
    }

    // 6. Delete Appointment: Deletes an appointment for the given date and time.
    deleteAppointment(date, time) {
        if (!this.isValidDate(date)) {
            throw new Error("Error Encountered");
        }
        const index = this.appointments.findIndex(appointment => appointment.date === date && appointment.time === time);
        if (index !== -1) {
            this.appointments.splice(index, 1);
            return "Successful";
        } else {
            throw new Error("Error Encountered");
        }
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
        // For simplicity, let's assume available slots are from 9:00 to 17:00
        const availableSlots = [];
        for (let hour = 9; hour <= 17; hour++) {
            availableSlots.push(`${hour}:00`);
        }
        return availableSlots.filter(slot => !this.isSlotBooked(date, slot));
    }

    // Checks if the provided time slot is already booked for the given date.
    isSlotBooked(date, time) {
        return this.appointments.some(appointment => appointment.date === date && appointment.time === time);
    }
}

module.exports = { IBCCUser };