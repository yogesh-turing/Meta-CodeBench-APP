Base Code:
```javascript
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

```

Stack Trace:
```javascript
Testing implementation: base_code
========================================
 FAIL  newTAsk/index.test.js
  FinancialToolkit
    convertCurrencyAmount
      ✕ should correctly convert currency and throw errors on invalid input (3 ms)
    calculateSimpleInterest
      ✕ should compute interest correctly and throw errors on invalid input
    calculateLoanPayment
      ✕ should compute monthly payment correctly and throw errors on invalid input
    calculateSavingsFutureValue
      ✕ should compute future value correctly and handle invalid inputs
    calculateTotalCost
      ✕ should compute total cost correctly and handle invalid inputs (1 ms)
    determineBreakEvenPoint
      ✕ should compute break-even point correctly and handle invalid inputs (1 ms)
    calculatePercentageIncrease
      ✕ should compute percentage increase correctly and handle invalid inputs (1 ms)
    compareInvestmentOptions
      ✕ should return best option and throw errors on invalid input (3 ms)
    calculateDiscountedPrice
      ✕ should compute discounted price correctly and handle invalid inputs
    calculateGrossProfit
      ✕ should compute gross profit and handle invalid inputs
    calculateDebtToIncomeRatio
      ✕ should compute debt-to-income ratio and handle invalid inputs
    estimateInsuranceCost
      ✕ should estimate insurance cost correctly and handle invalid inputs
    calculateAnnualSavings
      ✕ should compute annual savings correctly and handle invalid inputs (1 ms)
    determineFinancialHealth
      ✕ should assess financial health correctly and handle invalid inputs (1 ms)
    generateBasicFinancialReport
      ✓ should generate a financial report correctly and handle invalid inputs (7 ms)

  ● FinancialToolkit › convertCurrencyAmount › should correctly convert currency and throw errors on invalid input

    expect(received).toThrow(expected)

    Expected pattern: /Invalid amount/

    Received function did not throw

      13 |       expect(() =>
      14 |         FinancialToolkit.convertCurrencyAmount('100', 'USD', 'EUR', 0.85)
    > 15 |       ).toThrow(/Invalid amount/);
         |         ^
      16 |       // Invalid currency codes
      17 |       expect(() =>
      18 |         FinancialToolkit.convertCurrencyAmount(100, 123, 'EUR', 0.85)

      at Object.toThrow (newTAsk/index.test.js:15:9)

  ● FinancialToolkit › calculateSimpleInterest › should compute interest correctly and throw errors on invalid input

    expect(received).toThrow(expected)

    Expected pattern: /Principal must be a non-negative number/

    Received function did not throw

      35 |       expect(() =>
      36 |         FinancialToolkit.calculateSimpleInterest(-1000, 0.05, 3)
    > 37 |       ).toThrow(/Principal must be a non-negative number/);
         |         ^
      38 |       expect(() =>
      39 |         FinancialToolkit.calculateSimpleInterest(1000, -0.05, 3)
      40 |       ).toThrow(/Rate must be a non-negative number/);

      at Object.toThrow (newTAsk/index.test.js:37:9)

  ● FinancialToolkit › calculateLoanPayment › should compute monthly payment correctly and throw errors on invalid input

    expect(received).toThrow(expected)

    Expected pattern: /Principal must be a non-negative number/

    Received function did not throw

      55 |       expect(() =>
      56 |         FinancialToolkit.calculateLoanPayment(-200000, 5, 30)
    > 57 |       ).toThrow(/Principal must be a non-negative number/);
         |         ^
      58 |       expect(() =>
      59 |         FinancialToolkit.calculateLoanPayment(200000, -5, 30)
      60 |       ).toThrow(/Annual rate must be a non-negative number/);

      at Object.toThrow (newTAsk/index.test.js:57:9)

  ● FinancialToolkit › calculateSavingsFutureValue › should compute future value correctly and handle invalid inputs

    expect(received).toBeCloseTo(expected)

    Expected: 1628.8946267774422
    Received: 1648.7212707001281

    Expected precision:    2
    Expected difference: < 0.005
    Received difference:   19.82664392268589

      69 |       expect(
      70 |         FinancialToolkit.calculateSavingsFutureValue(1000, 0.05, 10)
    > 71 |       ).toBeCloseTo(1000 * Math.pow(1.05, 10));
         |         ^
      72 |       expect(() =>
      73 |         FinancialToolkit.calculateSavingsFutureValue(-1000, 0.05, 10)
      74 |       ).toThrow(/Principal must be a non-negative number/);

      at Object.toBeCloseTo (newTAsk/index.test.js:71:9)

  ● FinancialToolkit › calculateTotalCost › should compute total cost correctly and handle invalid inputs

    expect(received).toBeCloseTo(expected)

    Expected: 110
    Received: 100.1

    Expected precision:    2
    Expected difference: < 0.005
    Received difference:   9.900000000000006

      84 |   describe('calculateTotalCost', () => {
      85 |     it('should compute total cost correctly and handle invalid inputs', () => {
    > 86 |       expect(FinancialToolkit.calculateTotalCost(100, 0.1)).toBeCloseTo(110);
         |                                                             ^
      87 |       expect(() => FinancialToolkit.calculateTotalCost(-100, 0.1)).toThrow(
      88 |         /Price must be a non-negative number/
      89 |       );

      at Object.toBeCloseTo (newTAsk/index.test.js:86:61)

  ● FinancialToolkit › determineBreakEvenPoint › should compute break-even point correctly and handle invalid inputs

    expect(received).toBeCloseTo(expected)

    Expected: 100
    Received: 40

    Expected precision:    2
    Expected difference: < 0.005
    Received difference:   60

       98 |       expect(
       99 |         FinancialToolkit.determineBreakEvenPoint(1000, 20, 10)
    > 100 |       ).toBeCloseTo(1000 / (20 - 10));
          |         ^
      101 |       expect(() =>
      102 |         FinancialToolkit.determineBreakEvenPoint(-1000, 20, 10)
      103 |       ).toThrow(/Fixed costs must be a non-negative number/);

      at Object.toBeCloseTo (newTAsk/index.test.js:100:9)

  ● FinancialToolkit › calculatePercentageIncrease › should compute percentage increase correctly and handle invalid inputs

    expect(received).toBeCloseTo(expected)

    Expected: 50
    Received: 40

    Expected precision:    2
    Expected difference: < 0.005
    Received difference:   10

      112 |       expect(
      113 |         FinancialToolkit.calculatePercentageIncrease(100, 150)
    > 114 |       ).toBeCloseTo(50);
          |         ^
      115 |       expect(() =>
      116 |         FinancialToolkit.calculatePercentageIncrease(0, 150)
      117 |       ).toThrow(/Original value must be a positive number/);

      at Object.toBeCloseTo (newTAsk/index.test.js:114:9)

  ● FinancialToolkit › compareInvestmentOptions › should return best option and throw errors on invalid input

    expect(received).toBe(expected) // Object.is equality

    Expected: "Option B"
    Received: "Option C"

      129 |       expect(result).toHaveProperty('bestOption');
      130 |       // Option B has risk-adjusted return 8/1 = 8, which is highest among these options.
    > 131 |       expect(result.bestOption.name).toBe('Option B');
          |                                      ^
      132 |
      133 |       expect(() =>
      134 |         FinancialToolkit.compareInvestmentOptions(-1000, [])

      at Object.toBe (newTAsk/index.test.js:131:38)

  ● FinancialToolkit › calculateDiscountedPrice › should compute discounted price correctly and handle invalid inputs

    expect(received).toThrow(expected)

    Expected pattern: /Original price must be a non-negative number/

    Received function did not throw

      150 |       expect(() =>
      151 |         FinancialToolkit.calculateDiscountedPrice(-100, 0.2)
    > 152 |       ).toThrow(/Original price must be a non-negative number/);
          |         ^
      153 |       expect(() => FinancialToolkit.calculateDiscountedPrice(100, 1.2)).toThrow(
      154 |         /Discount rate must be a number between 0 and 1/
      155 |       );

      at Object.toThrow (newTAsk/index.test.js:152:9)

  ● FinancialToolkit › calculateGrossProfit › should compute gross profit and handle invalid inputs

    expect(received).toThrow(expected)

    Expected pattern: /Revenue must be a non-negative number/

    Received function did not throw

      163 |     it('should compute gross profit and handle invalid inputs', () => {
      164 |       expect(FinancialToolkit.calculateGrossProfit(1000, 600)).toBeCloseTo(400);
    > 165 |       expect(() => FinancialToolkit.calculateGrossProfit(-1000, 600)).toThrow(
          |                                                                       ^
      166 |         /Revenue must be a non-negative number/
      167 |       );
      168 |       expect(() => FinancialToolkit.calculateGrossProfit(1000, -600)).toThrow(

      at Object.toThrow (newTAsk/index.test.js:165:71)

  ● FinancialToolkit › calculateDebtToIncomeRatio › should compute debt-to-income ratio and handle invalid inputs

    expect(received).toThrow(expected)

    Expected pattern: /Total debt must be a non-negative number/

    Received function did not throw

      179 |       expect(() =>
      180 |         FinancialToolkit.calculateDebtToIncomeRatio(-200, 1000)
    > 181 |       ).toThrow(/Total debt must be a non-negative number/);
          |         ^
      182 |       expect(() => FinancialToolkit.calculateDebtToIncomeRatio(200, 0)).toThrow(
      183 |         /Gross income must be greater than zero/
      184 |       );

      at Object.toThrow (newTAsk/index.test.js:181:9)

  ● FinancialToolkit › estimateInsuranceCost › should estimate insurance cost correctly and handle invalid inputs

    expect(received).toBeCloseTo(expected)

    Expected: 120
    Received: 150

    Expected precision:    2
    Expected difference: < 0.005
    Received difference:   30

      192 |       expect(costYoung).toBeCloseTo(100);
      193 |       const costMid = FinancialToolkit.estimateInsuranceCost(40, 1, 100000);
    > 194 |       expect(costMid).toBeCloseTo(100 * 1.2);
          |                       ^
      195 |       const costOld = FinancialToolkit.estimateInsuranceCost(60, 1, 100000);
      196 |       expect(costOld).toBeCloseTo(100 * 1.5);
      197 |

      at Object.toBeCloseTo (newTAsk/index.test.js:194:23)

  ● FinancialToolkit › calculateAnnualSavings › should compute annual savings correctly and handle invalid inputs

    expect(received).toThrow(expected)

    Expected pattern: /Monthly saving must be a non-negative number/

    Received function did not throw

      211 |     it('should compute annual savings correctly and handle invalid inputs', () => {
      212 |       expect(FinancialToolkit.calculateAnnualSavings(500)).toBeCloseTo(6000);
    > 213 |       expect(() => FinancialToolkit.calculateAnnualSavings(-500)).toThrow(
          |                                                                   ^
      214 |         /Monthly saving must be a non-negative number/
      215 |       );
      216 |     });

      at Object.toThrow (newTAsk/index.test.js:213:67)

  ● FinancialToolkit › determineFinancialHealth › should assess financial health correctly and handle invalid inputs

    expect(received).toThrow(expected)

    Expected pattern: /Income must be a non-negative number/

    Received function did not throw

      236 |       expect(() =>
      237 |         FinancialToolkit.determineFinancialHealth(-5000, [1000, 500])
    > 238 |       ).toThrow(/Income must be a non-negative number/);
          |         ^
      239 |       expect(() =>
      240 |         FinancialToolkit.determineFinancialHealth(5000, 'not an array')
      241 |       ).toThrow(/Expenses must be provided as an array/);

      at Object.toThrow (newTAsk/index.test.js:238:9)

Test Suites: 1 failed, 1 total
Tests:       14 failed, 1 passed, 15 total
Snapshots:   0 total
Time:        0.484 s, estimated 1 s
Ran all test suites matching /newTAsk/i.
```

