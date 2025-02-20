function createQueryBuilder() {
  let tableName;
  let alias;
  let columns = [];
  let distinct = false;
  let joins = [];
  let whereConditions = [];
  let whereParams = [];
  let groupByColumns = [];
  let havingConditions = [];
  let havingParams = [];
  let orderByColumns = [];
  let limit;
  let offset;

  const validateIdentifier = (identifier) => {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
      throw new Error(`Invalid SQL identifier: ${identifier}`);
    }
  };

  const validateTableAlias = (alias) => {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(alias)) {
      throw new Error('Invalid table alias');
    }
  };

  const select = (columnsToSelect) => {
    columns = columnsToSelect;
    return this;
  };

  const distinctSelect = () => {
    distinct = true;
    return this;
  };

  const from = (tableNameToSet) => {
    validateIdentifier(tableNameToSet);
    tableName = tableNameToSet;
    return this;
  };

  const setAlias = (aliasToSet) => {
    validateTableAlias(aliasToSet);
    alias = aliasToSet;
    return this;
  };

  const join = (type, table, alias, onCondition, ...params) => {
    if (!['INNER', 'LEFT', 'RIGHT', 'FULL'].includes(type)) {
      throw new Error('Invalid join type');
    }
    validateIdentifier(table);
    validateTableAlias(alias);
    const placeholderCount = (onCondition.match(/\?/g) || []).length;
    if (placeholderCount !== params.length) {
      throw new Error('Parameter count mismatch in JOIN clause');
    }
    joins.push({ type, table, alias, onCondition, params });
    return this;
  };

  const where = (condition, ...params) => {
    const placeholderCount = (condition.match(/\?/g) || []).length;
    if (placeholderCount !== params.length) {
      throw new Error('Parameter count mismatch in WHERE clause');
    }
    whereConditions.push(condition);
    whereParams.push(...params);
    return this;
  };

  const groupBy = (columnsToGroup) => {
    groupByColumns = columnsToGroup;
    return this;
  };

  const having = (condition, ...params) => {
    const placeholderCount = (condition.match(/\?/g) || []).length;
    if (placeholderCount !== params.length) {
      throw new Error('Parameter count mismatch in HAVING clause');
    }
    havingConditions.push(condition);
    havingParams.push(...params);
    return this;
  };

  const orderBy = (column, direction = 'ASC') => {
    validateIdentifier(column);
    orderByColumns.push(`${column} ${direction}`);
    return this;
  };

  const setLimit = (n) => {
    if (n <= 0) {
      throw new Error('Invalid LIMIT value');
    }
    limit = n;
    return this;
  };

  const setOffset = (n) => {
    if (n < 0) {
      throw new Error('Invalid OFFSET value');
    }
    offset = n;
    return this;
  };

  const build = () => {
    if (!tableName) {
      throw new Error('Table name not specified');
    }

    let query = 'SELECT ';
    if (distinct) {
      query += 'DISTINCT ';
    }
    query += columns.length ? columns.join(', ') : '*';
    query += ` FROM ${tableName}`;
    if (alias) {
      query += ` AS ${alias}`;
    }

    for (const join of joins) {
      query += ` ${join.type} JOIN ${join.table} AS ${join.alias} ON ${join.onCondition}`;
    }

    if (whereConditions.length) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    if (groupByColumns.length) {
      query += ' GROUP BY ' + groupByColumns.join(', ');
    }

    if (havingConditions.length) {
      query += ' HAVING ' + havingConditions.join(' AND ');
    }

    if (orderByColumns.length) {
      query += ' ORDER BY ' + orderByColumns.join(', ');
    }

    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    if (offset) {
      query += ` OFFSET ${offset}`;
    }

    const params = [...whereParams, ...havingParams];

    return { query, params };
  };

  return {
    select,
    distinct: distinctSelect,
    from,
    alias: setAlias,
    join,
    where,
    groupBy,
    having,
    orderBy,
    limit: setLimit,
    offset: setOffset,
    build,
  };
}

module.exports = { createQueryBuilder };