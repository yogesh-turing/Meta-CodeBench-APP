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
  
      // Check credit score eligibility
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
  
      // Check if loan amount is within acceptable limit
      if (loanAmount > 2 * balance) {
        return false;
      }
  
      // Calculate monthly installment (EMI)
      const monthlyRate = interestRate / 12 / 100;
      const totalPayments = repaymentYears * 12;
      const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
                  (Math.pow(1 + monthlyRate, totalPayments) - 1);
  
      // Update customer balance
      this.customerBalances.set(customerId, balance + loanAmount);
  
      return true;
    }
  }
  
  module.exports = { LoanProcessor };