class ParkingSystem {
  constructor() {
      this.parkingSlots = {};  // Format: { areaId: { slotNumber: availability, ... } }
      this.reservations = {};  // Format: { reservationId: { areaId, customerName, slotNumber, time } }
  }

  addParkingArea(areaId, slotCount) {
      // TODO: adding a parking area logic comes here
  }

  reserveSlot(reservationId, areaId, customerName, slotNumber) {
      // TODO: reserving parking slot logic comes here
  }

  getParkingDetails(areaId) {
    // TODO: getting parking area details logic comes here
  }

  cancelReservation(reservationId) {
        // TODO: cancelling reservation logic comes here
  }

  getReservationDetails(reservationId) {
      // TODO:  getting reservation details logic comes here
  }
}

module.exports = { ParkingSystem };