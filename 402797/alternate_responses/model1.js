function summarizeTransactions(transactions) {
    // Handle empty array case
    if (!transactions || transactions.length === 0) {
        return {
            totalIncome: 0,
            totalExpense: 0,
            netBalance: 0,
            categorySummary: {},
            dailySummary: {},
            highestExpenseCategory: null
        };
    }

    // Initialize accumulators
    const summary = transactions.reduce((acc, transaction) => {
        const { amount, category, date } = transaction;

        // Update total income and expense
        if (amount > 0) {
            acc.totalIncome += amount;
        } else {
            acc.totalExpense += amount;
        }

        // Update category summary
        acc.categorySummary[category] = (acc.categorySummary[category] || 0) + amount;

        // Update daily summary
        acc.dailySummary[date] = (acc.dailySummary[date] || 0) + amount;

        return acc;
    }, {
        totalIncome: 0,
        totalExpense: 0,
        categorySummary: {},
        dailySummary: {}
    });

    // Calculate net balance
    summary.netBalance = summary.totalIncome - Math.abs(summary.totalExpense);

    // Find highest expense category
    summary.highestExpenseCategory = Object.entries(summary.categorySummary)
        .reduce((highest, [category, amount]) => {
            if (amount < 0 && (!highest || Math.abs(amount) > Math.abs(summary.categorySummary[highest]))) {
                return category;
            }
            return highest;
        }, null);

    return summary;
}

module.exports = { summarizeTransactions };