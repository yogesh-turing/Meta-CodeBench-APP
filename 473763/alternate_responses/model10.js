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

    if (creditScore < 600) {
      return false; // Reject loan due to low credit score
    }

    let interestRate;
    if (creditScore >= 800) {
      interestRate = 4.0;
    } else if (creditScore >= 700) {
      interestRate = 5.5;
    } else {
      interestRate = 7.0;
    }

    if (loanAmount > 2 * balance) {
      return false; // Reject loan due to excessive loan amount
    }

    // Update customer balance
    this.customerBalances.set(customerId, balance + loanAmount);

    // Calculate monthly installment (EMI)
    const monthlyInterestRate = interestRate / 12 / 100;
    const totalPayments = repaymentYears * 12;
    const emi = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments) / (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

    return true; // Loan successfully processed
  }
}

module.exports = { LoanProcessor };