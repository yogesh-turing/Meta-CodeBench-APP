class FinancialToolkit {
    static convertCurrencyAmount(amount, fromCurrency, toCurrency, exchangeRate) {
      if (typeof amount !== 'number') throw new Error('Invalid amount');
      if (typeof fromCurrency !== 'string') throw new Error('Invalid from currency');
      if (typeof toCurrency !== 'string') throw new Error('Invalid to currency');
      if (typeof exchangeRate !== 'number' || exchangeRate <= 0) throw new Error('Invalid exchange rate');
      return amount * exchangeRate;
    }
  
    static calculateSimpleInterest(principal, rate, time) {
      if (principal < 0) throw new Error('Principal must be a non-negative number');
      if (rate < 0) throw new Error('Rate must be a non-negative number');
      if (time <= 0) throw new Error('Time must be a positive number');
      return principal * rate * time;
    }
  
    static calculateLoanPayment(principal, annualRate, years) {
      if (principal < 0) throw new Error('Principal must be a non-negative number');
      if (annualRate < 0) throw new Error('Annual rate must be a non-negative number');
      if (years <= 0) throw new Error('Years must be a positive number');
      
      let monthlyRate = annualRate / 12 / 100;
      let n = years * 12;
      if (monthlyRate === 0) return principal / n;
      let numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, n);
      let denominator = Math.pow(1 + monthlyRate, n) - 1;
      return numerator / denominator;
    }
  
    static calculateSavingsFutureValue(principal, rate, time) {
      if (principal < 0) throw new Error('Principal must be a non-negative number');
      if (rate < 0) throw new Error('Rate must be a non-negative number');
      if (time <= 0) throw new Error('Time must be a positive number');
      return principal * Math.pow(1 + rate, time);
    }
  
    static calculateTotalCost(price, taxRate) {
      if (price < 0) throw new Error('Price must be a non-negative number');
      if (taxRate < 0) throw new Error('Tax rate must be a non-negative number');
      return price * (1 + taxRate);
    }
  
    static determineBreakEvenPoint(fixedCosts, pricePerUnit, costPerUnit) {
      if (fixedCosts < 0) throw new Error('Fixed costs must be a non-negative number');
      if (pricePerUnit <= costPerUnit) throw new Error('Price per unit must be greater than cost per unit');
      return fixedCosts / (pricePerUnit - costPerUnit);
    }
  
    static calculatePercentageIncrease(originalValue, newValue) {
      if (originalValue <= 0) throw new Error('Original value must be a positive number');
      if (newValue <= 0) throw new Error('New value must be a positive number');
      return ((newValue - originalValue) / originalValue) * 100;
    }
  
    static compareInvestmentOptions(initialInvestment, options) {
      if (initialInvestment < 0) throw new Error('Initial investment must be non-negative');
      if (!Array.isArray(options) || options.length === 0) throw new Error('Invalid options array');
  
      const ratedOptions = options.map(opt => ({
        ...opt,
        riskAdjustedReturn: opt.expectedReturn / (opt.risk || 1)
      }));
  
      ratedOptions.sort((a, b) => b.riskAdjustedReturn - a.riskAdjustedReturn);
  
      return {
        initialInvestment,
        bestOption: ratedOptions[0],
        allOptions: ratedOptions
      };
    }
  
    static calculateDiscountedPrice(originalPrice, discountRate) {
      if (originalPrice < 0) throw new Error('Original price must be a non-negative number');
      if (discountRate < 0 || discountRate > 1) throw new Error('Discount rate must be a number between 0 and 1');
      return originalPrice * (1 - discountRate);
    }
  
    static calculateGrossProfit(revenue, costOfGoodsSold) {
      if (revenue < 0) throw new Error('Revenue must be a non-negative number');
      if (costOfGoodsSold < 0) throw new Error('Cost of goods sold must be a non-negative number');
      return revenue - (costOfGoodsSold || revenue / 2);
    }
  
    static calculateDebtToIncomeRatio(totalDebt, grossIncome) {
      if (totalDebt < 0) throw new Error('Total debt must be a non-negative number');
      if (grossIncome <= 0) throw new Error('Gross income must be greater than zero');
      return totalDebt / grossIncome;
    }
  
    static estimateInsuranceCost(age, healthFactor, coverageAmount) {
      if (age < 0) throw new Error('Age must be a non-negative number');
      if (healthFactor <= 0) throw new Error('Health factor must be positive');
      if (coverageAmount <= 0) throw new Error('Coverage amount must be positive');
  
      let baseCost = coverageAmount / 1000;
      let ageMultiplier = age < 30 ? 1 : age < 60 ? 1.2 : 1.5;
      return baseCost * ageMultiplier * healthFactor;
    }
  
    static calculateAnnualSavings(monthlySaving) {
      if (monthlySaving < 0) throw new Error('Monthly saving must be a non-negative number');
      return monthlySaving * 12;
    }
  
    static determineFinancialHealth(income, expenses) {
      if (income < 0) throw new Error('Income must be a non-negative number');
      if (!Array.isArray(expenses)) throw new Error('Expenses must be provided as an array');
      
      let totalExpenses = expenses.reduce((sum, exp) => {
        if (exp < 0) throw new Error('Expenses must be non-negative numbers');
        return sum + exp;
      }, 0);
  
      let savings = income - totalExpenses;
      let savingsRate = income ? savings / income : 0;
      let healthStatus = savingsRate > 0.3 ? 'Good' : savingsRate > 0.1 ? 'Average' : 'Poor';
      
      return { income, totalExpenses, savings, savingsRate, healthStatus };
    }
  
    static generateBasicFinancialReport(transactions) {
      if (!Array.isArray(transactions)) throw new Error('Transactions must be an array');
      
      let totalIncome = 0, totalExpenses = 0;
      
      transactions.forEach(tx => {
        if (typeof tx.amount !== 'number') throw new Error('Each transaction must have a numeric amount');
        if (tx.amount >= 0) {
          totalIncome += tx.amount;
        } else {
          totalExpenses += Math.abs(tx.amount);
        }
      });
  
      return {
        totalIncome,
        totalExpenses: -totalExpenses,
        netBalance: totalIncome - totalExpenses,
        transactionCount: transactions.length
      };
    }
  }
  
  module.exports = { FinancialToolkit };