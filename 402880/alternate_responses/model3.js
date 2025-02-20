function createQueryBuilder() {
  class QueryBuilder {
    #columns = ['*'];
    #table = '';
    #tableAlias = '';
    #isDistinct = false;
    #whereConditions = [];
    #whereParams = [];
    #joins = [];
    #joinParams = [];
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
      if (Array.isArray(columns)) {
        this.#columns = columns;
      }
      return this;
    }

    distinct() {
      this.#isDistinct = true;
      return this;
    }

    from(tableName) {
      const tableNameOnly = tableName.split(' ')[0];
      this.#validateIdentifier(tableNameOnly);
      this.#table = tableName;
      return this;
    }

    alias(aliasName) {
      if (!this.#table) {
        throw new Error('Table name not specified');
      }
      this.#validateIdentifier(aliasName);
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
      const validJoinTypes = ['INNER', 'LEFT', 'RIGHT', 'FULL'];
      if (!validJoinTypes.includes(type.toUpperCase())) {
        throw new Error('Invalid join type');
      }

      this.#validateIdentifier(table);
      if (alias) {
        this.#validateIdentifier(alias);
      }

      this.#validateParameterCount(onCondition, params, 'JOIN');
      this.#joins.push({
        type: type.toUpperCase(),
        table,
        alias,
        condition: onCondition
      });
      this.#joinParams.push(...params);
      return this;
    }

    groupBy(columns) {
      if (Array.isArray(columns)) {
        columns.forEach(col => {
          const colName = col.split('.').pop();
          this.#validateIdentifier(colName);
        });
        this.#groupByColumns = columns;
      }
      return this;
    }

    having(condition, ...params) {
      this.#validateParameterCount(condition, params, 'HAVING');
      this.#havingConditions.push(condition);
      this.#havingParams.push(...params);
      return this;
    }

    orderBy(column, direction = 'ASC') {
      const dir = direction.toUpperCase();
      if (dir !== 'ASC' && dir !== 'DESC') {
        throw new Error('Invalid sort direction');
      }
      this.#orderByColumns.push(`${column} ${dir}`);
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
      
      // SELECT clause
      parts.push(`SELECT ${this.#isDistinct ? 'DISTINCT ' : ''}${this.#columns.join(', ')}`);

      // FROM clause
      let fromClause = `FROM ${this.#table}`;
      if (this.#tableAlias) {
        fromClause += ` AS ${this.#tableAlias}`;
      }
      parts.push(fromClause);

      // JOIN clauses
      if (this.#joins.length > 0) {
        const joinClauses = this.#joins.map(join => {
          let clause = `${join.type} JOIN ${join.table}`;
          if (join.alias) {
            clause += ` AS ${join.alias}`;
          }
          clause += ` ON ${join.condition}`;
          return clause;
        });
        parts.push(joinClauses.join(' '));
      }

      // WHERE clause
      if (this.#whereConditions.length > 0) {
        parts.push(`WHERE ${this.#whereConditions.join(' AND ')}`);
      }

      // GROUP BY clause
      if (this.#groupByColumns.length > 0) {
        parts.push(`GROUP BY ${this.#groupByColumns.join(', ')}`);
      }

      // HAVING clause
      if (this.#havingConditions.length > 0) {
        parts.push(`HAVING ${this.#havingConditions.join(' AND ')}`);
      }

      // ORDER BY clause
      if (this.#orderByColumns.length > 0) {
        parts.push(`ORDER BY ${this.#orderByColumns.join(', ')}`);
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
        params: [...this.#whereParams, ...this.#joinParams, ...this.#havingParams]
      };
    }
  }

  return new QueryBuilder();
}

module.exports = { createQueryBuilder };