Base Code:
```javascript
class FinanceManager {
    constructor() {
        this.expenses = {};  // Format: { expenseId: { amount, category, date, description } }
        this.categoryBudgets = {};  // Format: { category: budgetAmount }
        this.validCategories = ['Food', 'Entertainment', 'Transport'];  // Predefined categories
    }

    addExpense(expenseId, amount, category, date, description) {
        // TODO: Implement addExpense logic here
    }

    setCategoryBudget(category, budgetAmount) {
        // TODO: Implement setCategoryBudget logic here
    }

    getExpenseHistory(startDate, endDate) {
        // TODO: Implement getExpenseHistory logic here
    }

    generateMonthlyReport(year, month) {
        // TODO: Implement generateMonthlyReport logic here
    }

    updateExpense(expenseId, updatedDetails) {
        // TODO: Implement updateExpense logic here
    }

    generateCategoryReport(category) {
        // TODO: Implement generateCategoryReport logic here
    }
}

module.exports = { FinanceManager };
```

Prompt:

Please help me to complete the functionality of the `FinanceManager` class by completing the following methods in it:

-`addExpense`:
    - should accept `expenseId` (string), `amount` (positive float), `category` (string), `date` (string in 'YYYY-MM-DD' format), and `description` (string)
    -  If the `amount`, `category`, or `date` is invalid, throw an error: `"Invalid expense details"`.
    - Store the expense details, including the `expenseId`, `amount`, `category`, `date`, and `description`.
    - Ensure the category is a valid pre-defined category (e.g., "Food", "Entertainment", "Transport") , if not exist then raise the error `"Invalid category"`.
    -  If the expense already exists (same `expenseId`), update the expense with the new details.

-`setCategoryBudget`:
   - should accept `category` (string) and `budgetAmount` (positive float)
   -  Ensure the category is valid (pre-defined categories).
   - Store the expense details, including the `expenseId`, `amount`, `category`, `date`, and `description`.
   - If the `budgetAmount` is invalid (non-positive number), throw an error: `"Invalid budget amount"`.
   - Store the budget for the specified category.


-`getExpenseHistory`:
   - should accept `startDate` (string in 'YYYY-MM-DD' format) and `endDate` (string in 'YYYY-MM-DD' format).
   -  Return an array of objects representing each expense in the range. Each object should contain: `expenseId` (string), `amount` (float), `category` (string), `date` (string) and `description` (string).
   - If there are no expenses in the given range, return an empty array.

-`generateMonthlyReport`:
   - should accept `year` (valid 'YYYY' integer, e.g., 2025) and `month` (integer, 1 through 12) and if accepted arguments are invalid raise the error "Invalid year or month".
    - Return a JSON object containing the total expenses for each category within the given month sorted by `category`.
    - The object should have category names as keys and total amounts as values. Example: `{ "Entertainment": 50.25, "Food": 250.5, "Transport": 100.75}`
   - If there are no expenses in the given month, return: `"No expenses for this month"`.

-`updateExpense`:
   - should accept `expenseId` (string) and `updatedDetails` (an object containing updated `amount`, `category`, `date`, and/or `description`)
   -  If the `expenseId` does not exist, throw an error: `"Expense not found"`.
   - Update the existing expense details with the new ones.
   - Ensure the new values are valid (e.g., `amount` must be positive, `category` must be valid, and `date` must be in the correct format).

-`generateCategoryReport`:
   - should accept `category` (string) .
   -  Return an object containing the following:
       - `totalAmount`: total expense for the category
       -  `averageAmount`: average expense per entry in that category.
       -  `expenseCount`: number of expenses in that category.
   -  Ensure the category is valid (pre-defined categories).


Error Handling:
- Throw an error `"Invalid expense details"` if any expense details are invalid.
- Throw an error `"Invalid budget amount"` if the budget amount is invalid.
- Throw an error `"Expense not found"` if an expense does not exist.
- Throw an error `"No expenses for this month"` if no expenses are found in the specified month.
- Throw an error `"No expenses in this category"` if there are no expenses for the given category.
- Throw an error `"Invalid category"` if there is no predefined category.


Example:
```javascript
const financeManager = new FinanceManager(); // Add an expense 
financeManager.addExpense('expense1', 50.75, 'Food', '2025-02-19', 'Lunch at a restaurant'); 
console.log(financeManager.expenses); 
// Output: { 
// expense1: 
{ 
// amount: 50.75, 
// category: 'Food', 
// date: '2025-02-19', 
// description: 'Lunch at a restaurant' 
// } 
// } 
// Set a budget for a category financeManager.
setCategoryBudget('Food', 200); 
console.log(financeManager.categoryBudgets); 
// Output: { Food: 200 }
```