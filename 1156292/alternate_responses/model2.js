class ParkingSystem {
  constructor() {
      this.parkingSlots = {};  // Format: { areaId: { slotNumber: availability, ... } }
      this.reservations = {};  // Format: { reservationId: { areaId, customerName, slotNumber, time } }
  }

  addParkingArea(areaId, slotCount) {
      if (!areaId || typeof areaId !== 'string' || !Number.isInteger(slotCount) || slotCount <= 0) {
          throw new Error("Invalid parking area or slot count");
      }

      const slots = {};
      for (let i = 1; i <= slotCount; i++) {
          slots[i] = true; // true means available
      }
      this.parkingSlots[areaId] = slots;
  }

  reserveSlot(reservationId, areaId, customerName, slotNumber) {
      if (!reservationId || !areaId || !customerName || !slotNumber) {
          throw new Error("Invalid reservation details");
      }

      if (!this.parkingSlots[areaId]) {
          throw new Error("Parking area not found");
      }

      if (!this.parkingSlots[areaId][slotNumber]) {
          throw new Error("Slot not available");
      }

      if (this.parkingSlots[areaId][slotNumber] !== true) {
          throw new Error("Slot not available");
      }

      const reservationDetails = {
          reservationId,
          areaId,
          customerName,
          slotNumber,
          time: new Date().toISOString()
      };

      this.reservations[reservationId] = reservationDetails;
      this.parkingSlots[areaId][slotNumber] = false; // false means not available

      return reservationDetails;
  }

  getParkingDetails(areaId) {
      if (!this.parkingSlots[areaId]) {
          throw new Error("Parking area not found");
      }

      const slots = this.parkingSlots[areaId];
      return Object.entries(slots).map(([slotNumber, available]) => ({
          slotNumber: parseInt(slotNumber),
          available
      }));
  }

  cancelReservation(reservationId) {
      if (!this.reservations[reservationId]) {
          throw new Error("Reservation not found");
      }

      const reservation = this.reservations[reservationId];
      const { areaId, slotNumber } = reservation;

      this.parkingSlots[areaId][slotNumber] = true; // Mark slot as available
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