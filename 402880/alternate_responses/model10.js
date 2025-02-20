function createQueryBuilder() {
  let select = '*';
  let distinct = false;
  let from = null;
  let alias = null;
  let joins = [];
  let wheres = [];
  let groupBy = [];
  let havings = [];
  let orderBy = [];
  let limit = null;
  let offset = null;
  let params = [];

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

  const validateJoinType = (joinType) => {
    if (!['INNER', 'LEFT', 'RIGHT', 'FULL'].includes(joinType)) {
      throw new Error('Invalid join type');
    }
  };

  const validateParameterCount = (condition, params) => {
    const placeholderCount = condition.split('?').length - 1;
    if (placeholderCount !== params.length) {
      throw new Error(`Parameter count mismatch in ${condition.includes('WHERE') ? 'WHERE' : 'HAVING'} clause`);
    }
  };

  const validateLimit = (limit) => {
    if (typeof limit !== 'number' || limit <= 0) {
      throw new Error('Invalid LIMIT value');
    }
  };

  const validateOffset = (offset) => {
    if (typeof offset !== 'number' || offset < 0) {
      throw new Error('Invalid OFFSET value');
    }
  };

  return {
    select: (columns) => {
      select = columns.join(', ');
      return this;
    },
    distinct: () => {
      distinct = true;
      return this;
    },
    from: (tableName) => {
      from = tableName;
      validateIdentifier(tableName);
      return this;
    },
    alias: (aliasName) => {
      alias = aliasName;
      validateTableAlias(aliasName);
      return this;
    },
    join: (type, table, alias, onCondition, ...params) => {
      validateJoinType(type);
      validateIdentifier(table);
      validateIdentifier(alias);
      validateParameterCount(onCondition, params);
      joins.push({ type, table, alias, onCondition, params });
      return this;
    },
    where: (condition, ...params) => {
      validateParameterCount(condition, params);
      wheres.push({ condition, params });
      return this;
    },
    groupBy: (columns) => {
      groupBy = columns;
      return this;
    },
    having: (condition, ...params) => {
      validateParameterCount(condition, params);
      havings.push({ condition, params });
      return this;
    },
    orderBy: (column, direction = 'ASC') => {
      orderBy.push({ column, direction });
      return this;
    },
    limit: (n) => {
      validateLimit(n);
      limit = n;
      return this;
    },
    offset: (n) => {
      validateOffset(n);
      offset = n;
      return this;
    },
    build: () => {
      if (!from) {
        throw new Error('Table name not specified');
      }

      let query = `SELECT ${distinct ? 'DISTINCT ' : ''}${select} FROM ${from} AS ${alias}`;

      for (const join of joins) {
        query += ` ${join.type} JOIN ${join.table} AS ${join.alias} ON ${join.onCondition}`;
        params.push(...join.params);
      }

      if (wheres.length) {
        query += ' WHERE ';
        for (let i = 0; i < wheres.length; i++) {
          query += wheres[i].condition;
          if (i < wheres.length - 1) {
            query += ' AND ';
          }
          params.push(...wheres[i].params);
        }
      }

      if (groupBy.length) {
        query += ` GROUP BY ${groupBy.join(', ')}`;
      }

      if (havings.length) {
        query += ' HAVING ';
        for (let i = 0; i < havings.length; i++) {
          query += havings[i].condition;
          if (i < havings.length - 1) {
            query += ' AND ';
          }
          params.push(...havings[i].params);
        }
      }

      if (orderBy.length) {
        query += ' ORDER BY ';
        for (let i = 0; i < orderBy.length; i++) {
          query += `${orderBy[i].column} ${orderBy[i].direction}`;
          if (i < orderBy.length - 1) {
            query += ', ';
          }
        }
      }

      if (limit) {
        query += ` LIMIT ${limit}`;
      }

      if (offset) {
        query += ` OFFSET ${offset}`;
      }

      return { query, params };
    },
  };
}

module.exports = { createQueryBuilder };