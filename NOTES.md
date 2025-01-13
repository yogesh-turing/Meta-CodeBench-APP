Prompt
----------
- The prompt did not mention which hashing it should use.
- Prompt did not mention the number of invalid login attempts.
- Prompt should mention what validations should be added on what input paramters on function. It should also mention how validation erros should be handled.
- Prompt should mention the list of libraries should be used to implement the solution, to make sure that test case executes for all models.
- The code should be enclosed in ```javascript <code> ```
- It should follow the prompt structure as
    Base Code:
    ```javascript
    ```

    Prompt:

--------

Prompt Evaluation

The code in Base code field it different than that in code.



Response Evaluation

- For all models -> "Full Stack Trace" field should be updated with full test stack trace.


Test cases:
UserAuthService
    For test case 1 and 2: 
        "should successfully add a valid user and return a UUID",
        "should generate unique IDs for different users".
        In prompt should mention that addUser function to return uuid.
    Test case 3, 4 and 5:
        "should reject invalid email format",
        "should reject weak passwords",
        "should prevent duplicate users".
        The prompt asked for "Adding input validation", there is no mention on how code should behave when validation fails.
authenticateUser
    Test case 1:
        "should authenticate valid credentials"
        It checks if result have token field, in prompt there is no mention that this function should return the token.
session management
    Test case 1:
        "should create valid sessions"
        Test case expect result to return the token, this is not mentioned in prompt.
        It expect jsonwebtoken library should be used, this is also not mentioed in prompt.
        Also it used environment variable JWT_SECRET, which is not mentioned in prompt.
    Test case 2:
        "should reject expired sessions"
        Test case expect `createSession` function in response, the prompt should metion how this function should behave, what should be the inputs and outputs of the function.
    Test case 3:
        "should reject invalid tokens"
        Test case expect   `validateSession` function in response, the prompt should metion how this function should behave, what should be the inputs and outputs of the function.
    


UserAuthService
Test Case 1 & 2:
    "should successfully add a valid user and return a UUID".
    "should generate unique IDs for different users".
Observations:
    The prompt should explicitly state that the addUser function must return a UUID.

Test Case 3, 4 & 5:
    "should reject invalid email format".
    "should reject weak passwords".
    "should prevent duplicate users".
Observations:
    The prompt mentions "adding input validation" but lacks clarity on how the system should behave upon validation failure.

authenticateUser
Test Case 1:
    "should authenticate valid credentials".
Observations:
    The test case checks if the result contains a token field, but the prompt does not specify that the function should return a token.

Session Management
Test Case 1:
    "should create valid sessions".
Observations:
    The test case expects the result to include a token, which is not mentioned in the prompt.
    It assumes the use of the jsonwebtoken library, which is not required or specified.
    The use of the JWT_SECRET environment variable is also unstated.
Test Case 2:
    "should reject expired sessions".
Observations:
    The test case expects a createSession function but does not define its expected behavior, inputs, or outputs.
Test Case 3:
    "should reject invalid tokens".
Observations:
    The test case assumes a validateSession function, but the prompt does not describe how this function should behave or its expected inputs and outputs.
