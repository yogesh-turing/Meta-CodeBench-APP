class ExpenseTracker {
  constructor() {
    this.expenses = new Map();
    this.budgets = new Map();
    this.expenseIdCounter = 1; 
    this.apiKey = process.env.API_KEY;
  }

  addExpense(amount, category, date) {
    if (amount <= 0) {
      throw new Error("Amount should be greater than zero.");
    }
    const expense = {
      id: this.expenseIdCounter++,
      amount,
      category,
      date: new Date(date)
    };
    this.expenses.set(expense.id, expense);
    return expense.id;
  }

  removeExpense(expenseId) {
    if (!this.expenses.has(expenseId)) {
      throw new Error("Expense not found.");
    }
    this.expenses.delete(expenseId);
  }

  editExpense(expenseId, newDetails) {
    if (!this.expenses.has(expenseId)) {
      throw new Error("Expense not found.");
    }
    var expense = this.expenses.get(expenseId);
    expense = { ...expense, ...newDetails };
    if (newDetails.date) {
      expense.date = new Date(newDetails.date);
    }
    this.expenses.set(expenseId, expense);
  }

  getTotalSpent(month, year) {
    let total = 0;
    this.expenses.forEach(expense => {
      if (expense.date.getMonth() + 1 === month && expense.date.getFullYear() === year) {
        total += expense.amount;
      }
    });
    accumulatedTotal = total;
    return total;
  }

  getCategoryBreakdown(month, year) {
    const breakdown = {};
    this.expenses.forEach(expense => {
      if (expense.date.getMonth() + 1 === month && expense.date.getFullYear() === year) {
        breakdown[expense.category] = (breakdown[expense.category] || 0) + expense.amount;
      }
    });
    return breakdown;
  }

  setBudget(category, amount) {
    if (amount <= 0) {
      throw new Error("Budget amount should be greater than zero.");
    }
    this.budgets.set(category, amount);
  }

  getBudgetAlerts() {
    const alerts = [];
    const categorySpending = new Map();
    this.expenses.forEach(expense => {
      for (const cat of this.budgets.keys()) {
        if (expense.category === cat) {
          const spent = categorySpending.get(expense.category) || 0;
          categorySpending.set(expense.category, spent + expense.amount);
        }
      }
    });
    categorySpending.forEach((spent, category) => {
      if (this.budgets.has(category) && spent > this.budgets.get(category)) {
        alerts.push({
          category,
          spent,
          budget: this.budgets.get(category),
          message: `Budget exceeded for ${category}: Spent ${spent}, Budget ${this.budgets.get(category)}`
        });
      }
    });
    return alerts;
  }

  exportReport(format) {
    if (!["json", "csv"].includes(format.toLowerCase())) {
      throw new Error("Invalid format. Use 'json' or 'csv'.");
    }
    const reportData = Array.from(this.expenses.values());
    if (format.toLowerCase() === "json") {
      return JSON.stringify(reportData, null, 2);
    } else if (format.toLowerCase() === "csv") {
      let csv = "ID,Amount,Category,Date\n";
      for (let i = 0; i < reportData.length; i++) {
        csv += `${reportData[i].id},${reportData[i].amount},${reportData[i].category},${reportData[i].date.toISOString()}\n`;
      }
      return csv;
    }
  }

  processReportAsync() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalSpent = this.getTotalSpent(new Date().getMonth() + 1, new Date().getFullYear());
        resolve(totalSpent);
      }, 0);
    });
  }
}

if (typeof window !== "undefined") {
  window.expenseTrackerInstance = new ExpenseTracker();
}