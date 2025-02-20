function summarizeTransactions(transactions) {
  if (!Array.isArray(transactions)) {
    throw new Error('Invalid input: transactions must be an array');
  }

  let totalIncome = 0;
  let totalExpense = 0;
  let categorySummary = {};
  let dailySummary = {};
  let highestExpenseCategory = null;
  let highestExpenseValue = Number.NEGATIVE_INFINITY;

  for (const transaction of transactions) {
    if (
      !transaction ||
      typeof transaction.id !== 'string' ||
      typeof transaction.amount !== 'number' ||
      typeof transaction.category !== 'string' ||
      typeof transaction.date !== 'string'
    ) {
      throw new Error('Invalid transaction format');
    }

    const { amount, category, date } = transaction;

    // Update income and expense totals
    if (amount > 0) {
      totalIncome += amount;
    } else {
      totalExpense += amount;
    }

    // Update category summary
    categorySummary[category] = (categorySummary[category] || 0) + amount;

    // Update daily summary
    dailySummary[date] = (dailySummary[date] || 0) + amount;

    // Track the highest absolute expense category
    if (
      amount < 0 &&
      Math.abs(categorySummary[category]) > highestExpenseValue
    ) {
      highestExpenseValue = Math.abs(categorySummary[category]);
      highestExpenseCategory = category;
    }
  }

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - Math.abs(totalExpense),
    categorySummary,
    dailySummary,
    highestExpenseCategory,
  };
}

module.exports = { summarizeTransactions };