class LoanProcessor {
  constructor() {
    this.customerBalances = new Map();
    this.customerCreditScores = new Map();
    this.BASE_INTEREST_RATE = 5.0;
  }

  addCustomer(customerId, balance, creditScore) {
    this.customerBalances.set(customerId, balance);
    this.customerCreditScores.set(customerId, creditScore);
  }

  processLoanApplication(customerId, loanAmount, repaymentYears) {
    if (!this.customerBalances.has(customerId) || !this.customerCreditScores.has(customerId)) {
      throw new Error("Customer not found!");
    }

    const creditScore = this.customerCreditScores.get(customerId);
    const balance = this.customerBalances.get(customerId);

    // TODO: Implement loan processing logic
    // 1. Check if customer is eligible based on credit score.
    // 2. Determine interest rate dynamically based on score.
    // 3. Approve or reject the loan.
    // 4. If approved, update customer balance.
    // 5. Calculate monthly installment and return true if loan is successfully processed.

    return false; // Placeholder
  }
}

module.exports = {LoanProcessor};