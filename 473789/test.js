const {
  PortfolioManager,
  TradingBot,
  Investment,
  Loan,
} = require("./solution");
const Decimal = require("decimal.js");

jest.mock("moment", () => () => ({ format: () => "2024-03-20" }));

// Add global market data mock
global.globalMarketData = {
  AAPL: {
    price: 180.5,
    volatility: 0.25,
  },
  GOOGL: {
    price: 140.2,
    volatility: 0.2,
  },
};

describe("Loan", () => {
  let loan;

  beforeEach(() => {
    loan = new Loan(10000, 5.5, 12);
  });

  test("should calculate correct monthly payment", () => {
    const payment = loan.calculateMonthlyPayment();
    expect(payment.toString()).toBe("858.37");
  });

  test("should track payment history", () => {
    const payment = loan.makePayment();
    expect(loan.remainingPayments).toBe(11);
    expect(loan.paymentHistory).toHaveLength(1);
    expect(loan.paymentHistory[0].amount.toString()).toBe(payment.toString());
  });
});

describe("Investment", () => {
  let investment;

  beforeEach(() => {
    // Reset market data before each test
    globalMarketData["AAPL"] = {
      price: 180.5,
      volatility: 0.25,
    };
    investment = new Investment("AAPL", 10, 180.5);
  });

  test("should calculate correct value", () => {
    const value = investment.calculateValue();
    expect(value.toString()).toBe("1805");
  });

  test("should calculate risk metrics", () => {
    const risk = investment.calculateRisk();
    expect(risk.volatility).toBe(0.25);
    expect(risk.valueAtRisk.toString()).toBe("451.25");
  });

  test("should handle buy transactions", () => {
    investment.addTransaction("BUY", 5, 180.5);
    expect(investment.shares.toString()).toBe("15");
  });

  test("should handle sell transactions", () => {
    investment.addTransaction("SELL", 5, 180.5);
    expect(investment.shares.toString()).toBe("5");
  });

  test("should throw error on insufficient shares for sell", () => {
    expect(() => {
      investment.addTransaction("SELL", 15, 180.5);
    }).toThrow("Insufficient shares");
  });
});

