class ParkingSystem {
  constructor() {
    this.parkingSlots = {};  // Format: { areaId: { slotNumber: availability, ... } }
    this.reservations = {};  // Format: { reservationId: { areaId, customerName, slotNumber, time } }
  }

  addParkingArea(areaId, slotCount) {
    if (typeof areaId !== 'string' || areaId.trim() === '' || typeof slotCount !== 'number' || slotCount <= 0) {
      throw new Error('Invalid parking area or slot count');
    }

    const slots = {};
    for (let i = 1; i <= slotCount; i++) {
      slots[i] = true; // Initialize slots as available
    }
    this.parkingSlots[areaId] = slots;
  }

  reserveSlot(reservationId, areaId, customerName, slotNumber) {
    if (typeof reservationId !== 'string' || typeof areaId !== 'string' || typeof customerName !== 'string' || typeof slotNumber !== 'number' || slotNumber <= 0) {
      throw new Error('Invalid reservation details');
    }

    if (!this.parkingSlots[areaId]) {
      throw new Error('Parking area not found');
    }

    if (!this.parkingSlots[areaId][slotNumber] || !this.parkingSlots[areaId][slotNumber]) {
      throw new Error('Slot not available');
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
      throw new Error('Parking area not found');
    }

    const slots = this.parkingSlots[areaId];
    const parkingDetails = Object.keys(slots).map(slotNumber => ({
      slotNumber: parseInt(slotNumber),
      available: slots[slotNumber],
    }));
    return parkingDetails;
  }

  cancelReservation(reservationId) {
    if (!this.reservations[reservationId]) {
      throw new Error('Reservation not found');
    }

    const reservation = this.reservations[reservationId];
    this.parkingSlots[reservation.areaId][reservation.slotNumber] = true; // Mark slot as available
    delete this.reservations[reservationId];
  }

  getReservationDetails(reservationId) {
    if (!this.reservations[reservationId]) {
      throw new Error('Reservation not found');
    }

    return this.reservations[reservationId];
  }
}

module.exports = { ParkingSystem };