Prompt:
I am developing a FinancialToolkit class in JavaScript to handle various financial calculations. However, during testing, the class is failing multiple tests as detailed below. I need help to address these issues, with examples provided for clarity:

- convertCurrencyAmount: Fails to throw errors for invalid inputs.
    - Input: FinancialToolkit.convertCurrencyAmount('100', 'USD', 'EUR', 0.85)
    - Expected: Throw an error indicating "Invalid amount."

- calculateSimpleInterest: Does not throw an error when invalid values are provided.
    - Input: FinancialToolkit.calculateSimpleInterest(-1000, 0.05, 3)
    - Expected: Throw an error indicating "Principal must be a non-negative number."

- calculateLoanPayment: Fails to throw an error for negative principal or annual rate, or zero years.
    - Input: FinancialToolkit.calculateLoanPayment(-200000, 5, 30)
    - Expected: Throw an error indicating "Principal must be a non-negative number."

- calculateSavingsFutureValue: Incorrect future value calculation.
    - Input: FinancialToolkit.calculateSavingsFutureValue(1000, 0.05, 10)
    - Expected: Correctly calculate future value to be close to 1628.89, but the function returns 1648.72.

- calculateTotalCost: Incorrect total cost calculation when tax is applied.
    - Input: FinancialToolkit.calculateTotalCost(100, 0.1)
    - Expected: 110.

