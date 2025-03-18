const { generateProjectQuery } = require('./model_c');

describe("generateProjectQuery", () => {
  test("returns base query when no filters are provided", () => {
    const result = generateProjectQuery();
    expect(result.query).toBe("SELECT * FROM projects");
    expect(result.params).toEqual([]);
  });

  test("filters by job number only", () => {
    const result = generateProjectQuery(null, "12345");
    expect(result.query).toContain("job_number = ?");
    expect(result.params).toEqual(["12345"]);
  });

  test("filters by status 'current'", () => {
    const result = generateProjectQuery(null, null, "current");
    console.log(result)
    expect(result.query).toContain("completed_at IS NULL");
    expect(result.params).toEqual([]);
  });

  test("returns base query when an invalid status is provided", () => {
    const result = generateProjectQuery(null, null, "invalid");
    expect(result.query).toBe("SELECT * FROM projects");
    expect(result.params).toEqual([]);
  });

  test("filters by queryName with prefix matching conditions", () => {
    const result = generateProjectQuery("dir");
    
    // Verify that the WHERE clause contains two LIKE conditions.
    expect(result.query).toMatch(/LOWER$name$ LIKE \?/);
    // Check that both parameters are present
    expect(result.params).toEqual(["dir%", "% dir%"]);
  });

  test("combines queryName, jobNumber, and status filters correctly", () => {
    const result = generateProjectQuery("cto", "67890", "former");

    expect(result.query).toContain("job_number = ?");
    expect(result.query).toContain("completed_at IS NOT NULL AND completed_at < NOW() - INTERVAL 18 MONTH");
    
    // Expect the parameters to include the dual conditions for the project name and the job number.
    expect(result.params).toEqual(["cto%", "% cto%", "67890"]);
  });
});