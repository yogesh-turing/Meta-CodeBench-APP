function createQueryBuilder() {
  // Internal state
  let _selectColumns = null;
  let _distinct = false;
  let _fromTable = null;
  let _alias = null;
  let _whereClauses = [];
  let _joins = [];
  let _groupByColumns = [];
  let _havingClause = [];
  let _orderByClauses = [];
  let _limit = null;
  let _offset = null;

  // Helper: Validate a single SQL identifier (no dots)
  const isValidIdentifier = (str) => /^[A-Za-z][A-Za-z0-9_]*$/.test(str);

  // Helper: Validate qualified identifiers (e.g., "u.id")
  const isValidQualifiedIdentifier = (str) => {
    return str.split('.').every(part => isValidIdentifier(part));
  };

  // Helper: Count placeholders ("?") in a string
  const countPlaceholders = (str) => (str.match(/\?/g) || []).length;

  const builder = {
    select(columns) {
      if (columns) {
        if (!Array.isArray(columns)) {
          throw new Error("Invalid columns: must be an array");
        }
        columns.forEach((col) => {
          if (typeof col === "string" && !col.includes("(")) {
            // Check if an alias is provided in the form "col AS alias"
            const parts = col.split(/\s+AS\s+/i);
            const identifier = parts[0].trim();
            // Use qualified identifier validation if the identifier contains a dot
            if (!isValidQualifiedIdentifier(identifier)) {
              throw new Error(`Invalid SQL identifier: ${identifier}`);
            }
            if (parts.length > 1) {
              const aliasPart = parts[1].trim();
              if (!isValidIdentifier(aliasPart)) {
                throw new Error(`Invalid SQL identifier: ${aliasPart}`);
              }
            }
          }
        });
        _selectColumns = columns;
      }
      return builder;
    },
    distinct() {
      _distinct = true;
      return builder;
    },
    from(tableName) {
      if (!tableName) {
        throw new Error("Table name not specified");
      }
      // If tableName contains spaces, assume the first token is the actual table name.
      const mainTable = tableName.split(/\s+/)[0];
      if (!isValidIdentifier(mainTable)) {
        throw new Error(`Invalid SQL identifier: ${mainTable}`);
      }
      _fromTable = tableName;
      return builder;
    },
    alias(aliasName) {
      if (!aliasName || !isValidIdentifier(aliasName)) {
        throw new Error("Invalid table alias");
      }
      _alias = aliasName;
      return builder;
    },
    where(condition, ...params) {
      if (typeof condition !== "string") {
        throw new Error("Invalid WHERE condition");
      }
      const placeholders = countPlaceholders(condition);
      if (placeholders !== params.length) {
        throw new Error("Parameter count mismatch in WHERE clause");
      }
      _whereClauses.push({ condition, params });
      return builder;
    },
    join(type, table, alias, onCondition, ...params) {
      const validJoinTypes = ["INNER", "LEFT", "RIGHT", "FULL"];
      if (!validJoinTypes.includes(type.toUpperCase())) {
        throw new Error("Invalid join type");
      }
      if (!isValidIdentifier(table)) {
        throw new Error("Invalid table name");
      }
      if (!isValidIdentifier(alias)) {
        throw new Error("Invalid join alias");
      }
      const placeholders = countPlaceholders(onCondition);
      if (placeholders !== params.length) {
        throw new Error("Parameter count mismatch in WHERE clause");
      }
      _joins.push({ type: type.toUpperCase(), table, alias, onCondition, params });
      return builder;
    },
    groupBy(columns) {
      if (!Array.isArray(columns)) {
        throw new Error("Invalid GROUP BY clause");
      }
      columns.forEach((col) => {
        if (typeof col === "string" && !col.includes("(")) {
          if (!isValidQualifiedIdentifier(col)) {
            throw new Error(`Invalid SQL identifier: ${col}`);
          }
        }
      });
      _groupByColumns = columns;
      return builder;
    },
    having(condition, ...params) {
      if (typeof condition !== "string") {
        throw new Error("Invalid HAVING condition");
      }
      const placeholders = countPlaceholders(condition);
      if (placeholders !== params.length) {
        throw new Error("Parameter count mismatch in HAVING clause");
      }
      _havingClause.push({ condition, params });
      return builder;
    },
    orderBy(column, direction = "ASC") {
      if (typeof column !== "string" || !isValidQualifiedIdentifier(column)) {
        throw new Error(`Invalid SQL identifier: ${column}`);
      }
      const dir = direction.toUpperCase();
      if (dir !== "ASC" && dir !== "DESC") {
        throw new Error("Invalid order direction");
      }
      _orderByClauses.push({ column, direction: dir });
      return builder;
    },
    limit(n) {
      if (typeof n !== "number" || n <= 0) {
        throw new Error("Invalid LIMIT value");
      }
      _limit = n;
      return builder;
    },
    offset(n) {
      if (typeof n !== "number" || n < 0) {
        throw new Error("Invalid OFFSET value");
      }
      _offset = n;
      return builder;
    },
    build() {
      if (!_fromTable) {
        throw new Error("Table name not specified");
      }
      let selectClause = "";
      if (_selectColumns && _selectColumns.length > 0) {
        selectClause = _selectColumns.join(", ");
      } else {
        selectClause = "*";
      }
      let query = `SELECT${_distinct ? " DISTINCT " : " "}${selectClause} FROM ${_fromTable}`;
      const finalParams = [];

      if (_alias) {
        query += ` AS ${_alias}`;
      }

      if (_joins.length > 0) {
        _joins.forEach(j => {
          query += ` ${j.type} JOIN ${j.table} ${j.alias} ON ${j.onCondition}`;
          finalParams.push(...j.params);
        });
      }

      if (_whereClauses.length > 0) {
        const whereConditions = _whereClauses.map(w => w.condition).join(" AND ");
        query += ` WHERE ${whereConditions}`;
        _whereClauses.forEach(w => {
          finalParams.push(...w.params);
        });
      }

      if (_groupByColumns.length > 0) {
        query += ` GROUP BY ${_groupByColumns.join(", ")}`;
      }

      if (_havingClause.length > 0) {
        const havingConditions = _havingClause.map(h => h.condition).join(" AND ");
        query += ` HAVING ${havingConditions}`;
        _havingClause.forEach(h => {
          finalParams.push(...h.params);
        });
      }

      if (_orderByClauses.length > 0) {
        const orders = _orderByClauses.map(o => `${o.column} ${o.direction}`).join(", ");
        query += ` ORDER BY ${orders}`;
      }

      if (_limit !== null) {
        query += ` LIMIT ${_limit}`;
      }
      if (_offset !== null) {
        query += ` OFFSET ${_offset}`;
      }

      return { query, params: finalParams };
    }
  };

  return builder;
}

module.exports = { createQueryBuilder };