class FinancialToolkit {
    static convertCurrencyAmount(amount, fromCurrency, toCurrency, exchangeRate) {
      if (typeof amount !== 'number' || isNaN(amount))
        throw new Error('Invalid amount: must be a number.');
      if (typeof fromCurrency !== 'string' || typeof toCurrency !== 'string')
        throw new Error('Currency codes must be strings.');
      if (typeof exchangeRate !== 'number' || exchangeRate <= 0)
        throw new Error('Exchange rate must be a positive number.');
      return amount * exchangeRate;
    }
  
    static calculateSimpleInterest(principal, rate, time) {
      if (typeof principal !== 'number' || principal < 0)
        throw new Error('Principal must be a non-negative number.');
      if (typeof rate !== 'number' || rate < 0)
        throw new Error('Rate must be a non-negative number.');
      if (typeof time !== 'number' || time < 0)
        throw new Error('Time period must be a non-negative number.');
      return principal * rate * time;
    }
  
    static calculateLoanPayment(principal, annualRate, years) {
      if (typeof principal !== 'number' || principal < 0)
        throw new Error('Principal must be a non-negative number.');
      if (typeof annualRate !== 'number' || annualRate < 0)
        throw new Error('Annual rate must be a non-negative number.');
      if (typeof years !== 'number' || years <= 0)
        throw new Error('Years must be a positive number.');
  
      const monthlyRate = annualRate / 12 / 100;
      const n = years * 12;
      if (monthlyRate === 0) {
        return principal / n;
      }
      const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, n);
      const denominator = Math.pow(1 + monthlyRate, n) - 1;
      if (denominator === 0)
        throw new Error('Invalid calculation: denominator is zero.');
      return numerator / denominator;
    }
  
    static calculateSavingsFutureValue(principal, rate, time) {
      if (typeof principal !== 'number' || principal < 0)
        throw new Error('Principal must be a non-negative number.');
      if (typeof rate !== 'number' || rate < 0)
        throw new Error('Rate must be a non-negative number.');
      if (typeof time !== 'number' || time < 0)
        throw new Error('Time period must be a non-negative number.');
      return principal * Math.pow(1 + rate, time);
    }
  
    static calculateTotalCost(price, taxRate) {
      if (typeof price !== 'number' || price < 0)
        throw new Error('Price must be a non-negative number.');
      if (typeof taxRate !== 'number' || taxRate < 0)
        throw new Error('Tax rate must be a non-negative number.');
      return price * (1 + taxRate);
    }
  
    static determineBreakEvenPoint(fixedCosts, pricePerUnit, costPerUnit) {
      if (typeof fixedCosts !== 'number' || fixedCosts < 0)
        throw new Error('Fixed costs must be a non-negative number.');
      if (typeof pricePerUnit !== 'number' || pricePerUnit < 0)
        throw new Error('Price per unit must be a non-negative number.');
      if (typeof costPerUnit !== 'number' || costPerUnit < 0)
        throw new Error('Cost per unit must be a non-negative number.');
  
      const contributionMargin = pricePerUnit - costPerUnit;
      if (contributionMargin <= 0)
        throw new Error(
          'Price per unit must exceed cost per unit to break even.'
        );
      return fixedCosts / contributionMargin;
    }
  
    static calculatePercentageIncrease(originalValue, newValue) {
      if (typeof originalValue !== 'number' || originalValue <= 0)
        throw new Error('Original value must be a positive number.');
      if (typeof newValue !== 'number')
        throw new Error('New value must be a number.');
      return ((newValue - originalValue) / originalValue) * 100;
    }
  
    static compareInvestmentOptions(initialInvestment, options) {
      if (typeof initialInvestment !== 'number' || initialInvestment < 0)
        throw new Error('Initial investment must be a non-negative number.');
      if (!Array.isArray(options)) throw new Error('Options must be an array.');
  
      const validOptions = options.filter((opt) => {
        return (
          opt &&
          typeof opt.name === 'string' &&
          typeof opt.expectedReturn === 'number' &&
          typeof opt.risk === 'number'
        );
      });
  
      if (validOptions.length === 0)
        throw new Error('No valid investment options provided.');
  
      validOptions.forEach((opt) => {
        opt.riskAdjustedReturn =
          opt.risk > 0 ? opt.expectedReturn / opt.risk : Infinity;
      });
  
      validOptions.sort((a, b) => b.riskAdjustedReturn - a.riskAdjustedReturn);
  
      return {
        initialInvestment,
        bestOption: validOptions[0],
        allOptions: validOptions,
      };
    }
  
    static calculateDiscountedPrice(originalPrice, discountRate) {
      if (typeof originalPrice !== 'number' || originalPrice < 0)
        throw new Error('Original price must be a non-negative number.');
      if (
        typeof discountRate !== 'number' ||
        discountRate < 0 ||
        discountRate > 1
      )
        throw new Error('Discount rate must be a number between 0 and 1.');
      return originalPrice * (1 - discountRate);
    }
  
    static calculateGrossProfit(revenue, costOfGoodsSold) {
      if (typeof revenue !== 'number' || revenue < 0)
        throw new Error('Revenue must be a non-negative number.');
      if (typeof costOfGoodsSold !== 'number' || costOfGoodsSold < 0)
        throw new Error('Cost of goods sold must be a non-negative number.');
      return revenue - costOfGoodsSold;
    }
  
    static calculateDebtToIncomeRatio(totalDebt, grossIncome) {
      if (typeof totalDebt !== 'number' || totalDebt < 0)
        throw new Error('Total debt must be a non-negative number.');
      if (typeof grossIncome !== 'number' || grossIncome <= 0)
        throw new Error('Gross income must be greater than zero.');
      return totalDebt / grossIncome;
    }
  
    static estimateInsuranceCost(age, healthFactor, coverageAmount) {
      if (typeof age !== 'number' || age <= 0)
        throw new Error('Age must be a positive number.');
      if (typeof healthFactor !== 'number' || healthFactor <= 0)
        throw new Error('Health factor must be a positive number.');
      if (typeof coverageAmount !== 'number' || coverageAmount <= 0)
        throw new Error('Coverage amount must be a positive number.');
  
      let baseCost = coverageAmount * 0.001;
      let ageMultiplier = 1;
      if (age >= 30 && age <= 50) {
        ageMultiplier = 1.2;
      } else if (age > 50) {
        ageMultiplier = 1.5;
      }
      return baseCost * ageMultiplier * healthFactor;
    }
  
    static calculateAnnualSavings(monthlySaving) {
      if (typeof monthlySaving !== 'number' || monthlySaving < 0)
        throw new Error('Monthly saving must be a non-negative number.');
      return monthlySaving * 12;
    }
  
    static determineFinancialHealth(income, expenses) {
      if (typeof income !== 'number' || income < 0)
        throw new Error('Income must be a non-negative number.');
      if (!Array.isArray(expenses))
        throw new Error('Expenses must be provided as an array.');
      const totalExpenses = expenses.reduce((sum, exp) => {
        if (typeof exp !== 'number' || exp < 0)
          throw new Error('Each expense must be a non-negative number.');
        return sum + exp;
      }, 0);
      const savings = income - totalExpenses;
      const savingsRate = income > 0 ? savings / income : 0;
      let healthStatus = 'Poor';
      if (savingsRate >= 0.2) {
        healthStatus = 'Good';
      } else if (savingsRate >= 0.1) {
        healthStatus = 'Average';
      }
      return {
        income,
        totalExpenses,
        savings,
        savingsRate,
        healthStatus,
      };
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