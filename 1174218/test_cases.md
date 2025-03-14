
Here is what we are looking for:
    - The code review should point out improperly bound context in callbacks methods like bookFlight and selectSeat callbacks use traditional function syntax (not arrow functions), so the `this` context may be lost, causing repository methods to be called on an undefined context.
    - The code review should point out input parameter validation is missing on all methods.
    - The code review should point out improper exception handling in security-critical functions
    - The code review should point out unsafe dependency injection - constructor accepts external dependencies (flightService, bookingRepository) without validation
    - The code review should point out misuse of async hooks - that it is set up in the constructor for logging purposes which adds unnecessary overhead
    - The code review should point out blocking the event loop searchFlights uses a busy-wait loop and getFlightStatus performs a synchronous file read, both of which block the event loop.
    - The code review should point in the `getFlightStatus` function, a hard-coded file path is used. The folder path should be in environment variables. The `flightId` parameter should be validated, if not it could lead to a path traversal attack.
Each of these is worth a maximum of 2 points, for a total of 14 points. Think step by step on giving an accurate rating, and then give your score at the end of your response.



 You should include the following test cases, which seems to be most obvious:
        1. Input parameter validation is missing on all methods.
        2. In `getFlightStatus` function, hard coded file path used. The folder path should be in environment variables. The `flightId` parameter should be validated, if not it could lead to path traversal attack.

    Following test cases can be removed:
        1. The code review should point out side effects in pure functions searchFlights and getFlightDetails modify the returned data objects introducing side effects where only data retrieval was expected.
            - The functions are not changing the object state, these functions are adding/updaing fields (_lastAccessed, _searchIndex) which don't have impact on business logic. So you can remove this test case.
        2. The test case with race condition does not point out obvious mistake, if it make sense you can remove it.