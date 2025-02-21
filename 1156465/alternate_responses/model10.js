class FinanceManager {
    constructor() {
        this.expenses = {};  // Format: { expenseId: { amount, category, date, description } }
        this.categoryBudgets = {};  // Format: { category: budgetAmount }
        this.validCategories = ['Food', 'Entertainment', 'Transport'];  // Predefined categories
    }

    addExpense(expenseId, amount, category, date, description) {
        // Validate expense details
        if (amount <= 0 || !this.validCategories.includes(category) || !this.isValidDate(date)) {
            throw new Error("Invalid expense details");
        }

        // Store the expense details
        this.expenses[expenseId] = {
            amount,
            category,
            date,
            description
        };
    }

    setCategoryBudget(category, budgetAmount) {
        // Validate category and budget amount
        if (!this.validCategories.includes(category) || budgetAmount <= 0) {
            throw new Error("Invalid budget amount");
        }

        // Store the budget for the specified category
        this.categoryBudgets[category] = budgetAmount;
    }

    getExpenseHistory(startDate, endDate) {
        // Validate date range
        if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
            throw new Error("Invalid date range");
        }

        // Filter expenses by date range
        const expensesInRange = Object.values(this.expenses).filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
        });

        return expensesInRange;
    }

    generateMonthlyReport(year, month) {
        // Validate year and month
        if (year < 1 || month < 1 || month > 12) {
            throw new Error("Invalid year or month");
        }

        // Filter expenses by month and year
        const expensesInMonth = Object.values(this.expenses).filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getFullYear() === year && expenseDate.getMonth() + 1 === month;
        });

        // Calculate total expenses for each category
        const categoryTotals = {};
        expensesInMonth.forEach(expense => {
            const category = expense.category;
            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }
            categoryTotals[category] += expense.amount;
        });

        // Return category totals or "No expenses for this month" message
        return Object.keys(categoryTotals).length > 0 ? categoryTotals : "No expenses for this month";
    }

    updateExpense(expenseId, updatedDetails) {
        // Validate expenseId
        if (!this.expenses[expenseId]) {
            throw new Error("Expense not found");
        }

        // Update expense details
        Object.assign(this.expenses[expenseId], updatedDetails);
    }

    generateCategoryReport(category) {
        // Validate category
        if (!this.validCategories.includes(category)) {
            throw new Error("Invalid category");
        }

        // Filter expenses by category
        const expensesInCategory = Object.values(this.expenses).filter(expense => expense.category === category);

        // Calculate total amount, average amount, and expense count
        const totalAmount = expensesInCategory.reduce((acc, expense) => acc + expense.amount, 0);
        const averageAmount = expensesInCategory.length > 0 ? totalAmount / expensesInCategory.length : 0;
        const expenseCount = expensesInCategory.length;

        // Return category report or "No expenses in this category" message
        return expenseCount > 0 ? { totalAmount, averageAmount, expenseCount } : "No expenses in this category";
    }

    isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateString;
    }
}

module.exports = { FinanceManager };