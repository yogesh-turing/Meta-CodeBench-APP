const Decimal = require('decimal.js');
const moment = require('moment');
const { EventEmitter } = require('events');

let globalTransactions = [];
let globalPortfolio = {};
let globalMarketData = {
    'AAPL': { price: 180.50, volatility: 0.25 },
    'GOOGL': { price: 140.20, volatility: 0.28 },
    'MSFT': { price: 390.30, volatility: 0.22 },
    'AMZN': { price: 178.90, volatility: 0.32 },
    'BTC': { price: 65000.00, volatility: 0.85 },
    'ETH': { price: 3500.00, volatility: 0.90 },
};

class FinancialError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FinancialError';
    }
}

class InsufficientFundsError extends FinancialError {
    constructor(message) {
        super(message);
        this.name = 'InsufficientFundsError';
    }
}

class InsufficientSharesError extends FinancialError {
    constructor(message) {
        super(message);
        this.name = 'InsufficientSharesError';
    }
}

class InvalidAllocationError extends FinancialError {
    constructor(message) {
        super(message);
        this.name = 'InvalidAllocationError';
    }
}

class Loan {
    constructor(principal, annualRate, months) {
        this.principal = new Decimal(principal);
        this.annualRate = new Decimal(annualRate);
        this.months = months;
        this.remainingPayments = months;
        this.paymentHistory = [];
    }

    calculateMonthlyPayment() {
        const monthlyRate = this.annualRate.div(100).div(12);
        const payment = this.principal.mul(
            monthlyRate.mul(
                Decimal.pow(monthlyRate.add(1), this.months)
            )
        ).div(
            Decimal.pow(monthlyRate.add(1), this.months).sub(1)
        );
        return payment.toDecimalPlaces(2);
    }

    makePayment() {
        const payment = this.calculateMonthlyPayment();
        this.remainingPayments--;
        this.paymentHistory.push({
            date: moment().format('YYYY-MM-DD'),
            amount: payment
        });
        return payment;
    }
}

class RiskCalculator {
    calculate(investment) {
        const value = investment.calculateValue();
        const volatility = globalMarketData[investment.symbol].volatility;
        return {
            volatility: volatility,
            valueAtRisk: value.mul(volatility).toDecimalPlaces(2)
        };
    }
}

class Investment {
    constructor(symbol, shares, purchasePrice) {
        this.symbol = symbol;
        this.shares = new Decimal(shares);
        this.purchasePrice = new Decimal(purchasePrice);
        this.transactions = [];
        this.performanceHistory = [];
        this.riskCalculator = new RiskCalculator();
    }

    calculateValue() {
        return this.shares.mul(new Decimal(globalMarketData[this.symbol].price)).toDecimalPlaces(2);
    }

    calculateRisk() {
        return this.riskCalculator.calculate(this);
    }

    addTransaction(type, shares, price) {
        if (type === 'SELL' && shares > this.shares) {
            throw new InsufficientSharesError('Insufficient shares');
        }
        
        this.transactions.push({
            type,
            shares: new Decimal(shares),
            price: new Decimal(price),
            timestamp: moment().format('YYYY-MM-DD')
        });

        if (type === 'BUY') {
            this.shares = this.shares.add(shares);
        } else if (type === 'SELL') {
            this.shares = this.shares.sub(shares);
        }
    }
}

class BuyStockCommand {
    constructor(portfolio, symbol, shares) {
        this.portfolio = portfolio;
        this.symbol = symbol;
        this.shares = shares;
    }

    execute() {
        const price = new Decimal(globalMarketData[this.symbol].price);
        const totalCost = price.mul(this.shares).mul(this.portfolio.tradingFee.add(1));

        if (totalCost.greaterThan(this.portfolio.cashBalance)) {
            throw new InsufficientFundsError('Insufficient funds');
        }

        if (!this.portfolio.investments.has(this.symbol)) {
            this.portfolio.investments.set(this.symbol, new Investment(this.symbol, 0, price));
        }

        const investment = this.portfolio.investments.get(this.symbol);
        investment.addTransaction('BUY', this.shares, price);
        this.portfolio.cashBalance = this.portfolio.cashBalance.sub(totalCost);
    }
}

class PortfolioManager extends EventEmitter {
    constructor() {
        super();
        this.investments = new Map();
        this.cashBalance = new Decimal(0);
        this.tradingFee = new Decimal(0.001);
        this.loans = [];
        this.creditScore = 700;
        globalTransactions = [];
        this.targetAllocation = new Map();
        this.rebalancingThreshold = 5; // 5% deviation threshold
        this.autoReinvestDividends = true;
    }

    takeLoan(amount, interestRate, months) {
        if (this.creditScore < 600) {
            throw new FinancialError('Credit score too low');
        }
        const loan = new Loan(amount, interestRate, months);
        this.loans.push(loan);
        this.cashBalance = this.cashBalance.add(amount);
        this.creditScore -= 5;
        this.emit('loanTaken', loan);
        return loan;
    }

