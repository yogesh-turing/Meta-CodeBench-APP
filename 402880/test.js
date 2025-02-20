const { createQueryBuilder } = require('./solution');

describe('createQueryBuilder', () => {
  // 1. Missing FROM Clause
  test('throws error if FROM clause is missing', () => {
    expect(() => createQueryBuilder().select(['id']).build()).toThrow("Table name not specified");
  });

  // 2. Default SELECT clause
  test('defaults to "*" when select() is not called', () => {
    const { query, params } = createQueryBuilder().from('users').build();
    expect(query).toMatch(/^SELECT \* FROM users/);
    expect(params).toEqual([]);
  });

  // 3. DISTINCT behavior when select() is not called
  test('defaults to "DISTINCT *" when distinct() is called and select() is not provided', () => {
    const { query, params } = createQueryBuilder().distinct().from('users').build();
    expect(query).toMatch(/^SELECT DISTINCT \* FROM users/);
    expect(params).toEqual([]);
  });

  // 4. Valid alias for main table
  test('accepts valid alias for main table', () => {
    const { query } = createQueryBuilder().select(['id']).from('users').alias('u_main').build();
    expect(query).toContain('AS u_main');
  });

  // 5. Invalid main table alias
  test('throws error for invalid table alias', () => {
    expect(() => createQueryBuilder().select(['id']).from('users').alias('123invalid').build()).toThrow("Invalid table alias");
  });

  // 6. WHERE clause parameter count mismatch
  test('throws error if parameter count mismatch in WHERE clause', () => {
    // Condition expects 2 parameters but only 1 is provided.
    expect(() => createQueryBuilder().select(['id']).from('users').where('age > ? AND status = ?', 30).build()).toThrow("Parameter count mismatch in WHERE clause");
  });

  // 7. HAVING clause parameter count mismatch
  test('throws error if parameter count mismatch in HAVING clause', () => {
    expect(() => createQueryBuilder().select(['COUNT(*)']).from('users').groupBy(['id']).having('COUNT(*) > ? AND COUNT(*) < ?', 10).build()).toThrow("Parameter count mismatch in HAVING clause");
  });

  // 8. Invalid join type
  test('throws error for invalid join type', () => {
    expect(() => createQueryBuilder().select(['id']).from('users').join('INVALID', 'orders', 'o', 'o.user_id = users.id').build()).toThrow("Invalid join type");
  });

  // 9. Invalid join table name
  test('throws error for invalid join table name', () => {
    expect(() => createQueryBuilder().select(['id']).from('users').join('LEFT', '123orders', 'o', 'o.user_id = users.id').build()).toThrow("Invalid table name");
  });

  // 10. Invalid join alias
  test('throws error for invalid join alias', () => {
    expect(() => createQueryBuilder().select(['id']).from('users').join('LEFT', 'orders', '456alias', 'o.user_id = users.id').build()).toThrow("Invalid join alias");
  });

  // 11. Invalid LIMIT value
  test('throws error for invalid LIMIT value', () => {
    expect(() => createQueryBuilder().select(['id']).from('users').limit(0).build()).toThrow("Invalid LIMIT value");
  });

  // 12. Invalid OFFSET value
  test('throws error for invalid OFFSET value', () => {
    expect(() => createQueryBuilder().select(['id']).from('users').offset(-5).build()).toThrow("Invalid OFFSET value");
  });

  // 13. Invalid SQL identifier in table name
  test('throws error for invalid SQL identifier in table name', () => {
    expect(() => createQueryBuilder().select(['id']).from('users-1').build()).toThrow("Invalid SQL identifier: users-1");
  });

  // 14. Invalid SQL identifier in select column
  test('throws error for invalid SQL identifier in select column', () => {
    expect(() => createQueryBuilder().select(['1invalid']).from('users').build()).toThrow("Invalid SQL identifier: 1invalid");
  });

  // 15. Build a complete query with all clauses
  test('builds a complete query with all clauses', () => {
    const { query, params } = createQueryBuilder()
      .select(['u.id', 'u.name', 'COUNT(o.id) AS order_count'])
      .distinct()
      .from('users u')
      .alias('u_main')
      .join('LEFT', 'orders', 'o', 'o.user_id = u.id')
      .where('u.status = ?', 'active')
      .groupBy(['u.id', 'u.name'])
      .having('order_count > ?', 10)
      .orderBy('u.name', 'ASC')
      .limit(20)
      .offset(10)
      .build();

    expect(query).toMatch(/SELECT DISTINCT/);
    expect(query).toMatch(/FROM users u/);
    expect(query).toMatch(/JOIN orders o ON o\.user_id = u\.id/);
    expect(query).toMatch(/WHERE u\.status = \?/);
    expect(query).toMatch(/GROUP BY u\.id, u\.name/);
    expect(query).toMatch(/HAVING order_count > \?/);
    expect(query).toMatch(/ORDER BY u\.name ASC/);
    expect(query).toMatch(/LIMIT 20/);
    expect(query).toMatch(/OFFSET 10/);
    expect(params).toEqual(['active', 10]);
  });

  // 16. Multiple where clauses combined with AND
  test('combines multiple where() calls with AND', () => {
    const { query, params } = createQueryBuilder()
      .select(['id'])
      .from('users')
      .where('age > ?', 30)
      .where('status = ?', 'active')
      .build();
    expect(query).toMatch(/WHERE age > \? AND status = \?/);
    expect(params).toEqual([30, 'active']);
  });
});