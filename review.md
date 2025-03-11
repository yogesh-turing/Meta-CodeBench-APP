Model A, C, D, E:
    We are penalizing Model A for `replayEvents` function, but the requirements for this function is not clear from prompt. In base code it handled `deleteEvent` to delete the event.
    So model also implemented same, hence test case is failing.


For ideal solution make sure coverage is above 98%

------------|---------|----------|---------|---------|------------------------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------|---------|----------|---------|---------|------------------------------------
All files   |   89.92 |       75 |     100 |   89.76 | 
 correct.js |   89.92 |       75 |     100 |   89.76 | 59,121,140,176,208,259-266,284-294
------------|---------|----------|---------|---------|------------------------------------


To make prompt more clear, you can add following details for each function
1. What are the inputs to function
2. How it processes the inputs
3. What are the outputs from the function

You can include failed test cases in the prompt as well.