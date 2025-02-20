class ParkingSystem {
  constructor() {
      this.parkingSlots = {};  // Format: { areaId: { slotNumber: availability, ... } }
      this.reservations = {};  // Format: { reservationId: { areaId, customerName, slotNumber, time } }
  }

  addParkingArea(areaId, slotCount) {
      // Validate inputs
      if (!areaId || typeof areaId !== 'string' || !Number.isInteger(slotCount) || slotCount <= 0) {
          throw new Error("Invalid parking area or slot count");
      }

      // Initialize or update parking slots for the area
      this.parkingSlots[areaId] = {};
      for (let i = 1; i <= slotCount; i++) {
          this.parkingSlots[areaId][i] = true; // true means available
      }
  }

  reserveSlot(reservationId, areaId, customerName, slotNumber) {
      // Validate inputs
      if (!reservationId || !areaId || !customerName || !slotNumber) {
          throw new Error("Invalid reservation details");
      }

      // Check if parking area exists
      if (!this.parkingSlots[areaId]) {
          throw new Error("Parking area not found");
      }

      // Check if slot exists and is available
      if (!this.parkingSlots[areaId][slotNumber]) {
          throw new Error("Invalid slot number");
      }

      if (this.parkingSlots[areaId][slotNumber] !== true) {
          throw new Error("Slot not available");
      }

      // Create reservation
      const reservation = {
          reservationId,
          areaId,
          customerName,
          slotNumber,
          time: new Date().toISOString()
      };

      // Update slot availability and store reservation
      this.parkingSlots[areaId][slotNumber] = false; // false means reserved
      this.reservations[reservationId] = reservation;

      return reservation;
  }

  getParkingDetails(areaId) {
      // Check if parking area exists
      if (!this.parkingSlots[areaId]) {
          throw new Error("Parking area not found");
      }

      // Convert parking slots to array format
      return Object.entries(this.parkingSlots[areaId]).map(([slotNumber, available]) => ({
          slotNumber: parseInt(slotNumber),
          available: available
      }));
  }

  cancelReservation(reservationId) {
      // Check if reservation exists
      if (!this.reservations[reservationId]) {
          throw new Error("Reservation not found");
      }

      const reservation = this.reservations[reservationId];
      
      // Mark slot as available
      this.parkingSlots[reservation.areaId][reservation.slotNumber] = true;
      
      // Remove reservation
      delete this.reservations[reservationId];
  }

  getReservationDetails(reservationId) {
      // Check if reservation exists
      if (!this.reservations[reservationId]) {
          throw new Error("Reservation not found");
      }

      return this.reservations[reservationId];
  }
}

module.exports = { ParkingSystem };