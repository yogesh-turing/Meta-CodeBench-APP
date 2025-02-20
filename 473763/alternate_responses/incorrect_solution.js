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

    // Check if customer is eligible based on credit score.
    if (creditScore < 600) {
      return false;
    }

    // Determine interest rate dynamically based on score.
    let interestRate;
    if (creditScore >= 800) {
      interestRate = 4.0;
    } else if (creditScore >= 700 && creditScore < 800) {
      interestRate = 5.5;
    } else {
      interestRate = 7.0;
    }

    // Approve or reject the loan.
    if (loanAmount > 2 * balance) {
      return false;
    }

    // Update customer balance.
    this.customerBalances.set(customerId, balance + loanAmount);

    // Calculate monthly installment.
    const emi = this.calculateEmi(loanAmount, interestRate, repaymentYears);

    return true;
  }

  calculateEmi(loanAmount, interestRate, repaymentYears) {
    const r = interestRate / 12 / 100;
    const n = repaymentYears * 12;

    return (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }
}

module.exports = {LoanProcessor};