    deposit(amount) {
        this.cashBalance = this.cashBalance.add(amount);
        globalTransactions.push({
            type: 'DEPOSIT',
            amount,
            date: moment().format('YYYY-MM-DD')
        });
        this.emit('depositMade', amount);
    }

    buyStock(symbol, shares) {
        const command = new BuyStockCommand(this, symbol, shares);
        command.execute();
        this.emit('stockBought', symbol, shares);
    }

    calculatePortfolioMetrics() {
        let totalValue = new Decimal(0);
        let totalRisk = new Decimal(0);
        const positions = [];

        for (const [symbol, investment] of this.investments) {
            const value = investment.calculateValue();
            const risk = investment.calculateRisk();
            
            totalValue = totalValue.add(value);
            totalRisk = totalRisk.add(risk.valueAtRisk);

            positions.push({
                symbol,
                shares: investment.shares.toString(),
                value: value.toString(),
                risk: risk.volatility
            });
        }

        return {
            totalValue: totalValue.toString(),
            totalRisk: totalRisk.toString(),
            cashBalance: this.cashBalance.toString(),
            positions
        };
    }

    generateReport() {
        const metrics = this.calculatePortfolioMetrics();
        const report = {
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            portfolio: metrics,
            transactions: globalTransactions.slice(-10), // Last 10 transactions
            loans: this.loans.map(loan => ({
                principal: loan.principal.toString(),
                remainingPayments: loan.remainingPayments,
                monthlyPayment: loan.calculateMonthlyPayment().toString()
            }))
        };

        return report;
    }

    setTargetAllocation(symbol, percentage) {
        if (percentage < 0 || percentage > 100) {
            throw new InvalidAllocationError('Allocation percentage must be between 0 and 100');
        }
        this.targetAllocation.set(symbol, percentage);
    }

    rebalancePortfolio() {
        const metrics = this.calculatePortfolioMetrics();
        const totalValue = new Decimal(metrics.totalValue);
        const rebalancingTrades = [];

        for (const [symbol, targetPercentage] of this.targetAllocation) {
            const investment = this.investments.get(symbol);
            if (!investment) continue;

            const currentValue = investment.calculateValue();
            const currentPercentage = currentValue.div(totalValue).mul(100);
            const deviation = currentPercentage.sub(targetPercentage).abs();

            if (deviation.greaterThan(this.rebalancingThreshold)) {
                const targetValue = totalValue.mul(targetPercentage).div(100);
                const currentPrice = new Decimal(globalMarketData[symbol].price);
                const shareDifference = targetValue.sub(currentValue).div(currentPrice);

                rebalancingTrades.push({
                    symbol,
                    action: shareDifference.isPositive() ? 'BUY' : 'SELL',
                    shares: shareDifference.abs().toDecimalPlaces(4)
                });
            }
        }

        return rebalancingTrades;
    }

    processAllDividends() {
        let totalDividends = new Decimal(0);

        for (const [symbol, investment] of this.investments) {
            investment.dividendYield = new Decimal(globalMarketData[symbol].dividendYield || 0);
            const dividendAmount = investment.processDividend();
            totalDividends = totalDividends.add(dividendAmount);

            if (this.autoReinvestDividends && dividendAmount.greaterThan(0)) {
                const currentPrice = new Decimal(globalMarketData[symbol].price);
                const sharesToBuy = dividendAmount.div(currentPrice).floor();
                
                if (sharesToBuy.greaterThan(0)) {
                    try {
                        this.buyStock(symbol, sharesToBuy);
                    } catch (error) {
                        console.log(`Failed to reinvest dividends for ${symbol}: ${error.message}`);
                    }
                }
            }
        }

        return totalDividends;
    }
}

class TradingBot {
    constructor(portfolio) {
        this.portfolio = portfolio;
        this.tradingHistory = [];
    }

    analyzeTrend(symbol, days = 30) {
        const volatility = globalMarketData[symbol].volatility;
        const currentPrice = globalMarketData[symbol].price;
        return {
            shouldBuy: Math.random() > 0.5 && volatility < 0.3,
            recommendedShares: Math.floor(Math.random() * 10) + 1,
            predictedPrice: currentPrice * (1 + (Math.random() - 0.5) * volatility)
        };
    }

    executeAutomatedTrading() {
        for (const symbol in globalMarketData) {
            const analysis = this.analyzeTrend(symbol);
            if (analysis.shouldBuy) {
                try {
                    this.portfolio.buyStock(symbol, analysis.recommendedShares);
                    this.tradingHistory.push({
                        date: moment().format('YYYY-MM-DD HH:mm:ss'),
                        action: 'BUY',
                        symbol,
                        shares: analysis.recommendedShares,
                        prediction: analysis.predictedPrice
                    });
                } catch (error) {
                    console.log(`Failed to execute trade for ${symbol}: ${error.message}`);
                }
            }
        }
    }
}

module.exports = {
    PortfolioManager,
    TradingBot,
    Investment,
    Loan,
};