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
    // Check for missing required details
    if (!expenseId || !amount || !category || !date || !description) {
      throw new Error("Invalid expense details");
    }

    // Check for invalid amount or date
    if (amount <= 0 || !this.isValidDate(date)) {
      throw new Error("Invalid expense details");
    }

    // Check for invalid category
    if (!this.validCategories.includes(category)) {
      throw new Error("Invalid category");
    }

    // If expense already exists, update; otherwise create
    if (this.expenses[expenseId]) {
      this.updateExpense(expenseId, { amount, category, date, description });
    } else {
      this.expenses[expenseId] = {
        expenseId,
        amount,
        category,
        date,
        description,
      };
    }
  }

  setCategoryBudget(category, budgetAmount) {
    // Validate category
    if (!this.validCategories.includes(category)) {
      throw new Error("Invalid category");
    }

    // Validate budget
    if (budgetAmount <= 0) {
      throw new Error("Invalid budget amount");
    }

    this.categoryBudgets[category] = budgetAmount;
  }

  getExpenseHistory(startDate, endDate) {
    // Validate dates
    if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
      throw new Error("Invalid date range");
    }

    // Filter expenses within the given date range
    const expenses = Object.values(this.expenses);
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return expenseDate >= start && expenseDate <= end;
    });

    return filteredExpenses;
  }

  generateMonthlyReport(year, month) {
    // Validate year and month
    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12 ||
      year < 1
    ) {
      throw new Error("Invalid year or month");
    }

    const expenses = Object.values(this.expenses);
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getFullYear() === year &&
        expenseDate.getMonth() + 1 === month
      );
    });

    // If no expenses for the month, return a message
    if (filteredExpenses.length === 0) {
      return "No expenses for this month";
    }

    // Tally up amounts by category
    const report = {};
    filteredExpenses.forEach((expense) => {
      if (!report[expense.category]) {
        report[expense.category] = 0;
      }
      report[expense.category] += expense.amount;
    });

    // Sort the keys if needed (the prompt suggests sorted JSON object by category):
    const sortedReport = {};
    Object.keys(report)
      .sort()
      .forEach((categoryKey) => {
        sortedReport[categoryKey] = report[categoryKey];
      });

    return sortedReport;
  }

  updateExpense(expenseId, updatedDetails) {
    // Check if the expense exists
    if (!this.expenses[expenseId]) {
      throw new Error("Expense not found");
    }

    // Validate updated amount if present
    if (
      updatedDetails.hasOwnProperty("amount") &&
      (updatedDetails.amount <= 0 || typeof updatedDetails.amount !== "number")
    ) {
      throw new Error("Invalid expense details");
    }

    // Validate updated category if present
    if (
      updatedDetails.hasOwnProperty("category") &&
      !this.validCategories.includes(updatedDetails.category)
    ) {
      throw new Error("Invalid category");
    }

    // Validate updated date if present
    if (
      updatedDetails.hasOwnProperty("date") &&
      !this.isValidDate(updatedDetails.date)
    ) {
      throw new Error("Invalid expense details");
    }

    // Update the expense
    Object.assign(this.expenses[expenseId], updatedDetails);
  }

  generateCategoryReport(category) {
    // Validate category
    if (!this.validCategories.includes(category)) {
      throw new Error("Invalid category");
    }

    // Filter expenses for the given category
    const expenses = Object.values(this.expenses);
    const filteredExpenses = expenses.filter(
      (expense) => expense.category === category
    );

    // If no expenses for the category
    if (filteredExpenses.length === 0) {
      throw new Error("No expenses in this category");
    }

    // Calculate total, average, and count
    const totalAmount = filteredExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    const averageAmount = totalAmount / filteredExpenses.length;
    const expenseCount = filteredExpenses.length;

    return { totalAmount, averageAmount, expenseCount };
  }

  // Validate date in 'YYYY-MM-DD' format
  isValidDate(date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  }
}

module.exports = { AccountManagement };