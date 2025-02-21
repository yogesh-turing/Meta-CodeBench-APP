class FinanceManager {
    constructor() {
        this.expenses = {};  // Format: { expenseId: { amount, category, date, description } }
        this.categoryBudgets = {};  // Format: { category: budgetAmount }
        this.validCategories = ['Food', 'Entertainment', 'Transport'];  // Predefined categories
    }

    addExpense(expenseId, amount, category, date, description) {
        if (amount <= 0 || typeof amount !== 'number') {
            throw new Error("Invalid expense details");
        }

        if (!this.validCategories.includes(category)) {
            throw new Error("Invalid category");
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
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

        if (budgetAmount <= 0 || typeof budgetAmount !== 'number') {
            throw new Error("Invalid budget amount");
        }

        this.categoryBudgets[category] = budgetAmount;
    }

    getExpenseHistory(startDate, endDate) {
        const startDateTime = new Date(startDate).getTime();
        const endDateTime = new Date(endDate).getTime();

        const expenseHistory = Object.values(this.expenses).filter(expense => {
            const expenseDateTime = new Date(expense.date).getTime();
            return expenseDateTime >= startDateTime && expenseDateTime <= endDateTime;
        });

        return expenseHistory;
    }

    generateMonthlyReport(year, month) {
        if (month < 1 || month > 12 || year < 1) {
            throw new Error("Invalid year or month");
        }

        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;

        const expenseHistory = this.getExpenseHistory(startDate, endDate);

        if (expenseHistory.length === 0) {
            return "No expenses for this month";
        }

        const categoryExpenses = {};

        expenseHistory.forEach(expense => {
            if (!categoryExpenses[expense.category]) {
                categoryExpenses[expense.category] = 0;
            }
            categoryExpenses[expense.category] += expense.amount;
        });

        return categoryExpenses;
    }

    updateExpense(expenseId, updatedDetails) {
        if (!this.expenses[expenseId]) {
            throw new Error("Expense not found");
        }

        if (updatedDetails.amount && (updatedDetails.amount <= 0 || typeof updatedDetails.amount !== 'number')) {
            throw new Error("Invalid expense details");
        }

        if (updatedDetails.category && !this.validCategories.includes(updatedDetails.category)) {
            throw new Error("Invalid category");
        }

        if (updatedDetails.date) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(updatedDetails.date)) {
                throw new Error("Invalid expense details");
            }
        }

        this.expenses[expenseId] = { ...this.expenses[expenseId], ...updatedDetails };
    }

    generateCategoryReport(category) {
        if (!this.validCategories.includes(category)) {
            throw new Error("Invalid category");
        }

        const categoryExpenses = Object.values(this.expenses).filter(expense => expense.category === category);

        if (categoryExpenses.length === 0) {
            return "No expenses in this category";
        }

        const totalAmount = categoryExpenses.reduce((total, expense) => total + expense.amount, 0);
        const averageAmount = totalAmount / categoryExpenses.length;

        return {
            totalAmount,
            averageAmount,
            expenseCount: categoryExpenses.length
        };
    }
}

module.exports = { FinanceManager };