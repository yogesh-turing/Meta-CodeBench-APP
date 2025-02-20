class IBCCUser {
    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.appointments = [];
    }

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

    editAppointment(oldDate, oldTime, newDate, newTime) {
        if (!this.isValidDate(oldDate) || !this.isValidDate(newDate)) {
            throw new Error("Error Encountered");
        }

        const appointmentIndex = this.appointments.findIndex(
            (appointment) => appointment.date === oldDate && appointment.time === oldTime
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
        if (!this.isValidDate(date)) {
            throw new Error("Error Encountered");
        }

        const appointmentIndex = this.appointments.findIndex(
            (appointment) => appointment.date === date && appointment.time === time
        );

        if (appointmentIndex === -1) {
            throw new Error("Error Encountered");
        }

        this.appointments.splice(appointmentIndex, 1);
        return "Successful";
    }

    isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    isValidDate(date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(date);
    }

    isAvailableSlot(date, time) {
        const existingAppointment = this.appointments.find(
            (appointment) => appointment.date === date && appointment.time === time
        );
        return !existingAppointment;
    }

    getAvailableSlotsForDate(date) {
        const availableSlots = [];
        for (let hour = 9; hour < 17; hour++) {
            const time = `${hour}:00`;
            if (this.isAvailableSlot(date, time)) {
                availableSlots.push(time);
            }
        }
        return availableSlots;
    }

    isSlotBooked(date, time) {
        return !this.isAvailableSlot(date, time);
    }
}

module.exports = { IBCCUser };