function createQueryBuilder() {
  let query = {
    select: '*',
    distinct: false,
    from: null,
    alias: null,
    joins: [],
    where: [],
    groupBy: [],
    having: [],
    orderBy: [],
    limit: null,
    offset: null,
    params: []
  };

  const validateIdentifier = (identifier) => {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
      throw new Error(`Invalid SQL identifier: ${identifier}`);
    }
  };

  const builder = {
    select(columns) {
      query.select = columns.join(', ');
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
      validateIdentifier(aliasName);
      query.alias = aliasName;
      return builder;
    },
    join(type, table, alias, onCondition, ...params) {
      if (!['INNER', 'LEFT', 'RIGHT', 'FULL'].includes(type)) {
        throw new Error('Invalid join type');
      }
      validateIdentifier(table);
      validateIdentifier(alias);
      const placeholderCount = (onCondition.match(/\?/g) || []).length;
      if (placeholderCount !== params.length) {
        throw new Error('Parameter count mismatch in JOIN clause');
      }
      query.joins.push({ type, table, alias, onCondition, params });
      query.params = query.params.concat(params);
      return builder;
    },
    where(condition, ...params) {
      const placeholderCount = (condition.match(/\?/g) || []).length;
      if (placeholderCount !== params.length) {
        throw new Error('Parameter count mismatch in WHERE clause');
      }
      query.where.push({ condition, params });
      query.params = query.params.concat(params);
      return builder;
    },
    groupBy(columns) {
      query.groupBy = columns;
      return builder;
    },
    having(condition, ...params) {
      const placeholderCount = (condition.match(/\?/g) || []).length;
      if (placeholderCount !== params.length) {
        throw new Error('Parameter count mismatch in HAVING clause');
      }
      query.having.push({ condition, params });
      query.params = query.params.concat(params);
      return builder;
    },
    orderBy(column, direction = 'ASC') {
      query.orderBy.push({ column, direction });
      return builder;
    },
    limit(n) {
      if (n <= 0) {
        throw new Error('Invalid LIMIT value');
      }
      query.limit = n;
      return builder;
    },
    offset(n) {
      if (n < 0) {
        throw new Error('Invalid OFFSET value');
      }
      query.offset = n;
      return builder;
    },
    build() {
      if (!query.from) {
        throw new Error('Table name not specified');
      }

      let sql = `SELECT ${query.distinct ? 'DISTINCT ' : ''}${query.select} FROM ${query.from}`;
      if (query.alias) {
        sql += ` AS ${query.alias}`;
      }

      query.joins.forEach((join) => {
        sql += ` ${join.type} JOIN ${join.table} AS ${join.alias} ON ${join.onCondition}`;
      });

      if (query.where.length > 0) {
        sql += ' WHERE ';
        sql += query.where.map((where) => `(${where.condition})`).join(' AND ');
      }

      if (query.groupBy.length > 0) {
        sql += ` GROUP BY ${query.groupBy.join(', ')}`;
      }

      if (query.having.length > 0) {
        sql += ' HAVING ';
        sql += query.having.map((having) => `(${having.condition})`).join(' AND ');
      }

      if (query.orderBy.length > 0) {
        sql += ' ORDER BY ';
        sql += query.orderBy.map((orderBy) => `${orderBy.column} ${orderBy.direction}`).join(', ');
      }

      if (query.limit !== null) {
        sql += ` LIMIT ${query.limit}`;
      }

      if (query.offset !== null) {
        sql += ` OFFSET ${query.offset}`;
      }

      return { query: sql, params: query.params };
    }
  };

  return builder;
}

module.exports = { createQueryBuilder };