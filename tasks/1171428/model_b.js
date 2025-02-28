class AccountManagement {
    constructor() {
      this.expenses = {};
      this.categoryBudgets = {};
      this.validCategories = ["Food", "Entertainment", "Transport"];
    }
  
    addExpense(expenseId, amount, category, date, description) {
      if (!expenseId || !amount || !category || !date || !description) {
        throw new Error("Invalid expense details");
      }
  
      if (!this.validCategories.includes(category)) {
        throw new Error("Invalid category");
      }
  
      if (amount <= 0 || !this.isValidDate(date)) {
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
  
      if (budgetAmount <= 0) {
        throw new Error("Invalid budget amount");
      }
  
      this.categoryBudgets[category] = budgetAmount;
    }
  
    getExpenseHistory(startDate, endDate) {
      if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
        throw new Error("Invalid date range");
      }
  
      return Object.values(this.expenses).filter(expense => {
        const expenseDate = new Date(expense.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return expenseDate >= start && expenseDate <= end;
      });
    }
  
    generateMonthlyReport(year, month) {
      if (!Number.isInteger(year) || !Number.isInteger(month) || 
          month < 1 || month > 12 || year < 1000 || year > 9999) {
        throw new Error("Invalid year or month");
      }
  
      const expenses = Object.values(this.expenses).filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === year && 
               expenseDate.getMonth() + 1 === month;
      });
  
      if (expenses.length === 0) {
        return "No expenses for this month";
      }
  
      const report = {};
      this.validCategories.forEach(category => {
        report[category] = 0;
      });
  
      expenses.forEach(expense => {
        report[expense.category] += expense.amount;
      });
  
      return Object.fromEntries(
        Object.entries(report)
          .filter(([_, amount]) => amount > 0)
          .sort(([a], [b]) => a.localeCompare(b))
      );
    }
  
    updateExpense(expenseId, updatedDetails) {
      if (!this.expenses[expenseId]) {
        throw new Error("Expense not found");
      }
  
      const currentExpense = this.expenses[expenseId];
      const newDetails = { ...currentExpense };
  
      if (updatedDetails.amount !== undefined) {
        if (updatedDetails.amount <= 0) {
          throw new Error("Invalid expense details");
        }
        newDetails.amount = updatedDetails.amount;
      }
  
      if (updatedDetails.category !== undefined) {
        if (!this.validCategories.includes(updatedDetails.category)) {
          throw new Error("Invalid category");
        }
        newDetails.category = updatedDetails.category;
      }
  
      if (updatedDetails.date !== undefined) {
        if (!this.isValidDate(updatedDetails.date)) {
          throw new Error("Invalid expense details");
        }
        newDetails.date = updatedDetails.date;
      }
  
      if (updatedDetails.description !== undefined) {
        newDetails.description = updatedDetails.description;
      }
  
      this.expenses[expenseId] = newDetails;
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
  
      const totalAmount = categoryExpenses.reduce((sum, expense) => 
        sum + expense.amount, 0);
      
      return {
        totalAmount,
        averageAmount: totalAmount / categoryExpenses.length,
        expenseCount: categoryExpenses.length
      };
    }
  
    isValidDate(date) {
      if (!date || typeof date !== 'string') return false;
      
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(date)) return false;
  
      const [year, month, day] = date.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      
      return dateObj.getFullYear() === year &&
             dateObj.getMonth() === month - 1 &&
             dateObj.getDate() === day;
    }
  }
  
  module.exports = { AccountManagement };