Base Code:
```javascript
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
```


Prompt:

Please help me complete the functionality of the `ParkingSystem` class.

1.  Implement the function `addParkingArea(areaId, slotCount)` that allows adding a new parking area with a given `areaId` and a specified number of `slotCount` for the area.
    -   The function should accept: `areaId` (nonempty string) and `slotCount` (positive integer)
    -    If the `areaId` or `slotCount` is invalid, it should throw an error: `"Invalid parking area or slot count"`.
    -   Initialize the parking slots for the area with slot numbers starting from 1 up to `slotCount` (e.g., if `slotCount` is 10, slot numbers 1 through 10 will be available).
    -   If the parking area already exists, update the slot availability.

2. Implement the function `reserveSlot(reservationId, areaId, customerName, slotNumber)` that allows reserving a parking slot at a parking area.
      -   The function should accept: `reservationId` (string) , `areaId` (string)`customerName` (string) and `slotNumber` (positive integer)
      -   Ensure that the parking area exists, else raise the error `"Parking area not found"`.
      -   Ensure that the slot number is valid and in the range of slots. If the slot is already reserved, throw an error: `"Slot not available"`.
      -   Mark the slot as reserved.
      -   Return the reservation details, including: `reservationId`, `areaId`,   `customerName`, `slotNumber`, `time` (time of reservation)

3. Implement the function `getParkingDetails(areaId)` that returns the slot availability for a specific parking area.
     -   The function should:`areaId` (string)
     -   Return an array of objects representing each slot's availability. Each object should contain: `slotNumber` (integer) and `available` (boolean)
     -   If the parking area does not exist, throw an error: `"Parking area not found"`.

 4. Implement the function `cancelReservation(reservationId)` that allows canceling an existing reservation.
     -   The function should accept: `reservationId` (string).
	 -   Ensure that the reservation exists.
	 -   Mark the corresponding slot as available.
	 -   Delete the reservation from the system.

5. Implement the function `getReservationDetails(reservationId)` that returns the details of a specific reservation.
	- The function should: `reservationId` (string)
	- If the reservation exists, return the reservation details, including: `reservationId`, `areaId`, `customerName`,`slotNumber`, `time`.
	- If the reservation does not exist, throw an error: `"Reservation not found"`.

Error Handling:
- Throw an error `"Invalid parking area or slot count"` if parking area creation is invalid.
- Throw an error `"Invalid reservation details"` if any required details for reservation are missing or invalid.
- Throw an error `"Parking area not found"` if a parking area does not exist.
- Throw an error `"Slot not available"` if a slot is already reserved.
- Throw an error `"Reservation not found"` if a reservation is not found during cancellation or retrieval.

Example:
```javascript
const parkingSystem = new ParkingSystem();
// Add a new parking area
parkingSystem.addParkingArea('area1', 10);
// Reserve a parking slot
const reservation1 = parkingSystem.reserveSlot('reservation1', 'area1', 'John', 3);
console.log(reservation1);
// Output: { reservationId: 'reservation1', areaId: 'area1', customerName: 'John', slotNumber: 3, time: '2025-02-19T10:00:00Z' }
```