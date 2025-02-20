function summarizeTransactions(transactions) {
  const summary = {
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    categorySummary: {},
    dailySummary: {},
    highestExpenseCategory: null,
  };

  // Calculate total income, total expense, and net balance
  transactions.forEach((transaction) => {
    if (transaction.amount > 0) {
      summary.totalIncome += transaction.amount;
    } else {
      summary.totalExpense += transaction.amount;
    }
  });
  summary.netBalance = summary.totalIncome - Math.abs(summary.totalExpense);

  // Calculate category summary
  transactions.forEach((transaction) => {
    const category = transaction.category;
    if (!summary.categorySummary[category]) {
      summary.categorySummary[category] = 0;
    }
    summary.categorySummary[category] += transaction.amount;
  });

  // Calculate daily summary
  transactions.forEach((transaction) => {
    const date = transaction.date;
    if (!summary.dailySummary[date]) {
      summary.dailySummary[date] = 0;
    }
    summary.dailySummary[date] += transaction.amount;
  });

  // Find highest expense category
  let highestExpense = 0;
  transactions.forEach((transaction) => {
    if (transaction.amount < 0 && Math.abs(transaction.amount) > highestExpense) {
      highestExpense = Math.abs(transaction.amount);
      summary.highestExpenseCategory = transaction.category;
    }
  });

  return summary;
}

module.exports = { summarizeTransactions };