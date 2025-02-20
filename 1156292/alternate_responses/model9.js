class ParkingSystem {
  constructor() {
      this.parkingSlots = {};  // Format: { areaId: { slotNumber: availability, ... } }
      this.reservations = {};  // Format: { reservationId: { areaId, customerName, slotNumber, time } }
  }

  addParkingArea(areaId, slotCount) {
      if (typeof areaId !== 'string' || areaId.length === 0 || typeof slotCount !== 'number' || slotCount <= 0) {
          throw new Error("Invalid parking area or slot count");
      }

      if (this.parkingSlots[areaId]) {
          // If the parking area already exists, update the slot availability
          this.parkingSlots[areaId] = {};
          for (let i = 1; i <= slotCount; i++) {
              this.parkingSlots[areaId][i] = true;
          }
      } else {
          // Initialize the parking slots for the area
          this.parkingSlots[areaId] = {};
          for (let i = 1; i <= slotCount; i++) {
              this.parkingSlots[areaId][i] = true;
          }
      }
  }

  reserveSlot(reservationId, areaId, customerName, slotNumber) {
      if (typeof reservationId !== 'string' || typeof areaId !== 'string' || typeof customerName !== 'string' || typeof slotNumber !== 'number' || slotNumber <= 0) {
          throw new Error("Invalid reservation details");
      }

      if (!this.parkingSlots[areaId]) {
          throw new Error("Parking area not found");
      }

      if (!this.parkingSlots[areaId][slotNumber] || this.parkingSlots[areaId][slotNumber] === false) {
          throw new Error("Slot not available");
      }

      // Mark the slot as reserved
      this.parkingSlots[areaId][slotNumber] = false;

      // Create a new reservation
      const reservation = {
          reservationId,
          areaId,
          customerName,
          slotNumber,
          time: new Date().toISOString()
      };

      // Store the reservation
      this.reservations[reservationId] = reservation;

      return reservation;
  }

  getParkingDetails(areaId) {
      if (typeof areaId !== 'string') {
          throw new Error("Invalid areaId");
      }

      if (!this.parkingSlots[areaId]) {
          throw new Error("Parking area not found");
      }

      const parkingDetails = [];
      for (const slotNumber in this.parkingSlots[areaId]) {
          parkingDetails.push({
              slotNumber: parseInt(slotNumber),
              available: this.parkingSlots[areaId][slotNumber]
          });
      }

      return parkingDetails;
  }

  cancelReservation(reservationId) {
      if (typeof reservationId !== 'string') {
          throw new Error("Invalid reservationId");
      }

      if (!this.reservations[reservationId]) {
          throw new Error("Reservation not found");
      }

      const reservation = this.reservations[reservationId];
      // Mark the corresponding slot as available
      this.parkingSlots[reservation.areaId][reservation.slotNumber] = true;

      // Delete the reservation from the system
      delete this.reservations[reservationId];
  }

  getReservationDetails(reservationId) {
      if (typeof reservationId !== 'string') {
          throw new Error("Invalid reservationId");
      }

      if (!this.reservations[reservationId]) {
          throw new Error("Reservation not found");
      }

      return this.reservations[reservationId];
  }
}

module.exports = { ParkingSystem };