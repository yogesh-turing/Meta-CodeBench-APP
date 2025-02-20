function createQueryBuilder() {
  class QueryBuilder {
    constructor() {
      this.selectColumns = ['*'];
      this.isDistinct = false;
      this.tableName = '';
      this.tableAlias = '';
      this.whereConditions = [];
      this.whereParams = [];
      this.joins = [];
      this.groupByColumns = [];
      this.havingConditions = [];
      this.havingParams = [];
      this.orderByClause = '';
      this.limitValue = null;
      this.offsetValue = null;
    }

    validateIdentifier(identifier, context = 'identifier') {
      const validPattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;
      if (!validPattern.test(identifier)) {
        throw new Error(`Invalid SQL identifier: ${identifier}`);
      }
      return identifier;
    }

    validateParameterCount(condition, params, clause) {
      const placeholderCount = (condition.match(/\?/g) || []).length;
      if (placeholderCount !== params.length) {
        throw new Error(`Parameter count mismatch in ${clause} clause`);
      }
    }

    select(columns) {
      if (columns) {
        this.selectColumns = columns;
      }
      return this;
    }

    distinct() {
      this.isDistinct = true;
      return this;
    }

    from(tableName) {
      if (!tableName) {
        throw new Error('Table name not specified');
      }
      const parts = tableName.split(' ');
      this.validateIdentifier(parts[0]);
      this.tableName = tableName;
      return this;
    }

    alias(aliasName) {
      if (!aliasName) {
        throw new Error('Invalid table alias');
      }
      this.validateIdentifier(aliasName);
      this.tableAlias = aliasName;
      return this;
    }

    where(condition, ...params) {
      this.validateParameterCount(condition, params, 'WHERE');
      this.whereConditions.push(condition);
      this.whereParams.push(...params);
      return this;
    }

    join(type, table, alias, onCondition, ...params) {
      const validJoinTypes = ['INNER', 'LEFT', 'RIGHT', 'FULL'];
      if (!validJoinTypes.includes(type.toUpperCase())) {
        throw new Error('Invalid join type');
      }
      this.validateIdentifier(table);
      if (alias) {
        this.validateIdentifier(alias);
      }
      this.validateParameterCount(onCondition, params, 'JOIN');
      this.joins.push({
        type: type.toUpperCase(),
        table,
        alias,
        condition: onCondition,
        params
      });
      return this;
    }

    groupBy(columns) {
      if (Array.isArray(columns)) {
        this.groupByColumns = columns;
      } else {
        this.groupByColumns = [columns];
      }
      return this;
    }

    having(condition, ...params) {
      this.validateParameterCount(condition, params, 'HAVING');
      this.havingConditions.push(condition);
      this.havingParams.push(...params);
      return this;
    }

    orderBy(column, direction = 'ASC') {
      this.orderByClause = `${column} ${direction.toUpperCase()}`;
      return this;
    }

    limit(n) {
      if (!Number.isInteger(n) || n <= 0) {
        throw new Error('Invalid LIMIT value');
      }
      this.limitValue = n;
      return this;
    }

    offset(n) {
      if (!Number.isInteger(n) || n < 0) {
        throw new Error('Invalid OFFSET value');
      }
      this.offsetValue = n;
      return this;
    }

    build() {
      if (!this.tableName) {
        throw new Error('Table name not specified');
      }

      const parts = [];
      const params = [];

      // SELECT clause
      parts.push('SELECT');
      if (this.isDistinct) {
        parts.push('DISTINCT');
      }
      parts.push(this.selectColumns.join(', '));

      // FROM clause
      parts.push(`FROM ${this.tableName}`);
      if (this.tableAlias) {
        parts.push(`AS ${this.tableAlias}`);
      }

      // JOIN clauses
      this.joins.forEach(join => {
        const joinClause = `${join.type} JOIN ${join.table}${join.alias ? ` AS ${join.alias}` : ''} ON ${join.condition}`;
        parts.push(joinClause);
        params.push(...join.params);
      });

      // WHERE clause
      if (this.whereConditions.length > 0) {
        parts.push(`WHERE ${this.whereConditions.join(' AND ')}`);
        params.push(...this.whereParams);
      }

      // GROUP BY clause
      if (this.groupByColumns.length > 0) {
        parts.push(`GROUP BY ${this.groupByColumns.join(', ')}`);
      }

      // HAVING clause
      if (this.havingConditions.length > 0) {
        parts.push(`HAVING ${this.havingConditions.join(' AND ')}`);
        params.push(...this.havingParams);
      }

      // ORDER BY clause
      if (this.orderByClause) {
        parts.push(`ORDER BY ${this.orderByClause}`);
      }

      // LIMIT and OFFSET
      if (this.limitValue !== null) {
        parts.push(`LIMIT ${this.limitValue}`);
      }
      if (this.offsetValue !== null) {
        parts.push(`OFFSET ${this.offsetValue}`);
      }

      return {
        query: parts.join(' '),
        params
      };
    }
  }

  return new QueryBuilder();
}

module.exports = { createQueryBuilder };