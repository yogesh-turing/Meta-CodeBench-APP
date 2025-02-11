## User Prompt
The prompt should be clear.
In case of refactoring task, you can add how current code behaves and how expected code should be.
The test cases should comply with the use prompt. 
In this case there multiple functions in base code, so the sequence in which those should be executed is not very clear.
You can add example input and expected output in prompt as well to make is more clear (this is optional).

## Prompt Evaluation

#### Difficulty:
    Need to re-evaluate after prompt reworked
#### Estimated skill requirements
    You can add "Language-specific features" and "Software engineering best practices" to this prompt
    
---

### Unit Test

The unit test case should cover all the points mentioned in the prompt.
It should cover all the edge cases like null/undefined input, input data type, invalid inputs, large sized inputs etc. So it is important to mention it in prompt as well.
In test cases, hard coded strings used, make sure to either include those strings in prompt/base code or update the test case to not compare string instead you can check if error thrown or not.
---

## Model Evaluation

1. #### Model A
- ##### First Observed Failure
    The prompt did not mention to throw `OrderValidationError`.
    The prompt did not mention to implement the `Order` class as well.
    So we cannot penalize model for this.

---

2. #### Model B, C, D, E, F, G, H, J
    When I tried running test cases in my local I got different results.
    First test case failed is "× should generate a random order ID (5 ms)"
    Please recheck this.

3. #### Model G, H, J
    Full Stack Trace is partial.

4. #### Model I
    In prompt it not mentioned to generate string of 13 characters so this test case does not comply with the prompt.


### Installed Packages
    Use backticks here e.g. 
    ```bash 
        npm install jest
    ```
---

### Incorrect Solution Explanation
    The incorrect solution explanation should include all the issues in the code/solution. There are 2 test cases failed so try to include explanation for both. Here you can shortly explain why this test case has failed. 
---

### Ideal Response Test Stack Trace
    When I tried to execute the test case for ideal solution one of the test case failed. 
    "× should partially match a market order and leave remaining amount (2 ms)"
    Please validate this.
---

### Ideal Response Explanation
    In ideal solution explanation you should include what makes this solution better than incorrect solution. You can describe how it fixed/overcame the issues in incorrect solution.
---

### Ideal Response

---
