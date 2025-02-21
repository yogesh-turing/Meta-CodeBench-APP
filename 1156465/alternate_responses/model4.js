class FinanceManager {
    constructor() {
        this.expenses = {};  // Format: { expenseId: { amount, category, date, description } }
        this.categoryBudgets = {};  // Format: { category: budgetAmount }
        this.validCategories = ['Food', 'Entertainment', 'Transport'];  // Predefined categories
    }

    // Helper method to validate date format
    validateDate(dateStr) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateStr)) return false;
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date);
    }

    addExpense(expenseId, amount, category, date, description) {
        if (!expenseId || typeof amount !== 'number' || amount <= 0 || !this.validateDate(date)) {
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

        if (typeof budgetAmount !== 'number' || budgetAmount <= 0) {
            throw new Error("Invalid budget amount");
        }

        this.categoryBudgets[category] = budgetAmount;
    }

    getExpenseHistory(startDate, endDate) {
        if (!this.validateDate(startDate) || !this.validateDate(endDate)) {
            throw new Error("Invalid date format");
        }

        return Object.entries(this.expenses)
            .filter(([_, expense]) => {
                return expense.date >= startDate && expense.date <= endDate;
            })
            .map(([expenseId, expense]) => ({
                expenseId,
                ...expense
            }));
    }

    generateMonthlyReport(year, month) {
        if (!Number.isInteger(year) || !Number.isInteger(month) || 
            month < 1 || month > 12) {
            throw new Error("Invalid year or month");
        }

        const monthStr = month.toString().padStart(2, '0');
        const monthStart = `${year}-${monthStr}`;
        
        const expenses = Object.values(this.expenses)
            .filter(expense => expense.date.startsWith(monthStart));

        if (expenses.length === 0) {
            return "No expenses for this month";
        }

        const report = {};
        this.validCategories.forEach(category => {
            const total = expenses
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
        const newExpense = { ...currentExpense };

        if (updatedDetails.amount !== undefined) {
            if (typeof updatedDetails.amount !== 'number' || updatedDetails.amount <= 0) {
                throw new Error("Invalid expense details");
            }
            newExpense.amount = updatedDetails.amount;
        }

        if (updatedDetails.category !== undefined) {
            if (!this.validCategories.includes(updatedDetails.category)) {
                throw new Error("Invalid category");
            }
            newExpense.category = updatedDetails.category;
        }

        if (updatedDetails.date !== undefined) {
            if (!this.validateDate(updatedDetails.date)) {
                throw new Error("Invalid expense details");
            }
            newExpense.date = updatedDetails.date;
        }

        if (updatedDetails.description !== undefined) {
            newExpense.description = updatedDetails.description;
        }

        this.expenses[expenseId] = newExpense;
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