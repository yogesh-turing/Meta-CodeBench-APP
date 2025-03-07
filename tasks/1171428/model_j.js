class AccountManagement {
  constructor() {
    this.expenses = {}; // Format: { expenseId: { expenseId, amount, category, date, description } }
    this.categoryBudgets = {}; // Format: { category: budgetAmount }
    this.validCategories = ["Food", "Entertainment", "Transport"]; // Predefined categories
  }

  addExpense(expenseId, amount, category, date, description) {
    // Separate checks so that invalid category throws 'Invalid category'
    if (!this.validCategories.includes(category)) {
      throw new Error("Invalid category");
    }

    // Check amount and date validity
    if (amount <= 0 || !this.isValidDate(date)) {
      throw new Error("Invalid expense details");
    }

    // If expense already exists, update it; otherwise, create a new one
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
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Filter by date range
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });

    return filteredExpenses;
  }

  generateMonthlyReport(year, month) {
    // Validate year and month
    if (
      !Number.isInteger(year) ||
      year < 1 ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
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

    // If there are no expenses for this month, return a message as a string
    if (filteredExpenses.length === 0) {
      return "No expenses for this month";
    }

    // Summarize expenses by category
    const report = {};
    filteredExpenses.forEach((expense) => {
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

    // Validate any fields being updated
    if (
      updatedDetails.amount !== undefined &&
      (typeof updatedDetails.amount !== "number" || updatedDetails.amount <= 0)
    ) {
      throw new Error("Invalid expense details");
    }

    if (
      updatedDetails.category !== undefined &&
      !this.validCategories.includes(updatedDetails.category)
    ) {
      throw new Error("Invalid category");
    }

    if (
      updatedDetails.date !== undefined &&
      !this.isValidDate(updatedDetails.date)
    ) {
      throw new Error("Invalid expense details");
    }

    // Merge changes into the existing expense
    Object.assign(this.expenses[expenseId], updatedDetails);
  }

  generateCategoryReport(category) {
    if (!this.validCategories.includes(category)) {
      throw new Error("Invalid category");
    }

    const expenses = Object.values(this.expenses);
    const filteredExpenses = expenses.filter(
      (expense) => expense.category === category
    );

    if (filteredExpenses.length === 0) {
      throw new Error("No expenses in this category");
    }

    const totalAmount = filteredExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    const averageAmount = totalAmount / filteredExpenses.length;
    const expenseCount = filteredExpenses.length;

    return { totalAmount, averageAmount, expenseCount };
  }

  isValidDate(date) {
    // Basic YYYY-MM-DD regex check
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  }
}

module.exports = { AccountManagement };
