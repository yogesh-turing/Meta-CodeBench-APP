Base Code:
```javascript
class AccountManagement {
  constructor() {
    this.expenses = {}; // Format: { expenseId: { amount, category, date, description } }
    this.categoryBudgets = {}; // Format: { category: budgetAmount }
    this.validCategories = ["Food", "Entertainment", "Transport"]; // Predefined categories
  }

  addExpense(expenseId, amount, category, date, description) {
    if (
      amount <= 0 ||
      !this.validCategories.includes(category) ||
      !this.isValidDate(date)
    ) {
      throw new Error("Invalid expense details");
    }

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
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return expenseDate >= start && expenseDate <= end;
    });

    return filteredExpenses;
  }

  generateMonthlyReport(year, month) {
    if (month < 1 || month > 12 || year < 1) {
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

    if (filteredExpenses.length === 0) {
      throw new Error("No expenses for this month");
    }

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
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  }
}

module.exports = { AccountManagement };
```

Stack Trace:
```javascript
AccountManagement
    addExpense
      ✕ should add a new expense successfully (2 ms)
      ✓ should throw error for invalid expense details (4 ms)
      ✕ should throw error for invalid category (10 ms)
      ✓ should throw error for missing required expense details (1 ms)
      ✓ should throw error for invalid date in addExpense
      ✕ Update the expense details if it already exist (1 ms)
    setCategoryBudget
      ✓ should set a budget for a category successfully
      ✓ should throw error for invalid budget amount
      ✓ should throw error for invalid category (3 ms)
    getExpenseHistory
      ✓ should return expenses within a given date range
      ✓ should return empty array if no expenses in the date range
      ✓ should throw error when start date is not valid  (1 ms)
      ✓ should throw error when end date is not valid 
    generateMonthlyReport
      ✓ should generate a report for a specific month (2 ms)
      ✕ should throw error when passed month is not in not valid integer number (2 ms)
      ✓ should throw error when passed month is not in valid months range that is 1<=month=<=12
      ✕ should return a message if no expenses for the given month
      ✓ should throw error when passed year is not in YYYY integer format (1 ms)
    updateExpense
      ✓ should update an existing expense successfully
      ✓ should throw error if expense not found
      ✓ should throw error for invalid expense details that is amount
      ✓ should throw error for invalid expense details that is date
    generateCategoryReport
      ✓ should generate a category report successfully
      ✓ should return a message if no expenses for the category
      ✓ should return a message if no expenses for the category (1 ms)

  ● AccountManagement › addExpense › should add a new expense successfully

    expect(received).toBe(expected) // Object.is equality

    Expected: "expense1"
    Received: undefined

      22 |       );
      23 |       expect(expenseHistory.length).toBe(1);
    > 24 |       expect(expenseHistory[0].expenseId).toBe("expense1");
         |                                           ^
      25 |       expect(expenseHistory[0].amount).toBe(100.5);
      26 |       expect(expenseHistory[0].category).toBe("Food");
      27 |       expect(expenseHistory[0].description).toBe("Lunch");

      at Object.toBe (WordCloud.test.js:24:43)

  ● AccountManagement › addExpense › should throw error for invalid category

    expect(received).toThrow(expected)

    Expected substring: "Invalid category"
    Received message:   "Invalid expense details"

          12 |       !this.isValidDate(date)
          13 |     ) {
        > 14 |       throw new Error("Invalid expense details");
             |             ^
          15 |     }
          16 |
          17 |     if (this.expenses[expenseId]) {

          at AccountManagement.addExpense (Solution.js:14:13)
          at addExpense (WordCloud.test.js:44:27)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:51:9)

      49 |           "Dinner"
      50 |         )
    > 51 |       ).toThrow("Invalid category");
         |         ^
      52 |     });
      53 |
      54 |     it("should throw error for missing required expense details", () => {

      at Object.toThrow (WordCloud.test.js:51:9)

  ● AccountManagement › addExpense › Update the expense details if it already exist

    expect(received).toBe(expected) // Object.is equality

    Expected: "expense1"
    Received: undefined

      77 |       );
      78 |       expect(expenseHistory.length).toBe(1);
    > 79 |       expect(expenseHistory[0].expenseId).toBe("expense1");
         |                                           ^
      80 |       expect(expenseHistory[0].amount).toBe(200);
      81 |       expect(expenseHistory[0].category).toBe("Entertainment");
      82 |       expect(expenseHistory[0].description).toBe("Movie");

      at Object.toBe (WordCloud.test.js:79:43)

  ● AccountManagement › generateMonthlyReport › should throw error when passed month is not in not valid integer number

    expect(received).toThrow(expected)

    Expected substring: "Invalid year or month"
    Received message:   "No expenses for this month"

          65 |
          66 |     if (filteredExpenses.length === 0) {
        > 67 |       throw new Error("No expenses for this month");
             |             ^
          68 |     }
          69 |
          70 |     const report = {};

          at AccountManagement.generateMonthlyReport (Solution.js:67:13)
          at generateMonthlyReport (WordCloud.test.js:181:38)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:181:72)

      179 |
      180 |     it("should throw error when passed month is not in not valid integer number", () => {
    > 181 |       expect(() => accountManagement.generateMonthlyReport(2025, "s")).toThrow(
          |                                                                        ^
      182 |         "Invalid year or month"
      183 |       );
      184 |     });

      at Object.toThrow (WordCloud.test.js:181:72)

  ● AccountManagement › generateMonthlyReport › should return a message if no expenses for the given month

    No expenses for this month

      65 |
      66 |     if (filteredExpenses.length === 0) {
    > 67 |       throw new Error("No expenses for this month");
         |             ^
      68 |     }
      69 |
      70 |     const report = {};

      at AccountManagement.generateMonthlyReport (Solution.js:67:13)
      at Object.generateMonthlyReport (WordCloud.test.js:193:40)
```

