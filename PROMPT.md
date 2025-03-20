Base Code:
```javascript
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
              count++;
              if (count >= this.rooms[room]) {
                  return false;
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
}

module.exports = { ReservationSystem }
```

Stack Trace:
```javascript
Reservation System
    ✕ Should successfully book a room and store the reservation (1 ms)
    ✕ Should fail to book a full room
    ✕ Should cancel a booking and remove it from the list
    ✓ Should not cancel a non-existent booking
    ✓ Should not cancel within 24 hours (1 ms)
    ✕ Should reschedule a booking correctly
    ✓ Should not reschedule if the original booking doesn't exist

  ● Reservation System › Should successfully book a room and store the reservation

    TypeError: system.getRoomBookings is not a function

      13 |
      14 |         // Check reservation was actually stored
    > 15 |         const bookings = system.getRoomBookings("B202", "2025-03-25");
         |                                 ^
      16 |         expect(bookings.length).toBe(1);
      17 |         expect(bookings[0]).toMatchObject({ user: "alice", startTime: "10:00", endTime: "12:00" });
      18 |     });

      at Object.getRoomBookings (task11/index.test.js:15:33)

  ● Reservation System › Should fail to book a full room

    TypeError: system.getRoomBookings is not a function

      26 |         
      27 |         // Verify no extra reservation exists
    > 28 |         const bookings = system.getRoomBookings("B202", "2025-03-25");
         |                                 ^
      29 |         expect(bookings.length).toBe(2);
      30 |     });
      31 |

      at Object.getRoomBookings (task11/index.test.js:28:33)

  ● Reservation System › Should cancel a booking and remove it from the list

    TypeError: system.getRoomBookings is not a function

      37 |
      38 |         // Verify booking is removed
    > 39 |         const bookings = system.getRoomBookings("B202", "2025-03-25");
         |                                 ^
      40 |         expect(bookings.length).toBe(0);
      41 |     });
      42 |

      at Object.getRoomBookings (task11/index.test.js:39:33)

  ● Reservation System › Should reschedule a booking correctly

    TypeError: system.getRoomBookings is not a function

      64 |
      65 |         // Ensure old booking was removed
    > 66 |         expect(system.getRoomBookings("B202", "2025-03-25").length).toBe(0);
         |                       ^
      67 |
      68 |         // Ensure new booking was added
      69 |         const newBookings = system.getRoomBookings("B202", "2025-03-26");

      at Object.getRoomBookings (task11/index.test.js:66:23)

Test Suites: 1 failed, 1 total
Tests:       4 failed, 3 passed, 7 total
Snapshots:   0 total
Time:        0.175 s, estimated 1 s
```

Prompt:
The current implementation of `bookRoom` has some logical issues:  
1. Overlapping bookings are not handled correctly – If a room is booked from `"10:00"` to `"12:00"`, another booking from `"11:00"` to `"13:00"` should be rejected, but currently, it is allowed.  
2. Cancelling within 24 hours is not properly restricted – The function does not correctly block cancellations made less than 24 hours before check-in.  

Fix these issues while ensuring that the function still supports all three operations: booking, cancellation, and rescheduling correctly.  

---

### Example
```javascript
const system = new ReservationSystem();
const result = system.bookRoom("alice", "B202", "2025-03-25", "10:00", "12:00");
console.log(result);
```
### Expected Output
```javascript
true
```