- determineBreakEvenPoint: Incorrect break-even point calculation.
    - Input: FinancialToolkit.determineBreakEvenPoint(1000, 20, 10)
    - Expected: 100, but the function returns 40.

- calculatePercentageIncrease: Incorrect percentage increase calculation.
    - Input: FinancialToolkit.calculatePercentageIncrease(100, 150)
    - Expected: 50, but the function returns 40.

- compareInvestmentOptions: Incorrect identification of the best investment option.
    - Input: Options array where Option B should be best based on risk-adjusted returns.
    - Expected: Option B, but the function returns Option C.

- calculateDiscountedPrice: Fails to handle invalid discount rates.
    - Input: FinancialToolkit.calculateDiscountedPrice(100, -0.1)
    - Expected: Throw an error indicating "Discount rate must be between 0 and 1."

- calculateGrossProfit: Does not handle negative inputs as expected.
    - Input: FinancialToolkit.calculateGrossProfit(-1000, 600)
    - Expected: Throw an error indicating "Revenue must be a non-negative number."

- calculateDebtToIncomeRatio: Fails to handle negative total debt and zero gross income.
    - Input: FinancialToolkit.calculateDebtToIncomeRatio(-200, 1000)
    - Expected: Throw an error indicating "Total debt must be a non-negative number."

- estimateInsuranceCost: Incorrect insurance cost calculation for different age multipliers.
    - Input: FinancialToolkit.estimateInsuranceCost(40, 1, 100000)
    - Expected: 120, but the function returns 150.

- calculateAnnualSavings: Does not throw an error for negative monthly savings.
    - Input: FinancialToolkit.calculateAnnualSavings(-500)
    - Expected: Throw an error indicating "Monthly saving must be a non-negative number."

- determineFinancialHealth:Fails to handle negative income and non-array expenses.
    - Input: FinancialToolkit.determineFinancialHealth(-5000, [1000, 500])
    - Expected: Throw an error indicating "Income must be a non-negative number."

can you help me to fix those issues ?