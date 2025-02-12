
Unit Test:
Advanced Formatters -> should convert to camel case:
In prompt it is not mention to treat hyphen as space seperator to adding following check is not needed. We cannot penalize model to ignore hyphen.
`expect(formatter.format('hello-world', 'camel')).toBe('helloWorld');`
The test cases should include the examples given in the prompt.
Please include/use given examples in test cases.

Model Evaluations:
Once Unit test updated, update the model evaluations.


Installed Packages:
Include packages inside ```bash ```


Incorrect Solution Explanation:
Please update the explanation once you update test cases.
Please include details why following test case failed
`TextFormatter › Formatter Registration › should throw error for invalid formatter function`
`TextFormatter › Chain Formatting › should chain multiple formatters`

Ideal Response Explanation:
Please update the explanation once you update the incorrect solution explanation.