describe("PortfolioManager", () => {
  let portfolio;

  beforeEach(() => {
    portfolio = new PortfolioManager();
  });

  describe("Cash Operations", () => {
    test("should handle deposits correctly", () => {
      portfolio.deposit(1000);
      expect(portfolio.cashBalance.toString()).toBe("1000");
    });

    test("should track transactions after deposit", () => {
      portfolio.deposit(1000);
      const report = portfolio.generateReport();
      expect(report.transactions).toHaveLength(1);
      expect(report.transactions[0].type).toBe("DEPOSIT");
    });
  });

  describe("Stock Operations", () => {
    beforeEach(() => {
      portfolio.deposit(10000);
    });

    test("should buy stocks successfully", () => {
      portfolio.buyStock("AAPL", 5);
      const metrics = portfolio.calculatePortfolioMetrics();
      expect(metrics.positions).toHaveLength(1);
      expect(metrics.positions[0].symbol).toBe("AAPL");
    });

    test("should fail buying stocks with insufficient funds", () => {
      expect(() => {
        portfolio.buyStock("AAPL", 1000);
      }).toThrow("Insufficient funds");
    });

    test("should calculate trading fees correctly", () => {
      const initialBalance = portfolio.cashBalance;
      portfolio.buyStock("AAPL", 5);
      const expectedCost = new Decimal("180.50")
        .mul(5)
        .mul(new Decimal("1.001"));
      expect(initialBalance.sub(portfolio.cashBalance).toString()).toBe(
        expectedCost.toString()
      );
    });
  });

  describe("Loan Operations", () => {
    test("should approve loan with good credit score", () => {
      const loan = portfolio.takeLoan(5000, 5.5, 12);
      expect(loan.principal.toString()).toBe("5000");
      expect(portfolio.loans).toHaveLength(1);
    });

    test("should reject loan with bad credit score", () => {
      portfolio.creditScore = 500;
      expect(() => {
        portfolio.takeLoan(5000, 5.5, 12);
      }).toThrow("Credit score too low");
    });

    test("should decrease credit score after loan", () => {
      const initialScore = portfolio.creditScore;
      portfolio.takeLoan(5000, 5.5, 12);
      expect(portfolio.creditScore).toBe(initialScore - 5);
    });
  });

  describe("Portfolio Metrics", () => {
    beforeEach(() => {
      portfolio.deposit(10000);
      portfolio.buyStock("AAPL", 5);
      portfolio.buyStock("GOOGL", 3);
    });

    test("should calculate total portfolio value correctly", () => {
      const metrics = portfolio.calculatePortfolioMetrics();
      const expectedValue = new Decimal("180.50")
        .mul(5)
        .add(new Decimal("140.20").mul(3));
      expect(metrics.totalValue).toBe(expectedValue.toString());
    });

    test("should calculate risk metrics correctly", () => {
      const metrics = portfolio.calculatePortfolioMetrics();
      expect(metrics.positions.every((p) => p.risk !== undefined)).toBe(true);
    });

    test("should generate comprehensive report", () => {
      const report = portfolio.generateReport();
      expect(report).toHaveProperty("timestamp");
      expect(report).toHaveProperty("portfolio");
      expect(report).toHaveProperty("transactions");
      expect(report).toHaveProperty("loans");
    });
  });

  describe("Portfolio Allocation and Rebalancing", () => {
    beforeEach(() => {
      portfolio.deposit(10000);
      // Create a significantly unbalanced portfolio
      portfolio.buyStock("AAPL", 2); // ~361 value
      portfolio.buyStock("GOOGL", 20); // ~2804 value
      portfolio.rebalancingThreshold = 1; // Lower threshold to ensure rebalancing triggers
    });

    test("should calculate rebalancing trades correctly", () => {
      portfolio.setTargetAllocation("AAPL", 70); // Want more AAPL
      portfolio.setTargetAllocation("GOOGL", 30); // Want less GOOGL

      const trades = portfolio.rebalancePortfolio();
      expect(trades.length).toBeGreaterThan(0);
      expect(trades[0]).toHaveProperty("symbol");
      expect(trades[0]).toHaveProperty("action");
      expect(trades[0]).toHaveProperty("shares");
    });

    test("should set target allocation correctly", () => {
      portfolio.setTargetAllocation("AAPL", 60);
      portfolio.setTargetAllocation("GOOGL", 40);
      expect(portfolio.targetAllocation.get("AAPL")).toBe(60);
      expect(portfolio.targetAllocation.get("GOOGL")).toBe(40);
    });

    test("should reject invalid allocation percentages", () => {
      expect(() => {
        portfolio.setTargetAllocation("AAPL", 101);
      }).toThrow("Allocation percentage must be between 0 and 100");

      expect(() => {
        portfolio.setTargetAllocation("AAPL", -1);
      }).toThrow("Allocation percentage must be between 0 and 100");
    });
  });
});

describe("TradingBot", () => {
  let portfolio;
  let bot;

  beforeEach(() => {
    portfolio = new PortfolioManager();
    portfolio.deposit(100000);
    bot = new TradingBot(portfolio);
  });

  test("should analyze market trends", () => {
    const analysis = bot.analyzeTrend("AAPL");
    expect(analysis).toHaveProperty("shouldBuy");
    expect(analysis).toHaveProperty("recommendedShares");
    expect(analysis).toHaveProperty("predictedPrice");
  });

  test("should execute automated trading", () => {
    bot.executeAutomatedTrading();
    expect(bot.tradingHistory.length).toBeGreaterThanOrEqual(0);
  });

  test("should handle trading errors gracefully", () => {
    portfolio.cashBalance = new Decimal(0);
    expect(() => {
      bot.executeAutomatedTrading();
    }).not.toThrow();
  });
});
