const { AccountManagement } = require('./model_c');

describe("AccountManagement", () => {
  let accountManagement;

  beforeEach(() => {
    accountManagement = new AccountManagement();
  });

  describe("addExpense", () => {
    it("should add a new expense successfully", () => {
      accountManagement.addExpense(
        "expense1",
        100.5,
        "Food",
        "2025-02-20",
        "Lunch"
      );
      const expenseHistory = accountManagement.getExpenseHistory(
        "2025-02-20",
        "2025-02-20"
      );
      expect(expenseHistory.length).toBe(1);
      expect(expenseHistory[0].expenseId).toBe("expense1");
      expect(expenseHistory[0].amount).toBe(100.5);
      expect(expenseHistory[0].category).toBe("Food");
      expect(expenseHistory[0].description).toBe("Lunch");
    });

    it("should throw error for invalid expense details", () => {
      expect(() =>
        accountManagement.addExpense(
          "expense1",
          -10,
          "Food",
          "2025-02-20",
          "Lunch"
        )
      ).toThrow("Invalid expense details");
    });

    it("should throw error for invalid category", () => {
      expect(() =>
        accountManagement.addExpense(
          "expense1",
          50,
          "InvalidCategory",
          "2025-02-20",
          "Dinner"
        )
      ).toThrow("Invalid category");
    });

    it("should throw error for missing required expense details", () => {
      expect(() =>
        accountManagement.addExpense("expense1", 50, "2025-02-20", "Dinner")
      ).toThrow("Invalid expense details");
    });

    it("should throw error for invalid date in addExpense", () => {
      expect(() =>
        accountManagement.addExpense(
          "expense1",
          50,
          "Entertainment",
          "02-20-2025",
          "Dinner"
        )
      ).toThrow("Invalid expense details");
    });

    it("Update the expense details if it already exist", () => {
      accountManagement.addExpense(
        "expense1",
        200,
        "Entertainment",
        "2025-02-20",
        "Movie"
      );
      const expenseHistory = accountManagement.getExpenseHistory(
        "2025-02-20",
        "2025-02-20"
      );
      expect(expenseHistory.length).toBe(1);
      expect(expenseHistory[0].expenseId).toBe("expense1");
      expect(expenseHistory[0].amount).toBe(200);
      expect(expenseHistory[0].category).toBe("Entertainment");
      expect(expenseHistory[0].description).toBe("Movie");
    });
  });

  describe("setCategoryBudget", () => {
    it("should set a budget for a category successfully", () => {
      accountManagement.setCategoryBudget("Food", 500);
      expect(accountManagement.categoryBudgets["Food"]).toBe(500);
    });

    it("should throw error for invalid budget amount", () => {
      expect(() => accountManagement.setCategoryBudget("Food", -100)).toThrow(
        "Invalid budget amount"
      );
    });

    it("should throw error for invalid category", () => {
      expect(() =>
        accountManagement.setCategoryBudget("InvalidCategory", 100)
      ).toThrow("Invalid category");
    });
  });

  describe("getExpenseHistory", () => {
    it("should return expenses within a given date range", () => {
      accountManagement.addExpense(
        "expense1",
        100.5,
        "Food",
        "2025-02-20",
        "Lunch"
      );
      accountManagement.addExpense(
        "expense2",
        200.0,
        "Transport",
        "2025-02-21",
        "Taxi"
      );
      const expenses = accountManagement.getExpenseHistory(
        "2025-02-20",
        "2025-02-21"
      );
      expect(expenses.length).toBe(2);
    });

    it("should return empty array if no expenses in the date range", () => {
      const expenses = accountManagement.getExpenseHistory(
        "2025-02-20",
        "2025-02-20"
      );
      expect(expenses.length).toBe(0);
    });

    it("should throw error when start date is not valid ", () => {
      expect(() =>
        accountManagement.getExpenseHistory("2024-13- 13", "2024-13- 12")
      ).toThrow(Error);
    });

    it("should throw error when end date is not valid ", () => {
      expect(() =>
        accountManagement.getExpenseHistory("2024-12- 12", "2024-13- 13")
      ).toThrow(Error);
    });
  });

  describe("generateMonthlyReport", () => {
    it("should generate a report for a specific month", () => {
      accountManagement.addExpense(
        "expense1",
        100.5,
        "Food",
        "2025-02-10",
        "Lunch"
      );
      accountManagement.addExpense(
        "expense2",
        200,
        "Transport",
        "2025-02-15",
        "Taxi"
      );
      accountManagement.addExpense(
        "expense3",
        50.25,
        "Entertainment",
        "2025-02-15",
        "Movie"
      );
      const report = accountManagement.generateMonthlyReport(2025, 2);
      expect(report).toEqual({
        Entertainment: 50.25,
        Food: 100.5,
        Transport: 200,
      });
    });

    it("should throw error when passed month is not in not valid integer number", () => {
      expect(() => accountManagement.generateMonthlyReport(2025, "s")).toThrow(
        "Invalid year or month"
      );
    });

    it("should throw error when passed month is not in valid months range that is 1<=month=<=12", () => {
      expect(() => accountManagement.generateMonthlyReport(2025, 13)).toThrow(
        "Invalid year or month"
      );
    });

    it("should return a message if no expenses for the given month", () => {
      const report = accountManagement.generateMonthlyReport(2025, 3);
      expect(report).toBe("No expenses for this month");
    });

    it("should throw error when passed year is not in YYYY integer format", () => {
      expect(() => accountManagement.generateMonthlyReport("s", 13)).toThrow(
        "Invalid year or month"
      );
    });
  });

  describe("updateExpense", () => {
    it("should update an existing expense successfully", () => {
      accountManagement.addExpense(
        "expense1",
        100.5,
        "Food",
        "2025-02-20",
        "Lunch"
      );
      accountManagement.updateExpense("expense1", {
        amount: 150.0,
        category: "Transport",
        description: "Taxi ride",
      });
      const updatedExpense = accountManagement.getExpenseHistory(
        "2025-02-20",
        "2025-02-20"
      )[0];
      expect(updatedExpense.amount).toBe(150.0);
      expect(updatedExpense.category).toBe("Transport");
      expect(updatedExpense.description).toBe("Taxi ride");
    });

    it("should throw error if expense not found", () => {
      expect(() =>
        accountManagement.updateExpense("nonexistentExpense", { amount: 150.0 })
      ).toThrow("Expense not found");
    });

    it("should throw error for invalid expense details that is amount", () => {
      accountManagement.addExpense(
        "expense1",
        100.5,
        "Food",
        "2025-02-20",
        "Lunch"
      );
      expect(() =>
        accountManagement.updateExpense("expense1", { amount: -150.0 })
      ).toThrow("Invalid expense details");
    });

    it("should throw error for invalid expense details that is date", () => {
      accountManagement.addExpense(
        "expense1",
        100.5,
        "Food",
        "2025-12-20",
        "Lunch"
      );
      expect(() =>
        accountManagement.updateExpense("expense1", { amount: -150.0 })
      ).toThrow("Invalid expense details");
    });
  });

  describe("generateCategoryReport", () => {
    it("should generate a category report successfully", () => {
      accountManagement.addExpense(
        "expense1",
        100.5,
        "Food",
        "2025-02-20",
        "Lunch"
      );
      accountManagement.addExpense(
        "expense2",
        200.0,
        "Food",
        "2025-02-21",
        "Dinner"
      );
      const report = accountManagement.generateCategoryReport("Food");
      expect(report.totalAmount).toBe(300.5);
      expect(report.averageAmount).toBe(150.25);
      expect(report.expenseCount).toBe(2);
    });

    it("should return a message if no expenses for the category", () => {
      expect(() =>
        accountManagement.generateCategoryReport("Entertainment")
      ).toThrow("No expenses in this category");
    });

    it("should return a message if no expenses for the category", () => {
      expect(() => accountManagement.generateCategoryReport("")).toThrow(
        "Invalid category"
      );
    });
  });
});