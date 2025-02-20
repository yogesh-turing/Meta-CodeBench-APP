function createQueryBuilder() {
  const state = {
    columns: ['*'],
    table: '',
    joins: [],
    whereConditions: [],
    whereParams: [],
    groupByColumns: [],
    havingConditions: [],
    havingParams: [],
    orderByClause: '',
    limitValue: null,
    offsetValue: null
  };

  return {
    select(columns) {
      if (Array.isArray(columns) && columns.length > 0) {
        state.columns = columns;
      }
      return this;
    },

    from(tableName) {
      if (typeof tableName !== 'string' || !tableName.trim()) {
        throw new Error('Table name must be a non-empty string');
      }
      state.table = tableName.trim();
      return this;
    },

    where(condition, ...params) {
      if (typeof condition !== 'string' || !condition.trim()) {
        throw new Error('Where condition must be a non-empty string');
      }
      state.whereConditions.push(condition.trim());
      state.whereParams.push(...params);
      return this;
    },

    join(type, table, alias, onCondition, ...params) {
      if (!['INNER', 'LEFT', 'RIGHT', 'FULL'].includes(type.toUpperCase())) {
        throw new Error('Invalid join type');
      }
      if (!table || !onCondition) {
        throw new Error('Join requires table and condition');
      }
      state.joins.push({
        type: type.toUpperCase(),
        table,
        alias,
        condition: onCondition,
        params
      });
      return this;
    },

    groupBy(columns) {
      if (!Array.isArray(columns)) {
        throw new Error('groupBy requires an array of columns');
      }
      state.groupByColumns = columns;
      return this;
    },

    having(condition, ...params) {
      if (typeof condition !== 'string' || !condition.trim()) {
        throw new Error('Having condition must be a non-empty string');
      }
      state.havingConditions.push(condition.trim());
      state.havingParams.push(...params);
      return this;
    },

    orderBy(column, direction = 'ASC') {
      if (typeof column !== 'string' || !column.trim()) {
        throw new Error('Order by column must be a non-empty string');
      }
      const dir = direction.toUpperCase();
      if (!['ASC', 'DESC'].includes(dir)) {
        throw new Error('Order direction must be ASC or DESC');
      }
      state.orderByClause = `${column.trim()} ${dir}`;
      return this;
    },

    limit(n) {
      if (!Number.isInteger(n) || n < 0) {
        throw new Error('Limit must be a non-negative integer');
      }
      state.limitValue = n;
      return this;
    },

    offset(n) {
      if (!Number.isInteger(n) || n < 0) {
        throw new Error('Offset must be a non-negative integer');
      }
      state.offsetValue = n;
      return this;
    },

    build() {
      if (!state.table) {
        throw new Error('FROM clause is required');
      }

      const parts = [];
      const params = [];

      // SELECT
      parts.push(`SELECT ${state.columns.join(', ')}`);

      // FROM
      parts.push(`FROM ${state.table}`);

      // JOINS
      state.joins.forEach(join => {
        const joinClause = `${join.type} JOIN ${join.table}${join.alias ? ` ${join.alias}` : ''} ON ${join.condition}`;
        parts.push(joinClause);
        params.push(...join.params);
      });

      // WHERE
      if (state.whereConditions.length > 0) {
        parts.push(`WHERE ${state.whereConditions.join(' AND ')}`);
        params.push(...state.whereParams);
      }

      // GROUP BY
      if (state.groupByColumns.length > 0) {
        parts.push(`GROUP BY ${state.groupByColumns.join(', ')}`);
      }

      // HAVING
      if (state.havingConditions.length > 0) {
        parts.push(`HAVING ${state.havingConditions.join(' AND ')}`);
        params.push(...state.havingParams);
      }

      // ORDER BY
      if (state.orderByClause) {
        parts.push(`ORDER BY ${state.orderByClause}`);
      }

      // LIMIT and OFFSET
      if (state.limitValue !== null) {
        parts.push(`LIMIT ${state.limitValue}`);
      }
      if (state.offsetValue !== null) {
        parts.push(`OFFSET ${state.offsetValue}`);
      }

      return {
        query: parts.join(' '),
        params
      };
    }
  };
}

module.exports = { createQueryBuilder };