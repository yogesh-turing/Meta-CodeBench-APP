class ParkingSystem {
  constructor() {
      this.parkingSlots = {};  // Format: { areaId: { slotNumber: availability, ... } }
      this.reservations = {};  // Format: { reservationId: { areaId, customerName, slotNumber, time } }
  }

  addParkingArea(areaId, slotCount) {
      if (!areaId || slotCount <= 0) {
          throw new Error("Invalid parking area or slot count");
      }

      if (!this.parkingSlots[areaId]) {
          this.parkingSlots[areaId] = {};
      }

      for (let i = 1; i <= slotCount; i++) {
          this.parkingSlots[areaId][i] = true; // Initialize slots as available
      }
  }

  reserveSlot(reservationId, areaId, customerName, slotNumber) {
      if (!reservationId || !areaId || !customerName || slotNumber <= 0) {
          throw new Error("Invalid reservation details");
      }

      if (!this.parkingSlots[areaId]) {
          throw new Error("Parking area not found");
      }

      if (!this.parkingSlots[areaId][slotNumber] || this.parkingSlots[areaId][slotNumber] === false) {
          throw new Error("Slot not available");
      }

      this.parkingSlots[areaId][slotNumber] = false; // Mark slot as reserved

      const reservation = {
          reservationId,
          areaId,
          customerName,
          slotNumber,
          time: new Date().toISOString(),
      };

      this.reservations[reservationId] = reservation;

      return reservation;
  }

  getParkingDetails(areaId) {
      if (!this.parkingSlots[areaId]) {
          throw new Error("Parking area not found");
      }

      const slots = [];

      for (const slotNumber in this.parkingSlots[areaId]) {
          slots.push({
              slotNumber: parseInt(slotNumber),
              available: this.parkingSlots[areaId][slotNumber],
          });
      }

      return slots;
  }

  cancelReservation(reservationId) {
      if (!this.reservations[reservationId]) {
          throw new Error("Reservation not found");
      }

      const reservation = this.reservations[reservationId];
      this.parkingSlots[reservation.areaId][reservation.slotNumber] = true; // Mark slot as available

      delete this.reservations[reservationId];
  }

  getReservationDetails(reservationId) {
      if (!this.reservations[reservationId]) {
          throw new Error("Reservation not found");
      }

      return this.reservations[reservationId];
  }
}

module.exports = { ParkingSystem };