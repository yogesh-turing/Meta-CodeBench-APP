// Function to process and summarize an array of transactions
function summarizeTransactions(transactions) {
  let totalIncome = 0;
  let totalExpense = 0;
  const categorySummary = {};
  const dailySummary = {};

  transactions.forEach((transaction) => {
    if (transaction.amount > 0) {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }

    if (!categorySummary[transaction.category]) {
      categorySummary[transaction.category] = 0;
    }
    categorySummary[transaction.category] += transaction.amount;

    if (!dailySummary[transaction.date]) {
      dailySummary[transaction.date] = 0;
    }
    dailySummary[transaction.date] += transaction.amount;
  });

  const netBalance = totalIncome - Math.abs(totalExpense);

  const highestExpenseCategory = Object.keys(categorySummary).reduce((a, b) => {
    if (categorySummary[a] < categorySummary[b]) {
      return a;
    } else {
      return b;
    }
  });

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