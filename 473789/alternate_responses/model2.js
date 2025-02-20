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

class InvalidInputError extends FinancialError {
    constructor(message) {
        super(message, 'INVALID_INPUT');
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
    static calculateBasicRisk(value, volatility) {
        return {
            volatility,
            valueAtRisk: value.mul(volatility).toDecimalPlaces(2)
        };
    }
}

// Transaction Commands
class TransactionCommand {
    constructor(portfolio) {
        this.portfolio = portfolio;
    }
    
    execute() {
        throw new Error('Execute method must be implemented');
    }
}

class BuyStockCommand extends TransactionCommand {
    constructor(portfolio, symbol, shares) {
        super(portfolio);
        this.symbol = symbol;
        this.shares = shares;
    }

    execute() {
        const price = new Decimal(globalMarketData[this.symbol].price);
        const totalCost = price.mul(this.shares).mul(this.portfolio.tradingFee.add(1));

        if (totalCost.greaterThan(this.portfolio.cashBalance)) {
            throw new InsufficientFundsError();
        }

        if (!this.portfolio.investments.has(this.symbol)) {
            this.portfolio.investments.set(
                this.symbol,
                new Investment(this.symbol, 0, price)
            );
        }

        const investment = this.portfolio.investments.get(this.symbol);
        investment.addTransaction('BUY', this.shares, price);
        this.portfolio.cashBalance = this.portfolio.cashBalance.sub(totalCost);

        eventEmitter.emit('transaction', {
            type: 'BUY',
            symbol: this.symbol,
            shares: this.shares,
            price: price
        });
    }
}

class Loan {
    constructor(principal, annualRate, months) {
        if (principal <= 0 || annualRate <= 0 || months <= 0) {
            throw new InvalidInputError('Invalid loan parameters');
        }
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
        if (this.remainingPayments <= 0) {
            throw new InvalidInputError('Loan is already paid off');
        }
        const payment = this.calculateMonthlyPayment();
        this.remainingPayments--;
        this.paymentHistory.push({
            date: moment().format('YYYY-MM-DD'),
            amount: payment
        });
        eventEmitter.emit('loanPayment', {
            amount: payment,
            remainingPayments: this.remainingPayments
        });
        return payment;
    }
}

class Investment {
    constructor(symbol, shares, purchasePrice) {
        if (!symbol || shares < 0 || purchasePrice <= 0) {
            throw new InvalidInputError('Invalid investment parameters');
        }
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
        return RiskCalculator.calculateBasicRisk(
            this.calculateValue(),
            globalMarketData[this.symbol].volatility
        );
    }

    addTransaction(type, shares, price) {
        if (type === 'SELL' && shares > this.shares) {
            throw new InvalidInputError('Insufficient shares');
        }
        
        const transaction = {
            type,
            shares: new Decimal(shares),
            price: new Decimal(price),
            timestamp: moment().format('YYYY-MM-DD')
        };
        
        this.transactions.push(transaction);

        if (type === 'BUY') {
            this.shares = this.shares.add(shares);
        } else if (type === 'SELL') {
            this.shares = this.shares.sub(shares);
        }

        eventEmitter.emit('investmentTransaction', {
            symbol: this.symbol,
            ...transaction
        });
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
        
        eventEmitter.on('marketUpdate', this.handleMarketUpdate.bind(this));
    }

    handleMarketUpdate(update) {
        globalMarketData = { ...globalMarketData, ...update };
    }

    takeLoan(amount, interestRate, months) {
        if (this.creditScore < 600) {
            throw new InvalidInputError('Credit score too low');
        }
        const loan = new Loan(amount, interestRate, months);
        this.loans.push(loan);
        this.cashBalance = this.cashBalance.add(amount);
        this.creditScore -= 5;
        
        eventEmitter.emit('loanCreated', {
            amount,
            interestRate,
            months
        });
        
        return loan;
    }

    deposit(amount) {
        if (amount <= 0) {
            throw new InvalidInputError('Deposit amount must be positive');
        }
        this.cashBalance = this.cashBalance.add(amount);
        const transaction = {
            type: 'DEPOSIT',
            amount,
            date: moment().format('YYYY-MM-DD')
        };
        globalTransactions.push(transaction);
        eventEmitter.emit('deposit', transaction);
    }

    buyStock(symbol, shares) {
        const command = new BuyStockCommand(this, symbol, shares);
        command.execute();
    }

    // Remaining methods remain unchanged
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
            transactions: globalTransactions.slice(-10),
            loans: this.loans.map(loan => ({
                principal: loan.principal.toString(),
                remainingPayments: loan.remainingPayments,
                monthlyPayment: loan.calculateMonthlyPayment().toString()
            }))
        };

        eventEmitter.emit('reportGenerated', report);
        return report;
    }

    setTargetAllocation(symbol, percentage) {
        if (percentage < 0 || percentage > 100) {
            throw new InvalidInputError('Allocation percentage must be between 0 and 100');
        }
        this.targetAllocation.set(symbol, percentage);
    }

    rebalancePortfolio() {
        // Original implementation remains unchanged
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

        eventEmitter.emit('rebalance', rebalancingTrades);
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

        eventEmitter.emit('dividendsProcessed', { totalDividends });
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
                    const trade = {
                        date: moment().format('YYYY-MM-DD HH:mm:ss'),
                        action: 'BUY',
                        symbol,
                        shares: analysis.recommendedShares,
                        prediction: analysis.predictedPrice
                    };
                    this.tradingHistory.push(trade);
                    eventEmitter.emit('botTrade', trade);
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
    eventEmitter,
    FinancialError,
    InsufficientFundsError,
    InvalidInputError,
    RiskCalculator
};