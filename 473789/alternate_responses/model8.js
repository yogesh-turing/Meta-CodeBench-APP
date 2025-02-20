const Decimal = require('decimal.js');
const moment = require('moment');
const EventEmitter = require('events');

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

class CustomError extends Error {
    constructor(message, type) {
        super(message);
        this.type = type;
    }
}

class InsufficientFundsError extends CustomError {
    constructor(message) {
        super(message, 'InsufficientFundsError');
    }
}

class InsufficientSharesError extends CustomError {
    constructor(message) {
        super(message, 'InsufficientSharesError');
    }
}

class InvalidAllocationError extends CustomError {
    constructor(message) {
        super(message, 'InvalidAllocationError');
    }
}

class InvalidCreditScoreError extends CustomError {
    constructor(message) {
        super(message, 'InvalidCreditScoreError');
    }
}

class RiskCalculator {
    calculateRisk(value, volatility) {
        return {
            volatility,
            valueAtRisk: value.mul(volatility).toDecimalPlaces(2)
        };
    }
}

class TransactionCommand {
    constructor(type, symbol, shares, price) {
        this.type = type;
        this.symbol = symbol;
        this.shares = shares;
        this.price = price;
    }

    execute(investment) {
        if (this.type === 'BUY') {
            investment.shares = investment.shares.add(this.shares);
        } else if (this.type === 'SELL') {
            if (this.shares.greaterThan(investment.shares)) {
                throw new InsufficientSharesError('Insufficient shares');
            }
            investment.shares = investment.shares.sub(this.shares);
        }
        investment.transactions.push({
            type: this.type,
            shares: this.shares,
            price: this.price,
            timestamp: moment().format('YYYY-MM-DD')
        });
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

class Investment extends EventEmitter {
    constructor(symbol, shares, purchasePrice) {
        super();
        this.symbol = symbol;
        this.shares = new Decimal(shares);
        this.purchasePrice = new Decimal(purchasePrice);
        this.transactions = [];
        this.performanceHistory = [];
    }

    calculateValue() {
        return this.shares.mul(new Decimal(globalMarketData[this.symbol].price)).toDecimalPlaces(2);
    }

    calculateRisk() {
        const riskCalculator = new RiskCalculator();
        return riskCalculator.calculateRisk(this.calculateValue(), globalMarketData[this.symbol].volatility);
    }

    addTransaction(type, shares, price) {
        const transactionCommand = new TransactionCommand(type, this.symbol, shares, price);
        transactionCommand.execute(this);
        this.emit('transaction', {
            type,
            shares,
            price,
            timestamp: moment().format('YYYY-MM-DD')
        });
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
            throw new InvalidCreditScoreError('Credit score too low');
        }
        const loan = new Loan(amount, interestRate, months);
        this.loans.push(loan);
        this.cashBalance = this.cashBalance.add(amount);
        this.creditScore -= 5;
        return loan;
    }

    deposit(amount) {
        this.cashBalance = this.cashBalance.add(amount);
        globalTransactions.push({
            type: 'DEPOSIT',
            amount,
            date: moment().format('YYYY-MM-DD')
        });
        this.emit('transaction', {
            type: 'DEPOSIT',
            amount,
            date: moment().format('YYYY-MM-DD')
        });
    }

    buyStock(symbol, shares) {
        const price = new Decimal(globalMarketData[symbol].price);
        const totalCost = price.mul(shares).mul(this.tradingFee.add(1));

        if (totalCost.greaterThan(this.cashBalance)) {
            throw new InsufficientFundsError('Insufficient funds');
        }

        if (!this.investments.has(symbol)) {
            this.investments.set(symbol, new Investment(symbol, 0, price));
        }

        const investment = this.investments.get(symbol);
        investment.addTransaction('BUY', shares, price);
        this.cashBalance = this.cashBalance.sub(totalCost);
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