class FinancialToolkit {
    static convertCurrencyAmount(amount, fromCurrency, toCurrency, exchangeRate) {
        if (typeof amount !== 'number' || amount < 0) {
            throw new Error("Invalid amount.");
        }
        if (typeof exchangeRate !== 'number' || exchangeRate <= 0) {
            throw new Error("Invalid exchange rate.");
        }
        return amount * exchangeRate;
    }

    static calculateSimpleInterest(principal, rate, time) {
        if (principal < 0) {
            throw new Error("Principal must be a non-negative number.");
        }
        if (rate < 0) {
            throw new Error("Rate must be a non-negative number.");
        }
        if (time < 0) {
            throw new Error("Time must be a non-negative number.");
        }
        return principal * rate * time;
    }

    static calculateLoanPayment(principal, annualRate, years) {
        if (principal < 0) {
            throw new Error("Principal must be a non-negative number.");
        }
        if (annualRate < 0) {
            throw new Error("Annual rate must be a non-negative number.");
        }
        if (years <= 0) {
            throw new Error("Years must be greater than zero.");
        }
        let monthlyRate = annualRate / 12 / 100;
        let n = years * 12;
        if (monthlyRate === 0) return principal / n;
        let numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, n);
        let denominator = Math.pow(1 + monthlyRate, n) - 1;
        return numerator / denominator;
    }

    static calculateSavingsFutureValue(principal, rate, time) {
        if (principal < 0) {
            throw new Error("Principal must be a non-negative number.");
        }
        if (rate < 0) {
            throw new Error("Rate must be a non-negative number.");
        }
        if (time < 0) {
            throw new Error("Time must be a non-negative number.");
        }
        return principal * Math.pow(1 + rate, time);
    }

    static calculateTotalCost(price, taxRate) {
        if (price < 0) {
            throw new Error("Price must be a non-negative number.");
        }
        if (taxRate < 0) {
            throw new Error("Tax rate must be a non-negative number.");
        }
        return price * (1 + taxRate);
    }

    static determineBreakEvenPoint(fixedCosts, pricePerUnit, costPerUnit) {
        if (fixedCosts < 0) {
            throw new Error("Fixed costs must be a non-negative number.");
        }
        if (pricePerUnit <= costPerUnit) {
            throw new Error("Price per unit must be greater than cost per unit.");
        }
        return fixedCosts / (pricePerUnit - costPerUnit);
    }

    static calculatePercentageIncrease(originalValue, newValue) {
        if (originalValue < 0 || newValue < 0) {
            throw new Error("Values must be non-negative numbers.");
        }
        if (originalValue === 0) {
            throw new Error("Original value must be a positive number.");
        }
        return ((newValue - originalValue) / originalValue) * 100;
    }

    static compareInvestmentOptions(initialInvestment, options) {
        if (initialInvestment < 0) {
            throw new Error("Initial investment must be a non-negative number.");
        }
        if (!Array.isArray(options)) {
            throw new Error("Options must be an array.");
        }
        options.forEach((opt) => {
            if (typeof opt.expectedReturn !== 'number' || opt.expectedReturn < 0) {
                throw new Error("Expected return must be a non-negative number.");
            }
            opt.riskAdjustedReturn = opt.expectedReturn / (opt.risk || 1);
        });
        options.sort((a, b) => b.riskAdjustedReturn - a.riskAdjustedReturn);
        return {
            initialInvestment,
            bestOption: options[0],
            allOptions: options,
        };
    }

    static calculateDiscountedPrice(originalPrice, discountRate) {
        if (originalPrice < 0) {
            throw new Error("Original price must be a non-negative number.");
        }
        if (discountRate < 0 || discountRate > 1) {
            throw new Error("Discount rate must be between 0 and 1.");
        }
        return originalPrice * (1 - discountRate);
    }

    static calculateGrossProfit(revenue, costOfGoodsSold) {
        if (revenue < 0) {
            throw new Error("Revenue must be a non-negative number.");
        }
        if (costOfGoodsSold < 0) {
            throw new Error("Cost of goods sold must be a non-negative number.");
        }
        return revenue - costOfGoodsSold;
    }

    static calculateDebtToIncomeRatio(totalDebt, grossIncome) {
        if (totalDebt < 0) {
            throw new Error("Total debt must be a non-negative number.");
        }
        if (grossIncome <= 0) {
            throw new Error("Gross income must be greater than zero.");
        }
        return totalDebt / grossIncome;
    }

    static estimateInsuranceCost(age, healthFactor, coverageAmount) {
        if (age < 0 || coverageAmount < 0 || healthFactor <= 0) {
            throw new Error("Age, coverage amount, and health factor must be positive.");
        }
        let baseCost = coverageAmount / 1000;
        let ageMultiplier = age < 30 ? 1 : age < 60 ? 1.2 : 1.5;
        return baseCost * ageMultiplier * healthFactor;
    }

    static calculateAnnualSavings(monthlySaving) {
        if (monthlySaving < 0) {
            throw new Error("Monthly saving must be a non-negative number.");
        }
        return monthlySaving * 12;
    }

    static determineFinancialHealth(income, expenses) {
        if (income < 0) {
            throw new Error("Income must be a non-negative number.");
        }
        if (!Array.isArray(expenses)) {
            throw new Error("Expenses must be provided as an array.");
        }
        let totalExpenses = 0;
        for (let exp of expenses) {
            if (exp < 0) {
                throw new Error("Expense values must be non-negative.");
            }
            totalExpenses += exp;
        }
        let savings = income - totalExpenses;
        let savingsRate = income ? savings / income : 0;
        let healthStatus =
            savingsRate > 0.3 ? 'Good' : savingsRate > 0.1 ? 'Average' : 'Poor';
        return { income, totalExpenses, savings, savingsRate, healthStatus };
    }

    static generateBasicFinancialReport(transactions) {
        if (!Array.isArray(transactions)) throw new Error('Transactions must be an array.');
        let totalIncome = 0, totalExpenses = 0;
        transactions.forEach((tx) => {
            if (typeof tx.amount !== 'number') throw new Error('Each transaction must have a numeric amount.');
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