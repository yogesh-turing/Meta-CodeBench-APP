Prompt Evaluation
    Base code is different from User prompt base code.
    Prompt is different from User prompt.

Model A: please check "Full Stack Trace", when I run test cases for Model A, I got different results.
Model B: Please check "First Observed Failure Reason", from explanation it does not look like an error.
Model C, D, E: Please check "First Observed Failure Reason", it should not throw an error for zero weight.

Model I: When I run test cases for Model I, I got different results.

Ideal Response Test Stack Trace: The field contains the incorrect solution stack trace as well.


Incorrect Solution Stack Trace is incorrect ( All tests are passing )
Ideal response Stack trace is incorrect (there are 14 tests but 16 are there in the stack trace)
Recheck the Incorrect solution stack trace and Ideal response after updating the stack traces,

Incorrect stack trace and failure for Model J.

Unit Test-> We do not need to be very strict when matching the strings e.g. ".", Let's update the unit tests to use regex or match some substrings that make sense.