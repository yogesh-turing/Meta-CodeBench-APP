Estimated skill requirements:
    Add "Library features" and "Knowledge of a specialized software area"

Unit Test:

    You should include the following test cases, which seems to be most obvious:
        1. Input parameter validation is missing on all methods.
        2. In `getFlightStatus` function, hard coded file path used. The folder path should be in environment variables. The `flightId` parameter should be validated, if not it could lead to path traversal attack.

    Following test cases can be removed:
        1. The code review should point out side effects in pure functions searchFlights and getFlightDetails modify the returned data objects introducing side effects where only data retrieval was expected.
            - The functions are not changing the object state, these functions are adding/updaing fields (_lastAccessed, _searchIndex) which don't have impact on business logic. So you can remove this test case.
        2. The test case with race condition does not point out obvious mistake, if it make sense you can remove it.

    

