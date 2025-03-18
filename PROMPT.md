provide your prompt using the following format:

Base Code:
```javascript
function generateProjectQuery(queryName = null, jobNumber = null, status = null) {
    let query = "SELECT * FROM projects";
    let conditions = [];
    let params = [];

    // Filter by project name (queryName)
    if (queryName) {
        conditions.push("LOWER(name) LIKE ?");
        params.push(`%${queryName.toLowerCase()}%`);
    }

    // Filter by job number
    if (jobNumber) {
        conditions.push("job_number = ?");
        params.push(jobNumber);
    }

    // Filter by status
    if (status === "current") {
        conditions.push("completed_at IS NULL");
    } else if (status === "former") {
        conditions.push("completed_at IS NOT NULL AND completed_at < NOW() - INTERVAL 18 MONTH");
    } else if (status === "recent_former") {
        conditions.push("completed_at IS NOT NULL AND completed_at >= NOW() - INTERVAL 18 MONTH");
    } else if (status !== null && status !== "both") {
        return { query, params }; // Invalid status, return base query
    }

    // Append conditions if any
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    return { query, params };
}

module.exports = { generateProjectQuery };
```

Stack Trace:
```javascript
generateProjectQuery
    ✓ returns base query when no filters are provided (1 ms)
    ✓ filters by job number only
    ✓ filters by status 'current'
    ✓ returns base query when an invalid status is provided
    ✕ filters by queryName with prefix matching conditions (1 ms)
    ✕ combines queryName, jobNumber, and status filters correctly (1 ms)

  ● generateProjectQuery › filters by queryName with prefix matching conditions

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 1

      Array [
    -   "dir%",
    -   "% dir%",
    +   "%dir%",
      ]

      32 |     expect(result.query).toMatch(/LOWER\(name\) LIKE \?/);
      33 |     // Check that both parameters are present
    > 34 |     expect(result.params).toEqual(["dir%", "% dir%"]);
         |                           ^
      35 |   });
      36 |
      37 |   test("combines queryName, jobNumber, and status filters correctly", () => {

      at Object.toEqual (task10/index.test.js:34:27)

  ● generateProjectQuery › combines queryName, jobNumber, and status filters correctly

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 1

      Array [
    -   "cto%",
    -   "% cto%",
    +   "%cto%",
        "67890",
      ]

      42 |     
      43 |     // Expect the parameters to include the dual conditions for the project name and the job number.
    > 44 |     expect(result.params).toEqual(["cto%", "% cto%", "67890"]);
         |                           ^
      45 |   });
      46 | });
      47 |

      at Object.toEqual (task10/index.test.js:44:27)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 4 passed, 6 total
Snapshots:   0 total
Time:        0.174 s, estimated 1 s
```

Prompt:
The current implementation of generateProjectQuery has some logical issues:  
1. Filtering by name is not case-insensitive.  
2. Filtering by name does not work correctly, as it matches the keyword anywhere in the name. However, we want it to match only as a prefix. For example, if "cto" is searched, a project with the name "X CTO" should match, but "Senior Director" should not match because "cto" appears inside "Director" rather than at the beginning.

Fix these issues while ensuring that the function still supports all three filters properly.  

### Example 
```javascript
const query = generateProjectQuery(null, null, "current");
console.log(query)
```
### Expected Output
```javascript
{
      query: 'SELECT * FROM projects WHERE completed_at IS NULL',
      params: []
}
```