class AccountManagement {
  constructor() {
    this.expenses = {}; // Format: { expenseId: { amount, category, date, description } }
    this.categoryBudgets = {}; // Format: { category: budgetAmount }
    this.validCategories = ["Food", "Entertainment", "Transport"]; // Predefined categories
  }

  addExpense(expenseId, amount, category, date, description) {
    // Check for invalid category first
    if (!this.validCategories.includes(category)) {
      throw new Error("Invalid category");
    }

    // Validate amount and date
    if (amount <= 0 || !this.isValidDate(date)) {
      throw new Error("Invalid expense details");
    }

    // If expense already exists, update it
    if (this.expenses[expenseId]) {
      this.updateExpense(expenseId, { amount, category, date, description });
    } else {
      // Otherwise, add a new expense
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

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Return expenses that fall within the given date range
    return Object.entries(this.expenses)
      .filter(([_, expense]) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= start && expenseDate <= end;
      })
      .map(([id, expense]) => ({
        expenseId: id,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        description: expense.description,
      }));
  }

  generateMonthlyReport(year, month) {
    // Validate the year and month
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

    // If no expenses are found
    if (filteredExpenses.length === 0) {
      return "No expenses for this month";
    }

    // Build a report object with total expenses per category
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

    // Validate amount if provided
    if (
      updatedDetails.amount !== undefined &&
      (updatedDetails.amount <= 0 || isNaN(updatedDetails.amount))
    ) {
      throw new Error("Invalid expense details");
    }

    // Validate category if provided
    if (
      updatedDetails.category !== undefined &&
      !this.validCategories.includes(updatedDetails.category)
    ) {
      throw new Error("Invalid category");
    }

    // Validate date if provided
    if (
      updatedDetails.date !== undefined &&
      !this.isValidDate(updatedDetails.date)
    ) {
      throw new Error("Invalid expense details");
    }

    // Merge the updates into the existing object
    Object.assign(this.expenses[expenseId], updatedDetails);
  }

  generateCategoryReport(category) {
    if (!this.validCategories.includes(category)) {
      throw new Error("Invalid category");
    }

    // Filter expenses for the given category
    const filteredExpenses = Object.values(this.expenses).filter(
      (expense) => expense.category === category
    );

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

  isValidDate(date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  }
}

module.exports = { AccountManagement };