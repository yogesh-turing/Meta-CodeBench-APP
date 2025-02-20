const Decimal = require('decimal.js');
const moment = require('moment');
const EventEmitter = require('events');

// Custom Error Types
class FinancialError extends Error {
    constructor(message, code) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
    }
}

class InsufficientFundsError extends FinancialError {
    constructor(message = 'Insufficient funds') {
        super(message, 'INSUFFICIENT_FUNDS');
    }
}

class InsufficientSharesError extends FinancialError {
    constructor(message = 'Insufficient shares') {
        super(message, 'INSUFFICIENT_SHARES');
    }
}

// Event Management
const eventEmitter = new EventEmitter();

// Market Data Management
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

// Risk Calculation Strategy
class RiskCalculator {
    calculateRisk(investment) {
        const value = investment.calculateValue();
        const volatility = globalMarketData[investment.symbol].volatility;
        return {
            volatility,
            valueAtRisk: value.mul(volatility).toDecimalPlaces(2)
        };
    }
}

// Transaction Commands
class TransactionCommand {
    constructor(investment, type, shares, price) {
        this.investment = investment;
        this.type = type;
        this.shares = new Decimal(shares);
        this.price = new Decimal(price);
    }

    execute() {
        if (this.type === 'SELL' && this.shares.greaterThan(this.investment.shares)) {
            throw new InsufficientSharesError();
        }

        this.investment.transactions.push({
            type: this.type,
            shares: this.shares,
            price: this.price,
            timestamp: moment().format('YYYY-MM-DD')
        });

        if (this.type === 'BUY') {
            this.investment.shares = this.investment.shares.add(this.shares);
        } else if (this.type === 'SELL') {
            this.investment.shares = this.investment.shares.sub(this.shares);
        }

        eventEmitter.emit('transaction', {
            type: this.type,
            symbol: this.investment.symbol,
            shares: this.shares.toString(),
            price: this.price.toString()
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
        eventEmitter.emit('payment', {
            amount: payment.toString(),
            remainingPayments: this.remainingPayments
        });
        return payment;
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
        return this.riskCalculator.calculateRisk(this);
    }

    addTransaction(type, shares, price) {
        const command = new TransactionCommand(this, type, shares, price);
        command.execute();
    }
}

class PortfolioManager {
    constructor() {
        this.investments = new Map();
        this.cashBalance = new Decimal(0);
        this.tradingFee = new Decimal(0.001);
        this.loans = [];
        this.creditScore = 700;
        this.targetAllocation = new Map();
        this.rebalancingThreshold = 5;
        this.autoReinvestDividends = true;
        
        eventEmitter.on('transaction', this.handleTransaction.bind(this));
    }

    handleTransaction(transaction) {
        globalTransactions.push({
            ...transaction,
            date: moment().format('YYYY-MM-DD')
        });
    }

    subscribe(eventType, callback) {
        eventEmitter.on(eventType, callback);
    }

    unsubscribe(eventType, callback) {
        eventEmitter.off(eventType, callback);
    }

    // Existing methods remain unchanged
    takeLoan(amount, interestRate, months) {
        if (this.creditScore < 600) {
            throw new FinancialError('Credit score too low', 'LOW_CREDIT_SCORE');
        }
        const loan = new Loan(amount, interestRate, months);
        this.loans.push(loan);
        this.cashBalance = this.cashBalance.add(amount);
        this.creditScore -= 5;
        return loan;
    }

    deposit(amount) {
        this.cashBalance = this.cashBalance.add(amount);
        eventEmitter.emit('deposit', {
            amount: amount.toString(),
            date: moment().format('YYYY-MM-DD')
        });
    }

    buyStock(symbol, shares) {
        const price = new Decimal(globalMarketData[symbol].price);
        const totalCost = price.mul(shares).mul(this.tradingFee.add(1));

        if (totalCost.greaterThan(this.cashBalance)) {
            throw new InsufficientFundsError();
        }

        if (!this.investments.has(symbol)) {
            this.investments.set(symbol, new Investment(symbol, 0, price));
        }

        const investment = this.investments.get(symbol);
        investment.addTransaction('BUY', shares, price);
        this.cashBalance = this.cashBalance.sub(totalCost);
    }

    // Remaining methods from the original PortfolioManager class stay the same
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
        return {
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            portfolio: metrics,
            transactions: globalTransactions.slice(-10),
            loans: this.loans.map(loan => ({
                principal: loan.principal.toString(),
                remainingPayments: loan.remainingPayments,
                monthlyPayment: loan.calculateMonthlyPayment().toString()
            }))
        };
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
    RiskCalculator,
    FinancialError,
    InsufficientFundsError,
    InsufficientSharesError
};