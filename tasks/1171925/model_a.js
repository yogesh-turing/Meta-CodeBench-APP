class ReservationSystem {
    constructor() {
        this.reservations = [];
        this.rooms = {
            "A101": 1,
            "B202": 2
        };
    }

    bookRoom(user, room, date, startTime, endTime) {
        const reservationStart = new Date(`${date} ${startTime}`);
        const reservationEnd = new Date(`${date} ${endTime}`);
        
        if (reservationStart >= reservationEnd || reservationStart < new Date()) {
            return false;
        }

        if (!this.rooms[room]) {
            return false;
        }

        const existingBookings = this.getRoomBookings(room, date);
        if (existingBookings.length >= this.rooms[room]) {
            return false;
        }

        for (let booking of existingBookings) {
            const bookingStart = new Date(`${date} ${booking.startTime}`);
            const bookingEnd = new Date(`${date} ${booking.endTime}`);

            if (!(reservationEnd <= bookingStart || reservationStart >= bookingEnd)) {
                return false;
            }
        }

        this.reservations.push({ user, room, date, startTime, endTime });
        return true;
    }

    cancelBooking(user, room, date, startTime) {
        const reservation = this.reservations.find(res =>
            res.user === user && 
            res.room === room && 
            res.date === date && 
            res.startTime === startTime
        );

        if (!reservation) {
            return false;
        }

        const now = new Date();
        const reservationStart = new Date(`${date} ${startTime}`);
        const hoursDiff = (reservationStart - now) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
            return false;
        }

        this.reservations = this.reservations.filter(res => res !== reservation);
        return true;
    }

    rescheduleBooking(user, room, oldDate, oldStartTime, newDate, newStartTime, newEndTime) {
        const reservation = this.reservations.find(res =>
            res.user === user &&
            res.room === room &&
            res.date === oldDate &&
            res.startTime === oldStartTime
        );

        if (!reservation) {
            return false;
        }

        const tempReservations = [...this.reservations];
        this.reservations = this.reservations.filter(res => res !== reservation);

        const success = this.bookRoom(user, room, newDate, newStartTime, newEndTime);
        if (!success) {
            this.reservations = tempReservations;
            return false;
        }

        return true;
    }

    getRoomBookings(room, date) {
        return this.reservations.filter(res => 
            res.room === room && 
            res.date === date
        );
    }
}

module.exports = { ReservationSystem };