Model Evaluations:
    Models A to E:
        The Model is penalized for not validating age parameter correctly. But from prompt/base code/stack trace it is not clear how to handle this scenario. 

        ```javascript
            expect(() =>
                FinancialToolkit.estimateInsuranceCost(0, 1, 100000)
            ).toThrow();
        ```


        Same with following test case, it should be clear in prompt that `expenses` should be array of positive numbers only.
        ```javascript
            expect(() =>
                FinancialToolkit.determineFinancialHealth(5000, [1000, '500'])
            ).toThrow();
        ```

        Zero is neither positive not negative.

        