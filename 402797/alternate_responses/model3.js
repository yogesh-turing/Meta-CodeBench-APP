function summarizeTransactions(transactions) {
    // Input validation
    if (!Array.isArray(transactions)) {
        throw new Error('Input must be an array of transactions');
    }

    // Initialize summary object
    const summary = {
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0,
        categorySummary: {},
        dailySummary: {},
        highestExpenseCategory: ''
    };

    // Return early if no transactions
    if (transactions.length === 0) {
        return summary;
    }

    // Process all transactions
    transactions.forEach(transaction => {
        // Validate transaction object
        if (!transaction.amount || !transaction.category || !transaction.date) {
            throw new Error('Invalid transaction format');
        }

        // Update income and expense totals
        if (transaction.amount > 0) {
            summary.totalIncome += transaction.amount;
        } else {
            summary.totalExpense += transaction.amount;
        }

        // Update category summary
        summary.categorySummary[transaction.category] = 
            (summary.categorySummary[transaction.category] || 0) + transaction.amount;

        // Update daily summary
        summary.dailySummary[transaction.date] = 
            (summary.dailySummary[transaction.date] || 0) + transaction.amount;
    });

    // Calculate net balance
    summary.netBalance = summary.totalIncome - Math.abs(summary.totalExpense);

    // Find highest expense category
    let maxExpense = 0;
    for (const [category, amount] of Object.entries(summary.categorySummary)) {
        if (amount < 0 && Math.abs(amount) > maxExpense) {
            maxExpense = Math.abs(amount);
            summary.highestExpenseCategory = category;
        }
    }

    return summary;
}

module.exports = { summarizeTransactions };