function createQueryBuilder() {
  let columns = [];
  let distinct = false;
  let tableName;
  let alias;
  let conditions = [];
  let params = [];
  let joins = [];
  let groupByColumns = [];
  let havingConditions = [];
  let orderByColumns = [];
  let limit;
  let offset;

  const select = (cols) => {
    if (cols) {
      columns = cols;
    }
    return this;
  };

  const from = (name) => {
    if (!name) {
      throw new Error("Table name not specified");
    }
    if (!isValidIdentifier(name)) {
      throw new Error(`Invalid SQL identifier: ${name}`);
    }
    tableName = name;
    return this;
  };

  const alias = (name) => {
    if (!name) {
      throw new Error("Invalid table alias");
    }
    if (!isValidIdentifier(name)) {
      throw new Error(`Invalid SQL identifier: ${name}`);
    }
    alias = name;
    return this;
  };

  const where = (condition, ...args) => {
    if (condition.includes("?")) {
      const count = (condition.match(/\?/g) || []).length;
      if (count !== args.length) {
        throw new Error("Parameter count mismatch in WHERE clause");
      }
      params.push(...args);
    }
    conditions.push(condition);
    return this;
  };

  const join = (type, table, alias, onCondition, ...args) => {
    if (!["INNER", "LEFT", "RIGHT", "FULL"].includes(type)) {
      throw new Error("Invalid join type");
    }
    if (!isValidIdentifier(table)) {
      throw new Error(`Invalid SQL identifier: ${table}`);
    }
    if (!isValidIdentifier(alias)) {
      throw new Error(`Invalid SQL identifier: ${alias}`);
    }
    if (onCondition.includes("?")) {
      const count = (onCondition.match(/\?/g) || []).length;
      if (count !== args.length) {
        throw new Error("Parameter count mismatch in JOIN clause");
      }
      params.push(...args);
    }
    joins.push({ type, table, alias, onCondition });
    return this;
  };

  const groupBy = (cols) => {
    groupByColumns = cols;
    return this;
  };

  const having = (condition, ...args) => {
    if (condition.includes("?")) {
      const count = (condition.match(/\?/g) || []).length;
      if (count !== args.length) {
        throw new Error("Parameter count mismatch in HAVING clause");
      }
      params.push(...args);
    }
    havingConditions.push(condition);
    return this;
  };

  const orderBy = (column, direction = "ASC") => {
    orderByColumns.push({ column, direction });
    return this;
  };

  const setLimit = (n) => {
    if (n <= 0) {
      throw new Error("Invalid LIMIT value");
    }
    limit = n;
    return this;
  };

  const setOffset = (n) => {
    if (n < 0) {
      throw new Error("Invalid OFFSET value");
    }
    offset = n;
    return this;
  };

  const build = () => {
    if (!tableName) {
      throw new Error("Table name not specified");
    }

    let query = "SELECT ";
    if (distinct) {
      query += "DISTINCT ";
    }
    if (columns.length) {
      query += columns.join(", ");
    } else {
      query += "*";
    }

    query += ` FROM ${tableName}`;
    if (alias) {
      query += ` AS ${alias}`;
    }

    for (const join of joins) {
      query += ` ${join.type} JOIN ${join.table} AS ${join.alias} ON ${join.onCondition}`;
    }

    if (conditions.length) {
      query += " WHERE ";
      query += conditions.join(" AND ");
    }

    if (groupByColumns.length) {
      query += " GROUP BY ";
      query += groupByColumns.join(", ");
    }

    if (havingConditions.length) {
      query += " HAVING ";
      query += havingConditions.join(" AND ");
    }

    if (orderByColumns.length) {
      query += " ORDER BY ";
      query += orderByColumns.map((col) => `${col.column} ${col.direction}`).join(", ");
    }

    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    if (offset) {
      query += ` OFFSET ${offset}`;
    }

    return { query, params };
  };

  const isValidIdentifier = (name) => {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
  };

  return {
    select,
    from,
    alias,
    where,
    join,
    groupBy,
    having,
    orderBy,
    limit: setLimit,
    offset: setOffset,
    build,
    distinct: () => {
      distinct = true;
      return this;
    },
  };
}

module.exports = { createQueryBuilder };