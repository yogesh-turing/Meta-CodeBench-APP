function createQueryBuilder() {
  const state = {
    distinct: false,
    columns: ['*'],
    table: '',
    tableAlias: '',
    joins: [],
    whereConditions: [],
    whereParams: [],
    groupByColumns: [],
    havingConditions: [],
    havingParams: [],
    orderByColumns: [],
    limitValue: null,
    offsetValue: null
  };

  function validateIdentifier(identifier, context = 'identifier') {
    const validPattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if (!validPattern.test(identifier)) {
      throw new Error(`Invalid SQL identifier: ${identifier}`);
    }
  }

  function validateParameterCount(condition, params, clause) {
    const placeholderCount = (condition.match(/\?/g) || []).length;
    if (placeholderCount !== params.length) {
      throw new Error(`Parameter count mismatch in ${clause} clause`);
    }
  }

  return {
    select(columns) {
      if (columns && Array.isArray(columns)) {
        state.columns = columns;
      }
      return this;
    },

    distinct() {
      state.distinct = true;
      return this;
    },

    from(tableName) {
      if (!tableName) {
        throw new Error('Table name not specified');
      }
      const tableNameOnly = tableName.split(' ')[0];
      validateIdentifier(tableNameOnly);
      state.table = tableName;
      return this;
    },

    alias(aliasName) {
      if (!aliasName) {
        throw new Error('Invalid table alias');
      }
      validateIdentifier(aliasName);
      state.tableAlias = aliasName;
      return this;
    },

    where(condition, ...params) {
      validateParameterCount(condition, params, 'WHERE');
      state.whereConditions.push(condition);
      state.whereParams.push(...params);
      return this;
    },

    join(type, table, alias, onCondition, ...params) {
      const validJoinTypes = ['INNER', 'LEFT', 'RIGHT', 'FULL'];
      if (!validJoinTypes.includes(type.toUpperCase())) {
        throw new Error('Invalid join type');
      }
      validateIdentifier(table);
      if (alias) {
        validateIdentifier(alias);
      }
      validateParameterCount(onCondition, params, 'JOIN');
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
      if (Array.isArray(columns)) {
        state.groupByColumns = columns;
      }
      return this;
    },

    having(condition, ...params) {
      validateParameterCount(condition, params, 'HAVING');
      state.havingConditions.push(condition);
      state.havingParams.push(...params);
      return this;
    },

    orderBy(column, direction = 'ASC') {
      state.orderByColumns.push({
        column,
        direction: direction.toUpperCase()
      });
      return this;
    },

    limit(n) {
      if (!Number.isInteger(n) || n <= 0) {
        throw new Error('Invalid LIMIT value');
      }
      state.limitValue = n;
      return this;
    },

    offset(n) {
      if (!Number.isInteger(n) || n < 0) {
        throw new Error('Invalid OFFSET value');
      }
      state.offsetValue = n;
      return this;
    },

    build() {
      if (!state.table) {
        throw new Error('Table name not specified');
      }

      const parts = [];
      const params = [];

      // SELECT clause
      parts.push('SELECT');
      if (state.distinct) {
        parts.push('DISTINCT');
      }
      parts.push(state.columns.join(', '));

      // FROM clause
      parts.push(`FROM ${state.table}`);
      if (state.tableAlias) {
        parts.push(state.tableAlias);
      }

      // JOIN clauses
      state.joins.forEach(join => {
        parts.push(`${join.type} JOIN ${join.table}`);
        if (join.alias) {
          parts.push(join.alias);
        }
        parts.push(`ON ${join.condition}`);
        params.push(...join.params);
      });

      // WHERE clause
      if (state.whereConditions.length > 0) {
        parts.push('WHERE');
        parts.push(state.whereConditions.join(' AND '));
        params.push(...state.whereParams);
      }

      // GROUP BY clause
      if (state.groupByColumns.length > 0) {
        parts.push('GROUP BY');
        parts.push(state.groupByColumns.join(', '));
      }

      // HAVING clause
      if (state.havingConditions.length > 0) {
        parts.push('HAVING');
        parts.push(state.havingConditions.join(' AND '));
        params.push(...state.havingParams);
      }

      // ORDER BY clause
      if (state.orderByColumns.length > 0) {
        parts.push('ORDER BY');
        parts.push(state.orderByColumns.map(
          col => `${col.column} ${col.direction}`
        ).join(', '));
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