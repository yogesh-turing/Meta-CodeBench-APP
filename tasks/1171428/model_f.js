class AccountManagement {
    constructor() {
      // Format: { expenseId: { expenseId, amount, category, date, description } }
      this.expenses = {};
      // Format: { category: budgetAmount }
      this.categoryBudgets = {};
      // Predefined categories
      this.validCategories = ["Food", "Entertainment", "Transport"];
    }
  
    addExpense(expenseId, amount, category, date, description) {
      // Check for any missing details
      if (!expenseId || !amount || !category || !date || !description) {
        throw new Error("Invalid expense details");
      }
  
      // Check for valid category
      if (!this.validCategories.includes(category)) {
        throw new Error("Invalid category");
      }
  
      // Check for valid amount and date
      if (amount <= 0 || !this.isValidDate(date)) {
        throw new Error("Invalid expense details");
      }
  
      // If the expense already exists, update it
      if (this.expenses[expenseId]) {
        this.updateExpense(expenseId, { amount, category, date, description });
      } else {
        // Otherwise, add a new expense object (store expenseId as well)
        this.expenses[expenseId] = { expenseId, amount, category, date, description };
      }
    }
  
    setCategoryBudget(category, budgetAmount) {
      // Validate category
      if (!this.validCategories.includes(category)) {
        throw new Error("Invalid category");
      }
      // Validate budget amount
      if (budgetAmount <= 0) {
        throw new Error("Invalid budget amount");
      }
      // Store the budget for the category
      this.categoryBudgets[category] = budgetAmount;
    }
  
    getExpenseHistory(startDate, endDate) {
      // Validate both dates
      if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
        throw new Error("Invalid date range");
      }
  
      // Convert to Date objects for comparison
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      // Filter expenses within the given range
      const filteredExpenses = Object.values(this.expenses).filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= start && expenseDate <= end;
      });
  
      return filteredExpenses;
    }
  
    generateMonthlyReport(year, month) {
      // Validate year and month as integers in the correct range
      if (
        typeof year !== "number" ||
        !Number.isInteger(year) ||
        year < 1 ||
        typeof month !== "number" ||
        !Number.isInteger(month) ||
        month < 1 ||
        month > 12
      ) {
        throw new Error("Invalid year or month");
      }
  
      // Filter expenses for the given year/month
      const filteredExpenses = Object.values(this.expenses).filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getFullYear() === year &&
          expenseDate.getMonth() + 1 === month
        );
      });
  
      // If no expenses found, return message
      if (filteredExpenses.length === 0) {
        return "No expenses for this month";
      }
  
      // Sum the amounts by category
      const report = {};
      filteredExpenses.forEach((expense) => {
        if (!report[expense.category]) {
          report[expense.category] = 0;
        }
        report[expense.category] += expense.amount;
      });
  
      // Sort the categories alphabetically in the returned object
      const sortedKeys = Object.keys(report).sort();
      const sortedReport = {};
      sortedKeys.forEach((key) => {
        sortedReport[key] = report[key];
      });
  
      return sortedReport;
    }
  
    updateExpense(expenseId, updatedDetails) {
      // Check if the expense exists
      if (!this.expenses[expenseId]) {
        throw new Error("Expense not found");
      }
  
      // Validate the new details
      if (updatedDetails.amount && updatedDetails.amount <= 0) {
        throw new Error("Invalid expense details");
      }
  
      if (
        updatedDetails.category &&
        !this.validCategories.includes(updatedDetails.category)
      ) {
        throw new Error("Invalid category");
      }
  
      if (updatedDetails.date && !this.isValidDate(updatedDetails.date)) {
        throw new Error("Invalid expense details");
      }
  
      // Apply updates
      Object.assign(this.expenses[expenseId], updatedDetails);
    }
  
    generateCategoryReport(category) {
      // Check if category is valid
      if (!this.validCategories.includes(category)) {
        throw new Error("Invalid category");
      }
  
      // Filter for expenses in this category
      const filteredExpenses = Object.values(this.expenses).filter(
        (expense) => expense.category === category
      );
  
      // If none found
      if (filteredExpenses.length === 0) {
        throw new Error("No expenses in this category");
      }
  
      // Calculate total, average, and count
      const totalAmount = filteredExpenses.reduce(
        (acc, expense) => acc + expense.amount,
        0
      );
      const expenseCount = filteredExpenses.length;
      const averageAmount = totalAmount / expenseCount;
  
      return { totalAmount, averageAmount, expenseCount };
    }
  
    // Validate date in 'YYYY-MM-DD' format
    isValidDate(date) {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      return regex.test(date);
    }
  }
  
  module.exports = { AccountManagement };