class FinanceManager {
    constructor() {
        this.expenses = {};  // Format: { expenseId: { amount, category, date, description } }
        this.categoryBudgets = {};  // Format: { category: budgetAmount }
        this.validCategories = ['Food', 'Entertainment', 'Transport'];  // Predefined categories
    }

    addExpense(expenseId, amount, category, date, description) {
        if (typeof amount !== 'number' || amount <= 0 || !this.validCategories.includes(category) || !this.isValidDate(date)) {
            throw new Error("Invalid expense details");
        }

        if (this.expenses[expenseId]) {
            this.updateExpense(expenseId, { amount, category, date, description });
        } else {
            this.expenses[expenseId] = { amount, category, date, description };
        }
    }

    setCategoryBudget(category, budgetAmount) {
        if (!this.validCategories.includes(category)) {
            throw new Error("Invalid category");
        }

        if (typeof budgetAmount !== 'number' || budgetAmount <= 0) {
            throw new Error("Invalid budget amount");
        }

        this.categoryBudgets[category] = budgetAmount;
    }

    getExpenseHistory(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const expenses = [];

        for (const expenseId in this.expenses) {
            const expense = this.expenses[expenseId];
            const expenseDate = new Date(expense.date);

            if (expenseDate >= start && expenseDate <= end) {
                expenses.push({ expenseId, ...expense });
            }
        }

        return expenses;
    }

    generateMonthlyReport(year, month) {
        if (typeof year !== 'number' || typeof month !== 'number' || month < 1 || month > 12) {
            throw new Error("Invalid year or month");
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const expenses = this.getExpenseHistory(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
        const report = {};

        for (const expense of expenses) {
            if (!report[expense.category]) {
                report[expense.category] = 0;
            }

            report[expense.category] += expense.amount;
        }

        if (Object.keys(report).length === 0) {
            return "No expenses for this month";
        }

        return report;
    }

    updateExpense(expenseId, updatedDetails) {
        if (!this.expenses[expenseId]) {
            throw new Error("Expense not found");
        }

        if (updatedDetails.amount && (typeof updatedDetails.amount !== 'number' || updatedDetails.amount <= 0)) {
            throw new Error("Invalid expense details");
        }

        if (updatedDetails.category && !this.validCategories.includes(updatedDetails.category)) {
            throw new Error("Invalid category");
        }

        if (updatedDetails.date && !this.isValidDate(updatedDetails.date)) {
            throw new Error("Invalid expense details");
        }

        this.expenses[expenseId] = { ...this.expenses[expenseId], ...updatedDetails };
    }

    generateCategoryReport(category) {
        if (!this.validCategories.includes(category)) {
            throw new Error("Invalid category");
        }

        const expenses = Object.values(this.expenses).filter(expense => expense.category === category);

        if (expenses.length === 0) {
            throw new Error("No expenses in this category");
        }

        const totalAmount = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        const averageAmount = totalAmount / expenses.length;

        return { totalAmount, averageAmount, expenseCount: expenses.length };
    }

    isValidDate(date) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(date);
    }
}

module.exports = { FinanceManager };