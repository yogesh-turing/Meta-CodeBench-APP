class AccountManagement {
    constructor() {
      // Format: { expenseId: { amount, category, date, description } }
      this.expenses = {};
      // Format: { category: budgetAmount }
      this.categoryBudgets = {};
      // Predefined valid categories
      this.validCategories = ["Food", "Entertainment", "Transport"];
    }
  
    addExpense(expenseId, amount, category, date, description) {
      // Validate the presence of required fields
      if (!expenseId || typeof expenseId !== "string") {
        throw new Error("Invalid expense details");
      }
  
      // Validate amount
      if (!amount || amount <= 0 || isNaN(amount)) {
        throw new Error("Invalid expense details");
      }
  
      // Check for valid category or throw "Invalid category"
      if (!category || typeof category !== "string") {
        throw new Error("Invalid expense details");
      }
      if (!this.validCategories.includes(category)) {
        throw new Error("Invalid category");
      }
  
      // Validate date
      if (!date || !this.isValidDate(date)) {
        throw new Error("Invalid expense details");
      }
  
      // description can be optional or any string; 
      // if you want to enforce it, similarly check here:
      // if (!description || typeof description !== "string") {
      //   throw new Error("Invalid expense details");
      // }
  
      // If the expenseId already exists, update instead
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
  
      if (!budgetAmount || budgetAmount <= 0) {
        throw new Error("Invalid budget amount");
      }
  
      this.categoryBudgets[category] = budgetAmount;
    }
  
    getExpenseHistory(startDate, endDate) {
      if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
        throw new Error("Invalid date range");
      }
  
      // Include expenseId in the returned objects
      const allExpenses = Object.entries(this.expenses).map(([id, data]) => ({
        expenseId: id,
        ...data,
      }));
  
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      const filteredExpenses = allExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= start && expenseDate <= end;
      });
  
      return filteredExpenses;
    }
  
    generateMonthlyReport(year, month) {
      // Check that year and month are valid integers
      if (
        !Number.isInteger(year) ||
        year < 1 ||
        !Number.isInteger(month) ||
        month < 1 ||
        month > 12
      ) {
        throw new Error("Invalid year or month");
      }
  
      // Gather all expenses and filter by the provided year/month
      const allExpenses = Object.entries(this.expenses).map(([id, data]) => ({
        expenseId: id,
        ...data,
      }));
  
      const filteredExpenses = allExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getFullYear() === year &&
          expenseDate.getMonth() + 1 === month
        );
      });
  
      if (filteredExpenses.length === 0) {
        // Return message instead of throwing
        return "No expenses for this month";
      }
  
      // Calculate total per category
      const report = {};
      filteredExpenses.forEach((expense) => {
        if (!report[expense.category]) {
          report[expense.category] = 0;
        }
        report[expense.category] += expense.amount;
      });
  
      // Return an object: { "Food": 100, "Transport": 20, ... }
      return report;
    }
  
    updateExpense(expenseId, updatedDetails) {
      if (!this.expenses[expenseId]) {
        throw new Error("Expense not found");
      }
  
      // Validate any updated fields
      if (updatedDetails.amount !== undefined) {
        if (!updatedDetails.amount || updatedDetails.amount <= 0) {
          throw new Error("Invalid expense details");
        }
      }
  
      if (updatedDetails.category !== undefined) {
        if (!this.validCategories.includes(updatedDetails.category)) {
          throw new Error("Invalid category");
        }
      }
  
      if (updatedDetails.date !== undefined) {
        if (!this.isValidDate(updatedDetails.date)) {
          throw new Error("Invalid expense details");
        }
      }
  
      // Merge changes
      Object.assign(this.expenses[expenseId], updatedDetails);
    }
  
    generateCategoryReport(category) {
      if (!this.validCategories.includes(category)) {
        throw new Error("Invalid category");
      }
  
      // Include expenseId if needed, or just values
      const expensesInCategory = Object.values(this.expenses).filter(
        (expense) => expense.category === category
      );
  
      if (expensesInCategory.length === 0) {
        throw new Error("No expenses in this category");
      }
  
      const totalAmount = expensesInCategory.reduce(
        (acc, expense) => acc + expense.amount,
        0
      );
      const averageAmount = totalAmount / expensesInCategory.length;
      const expenseCount = expensesInCategory.length;
  
      return { totalAmount, averageAmount, expenseCount };
    }
  
    isValidDate(date) {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      return regex.test(date);
    }
  }
  
  module.exports = { AccountManagement };