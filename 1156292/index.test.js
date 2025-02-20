const { ParkingSystem } = require('./solution'); 

describe('ParkingSystem', () => {
  
  let parkingSystem;
  
  beforeEach(() => {
    parkingSystem = new ParkingSystem();
  });

  describe('addParkingArea', () => {

    it('should add a new parking area successfully', () => {
      parkingSystem.addParkingArea('area1', 10);
      let parkingDetails = parkingSystem.getParkingDetails('area1');
      expect(parkingDetails.length).toBe(10);
      expect(parkingDetails[0].slotNumber).toBe(1);
      expect(parkingDetails[9].slotNumber).toBe(10);
    });

    it('should throw error for invalid slot count providing negative value for slots', () => {
      expect(() => parkingSystem.addParkingArea('area1', -5)).toThrow('Invalid parking area or slot count');
    });

    it('should throw error for invalid areaId if the passed areaId is not a string', () => {
      expect(() => parkingSystem.addParkingArea(10, 5)).toThrow('Invalid parking area or slot count');
    });

    it('should throw error for invalid areaId if the passed areaId is empty', () => {
      expect(() => parkingSystem.addParkingArea('', 10)).toThrow('Invalid parking area or slot count');
    });

    it('should throw error for invalid slot count', () => {
      expect(() => parkingSystem.addParkingArea('area1', -10)).toThrow('Invalid parking area or slot count');
    });

    it('should update slot availability for an existing area', () => {
      parkingSystem.addParkingArea('area1', 10);
      parkingSystem.addParkingArea('area1', 5);
      const parkingDetails = parkingSystem.getParkingDetails('area1');
      expect(parkingDetails.length).toBe(5);
    });
  });

  describe('reserveSlot', () => {
    it('should reserve a parking slot successfully', () => {
      parkingSystem.addParkingArea('area1', 10);
      const reservation = parkingSystem.reserveSlot('reservation1', 'area1', 'John Doe', 3);
      expect(reservation.reservationId).toBe('reservation1');
      expect(reservation.areaId).toBe('area1');
      expect(reservation.customerName).toBe('John Doe');
      expect(reservation.slotNumber).toBe(3);
      expect(reservation.time).toBeTruthy(); // Check if time exists
    });

    it('should throw error if parking area not found', () => {
      expect(() => parkingSystem.reserveSlot('reservation1', 'area2', 'John Doe', 3)).toThrow('Parking area not found');
    });

    it('should throw error if parking area is not of type string ', () => {
        expect(() => parkingSystem.reserveSlot('reservation1', "random area", 'John Doe', 3)).toThrow('Parking area not found');
      });

    it('should throw error if Customer Name  is missing for reservation detail ', () => {
        expect(() => parkingSystem.reserveSlot('reservation1', "random area",  3)).toThrow('Invalid reservation details');
      });

    it('should throw error if Seat number  is missing for reservation detail ', () => {
        expect(() => parkingSystem.reserveSlot('reservation1', "random area", 'John Doe')).toThrow('Invalid reservation details');
      });

    it('should throw error if reservation id is missing for reservation detail ', () => {
        expect(() => parkingSystem.reserveSlot( "random area",  3)).toThrow('Invalid reservation details');
      });
     

    it('should throw error if area is missing for reservation detail ', () => {
        expect(() => parkingSystem.reserveSlot( "random area",  3)).toThrow('Invalid reservation details');
      });

    it('should throw error if slot is already reserved', () => {
      parkingSystem.addParkingArea('area1', 10);
      parkingSystem.reserveSlot('reservation1', 'area1', 'John Doe', 3);
      expect(() => parkingSystem.reserveSlot('reservation2', 'area1', 'Jane Doe', 3)).toThrow('Slot not available');
    });
  });

  describe('getParkingDetails', () => {
    it('should return the slot availability for a parking area', () => {
      parkingSystem.addParkingArea('area1', 10);
      const parkingDetails = parkingSystem.getParkingDetails('area1');
      expect(parkingDetails.length).toBe(10);
      expect(parkingDetails[0].available).toBe(true);
    });

    it('should throw error if parking area not found', () => {
      expect(() => parkingSystem.getParkingDetails('area2')).toThrow('Parking area not found');
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation successfully', () => {
      parkingSystem.addParkingArea('area1', 10);
      parkingSystem.reserveSlot('reservation1', 'area1', 'John Doe', 3);
      parkingSystem.cancelReservation('reservation1');
      const parkingDetails = parkingSystem.getParkingDetails('area1');
      expect(parkingDetails[2].available).toBe(true); // Slot 3 should be available after cancellation
    });

    it('should throw error if reservation not found', () => {
      expect(() => parkingSystem.cancelReservation('nonexistentReservation')).toThrow('Reservation not found');
    });
  });

  describe('getReservationDetails', () => {
    it('should return reservation details for an existing reservation', () => {
      parkingSystem.addParkingArea('area1', 10);
      const reservation = parkingSystem.reserveSlot('reservation1', 'area1', 'John Doe', 3);
      const reservationDetails = parkingSystem.getReservationDetails('reservation1');
      expect(reservationDetails.reservationId).toBe('reservation1');
      expect(reservationDetails.customerName).toBe('John Doe');
      expect(reservationDetails.slotNumber).toBe(3);
      expect(reservationDetails.time).toBeTruthy();
    });

    it('should throw error if reservation not found', () => {
      expect(() => parkingSystem.getReservationDetails('nonexistentReservation')).toThrow('Reservation not found');
    });
  });
});
