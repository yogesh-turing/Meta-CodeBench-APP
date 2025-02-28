class AccountManagement {
    constructor() {
      this.expenses = {};
      this.categoryBudgets = {};
      this.validCategories = ["Food", "Entertainment", "Transport"];
    }
  
    addExpense(expenseId, amount, category, date, description) {
      if (!expenseId || typeof expenseId !== 'string') {
        throw new Error("Invalid expense details");
      }
  
      if (!amount || amount <= 0) {
        throw new Error("Invalid expense details");
      }
  
      if (!category || !this.validCategories.includes(category)) {
        throw new Error("Invalid category");
      }
  
      if (!date || !this.isValidDate(date)) {
        throw new Error("Invalid expense details");
      }
  
      if (!description || typeof description !== 'string') {
        throw new Error("Invalid expense details");
      }
  
      this.expenses[expenseId] = {
        expenseId,
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
      if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
        throw new Error("Invalid date range");
      }
  
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      return Object.values(this.expenses)
        .filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= start && expenseDate <= end;
        });
    }
  
    generateMonthlyReport(year, month) {
      if (!Number.isInteger(year) || !Number.isInteger(month) ||
          year < 1000 || year > 9999 || month < 1 || month > 12) {
        throw new Error("Invalid year or month");
      }
  
      const filteredExpenses = Object.values(this.expenses).filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === year && expenseDate.getMonth() + 1 === month;
      });
  
      if (filteredExpenses.length === 0) {
        return "No expenses for this month";
      }
  
      return filteredExpenses.reduce((report, expense) => {
        if (!report[expense.category]) {
          report[expense.category] = 0;
        }
        report[expense.category] += expense.amount;
        return report;
      }, {});
    }
  
    updateExpense(expenseId, updatedDetails) {
      if (!this.expenses[expenseId]) {
        throw new Error("Expense not found");
      }
  
      const currentExpense = this.expenses[expenseId];
      const newExpense = { ...currentExpense };
  
      if (updatedDetails.amount !== undefined) {
        if (updatedDetails.amount <= 0) {
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
        if (!this.isValidDate(updatedDetails.date)) {
          throw new Error("Invalid expense details");
        }
        newExpense.date = updatedDetails.date;
      }
  
      if (updatedDetails.description !== undefined) {
        if (typeof updatedDetails.description !== 'string') {
          throw new Error("Invalid expense details");
        }
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
  
    isValidDate(dateString) {
      if (!dateString || typeof dateString !== 'string') return false;
      
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(dateString)) return false;
  
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date);
    }
  }
  
  module.exports = { AccountManagement };