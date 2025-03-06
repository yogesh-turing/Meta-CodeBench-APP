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

    const txnObj = {
      amount: transaction.amount,
      date: new Date(transaction.date),
      type: transaction.type || 'purchase',
    };

    if (isNaN(txnObj.date.getTime())) {
      return false;
    }

    if (!this.userTransactions.has(userId)) {
      this.userTransactions.set(userId, []);
    }
    const transactions = this.userTransactions.get(userId);
    transactions.push(txnObj);
    transactions.sort((a, b) => a.date.toISOString().localeCompare(b.date.toISOString()));
    return true;
  }

  calculateTransactionPoints(transaction) {
    const { amount, type } = transaction;
    const { lowerThreshold, upperThreshold, lowerMultiplier, upperMultiplier } = this.config;
    let points = 0;

    if (amount <= lowerThreshold) {
      points = 0;
    } else if (amount <= upperThreshold) {
      points = Math.floor((amount - lowerThreshold) * lowerMultiplier);
    } else {
      points = Math.floor((upperThreshold - lowerThreshold) * lowerMultiplier) +
              Math.floor((amount - upperThreshold) * upperMultiplier);
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
    const monthlySummary = {};

    transactions.forEach(txn => {
      if (isNaN(txn.date.getTime())) return;
      
      const month = (txn.date.getMonth() + 1).toString().padStart(2, '0');
      const monthKey = `${txn.date.getFullYear()}-${month}`;
      
      monthlySummary[monthKey] = (monthlySummary[monthKey] || 0) + 
                                this.calculateTransactionPoints(txn);
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
    return this.userTransactions.delete(userId);
  }

  updateConfig(newConfig) {
    Object.keys(newConfig).forEach(key => {
      if (this.config.hasOwnProperty(key)) {
        this.config[key] = newConfig[key];
      }
    });
  }

  getTransactionLog() {
    return JSON.parse(JSON.stringify(Array.from(this.userTransactions.entries())));
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

  printUserRewardSummary(userId) {
    const rewards = this.calculateUserRewards(userId);
    const monthly = this.calculateMonthlyRewards(userId);
    let summary = `User: ${userId}\nTotal Rewards: ${rewards}\nMonthly Breakdown:\n`;
    
    Object.entries(monthly).forEach(([month, points]) => {
      summary += `${month} : ${points}\n`;
    });
    
    console.log(summary);
    return summary;
  }

  importTransactionsFromFile(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const transactions = JSON.parse(data);
      
      transactions.forEach(item => {
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
    let userId = null;

    transactions.forEach(item => {
      if (item.transaction && typeof item.transaction.amount === 'number') {
        if (this.addTransaction(item.userId, item.transaction)) {
          processedCount++;
        }
        userId = item.userId;
      }
    });

    return { count: processedCount, userId };
  }
}

module.exports = { RewardCalculator };