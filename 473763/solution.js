class LoanProcessor {
  // Static constant for base interest rate
  static BASE_INTEREST_RATE = 5.0;

  constructor() {
    // Maps to store customer balances and credit scores
    this.customerBalances = new Map();
    this.customerCreditScores = new Map();
  }

  // Method to add a customer
  addCustomer(customerId, balance, creditScore) {
    this.customerBalances.set(customerId, balance);
    this.customerCreditScores.set(customerId, creditScore);
  }

  // Method to process a loan application
  processLoanApplication(customerId, loanAmount, repaymentYears) {
    // Check if customer exists
    if (!this.customerBalances.has(customerId) || !this.customerCreditScores.has(customerId)) {
      throw new Error("Customer not found!");
    }

    const creditScore = this.customerCreditScores.get(customerId);
    const balance = this.customerBalances.get(customerId);

    // Reject loan if credit score is less than 600
    if (creditScore < 600) {
      return false;
    }

    // Determine interest rate based on credit score
    let interestRate;
    if (creditScore >= 800) {
      interestRate = 4.0;
    } else if (creditScore >= 700) {
      interestRate = 5.5;
    } else {
      interestRate = 7.0;
    }

    // Reject loan if amount exceeds twice the balance or is non-positive
    if (loanAmount > 2 * balance || loanAmount <= 0) {
      return false;
    }

    // Update customer balance
    this.customerBalances.set(customerId, balance + loanAmount);

    // Calculate EMI
    const monthlyInterestRate = (interestRate / 100) / 12;
    const totalMonths = repaymentYears * 12;

    let emi;
    if (monthlyInterestRate === 0) {
      emi = loanAmount / totalMonths;
    } else {
      const factor = Math.pow(1 + monthlyInterestRate, totalMonths);
      emi = (loanAmount * monthlyInterestRate * factor) / (factor - 1);
    }

    // Return true if loan is successfully processed
    return true;
  }
}

module.exports = {LoanProcessor};