Prompt:
Please fix the bugs in the code and ensure it works as per the details below:

 `addExpense`:
-   Should accept:
    -   `expenseId` (string)
    -   `amount` (positive float)
    -   `category` (string)
    -   `date` (string in 'YYYY-MM-DD' format)
    -   `description` (string)
-   If the `amount`, `category`, or `date` is invalid, throw an error: "Invalid expense details".
-   Store the expense details, including the `expenseId`, `amount`, `category`, `date`, and `description`.
-   Ensure the category is a valid pre-defined category (e.g., "Food", "Entertainment", "Transport"). If not, raise the error "Invalid category".
-   If the expense already exists (same `expenseId`), update the expense with the new details.

`setCategoryBudget`:
-   Should accept:
    -   `category` (string)
    -   `budgetAmount` (positive float)
-   Ensure the category is valid (pre-defined categories).
-   Store the expense details, including the `expenseId`, `amount`, `category`, `date`, and `description`.
-   If the `budgetAmount` is invalid (non-positive number), throw an error: "Invalid budget amount".
-   Store the budget for the specified category.

 `getExpenseHistory`:

-   Should accept:
    -   `startDate` (string in 'YYYY-MM-DD' format) and  `endDate` (string in 'YYYY-MM-DD' format).
-   Return an array of objects representing each expense in the range. Each object should contain:
    -   `expenseId` (string)
    -   `amount` (float)
    -   `category` (string)
    -   `date` (string)
    -   `description` (string)
-   If there are no expenses in the given range, return an empty array.

 `generateMonthlyReport`:

-   Should accept:
    -   `year` (valid 'YYYY' integer, e.g., 2025)
    -   `month` (integer, 1 through 12)
-   If accepted arguments are invalid, raise the error "Invalid year or month".
-   Return a JSON object containing the total expenses for each category within the given month sorted by `category`.
-   The object should have category names as keys and total amounts as values.
    -   Example: `{ "Entertainment": 50.25, "Food": 250.5, "Transport": 100.75 }`
-   If there are no expenses in the given month, return: "No expenses for this month".

`updateExpense`:

-   Should accept:
    -   `expenseId` (string)
    -   `updatedDetails` (an object containing updated `amount`, `category`, `date`, and/or `description`)
-   If the `expenseId` does not exist, throw an error: "Expense not found".
-   Update the existing expense details with the new ones.
-   Ensure the new values are valid (e.g., `amount` must be positive, `category` must be valid, and `date` must be in the correct format).

`generateCategoryReport`:

-   Should accept:
    -   `category` (string)
-   Return an object containing the following:
    -   `totalAmount`: total expense for the category
    -   `averageAmount`: average expense per entry in that category
    -   `expenseCount`: number of expenses in that category
-   Ensure the category is valid (pre-defined categories).

Error Handling:

-   Throw an 'Invalid expense details' error if any expense details are missing or invalid.
-   Throw an error "Invalid budget amount" if the budget amount is invalid.
-   Throw an error "Expense not found" if an expense does not exist.
-   Throw an error "No expenses for this month" if no expenses are found in the specified month.
-   Throw an error "No expenses in this category" if there are no expenses for the given category.
-   Throw an error "Invalid category" if there is no predefined category.