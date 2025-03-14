For given base code:

Team leader provided following code review comments:   
    **Critical Improvements Needed:**

    1. **Context Loss in Callbacks**: Use arrow functions in `bookFlight` and `selectSeat` to maintain `this` context within `setTimeout`. This prevents errors from undefined references to `this.bookingRepository`.

    2. **Input Parameter Validation**: All methods, such as `bookFlight`, `searchFlights`, and `addLuggage`, need validation checks for their inputs to avoid processing incorrect data and to prevent security risks.

    3. **Exception Handling in Security-Critical Functions**: Improve error handling by specifically classifying and managing errors, especially in critical functions. This will make the system more reliable and easier to troubleshoot.

    4. **Unsafe Dependency Injection**: Verify external dependencies in the constructor to ensure they are appropriate and secure before use, protecting against potential security breaches and malfunctions.

    5. **Misuse of Async Hooks**: Limit the use of `async_hooks` to debugging purposes and disable them in production to minimize performance overhead. Consider implementing a feature toggle for better control.

    6. **Blocking Event Loop**: Replace the busy-wait in `searchFlights` with `setTimeout` and switch to asynchronous file operations in `getFlightStatus` with `fs.promises.readFile` to keep the event loop free and improve system responsiveness.

    7. **Hard-coded Paths and Parameter Validation**: Remove hard-coded paths in `getFlightStatus`, using configuration files or environment variables instead. Also, validate `flightId` to protect against path traversal attacks.

    By addressing these points, the system will not only adhere to best practices but will also offer a more secure, efficient, and maintainable environment for handling flight bookings.

Following are the 7 point that should be addressed/pointed out in code review:
    
    1. The code review should point out improperly bound context in callbacks methods like bookFlight and selectSeat callbacks use traditional function syntax (not arrow functions), so the `this` context may be lost, causing repository methods to be called on an undefined context.
    2. The code review should point out input parameter validation is missing on all methods.
    3. The code review should point out improper exception handling in security-critical functions
    4. The code review should point out unsafe dependency injection - constructor accepts external dependencies (flightService, bookingRepository) without validation
    5. The code review should point out misuse of async hooks - that it is set up in the constructor for logging purposes which adds unnecessary overhead
    6. The code review should point out blocking the event loop searchFlights uses a busy-wait loop and getFlightStatus performs a synchronous file read, both of which block the event loop.
    7. The code review should point in the `getFlightStatus` function, a hard-coded file path is used. The folder path should be in environment variables. The `flightId` parameter should be validated, if not it could lead to a path traversal attack.

Can you please help to check if team leader’s review has addressed the points.
Each of these is worth a maximum of 2 points, for a total of 14 points. Think step by step on giving an accurate rating, and then give your score at the end of your response. If review comment has addressed issues partially then allocate 1 score point.