function createQueryBuilder() {
  class QueryBuilder {
    #columns = ['*'];
    #isDistinct = false;
    #table = '';
    #tableAlias = '';
    #joins = [];
    #whereConditions = [];
    #whereParams = [];
    #groupByColumns = [];
    #havingConditions = [];
    #havingParams = [];
    #orderByColumns = [];
    #limitValue = null;
    #offsetValue = null;

    #validateIdentifier(identifier) {
      const pattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;
      if (!pattern.test(identifier)) {
        throw new Error(`Invalid SQL identifier: ${identifier}`);
      }
    }

    #validateParameterCount(condition, params, clause) {
      const placeholderCount = (condition.match(/\?/g) || []).length;
      if (placeholderCount !== params.length) {
        throw new Error(`Parameter count mismatch in ${clause} clause`);
      }
    }

    select(columns) {
      if (columns) {
        this.#columns = Array.isArray(columns) ? columns : [columns];
      }
      return this;
    }

    distinct() {
      this.#isDistinct = true;
      return this;
    }

    from(tableName) {
      if (!tableName) {
        throw new Error('Table name not specified');
      }
      const baseTableName = tableName.split(' ')[0];
      this.#validateIdentifier(baseTableName);
      this.#table = tableName;
      return this;
    }

    alias(aliasName) {
      if (!aliasName || !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(aliasName)) {
        throw new Error('Invalid table alias');
      }
      this.#tableAlias = aliasName;
      return this;
    }

    where(condition, ...params) {
      this.#validateParameterCount(condition, params, 'WHERE');
      this.#whereConditions.push(condition);
      this.#whereParams.push(...params);
      return this;
    }

    join(type, table, alias, onCondition, ...params) {
      const validTypes = ['INNER', 'LEFT', 'RIGHT', 'FULL'];
      if (!validTypes.includes(type.toUpperCase())) {
        throw new Error('Invalid join type');
      }
      
      this.#validateIdentifier(table);
      this.#validateIdentifier(alias);
      
      this.#validateParameterCount(onCondition, params, 'JOIN');
      
      this.#joins.push({
        type: type.toUpperCase(),
        table,
        alias,
        condition: onCondition,
        params
      });
      return this;
    }

    groupBy(columns) {
      this.#groupByColumns = Array.isArray(columns) ? columns : [columns];
      return this;
    }

    having(condition, ...params) {
      this.#validateParameterCount(condition, params, 'HAVING');
      this.#havingConditions.push(condition);
      this.#havingParams.push(...params);
      return this;
    }

    orderBy(column, direction = 'ASC') {
      this.#orderByColumns.push({
        column,
        direction: direction.toUpperCase()
      });
      return this;
    }

    limit(n) {
      if (!Number.isInteger(n) || n <= 0) {
        throw new Error('Invalid LIMIT value');
      }
      this.#limitValue = n;
      return this;
    }

    offset(n) {
      if (!Number.isInteger(n) || n < 0) {
        throw new Error('Invalid OFFSET value');
      }
      this.#offsetValue = n;
      return this;
    }

    build() {
      if (!this.#table) {
        throw new Error('Table name not specified');
      }

      const parts = [];
      const params = [];

      // SELECT clause
      parts.push(`SELECT ${this.#isDistinct ? 'DISTINCT ' : ''}${this.#columns.join(', ')}`);

      // FROM clause
      let fromClause = `FROM ${this.#table}`;
      if (this.#tableAlias) {
        fromClause += ` AS ${this.#tableAlias}`;
      }
      parts.push(fromClause);

      // JOIN clauses
      for (const join of this.#joins) {
        parts.push(`${join.type} JOIN ${join.table} ${join.alias} ON ${join.condition}`);
        params.push(...join.params);
      }

      // WHERE clause
      if (this.#whereConditions.length > 0) {
        parts.push(`WHERE ${this.#whereConditions.join(' AND ')}`);
        params.push(...this.#whereParams);
      }

      // GROUP BY clause
      if (this.#groupByColumns.length > 0) {
        parts.push(`GROUP BY ${this.#groupByColumns.join(', ')}`);
      }

      // HAVING clause
      if (this.#havingConditions.length > 0) {
        parts.push(`HAVING ${this.#havingConditions.join(' AND ')}`);
        params.push(...this.#havingParams);
      }

      // ORDER BY clause
      if (this.#orderByColumns.length > 0) {
        const orderByParts = this.#orderByColumns.map(
          ({ column, direction }) => `${column} ${direction}`
        );
        parts.push(`ORDER BY ${orderByParts.join(', ')}`);
      }

      // LIMIT and OFFSET
      if (this.#limitValue !== null) {
        parts.push(`LIMIT ${this.#limitValue}`);
      }
      if (this.#offsetValue !== null) {
        parts.push(`OFFSET ${this.#offsetValue}`);
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