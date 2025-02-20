const { summarizeTransactions } = require('./solution.js');

describe('summarizeTransactions', () => {
  test('should return correct summary for mixed income and expenses', () => {
    const transactions = [
      { id: 't1', amount: 500, category: 'salary', date: '2024-02-01' },
      { id: 't2', amount: -50, category: 'groceries', date: '2024-02-01' },
      { id: 't3', amount: -20, category: 'transport', date: '2024-02-02' },
      { id: 't4', amount: -100, category: 'entertainment', date: '2024-02-02' },
      { id: 't5', amount: -10, category: 'groceries', date: '2024-02-02' },
    ];
    const result = summarizeTransactions(transactions);

    expect(result).toMatchObject({
      totalIncome: 500,
      totalExpense: -180,
      netBalance: 320,
      categorySummary: {
        salary: 500,
        groceries: -60,
        transport: -20,
        entertainment: -100,
      },
      dailySummary: {
        '2024-02-01': 450,
        '2024-02-02': -130,
      },
    });

    expect(result.highestExpenseCategory).toBe('entertainment');
  });

  test('should return correct summary for only income transactions', () => {
    const transactions = [
      { id: 't1', amount: 1000, category: 'salary', date: '2024-02-01' },
      { id: 't2', amount: 200, category: 'bonus', date: '2024-02-02' },
    ];
    const result = summarizeTransactions(transactions);

    expect(result).toMatchObject({
      totalIncome: 1200,
      totalExpense: 0,
      netBalance: 1200,
      categorySummary: {
        salary: 1000,
        bonus: 200,
      },
      dailySummary: {
        '2024-02-01': 1000,
        '2024-02-02': 200,
      },
    });

    expect(
      result.highestExpenseCategory === null ||
        result.highestExpenseCategory === ''
    ).toBe(true);
  });

  test('should return correct summary for only expense transactions', () => {
    const transactions = [
      { id: 't1', amount: -100, category: 'food', date: '2024-02-01' },
      { id: 't2', amount: -200, category: 'rent', date: '2024-02-02' },
    ];
    const result = summarizeTransactions(transactions);

    expect(result).toMatchObject({
      totalIncome: 0,
      totalExpense: -300,
      netBalance: -300,
      categorySummary: {
        food: -100,
        rent: -200,
      },
      dailySummary: {
        '2024-02-01': -100,
        '2024-02-02': -200,
      },
    });

    expect(result.highestExpenseCategory).toBe('rent');
  });

  test('should return empty summary for an empty transaction list', () => {
    const result = summarizeTransactions([]);

    expect(result).toMatchObject({
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
      categorySummary: {},
      dailySummary: {},
    });

    expect(
      result.highestExpenseCategory === null ||
        result.highestExpenseCategory === ''
    ).toBe(true);
  });

  test('should correctly handle multiple transactions on the same date', () => {
    const transactions = [
      { id: 't1', amount: 100, category: 'salary', date: '2024-02-01' },
      { id: 't2', amount: 50, category: 'bonus', date: '2024-02-01' },
      { id: 't3', amount: -30, category: 'groceries', date: '2024-02-01' },
    ];
    const result = summarizeTransactions(transactions);

    expect(result).toMatchObject({
      totalIncome: 150,
      totalExpense: -30,
      netBalance: 120,
      categorySummary: {
        salary: 100,
        bonus: 50,
        groceries: -30,
      },
      dailySummary: {
        '2024-02-01': 120,
      },
    });

    expect(result.highestExpenseCategory).toBe('groceries');
  });

  test('should correctly handle transactions with zero values', () => {
    const transactions = [
      { id: 't1', amount: 0, category: 'salary', date: '2024-02-01' },
      { id: 't2', amount: 0, category: 'bonus', date: '2024-02-02' },
    ];
    const result = summarizeTransactions(transactions);

    expect(result).toMatchObject({
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
      categorySummary: {
        salary: 0,
        bonus: 0,
      },
      dailySummary: {
        '2024-02-01': 0,
        '2024-02-02': 0,
      },
    });

    expect(
      result.highestExpenseCategory === null ||
        result.highestExpenseCategory === ''
    ).toBe(true);
  });

  test('should correctly handle transactions with duplicate categories', () => {
    const transactions = [
      { id: 't1', amount: -100, category: 'food', date: '2024-02-01' },
      { id: 't2', amount: -50, category: 'food', date: '2024-02-02' },
      { id: 't3', amount: -30, category: 'food', date: '2024-02-03' },
    ];
    const result = summarizeTransactions(transactions);

    expect(result).toMatchObject({
      totalIncome: 0,
      totalExpense: -180,
      netBalance: -180,
      categorySummary: {
        food: -180,
      },
      dailySummary: {
        '2024-02-01': -100,
        '2024-02-02': -50,
        '2024-02-03': -30,
      },
    });

    expect(result.highestExpenseCategory).toBe('food');
  });

  test('should correctly handle transactions with duplicate dates', () => {
    const transactions = [
      { id: 't1', amount: -20, category: 'food', date: '2024-02-01' },
      { id: 't2', amount: -30, category: 'transport', date: '2024-02-01' },
      { id: 't3', amount: -10, category: 'groceries', date: '2024-02-01' },
    ];
    const result = summarizeTransactions(transactions);

    expect(result).toMatchObject({
      totalIncome: 0,
      totalExpense: -60,
      netBalance: -60,
      categorySummary: {
        food: -20,
        transport: -30,
        groceries: -10,
      },
      dailySummary: {
        '2024-02-01': -60,
      },
    });

    expect(result.highestExpenseCategory).toBe('transport');
  });
});