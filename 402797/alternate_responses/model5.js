function summarizeTransactions(transactions) {
  // Input validation
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
      categorySummary: {},
      dailySummary: {},
      highestExpenseCategory: null
    };
  }

  // Calculate total income and expense
  const { income, expense } = transactions.reduce((acc, transaction) => {
    if (transaction.amount > 0) {
      acc.income += transaction.amount;
    } else {
      acc.expense += transaction.amount;
    }
    return acc;
  }, { income: 0, expense: 0 });

  // Create category summary
  const categorySummary = transactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  // Create daily summary
  const dailySummary = transactions.reduce((acc, transaction) => {
    acc[transaction.date] = (acc[transaction.date] || 0) + transaction.amount;
    return acc;
  }, {});

  // Find highest expense category
  const expenseCategories = Object.entries(categorySummary)
    .filter(([_, amount]) => amount < 0);
  
  const highestExpenseCategory = expenseCategories.length > 0
    ? expenseCategories.reduce((max, current) => 
        Math.abs(current[1]) > Math.abs(max[1]) ? current : max
      )[0]
    : null;

  return {
    totalIncome: income,
    totalExpense: expense,
    netBalance: income - Math.abs(expense),
    categorySummary,
    dailySummary,
    highestExpenseCategory
  };
}

module.exports = { summarizeTransactions };