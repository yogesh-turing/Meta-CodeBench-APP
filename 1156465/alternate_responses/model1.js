class FinanceManager {
    constructor() {
        this.expenses = {};  // Format: { expenseId: { amount, category, date, description } }
        this.categoryBudgets = {};  // Format: { category: budgetAmount }
        this.validCategories = ['Food', 'Entertainment', 'Transport'];
    }

    validateDate(dateStr) {
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date) && dateStr.match(/^\d{4}-\d{2}-\d{2}$/);
    }

    addExpense(expenseId, amount, category, date, description) {
        if (!amount || amount <= 0 || !this.validateDate(date)) {
            throw new Error("Invalid expense details");
        }
        
        if (!this.validCategories.includes(category)) {
            throw new Error("Invalid category");
        }

        this.expenses[expenseId] = {
            amount,
            category,
            date,
            description
        };
    }

    setCategoryBudget(category, budgetAmount) {
        if (!this.validCategories.includes(category)) {
            throw new Error("Invalid category");
        }

        if (!budgetAmount || budgetAmount <= 0) {
            throw new Error("Invalid budget amount");
        }

        this.categoryBudgets[category] = budgetAmount;
    }

    getExpenseHistory(startDate, endDate) {
        if (!this.validateDate(startDate) || !this.validateDate(endDate)) {
            throw new Error("Invalid expense details");
        }

        return Object.entries(this.expenses)
            .filter(([_, expense]) => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
            })
            .map(([expenseId, expense]) => ({
                expenseId,
                ...expense
            }));
    }

    generateMonthlyReport(year, month) {
        if (!Number.isInteger(year) || month < 1 || month > 12) {
            throw new Error("Invalid year or month");
        }

        const monthlyExpenses = Object.values(this.expenses)
            .filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getFullYear() === year && expenseDate.getMonth() + 1 === month;
            });

        if (monthlyExpenses.length === 0) {
            throw new Error("No expenses for this month");
        }

        const report = {};
        this.validCategories.forEach(category => {
            const total = monthlyExpenses
                .filter(expense => expense.category === category)
                .reduce((sum, expense) => sum + expense.amount, 0);
            if (total > 0) {
                report[category] = total;
            }
        });

        return report;
    }

    updateExpense(expenseId, updatedDetails) {
        if (!this.expenses[expenseId]) {
            throw new Error("Expense not found");
        }

        const currentExpense = this.expenses[expenseId];
        const newAmount = updatedDetails.amount ?? currentExpense.amount;
        const newCategory = updatedDetails.category ?? currentExpense.category;
        const newDate = updatedDetails.date ?? currentExpense.date;
        const newDescription = updatedDetails.description ?? currentExpense.description;

        if (newAmount <= 0 || (newDate && !this.validateDate(newDate))) {
            throw new Error("Invalid expense details");
        }

        if (newCategory && !this.validCategories.includes(newCategory)) {
            throw new Error("Invalid category");
        }

        this.expenses[expenseId] = {
            amount: newAmount,
            category: newCategory,
            date: newDate,
            description: newDescription
        };
    }

    generateCategoryReport(category) {
        if (!this.validCategories.includes(category)) {
            throw new Error("Invalid category");
        }

        const categoryExpenses = Object.values(this.expenses)
            .filter(expense => expense.category === category);

        if (categoryExpenses.length === 0) {
            throw new Error("No expenses in this category");
        }

        const totalAmount = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const expenseCount = categoryExpenses.length;
        const averageAmount = totalAmount / expenseCount;

        return {
            totalAmount,
            averageAmount,
            expenseCount
        };
    }
}

module.exports = { FinanceManager };