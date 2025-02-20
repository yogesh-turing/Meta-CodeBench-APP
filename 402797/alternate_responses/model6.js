function summarizeTransactions(transactions) {
  let totalIncome = 0;
  let totalExpense = 0;
  const categorySummary = {};
  const dailySummary = {};

  for (const transaction of transactions) {
    if (transaction.amount > 0) {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }

    if (categorySummary[transaction.category]) {
      categorySummary[transaction.category] += transaction.amount;
    } else {
      categorySummary[transaction.category] = transaction.amount;
    }

    if (dailySummary[transaction.date]) {
      dailySummary[transaction.date] += transaction.amount;
    } else {
      dailySummary[transaction.date] = transaction.amount;
    }
  }

  const netBalance = totalIncome - Math.abs(totalExpense);

  let highestExpenseCategory = null;
  let highestExpense = 0;
  for (const category in categorySummary) {
    if (categorySummary[category] < 0 && Math.abs(categorySummary[category]) > highestExpense) {
      highestExpenseCategory = category;
      highestExpense = Math.abs(categorySummary[category]);
    }
  }

  return {
    totalIncome,
    totalExpense,
    netBalance,
    categorySummary,
    dailySummary,
    highestExpenseCategory,
  };
}

module.exports = { summarizeTransactions };