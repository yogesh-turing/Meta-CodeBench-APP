class IBCCUser {
    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.appointments = [];
    }

    // 1. Create Account: Initializes a user account with provided email and password.
    createAccount(email, password) {
        if (this.isValidEmail(email) && this.isValidPassword(password)) {
            this.email = email;
            this.password = password;
            return "Successful";
        } else {
            throw new Error("Error Encountered");
        }
    }

    // 2. Request Appointment: Allows user to request an appointment at a specific date and time.
    requestAppointment(date, time) {
        if (this.isValidDate(date) && this.isValidTime(time)) {
            if (this.isAvailableSlot(date, time)) {
                this.appointments.push({ date, time });
                return "Successful";
            } else {
                throw new Error("Error Encountered");
            }
        } else {
            throw new Error("Error Encountered");
        }
    }

    // 3. Edit Appointment: Allows user to edit an existing appointment.
    editAppointment(oldDate, oldTime, newDate, newTime) {
        if (this.isValidDate(oldDate) && this.isValidTime(oldTime) && this.isValidDate(newDate) && this.isValidTime(newTime)) {
            const index = this.appointments.findIndex(appointment => appointment.date === oldDate && appointment.time === oldTime);
            if (index !== -1) {
                if (this.isAvailableSlot(newDate, newTime)) {
                    this.appointments[index] = { date: newDate, time: newTime };
                    return "Successful";
                } else {
                    throw new Error("Error Encountered");
                }
            } else {
                throw new Error("Error Encountered");
            }
        } else {
            throw new Error("Error Encountered");
        }
    }

    // 4. Check Available Slots: Checks available appointment slots for a specific date.
    checkAvailableSlots(date) {
        if (this.isValidDate(date)) {
            return this.getAvailableSlotsForDate(date);
        } else {
            throw new Error("Error Encountered");
        }
    }

    // 5. View Appointments: Displays all the appointments for the user.
    viewAppointments() {
        return this.appointments;
    }

    // 6. Delete Appointment: Deletes an appointment for the given date and time.
    deleteAppointment(date, time) {
        if (this.isValidDate(date) && this.isValidTime(time)) {
            const index = this.appointments.findIndex(appointment => appointment.date === date && appointment.time === time);
            if (index !== -1) {
                this.appointments.splice(index, 1);
                return "Successful";
            } else {
                throw new Error("Error Encountered");
            }
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

    // Checks if the provided password is valid (at least 6 characters).
    isValidPassword(password) {
        return password.length >= 6;
    }

    // Checks if the provided date is in a valid format.
    isValidDate(date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(date);
    }

    // Checks if the provided time is in a valid format.
    isValidTime(time) {
        const timeRegex = /^\d{2}:\d{2}$/;
        return timeRegex.test(time);
    }

    // Checks if the provided time slot is available on the given date.
    isAvailableSlot(date, time) {
        return !this.isSlotBooked(date, time);
    }

    // Retrieves all available slots for a given date.
    getAvailableSlotsForDate(date) {
        const availableSlots = [];
        for (let hour = 9; hour < 18; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                if (this.isAvailableSlot(date, time)) {
                    availableSlots.push(time);
                }
            }
        }
        return availableSlots;
    }

    // Checks if the provided time slot is already booked for the given date.
    isSlotBooked(date, time) {
        return this.appointments.some(appointment => appointment.date === date && appointment.time === time);
    }
}

module.exports = { IBCCUser };