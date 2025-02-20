class IBCCUser {
    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.appointments = [];
    }

    createAccount(email, password) {
        if (!this.isValidEmail(email) || password.length < 6) {
            throw new Error("Error Encountered");
        }
        this.email = email;
        this.password = password;
        return "Successful";
    }

    requestAppointment(date, time) {
        if (!this.isValidDate(date) || !this.isValidTime(time)) {
            throw new Error("Error Encountered");
        }
        
        if (!this.isAvailableSlot(date, time)) {
            throw new Error("Error Encountered");
        }

        this.appointments.push({ date, time });
        return "Successful";
    }

    editAppointment(oldDate, oldTime, newDate, newTime) {
        if (!this.isValidDate(oldDate) || !this.isValidDate(newDate) ||
            !this.isValidTime(oldTime) || !this.isValidTime(newTime)) {
            throw new Error("Error Encountered");
        }

        const appointmentIndex = this.appointments.findIndex(
            app => app.date === oldDate && app.time === oldTime
        );

        if (appointmentIndex === -1) {
            throw new Error("Error Encountered");
        }

        if (!this.isAvailableSlot(newDate, newTime)) {
            throw new Error("Error Encountered");
        }

        this.appointments[appointmentIndex] = { date: newDate, time: newTime };
        return "Successful";
    }

    checkAvailableSlots(date) {
        if (!this.isValidDate(date)) {
            throw new Error("Error Encountered");
        }
        return this.getAvailableSlotsForDate(date);
    }

    viewAppointments() {
        return this.appointments;
    }

    deleteAppointment(date, time) {
        if (!this.isValidDate(date) || !this.isValidTime(time)) {
            throw new Error("Error Encountered");
        }

        const appointmentIndex = this.appointments.findIndex(
            app => app.date === date && app.time === time
        );

        if (appointmentIndex === -1) {
            throw new Error("Error Encountered");
        }

        this.appointments.splice(appointmentIndex, 1);
        return "Successful";
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidDate(date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) return false;
        
        const parsedDate = new Date(date);
        return parsedDate instanceof Date && !isNaN(parsedDate);
    }

    isValidTime(time) {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return timeRegex.test(time);
    }

    isAvailableSlot(date, time) {
        return !this.isSlotBooked(date, time);
    }

    getAvailableSlotsForDate(date) {
        const allSlots = [];
        for (let hour = 9; hour < 17; hour++) {
            allSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        
        const bookedSlots = this.appointments
            .filter(app => app.date === date)
            .map(app => app.time);
        
        return allSlots.filter(slot => !bookedSlots.includes(slot));
    }

    isSlotBooked(date, time) {
        return this.appointments.some(
            app => app.date === date && app.time === time
        );
    }
}

module.exports = { IBCCUser };