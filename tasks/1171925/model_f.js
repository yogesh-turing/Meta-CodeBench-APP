class ReservationSystem {
  constructor() {
      this.reservations = []; // Store reservations
      this.rooms = {
          "A101": 1, // Private room (only one booking allowed)
          "B202": 2  // Shared room (two users can book)
      };
  }

  bookRoom(user, room, date, startTime, endTime) {
      const reservationStart = new Date(`${date} ${startTime}`);
      const reservationEnd = new Date(`${date} ${endTime}`);

      if (reservationStart < new Date()) {
          return false;
      }

      let count = 0;
      for (let res of this.reservations) {
          if (res.room === room && res.date === date) {
              const existingStart = new Date(`${res.date} ${res.startTime}`);
              const existingEnd = new Date(`${res.date} ${res.endTime}`);

              if (
                  (reservationStart < existingEnd && reservationEnd > existingStart)
              ) {
                  count++;
                  if (count >= this.rooms[room]) {
                      return false;
                  }
              }
          }
      }

      this.reservations.push({ user, room, date, startTime, endTime });
      return true;
  }

  cancelBooking(user, room, date, startTime) {
      const now = new Date();
      const reservation = this.reservations.find(res =>
          res.user === user && res.room === room && res.date === date && res.startTime === startTime
      );

      if (!reservation) {
          return false;
      }

      const reservationTime = new Date(`${date} ${startTime}`);
      const hoursDiff = (reservationTime - now) / (1000 * 60 * 60);

      if (hoursDiff < 24) {
          return false;
      }

      this.reservations = this.reservations.filter(res => res !== reservation);
      return true;
  }

  rescheduleBooking(user, room, oldDate, oldStartTime, newDate, newStartTime, newEndTime) {
      const success = this.cancelBooking(user, room, oldDate, oldStartTime);
      if (!success) return false;
      return this.bookRoom(user, room, newDate, newStartTime, newEndTime);
  }

  getRoomBookings(room, date) {
      return this.reservations.filter(res => res.room === room && res.date === date);
  }
}

module.exports = { ReservationSystem };