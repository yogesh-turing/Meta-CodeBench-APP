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
  
      // Check if customer is eligible based on credit score
      if (creditScore < 600) {
        return false; // Reject loan due to low credit score
      }
  
      // Determine interest rate dynamically based on score
      let interestRate;
      if (creditScore >= 800) {
        interestRate = 4.0;
      } else if (creditScore >= 700 && creditScore < 800) {
        interestRate = 5.5;
      } else {
        interestRate = 7.0;
      }
  
      // Check if loan amount is within allowed limit
      if (loanAmount > 2 * balance) {
        return false; // Reject loan due to excessive amount
      }
  
      // Approve loan and update customer balance
      const newBalance = balance + loanAmount;
      this.customerBalances.set(customerId, newBalance);
  
      // Calculate monthly installment (EMI)
      const monthlyInterestRate = interestRate / 12 / 100;
      const totalPayments = repaymentYears * 12;
      const emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
  
      // Return true to indicate successful loan processing
      return true;
    }
  }
  
  module.exports = { LoanProcessor };