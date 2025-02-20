class ParkingSystem {
  constructor() {
      this.parkingSlots = {};  // Format: { areaId: { slotNumber: availability, ... } }
      this.reservations = {};  // Format: { reservationId: { areaId, customerName, slotNumber, time } }
  }

  addParkingArea(areaId, slotCount) {
      // Check if areaId is a non-empty string and slotCount is a positive integer
      if (typeof areaId !== 'string' || areaId.trim() === '' || typeof slotCount !== 'number' || slotCount <= 0) {
          throw new Error('Invalid parking area or slot count');
      }

      // Initialize parking slots for the area
      if (!this.parkingSlots[areaId]) {
          this.parkingSlots[areaId] = {};
      }

      // Update slot availability
      for (let i = 1; i <= slotCount; i++) {
          this.parkingSlots[areaId][i] = true; // true indicates the slot is available
      }
  }

  reserveSlot(reservationId, areaId, customerName, slotNumber) {
      // Check if reservation details are valid
      if (typeof reservationId !== 'string' || typeof areaId !== 'string' || typeof customerName !== 'string' || typeof slotNumber !== 'number' || slotNumber <= 0) {
          throw new Error('Invalid reservation details');
      }

      // Check if parking area exists
      if (!this.parkingSlots[areaId]) {
          throw new Error('Parking area not found');
      }

      // Check if slot number is valid and available
      if (!this.parkingSlots[areaId][slotNumber] || !this.parkingSlots[areaId][slotNumber]) {
          throw new Error('Slot not available');
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
      // Check if parking area exists
      if (!this.parkingSlots[areaId]) {
          throw new Error('Parking area not found');
      }

      // Get slot availability for the area
      const slots = Object.keys(this.parkingSlots[areaId]).map(slotNumber => ({
          slotNumber: parseInt(slotNumber),
          available: this.parkingSlots[areaId][slotNumber]
      }));

      return slots;
  }

  cancelReservation(reservationId) {
      // Check if reservation exists
      if (!this.reservations[reservationId]) {
          throw new Error('Reservation not found');
      }

      // Get the reservation details
      const reservation = this.reservations[reservationId];

      // Mark the corresponding slot as available
      this.parkingSlots[reservation.areaId][reservation.slotNumber] = true;

      // Delete the reservation
      delete this.reservations[reservationId];
  }

  getReservationDetails(reservationId) {
      // Check if reservation exists
      if (!this.reservations[reservationId]) {
          throw new Error('Reservation not found');
      }

      // Return the reservation details
      return this.reservations[reservationId];
  }
}

module.exports = { ParkingSystem };