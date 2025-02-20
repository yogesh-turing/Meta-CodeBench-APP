function summarizeTransactions(transactions) {
    let totalIncome = 0;
    let totalExpense = 0;
    let categorySummary = {};
    let dailySummary = {};

    transactions.forEach(transaction => {
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
    });

    let netBalance = totalIncome - Math.abs(totalExpense);

    let highestExpenseCategory = Object.keys(categorySummary).reduce((a, b) => {
        return categorySummary[a] < categorySummary[b] ? a : b;
    });

    return {
        totalIncome,
        totalExpense,
        netBalance,
        categorySummary,
        dailySummary,
        highestExpenseCategory
    };
}

module.exports = { summarizeTransactions };