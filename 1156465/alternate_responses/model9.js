class FinanceManager {
    constructor() {
        this.expenses = {};  // Format: { expenseId: { amount, category, date, description } }
        this.categoryBudgets = {};  // Format: { category: budgetAmount }
        this.validCategories = ['Food', 'Entertainment', 'Transport'];  // Predefined categories
    }

    addExpense(expenseId, amount, category, date, description) {
        if (amount <= 0 || !this.validCategories.includes(category) || !this.isValidDate(date)) {
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

        if (budgetAmount <= 0) {
            throw new Error("Invalid budget amount");
        }

        this.categoryBudgets[category] = budgetAmount;
    }

    getExpenseHistory(startDate, endDate) {
        if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
            throw new Error("Invalid date range");
        }

        const expenses = Object.values(this.expenses);
        const filteredExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return expenseDate >= start && expenseDate <= end;
        });

        return filteredExpenses;
    }

    generateMonthlyReport(year, month) {
        if (month < 1 || month > 12 || year < 1) {
            throw new Error("Invalid year or month");
        }

        const expenses = Object.values(this.expenses);
        const filteredExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getFullYear() === year && expenseDate.getMonth() + 1 === month;
        });

        if (filteredExpenses.length === 0) {
            throw new Error("No expenses for this month");
        }

        const report = {};
        filteredExpenses.forEach(expense => {
            if (!report[expense.category]) {
                report[expense.category] = 0;
            }
            report[expense.category] += expense.amount;
        });

        return report;
    }

    updateExpense(expenseId, updatedDetails) {
        if (!this.expenses[expenseId]) {
            throw new Error("Expense not found");
        }

        if (updatedDetails.amount && updatedDetails.amount <= 0) {
            throw new Error("Invalid expense details");
        }

        if (updatedDetails.category && !this.validCategories.includes(updatedDetails.category)) {
            throw new Error("Invalid category");
        }

        if (updatedDetails.date && !this.isValidDate(updatedDetails.date)) {
            throw new Error("Invalid expense details");
        }

        Object.assign(this.expenses[expenseId], updatedDetails);
    }

    generateCategoryReport(category) {
        if (!this.validCategories.includes(category)) {
            throw new Error("Invalid category");
        }

        const expenses = Object.values(this.expenses);
        const filteredExpenses = expenses.filter(expense => expense.category === category);

        if (filteredExpenses.length === 0) {
            throw new Error("No expenses in this category");
        }

        const totalAmount = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
        const averageAmount = totalAmount / filteredExpenses.length;
        const expenseCount = filteredExpenses.length;

        return { totalAmount, averageAmount, expenseCount };
    }

    isValidDate(date) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(date);
    }
}

module.exports = { FinanceManager };