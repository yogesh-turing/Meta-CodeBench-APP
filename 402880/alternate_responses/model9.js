function createQueryBuilder() {
  let query = {
    select: '*',
    from: null,
    alias: null,
    joins: [],
    where: [],
    groupBy: [],
    having: [],
    orderBy: [],
    limit: null,
    offset: null,
    params: [],
    distinct: false,
  };

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

  const builder = {
    select(columns) {
      if (Array.isArray(columns)) {
        query.select = columns.map((column) => {
          if (typeof column === 'string') {
            validateIdentifier(column);
            return column;
          } else if (typeof column === 'function') {
            // Assume the function returns a subquery string
            return `(${column()})`;
          } else {
            throw new Error('Invalid column type');
          }
        }).join(', ');
      } else {
        throw new Error('Invalid column type');
      }
      return builder;
    },

    distinct() {
      query.distinct = true;
      return builder;
    },

    from(tableName) {
      validateIdentifier(tableName);
      query.from = tableName;
      return builder;
    },

    alias(aliasName) {
      validateTableAlias(aliasName);
      query.alias = aliasName;
      return builder;
    },

    join(type, table, alias, onCondition, ...params) {
      if (!['INNER', 'LEFT', 'RIGHT', 'FULL'].includes(type)) {
        throw new Error('Invalid join type');
      }
      validateIdentifier(table);
      validateTableAlias(alias);
      query.joins.push({ type, table, alias, onCondition, params });
      query.params.push(...params);
      return builder;
    },

    where(condition, ...params) {
      const placeholderCount = condition.split('?').length - 1;
      if (placeholderCount !== params.length) {
        throw new Error('Parameter count mismatch in WHERE clause');
      }
      query.where.push({ condition, params });
      query.params.push(...params);
      return builder;
    },

    groupBy(columns) {
      if (Array.isArray(columns)) {
        query.groupBy = columns.map((column) => {
          validateIdentifier(column);
          return column;
        }).join(', ');
      } else {
        throw new Error('Invalid column type');
      }
      return builder;
    },

    having(condition, ...params) {
      const placeholderCount = condition.split('?').length - 1;
      if (placeholderCount !== params.length) {
        throw new Error('Parameter count mismatch in HAVING clause');
      }
      query.having.push({ condition, params });
      query.params.push(...params);
      return builder;
    },

    orderBy(column, direction = 'ASC') {
      validateIdentifier(column);
      query.orderBy.push({ column, direction });
      return builder;
    },

    limit(n) {
      if (typeof n !== 'number' || n <= 0) {
        throw new Error('Invalid LIMIT value');
      }
      query.limit = n;
      return builder;
    },

    offset(n) {
      if (typeof n !== 'number' || n < 0) {
        throw new Error('Invalid OFFSET value');
      }
      query.offset = n;
      return builder;
    },

    build() {
      if (!query.from) {
        throw new Error('Table name not specified');
      }

      let queryString = 'SELECT ';
      if (query.distinct) {
        queryString += 'DISTINCT ';
      }
      queryString += query.select + ' FROM ' + query.from;

      if (query.alias) {
        queryString += ' AS ' + query.alias;
      }

      query.joins.forEach((join) => {
        queryString += ` ${join.type} JOIN ${join.table} AS ${join.alias} ON ${join.onCondition}`;
      });

      if (query.where.length > 0) {
        queryString += ' WHERE ';
        queryString += query.where.map((where) => where.condition).join(' AND ');
      }

      if (query.groupBy) {
        queryString += ' GROUP BY ' + query.groupBy;
      }

      if (query.having.length > 0) {
        queryString += ' HAVING ';
        queryString += query.having.map((having) => having.condition).join(' AND ');
      }

      if (query.orderBy.length > 0) {
        queryString += ' ORDER BY ';
        queryString += query.orderBy.map((orderBy) => `${orderBy.column} ${orderBy.direction}`).join(', ');
      }

      if (query.limit) {
        queryString += ' LIMIT ' + query.limit;
      }

      if (query.offset) {
        queryString += ' OFFSET ' + query.offset;
      }

      return { query: queryString, params: query.params };
    },
  };

  return builder;
}

module.exports = { createQueryBuilder };