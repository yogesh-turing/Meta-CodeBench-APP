User Prompt:
    The prompt should make use of exact prompt provided in the document, you can change the numbers (4-6) according to your test cases.

    `
    Please do a code review for the above code. Please look especially for things like this:
    - Bad practices
    - Security vulnerabilities
    - Clear inefficiencies
    - Bugs
    Please mention only the 4-6 most obvious and clearest points that would always be mentioned in a good code review. Please make your code review accurate and clear while also being concise.
    `

Unit Test:
    In `Unit Test` you should provide the list of obvious issues in the code, for which models will be evaluated.
    Refere "Criteria to be added in the Unit Test field:" section in the document https://docs.google.com/document/d/1m1VV6a4cvkHz3Uhx-RUtjKXiFwC7aaemQedrKsiRHGA/edit?tab=t.0
    Here you have to use following format:
    <base_code>
        <review>
        Please rate the quality of the code review for the above JavaScript code. The reviewer was asked to look especially for things like this:
        - Bad practices
        - Security vulnerabilities
        - Clear inefficiencies
        - Bugs
        And the reviewer was asked to only the most obvious and clearest points that would definitely be mentioned in a good code review. Here is what we are looking for:

        <<Add your list of obvious issues>>

    
Model Evaluations:
    For model evaluations, make use of LLM Judge tool: 
    https://llmjudge.streamlit.app/

    Full Stack Trace: Should be copied from the `LLM Judge tool -> Evaluation Result`
    First Observed Failure: Should paste the first failure from the `LLM Judge tool -> Evaluation Result`
    First Observed Failure Reason: Should be the reason why issue is not corrected be the model.


Incorrect Solution Stack Trace:
    You should run incorrect solution in LLM Judge tool and paste the 'Evaluation Result'.

Incorrect Solution Explanation:
    Here you should provide the reason why there are issues in incorrect solution.
    You can refer `Incorrect Solution Stack Trace` to identify the issues and its root cause in short.
    One liner explanation for each issue should be good.

Ideal Response Test Stack Trace
    You should run ideal solution in LLM Judge tool and paste the 'Evaluation Result'.
    Make sure result is 100%, that there are no issues in ideal solution.

Ideal Response Explanation:
    Here you should mention why ideal solution is better than incorrect solution, you can mention the how ideal solution fixed the issues in incorrect solution. Please make is not too long and not too short, ideal 4-6 lines should be good.

