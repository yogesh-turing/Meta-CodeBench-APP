// Function to process and summarize an array of transactions
function summarizeTransactions(transactions) {
  // Initialize variables to hold summary values
  let totalIncome = 0;
  let totalExpense = 0;
  const categorySummary = {};
  const dailySummary = {};

  // Loop through each transaction to calculate summaries
  transactions.forEach((transaction) => {
    const { amount, category, date } = transaction;

    // Update total income or expense
    if (amount > 0) {
      totalIncome += amount;
    } else {
      totalExpense += amount;
    }

    // Update category summary
    if (!categorySummary[category]) {
      categorySummary[category] = 0;
    }
    categorySummary[category] += amount;

    // Update daily summary
    if (!dailySummary[date]) {
      dailySummary[date] = 0;
    }
    dailySummary[date] += amount;
  });

  // Calculate net balance
  const netBalance = totalIncome - Math.abs(totalExpense);

  // Find the category with the highest absolute expense
  let highestExpenseCategory = null;
  let highestExpense = 0;
  Object.keys(categorySummary).forEach((category) => {
    const expense = Math.abs(categorySummary[category]);
    if (expense > highestExpense) {
      highestExpense = expense;
      highestExpenseCategory = category;
    }
  });

  // Return the summary object
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