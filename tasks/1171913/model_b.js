function generateProjectQuery(queryName = null, jobNumber = null, status = null) {
    let query = "SELECT * FROM projects";
    let conditions = [];
    let params = [];

    if (queryName) {
        conditions.push("(LOWER(name) LIKE ? OR LOWER(name) LIKE ?)");
        params.push(`${queryName.toLowerCase()}%`, `% ${queryName.toLowerCase()}%`);
    }

    if (jobNumber) {
        conditions.push("job_number = ?");
        params.push(jobNumber);
    }

    if (status === "current") {
        conditions.push("completed_at IS NULL");
    } else if (status === "former") {
        conditions.push("completed_at IS NOT NULL AND completed_at < NOW() - INTERVAL 18 MONTH");
    } else if (status === "recent_former") {
        conditions.push("completed_at IS NOT NULL AND completed_at >= NOW() - INTERVAL 18 MONTH");
    } else if (status !== null && status !== "both") {
        return { query, params };
    }

    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    return { query, params };
}

module.exports = { generateProjectQuery };