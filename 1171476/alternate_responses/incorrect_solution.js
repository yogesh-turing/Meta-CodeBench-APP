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
      return false;
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
    return true;
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
    const totalPoints = transactions.reduce((sum, txn) => {
      if (isNaN(txn.date.getTime())) return sum;
      return sum + this.calculateTransactionPoints(txn);
    }, 0);
    
    this.calculationLog.push({
      userId,
      totalPoints,
      timestamp: new Date()
    });
    
    return totalPoints;
  }

  calculateMonthlyRewards(userId) {
    if (!this.userTransactions.has(userId)) return {};
    const transactions = this.userTransactions.get(userId);
    return transactions.reduce((monthlySummary, txn) => {
      if (isNaN(txn.date.getTime())) return monthlySummary;
      const monthKey = `${txn.date.getFullYear()}-${String(txn.date.getMonth() + 1).padStart(2, '0')}`;
      monthlySummary[monthKey] = (monthlySummary[monthKey] || 0) + this.calculateTransactionPoints(txn);
      return monthlySummary;
    }, {});
  }

  calculateRewardsForDateRange(userId, startDate, endDate) {
    if (!this.userTransactions.has(userId)) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return this.userTransactions.get(userId)
      .filter(txn => txn.date >= start && txn.date <= end)
      .reduce((total, txn) => total + this.calculateTransactionPoints(txn), 0);
  }

  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);
  }

  getTransaction(userId, index) {
    if (!this.userTransactions.has(userId)) return null;
    const transactions = this.userTransactions.get(userId);
    if (index < 0 || index >= transactions.length) return null;
    const txn = transactions[index];
    return {
      amount: this.calculateTransactionPoints(txn),
      date: txn.date,
      type: txn.type
    };
  }

  exportTransactionsToFile(filePath) {
    try {
      const data = JSON.stringify(Array.from(this.userTransactions), null, 2);
      fs.writeFileSync(filePath, data);
      return true;
    } catch {
      return false;
    }
  }

  importTransactionsFromFile(filePath) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      this.userTransactions = new Map(data);
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
      if (item.userId && item.transaction && this.addTransaction(item.userId, item.transaction)) {
        processedCount++;
        lastUserId = item.userId;
      }
    });

    return { count: processedCount, userId: lastUserId };
  }

  printUserRewardSummary(userId) {
    const rewards = this.calculateUserRewards(userId);
    const monthly = this.calculateMonthlyRewards(userId);
    let summary = `User: ${userId}\nTotal Rewards: ${rewards}\nMonthly Breakdown:\n`;
    Object.entries(monthly).forEach(([month, points]) => {
      summary += `${month} : ${points}\n`;
    });
    return summary;
  }

  getTransactionLog() {
    return JSON.parse(JSON.stringify(Array.from(this.userTransactions.entries())));
  }

  persistCalculationLog(callback) {
    const logPath = path.join(__dirname, 'calcLog.txt');
    fs.writeFile(logPath, JSON.stringify(this.calculationLog, null, 2), err => {
      callback(err, err ? null : { persisted: true });
    });
  }

  getMonthlySummary(userId) {
    return this.calculateMonthlyRewards(userId);
  }

  getTotalRewards(userId) {
    return {
      amount: this.calculateUserRewards(userId),
      userId
    };
  }

  getRewardsForDateRange(userId, startDate, endDate) {
    return {
      amount: this.calculateRewardsForDateRange(userId, startDate, endDate),
      from: new Date(startDate),
      to: new Date(endDate),
      userId
    };
  }

  clearTransactions(userId) {
    return this.userTransactions.delete(userId);
  }
}

module.exports = { RewardCalculator };