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