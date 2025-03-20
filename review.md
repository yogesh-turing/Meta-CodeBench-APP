Most of the models are failing for the following test case:
    - "Should fail to book a full room"
The models, incorrectly implemented the `bookRoom` function for booking having time overlap with existing booking. It did not add check for number of bookings room can have.