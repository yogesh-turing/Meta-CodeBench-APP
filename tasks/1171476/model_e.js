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
    if (!transaction || typeof transaction.amount !== 'number' || !transaction.date) {
      throw new Error('Invalid transaction data');
    }

    const date = new Date(transaction.date);
    if (isNaN(date.getTime())) {
      return;
    }

    const txnObj = {
      amount: transaction.amount,
      date,
      type: transaction.type || 'purchase',
    };

    if (!this.userTransactions.has(userId)) {
      this.userTransactions.set(userId, []);
    }
    const transactions = this.userTransactions.get(userId);
    transactions.push(txnObj);
    transactions.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  calculateTransactionPoints(transaction) {
    const { amount, type } = transaction;
    const { lowerThreshold, upperThreshold, lowerMultiplier, upperMultiplier } = this.config;
    let points = 0;

    if (amount > upperThreshold) {
      points = Math.floor((upperThreshold - lowerThreshold) * lowerMultiplier) +
              Math.floor((amount - upperThreshold) * upperMultiplier);
    } else if (amount > lowerThreshold) {
      points = Math.floor((amount - lowerThreshold) * lowerMultiplier);
    }

    return type === 'refund' ? -points : points;
  }

  calculateUserRewards(userId) {
    if (!this.userTransactions.has(userId)) return 0;
    const transactions = this.userTransactions.get(userId);
    const totalPoints = transactions.reduce((sum, txn) => 
      sum + this.calculateTransactionPoints(txn), 0);
    this.calculationLog.push({ userId, totalPoints, timestamp: new Date() });
    return totalPoints;
  }

  calculateMonthlyRewards(userId) {
    if (!this.userTransactions.has(userId)) return {};
    const transactions = this.userTransactions.get(userId);
    return transactions.reduce((summary, txn) => {
      const monthKey = `${txn.date.getFullYear()}-${String(txn.date.getMonth() + 1).padStart(2, '0')}`;
      summary[monthKey] = (summary[monthKey] || 0) + this.calculateTransactionPoints(txn);
      return summary;
    }, {});
  }

  persistCalculationLog(callback) {
    const logPath = path.join(__dirname, 'calcLog.txt');
    fs.writeFile(logPath, JSON.stringify(this.calculationLog, null, 2), (err) => {
      callback(err, err ? null : { persisted: true });
    });
  }

  clearTransactions(userId) {
    return this.userTransactions.delete(userId);
  }

  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);
  }

  getTransactionLog() {
    return JSON.parse(JSON.stringify(Array.from(this.userTransactions.entries())));
  }

  calculateRewardsForDateRange(userId, startDate, endDate) {
    if (!this.userTransactions.has(userId)) return 0;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime() + 86400000;
    return this.userTransactions.get(userId)
      .filter(txn => txn.date.getTime() >= start && txn.date.getTime() <= end)
      .reduce((sum, txn) => sum + this.calculateTransactionPoints(txn), 0);
  }

  printUserRewardSummary(userId) {
    const rewards = this.calculateUserRewards(userId);
    const monthly = this.calculateMonthlyRewards(userId);
    const summary = `User: ${userId}\nTotal Rewards: ${rewards}\nMonthly Breakdown:\n${
      Object.entries(monthly).map(([month, points]) => `${month} : ${points}`).join('\n')
    }\n`;
    console.log(summary);
    return summary;
  }

  importTransactionsFromFile(filePath) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!Array.isArray(data)) return false;
      data.forEach(item => {
        if (item.userId && item.transaction) {
          this.addTransaction(item.userId, item.transaction);
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  exportTransactionsToFile(filePath) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(Array.from(this.userTransactions.entries()), null, 2));
      return true;
    } catch {
      return false;
    }
  }

  processBulkTransactions(transactions) {
    if (!Array.isArray(transactions)) throw new Error('Invalid transactions data');
    let processedCount = 0;
    let lastUserId = null;
    transactions.forEach(item => {
      if (item.userId && item.transaction && typeof item.transaction.amount === 'number') {
        this.addTransaction(item.userId, item.transaction);
        processedCount++;
        lastUserId = item.userId;
      }
    });
    return { count: processedCount, userId: lastUserId };
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
    return { amount: this.calculateUserRewards(userId), userId };
  }

  getRewardsForDateRange(userId, startDate, endDate) {
    return {
      amount: this.calculateRewardsForDateRange(userId, startDate, endDate),
      from: new Date(startDate),
      to: new Date(endDate),
      userId,
    };
  }
}

module.exports = { RewardCalculator };