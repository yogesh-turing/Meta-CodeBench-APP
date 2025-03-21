Estimated skill requirements:
    Include "Software engineering best practices"

Unit test:
    When I tried executing test cases for all model and solutions, I got different results.
    I think this is due to tool's regex issue, following test case is failing.

    ```javascript
    test("filters by queryName with prefix matching conditions", () => {
        const result = generateProjectQuery("dir");
        
        // Verify that the WHERE clause contains two LIKE conditions.
        expect(result.query).toMatch(/LOWER$name$ LIKE \?/);
        // Check that both parameters are present
        expect(result.params).toEqual(["dir%", "% dir%"]);
    });
    ```

Once I get correct unit test cases, I will continue with remaining evaluations.









////

The correct test case is:

  test("filters by queryName with prefix matching conditions", () => {
    const result = generateProjectQuery("dir");
    
    // Verify that the WHERE clause contains two LIKE conditions.
    expect(result.query).toMatch(/LOWER\(name\) LIKE \?/);
    // Check that both parameters are present
    expect(result.params).toEqual(["dir%", "% dir%"]);
  });