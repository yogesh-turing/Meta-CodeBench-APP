const fs = require('fs');
const path = require('path');

class RewardCalculator {
  constructor() {
    this.userTransactions = new Map();
    this.calculationLog = [];
    this.config = {
      lowerThreshold: 50,
      upperThreshold: 100,
      lowerMultiplier: 1,
      upperMultiplier: 2,
    };
  }

  addTransaction(userId, transaction) {
    if (
      !transaction ||
      typeof transaction.amount !== 'number' ||
      !transaction.date
    ) {
      throw new Error('Invalid transaction data');
    }
    const txnObj = {
      amount: transaction.amount,
      date: new Date(transaction.date),
      type: transaction.type || 'purchase',
    };
    if (!this.userTransactions.has(userId)) {
      this.userTransactions.set(userId, []);
    }
    const transactions = this.userTransactions.get(userId);
    transactions.push(txnObj);
    transactions.sort((a, b) => a.date - b.date);
  }

  calculateTransactionPoints(transaction) {
    const { amount, type } = transaction;
    const { lowerThreshold, upperThreshold, lowerMultiplier, upperMultiplier } = this.config;
    let points = 0;
    if (amount > lowerThreshold && amount <= upperThreshold) {
      points = Math.floor((amount - lowerThreshold) * lowerMultiplier);
    } else if (amount > upperThreshold) {
      points = Math.floor((upperThreshold - lowerThreshold) * lowerMultiplier) +
               Math.floor((amount - upperThreshold) * upperMultiplier);
    }
    if (type === 'refund') {
      points = -points;
    }
    return points;
  }

  calculateUserRewards(userId) {
    if (!this.userTransactions.has(userId)) return 0;
    const transactions = this.userTransactions.get(userId);
    const totalPoints = transactions.reduce((sum, txn) => {
      if (!isNaN(txn.date.getTime())) {
        return sum + this.calculateTransactionPoints(txn);
      }
      return sum;
    }, 0);
    this.calculationLog.push({ userId, totalPoints, timestamp: new Date() });
    return totalPoints;
  }

  calculateMonthlyRewards(userId) {
    if (!this.userTransactions.has(userId)) return {};
    const transactions = this.userTransactions.get(userId);
    const monthlySummary = {};
    transactions.forEach((txn) => {
      if (!isNaN(txn.date.getTime())) {
        const month = txn.date.getMonth() + 1;
        const monthKey = `${txn.date.getFullYear()}-${month.toString().padStart(2, '0')}`;
        monthlySummary[monthKey] = (monthlySummary[monthKey] || 0) + this.calculateTransactionPoints(txn);
      }
    });
    return monthlySummary;
  }

  persistCalculationLog(callback) {
    setTimeout(() => {
      try {
        fs.writeFileSync(
          path.join(__dirname, 'calcLog.txt'),
          JSON.stringify(this.calculationLog, null, 2)
        );
        callback(null, { persisted: true });
      } catch (e) {
        callback(e);
      }
    }, 50);
  }

  clearTransactions(userId) {
    if (!this.userTransactions.has(userId)) return false;
    this.userTransactions.delete(userId);
    return true;
  }

  updateConfig(newConfig) {
    for (let key in newConfig) {
      if (this.config.hasOwnProperty(key)) {
        this.config[key] = newConfig[key];
      }
    }
  }

  getTransactionLog() {
    return JSON.parse(
      JSON.stringify(Array.from(this.userTransactions.entries()))
    );
  }

  calculateRewardsForDateRange(userId, startDate, endDate) {
    if (!this.userTransactions.has(userId)) return 0;
    const transactions = this.userTransactions.get(userId);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return transactions.reduce((total, txn) => {
      if (txn.date >= start && txn.date <= end) {
        return total + this.calculateTransactionPoints(txn);
      }
      return total;
    }, 0);
  }

  printUserRewardSummary(userId) {
    const rewards = this.calculateUserRewards(userId);
    const monthly = this.calculateMonthlyRewards(userId);
    let summary = `User: ${userId}\nTotal Rewards: ${rewards}\nMonthly Breakdown:\n`;
    for (const key in monthly) {
      summary += `${key} : ${monthly[key]}\n`;
    }
    console.log(summary);
    return summary;
  }

  importTransactionsFromFile(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const transactions = JSON.parse(data);
      transactions.forEach((item) => {
        if (item.userId && item.transaction) {
          this.addTransaction(item.userId, item.transaction);
        }
      });
      return true;
    } catch (e) {
      console.log('Error importing transactions: ' + e.message);
      return false;
    }
  }

  exportTransactionsToFile(filePath) {
    try {
      const allTransactions = Array.from(this.userTransactions.entries());
      fs.writeFileSync(filePath, JSON.stringify(allTransactions, null, 2));
      return true;
    } catch (e) {
      console.log('Error exporting transactions: ' + e.message);
      return false;
    }
  }

  processBulkTransactions(transactions) {
    if (!Array.isArray(transactions)) {
      throw new Error('Invalid transactions data');
    }
    let processedCount = 0;
    transactions.forEach((item) => {
      if (item.transaction && typeof item.transaction.amount === 'number') {
        this.addTransaction(item.userId, item.transaction);
        processedCount++;
      }
    });
    return { count: processedCount, userId: transactions[0]?.userId || null };
  }

  getTransaction(userId, index) {
    if (!this.userTransactions.has(userId)) return null;
    const transactions = this.userTransactions.get(userId);
    if (index < 0 || index >= transactions.length) return null;
    const txn = transactions[index];
    return {
      amount: this.calculateTransactionPoints(txn),
      date: txn.date,
      type: txn.type,
    };
  }

  getMonthlySummary(userId) {
    return this.calculateMonthlyRewards(userId);
  }

  getTotalRewards(userId) {
    const total = this.calculateUserRewards(userId);
    return { amount: total, userId };
  }

  getRewardsForDateRange(userId, startDate, endDate) {
    const total = this.calculateRewardsForDateRange(userId, startDate, endDate);
    return {
      amount: total,
      from: new Date(startDate),
      to: new Date(endDate),
      userId,
    };
  }
}

module.exports = { RewardCalculator };