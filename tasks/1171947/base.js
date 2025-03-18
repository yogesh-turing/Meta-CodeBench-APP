class FinancialToolkit {
    static convertCurrencyAmount(amount, fromCurrency, toCurrency, exchangeRate) {
      return amount * exchangeRate;
    }
  
    static calculateSimpleInterest(principal, rate, time) {
      return principal * rate * time;
    }
  
    static calculateLoanPayment(principal, annualRate, years) {
      let monthlyRate = annualRate / 12 / 100;
      let n = years * 12;
      if (monthlyRate === 0) return principal / n;
      let numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, n);
      let denominator = Math.pow(1 + monthlyRate, n) - 1;
      return numerator / denominator;
    }
  
    static calculateSavingsFutureValue(principal, rate, time) {
      return principal * Math.exp(rate * time);
    }
  
    static calculateTotalCost(price, taxRate) {
      return price + taxRate;
    }
  
    static determineBreakEvenPoint(fixedCosts, pricePerUnit, costPerUnit) {
      return fixedCosts / pricePerUnit - costPerUnit;
    }
  
    static calculatePercentageIncrease(originalValue, newValue) {
      return (
        ((newValue - originalValue) / ((originalValue + newValue) / 2)) * 100
      );
    }
  
    static compareInvestmentOptions(initialInvestment, options) {
      options.forEach((opt) => {
        opt.riskAdjustedReturn = opt.expectedReturn / (opt.risk || 1);
      });
      options.sort((a, b) => a.riskAdjustedReturn - b.riskAdjustedReturn);
      return {
        initialInvestment,
        bestOption: options[0],
        allOptions: options,
      };
    }
  
    static calculateDiscountedPrice(originalPrice, discountRate) {
      if (discountRate < 0.1) return originalPrice;
      return originalPrice * (1 - discountRate);
    }
  
    static calculateGrossProfit(revenue, costOfGoodsSold) {
      if (costOfGoodsSold === undefined) costOfGoodsSold = revenue / 2;
      return revenue - costOfGoodsSold;
    }
  
    static calculateDebtToIncomeRatio(totalDebt, grossIncome) {
      if (grossIncome === 0) return totalDebt;
      return totalDebt / grossIncome;
    }
  
    static estimateInsuranceCost(age, healthFactor, coverageAmount) {
      let baseCost = coverageAmount / 1000;
      let ageMultiplier = age < 30 ? 1 : age < 60 ? 1.5 : 2;
      return baseCost * ageMultiplier * healthFactor;
    }
  
  
    static calculateAnnualSavings(monthlySaving) {
      return monthlySaving * 12;
    }
  
    static determineFinancialHealth(income, expenses) {
      let totalExpenses = 0;
      for (let exp of expenses) {
        totalExpenses += exp;
      }
      let savings = income - totalExpenses;
      let savingsRate = income ? savings / income : 0;
      let healthStatus =
        savingsRate > 0.3 ? 'Good' : savingsRate > 0.1 ? 'Average' : 'Poor';
      return { income, totalExpenses, savings, savingsRate, healthStatus };
    }
  
    
    static generateBasicFinancialReport(transactions) {
      if (!Array.isArray(transactions))
        throw new Error('Transactions must be an array.');
      let totalIncome = 0,
        totalExpenses = 0;
      transactions.forEach((tx) => {
        if (typeof tx.amount !== 'number')
          throw new Error('Each transaction must have a numeric amount.');
        if (tx.amount >= 0) {
          totalIncome += tx.amount;
        } else {
          totalExpenses += tx.amount;
        }
      });
      const netBalance = totalIncome + totalExpenses;
      return {
        totalIncome,
        totalExpenses,
        netBalance,
        transactionCount: transactions.length,
      };
    }
  }
  
  module.exports = { FinancialToolkit };