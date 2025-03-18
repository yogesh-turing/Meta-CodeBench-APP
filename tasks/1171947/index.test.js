const { FinancialToolkit, } = require('./model_a');

describe('FinancialToolkit', () => {
  describe('convertCurrencyAmount', () => {
    it('should correctly convert currency and throw errors on invalid input', () => {
      expect(
        FinancialToolkit.convertCurrencyAmount(100, 'USD', 'EUR', 0.85)
      ).toBeCloseTo(85);

      expect(() =>
        FinancialToolkit.convertCurrencyAmount('100', 'USD', 'EUR', 0.85)
      ).toThrow();
      // Invalid currency codes
      expect(() =>
        FinancialToolkit.convertCurrencyAmount(100, 123, 'EUR', 0.85)
      ).toThrow();
      // Invalid exchange rate (zero or negative)
      expect(() =>
        FinancialToolkit.convertCurrencyAmount(100, 'USD', 'EUR', 0)
      ).toThrow();
      expect(() =>
        FinancialToolkit.convertCurrencyAmount(100, 'USD', 'EUR', -1)
      ).toThrow();
    });
  });

  describe('calculateSimpleInterest', () => {
    it('should compute interest correctly and throw errors on invalid input', () => {
      expect(
        FinancialToolkit.calculateSimpleInterest(1000, 0.05, 3)
      ).toBeCloseTo(150);
      expect(() =>
        FinancialToolkit.calculateSimpleInterest(-1000, 0.05, 3)
      ).toThrow();
      expect(() =>
        FinancialToolkit.calculateSimpleInterest(1000, -0.05, 3)
      ).toThrow();
      expect(() =>
        FinancialToolkit.calculateSimpleInterest(1000, 0.05, -3)
      ).toThrow();
    });
  });

  describe('calculateLoanPayment', () => {
    it('should compute monthly payment correctly and throw errors on invalid input', () => {
      const payment = FinancialToolkit.calculateLoanPayment(200000, 5, 30);
      expect(payment).toBeCloseTo(1073.64, 1);
      // Zero interest rate
      expect(FinancialToolkit.calculateLoanPayment(120000, 0, 30)).toBeCloseTo(
        120000 / (30 * 12)
      );
      expect(() =>
        FinancialToolkit.calculateLoanPayment(-200000, 5, 30)
      ).toThrow();
      expect(() =>
        FinancialToolkit.calculateLoanPayment(200000, -5, 30)
      ).toThrow();
      expect(() =>
        FinancialToolkit.calculateLoanPayment(200000, 5, 0)
      ).toThrow();
    });
  });

  describe('calculateSavingsFutureValue', () => {
    it('should compute future value correctly and handle invalid inputs', () => {
      expect(
        FinancialToolkit.calculateSavingsFutureValue(1000, 0.05, 10)
      ).toBeCloseTo(1000 * Math.pow(1.05, 10));
      expect(() =>
        FinancialToolkit.calculateSavingsFutureValue(-1000, 0.05, 10)
      ).toThrow();
      expect(() =>
        FinancialToolkit.calculateSavingsFutureValue(1000, -0.05, 10)
      ).toThrow();
      expect(() =>
        FinancialToolkit.calculateSavingsFutureValue(1000, 0.05, -10)
      ).toThrow();
    });
  });

  describe('calculateTotalCost', () => {
    it('should compute total cost correctly and handle invalid inputs', () => {
      expect(FinancialToolkit.calculateTotalCost(100, 0.1)).toBeCloseTo(110);
      expect(() => FinancialToolkit.calculateTotalCost(-100, 0.1)).toThrow();
      expect(() => FinancialToolkit.calculateTotalCost(100, -0.1)).toThrow();
    });
  });

  describe('determineBreakEvenPoint', () => {
    it('should compute break-even point correctly and handle invalid inputs', () => {
      expect(
        FinancialToolkit.determineBreakEvenPoint(1000, 20, 10)
      ).toBeCloseTo(1000 / (20 - 10));
      expect(() =>
        FinancialToolkit.determineBreakEvenPoint(-1000, 20, 10)
      ).toThrow();
      expect(() =>
        FinancialToolkit.determineBreakEvenPoint(1000, 10, 20)
      ).toThrow();
    });
  });

  describe('calculatePercentageIncrease', () => {
    it('should compute percentage increase correctly and handle invalid inputs', () => {
      expect(
        FinancialToolkit.calculatePercentageIncrease(100, 150)
      ).toBeCloseTo(50);
      expect(() =>
        FinancialToolkit.calculatePercentageIncrease(0, 150)
      ).toThrow();
    });
  });

  describe('compareInvestmentOptions', () => {
    it('should return best option and throw errors on invalid input', () => {
      const options = [
        { name: 'Option A', expectedReturn: 10, risk: 2 },
        { name: 'Option B', expectedReturn: 8, risk: 1 },
        { name: 'Option C', expectedReturn: 12, risk: 3 },
      ];
      const result = FinancialToolkit.compareInvestmentOptions(1000, options);
      expect(result).toHaveProperty('bestOption');
      expect(result.bestOption.name).toBe('Option B');
      expect(() =>
        FinancialToolkit.compareInvestmentOptions(-1000, [])
      ).toThrow();
      expect(() =>
        FinancialToolkit.compareInvestmentOptions(1000, 'invalid')
      ).toThrow();
      expect(() =>
        FinancialToolkit.compareInvestmentOptions(1000, [{}, null])
      ).toThrow();
    });
  });

  describe('calculateDiscountedPrice', () => {
    it('should compute discounted price correctly and handle invalid inputs', () => {
      expect(FinancialToolkit.calculateDiscountedPrice(100, 0.2)).toBeCloseTo(
        80
      );
      expect(() =>
        FinancialToolkit.calculateDiscountedPrice(-100, 0.2)
      ).toThrow();
      expect(() =>
        FinancialToolkit.calculateDiscountedPrice(100, 1.2)
      ).toThrow();
      expect(() =>
        FinancialToolkit.calculateDiscountedPrice(100, -0.1)
      ).toThrow();
    });
  });

  describe('calculateGrossProfit', () => {
    it('should compute gross profit and handle invalid inputs', () => {
      expect(FinancialToolkit.calculateGrossProfit(1000, 600)).toBeCloseTo(400);
      expect(() => FinancialToolkit.calculateGrossProfit(-1000, 600)).toThrow();
      expect(() => FinancialToolkit.calculateGrossProfit(1000, -600)).toThrow();
    });
  });

  describe('calculateDebtToIncomeRatio', () => {
    it('should compute debt-to-income ratio and handle invalid inputs', () => {
      expect(
        FinancialToolkit.calculateDebtToIncomeRatio(200, 1000)
      ).toBeCloseTo(0.2);
      expect(() =>
        FinancialToolkit.calculateDebtToIncomeRatio(-200, 1000)
      ).toThrow();
      expect(() =>
        FinancialToolkit.calculateDebtToIncomeRatio(200, 0)
      ).toThrow();
    });
  });

  describe('estimateInsuranceCost', () => {
    it('should estimate insurance cost correctly and handle invalid inputs', () => {
      // For different age groups (base cost = coverageAmount * 0.001)
      const costYoung = FinancialToolkit.estimateInsuranceCost(25, 1, 100000);
      expect(costYoung).toBeCloseTo(100);
      const costMid = FinancialToolkit.estimateInsuranceCost(40, 1, 100000);
      expect(costMid).toBeCloseTo(100 * 1.2);
      const costOld = FinancialToolkit.estimateInsuranceCost(60, 1, 100000);
      expect(costOld).toBeCloseTo(100 * 1.5);

      expect(() =>
        FinancialToolkit.estimateInsuranceCost(0, 1, 100000)
      ).toThrow();
      expect(() =>
        FinancialToolkit.estimateInsuranceCost(30, 0, 100000)
      ).toThrow();
      expect(() => FinancialToolkit.estimateInsuranceCost(30, 1, 0)).toThrow();
    });
  });

  describe('calculateAnnualSavings', () => {
    it('should compute annual savings correctly and handle invalid inputs', () => {
      expect(FinancialToolkit.calculateAnnualSavings(500)).toBeCloseTo(6000);
      expect(() => FinancialToolkit.calculateAnnualSavings(-500)).toThrow();
    });
  });

  describe('determineFinancialHealth', () => {
    it('should assess financial health correctly and handle invalid inputs', () => {
      const result = FinancialToolkit.determineFinancialHealth(
        5000,
        [1000, 500, 800]
      );
      expect(result.income).toBe(5000);
      expect(result.totalExpenses).toBeCloseTo(2300);
      expect(result.savings).toBeCloseTo(2700);
      expect(result.savingsRate).toBeCloseTo(2700 / 5000);
      if (result.savingsRate >= 0.2) {
        expect(result.healthStatus).toBe('Good');
      } else if (result.savingsRate >= 0.1) {
        expect(result.healthStatus).toBe('Average');
      } else {
        expect(result.healthStatus).toBe('Poor');
      }
      expect(() =>
        FinancialToolkit.determineFinancialHealth(-5000, [1000, 500])
      ).toThrow();
      expect(() =>
        FinancialToolkit.determineFinancialHealth(5000, 'not an array')
      ).toThrow();
      expect(() =>
        FinancialToolkit.determineFinancialHealth(5000, [1000, '500'])
      ).toThrow();
    });
  });

  describe('generateBasicFinancialReport', () => {
    it('should generate a financial report correctly and handle invalid inputs', () => {
      const transactions = [
        { date: '2023-01-01', description: 'Income', amount: 2000 },
        { date: '2023-01-02', description: 'Expense', amount: -500 },
        { date: '2023-01-03', description: 'Income', amount: 1500 },
        { date: '2023-01-04', description: 'Expense', amount: -300 },
      ];
      const report =
        FinancialToolkit.generateBasicFinancialReport(transactions);
      expect(report.totalIncome).toBeCloseTo(3500);
      expect(report.totalExpenses).toBeCloseTo(-800);
      expect(report.netBalance).toBeCloseTo(3500 - 800);
      expect(report.transactionCount).toBe(transactions.length);

      expect(() =>
        FinancialToolkit.generateBasicFinancialReport('not an array')
      ).toThrow();
      expect(() =>
        FinancialToolkit.generateBasicFinancialReport([
          { date: '2023-01-01', description: 'Test', amount: 'NaN' },
        ])
      ).toThrow();
    });
  });
});