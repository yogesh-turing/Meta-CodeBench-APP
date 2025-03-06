const fs = require('fs');
const path = require('path');

class RewardCalculator {
  constructor() {
    // Map of userId -> Array of transactions
    this.userTransactions = new Map();
    // Global log of reward calculations (accumulates indefinitely)
    this.calculationLog = [];
    // Default reward configuration
    this.config = {
      lowerThreshold: 50,
      upperThreshold: 100,
      lowerMultiplier: 1,
      upperMultiplier: 2,
    };
  }

  // Adds a transaction for a given user. Ignores transactions with invalid dates.
  addTransaction(userId, transaction) {
    if (
      !transaction ||
      typeof transaction.amount !== 'number' ||
      !transaction.date
    ) {
      throw new Error('Invalid transaction data');
    }
    const date = new Date(transaction.date);
    if (isNaN(date.getTime())) {
      // Do not add transaction if date is invalid.
      return;
    }
    const txnObj = {
      amount: transaction.amount,
      date: date,
      type: transaction.type || 'purchase',
    };
    if (!this.userTransactions.has(userId)) {
      this.userTransactions.set(userId, []);
    }
    this.userTransactions.get(userId).push(txnObj);
    // Sort transactions in ascending order by date.
    this.userTransactions.get(userId).sort((a, b) => a.date - b.date);
  }

  // Calculates reward points for a single transaction.
  calculateTransactionPoints(transaction) {
    const { amount, type } = transaction;
    let points = 0;
    if (amount <= this.config.lowerThreshold) {
      points = 0;
    } else if (amount <= this.config.upperThreshold) {
      points = Math.floor(
        (amount - this.config.lowerThreshold) * this.config.lowerMultiplier
      );
    } else {
      points =
        Math.floor(
          (this.config.upperThreshold - this.config.lowerThreshold) *
            this.config.lowerMultiplier
        ) +
        Math.floor(
          (amount - this.config.upperThreshold) * this.config.upperMultiplier
        );
    }
    return type === 'refund' ? -points : points;
  }

  // Calculates total reward points for a user.
  calculateUserRewards(userId) {
    if (!this.userTransactions.has(userId)) return 0;
    const transactions = this.userTransactions.get(userId);
    const totalPoints = transactions.reduce(
      (sum, txn) => sum + this.calculateTransactionPoints(txn),
      0
    );
    // Log the calculation.
    this.calculationLog.push({ userId, totalPoints, timestamp: new Date() });
    return totalPoints;
  }

  // Calculates monthly rewards summary for a user.
  calculateMonthlyRewards(userId) {
    const summary = {};
    if (!this.userTransactions.has(userId)) return summary;
    this.userTransactions.get(userId).forEach((txn) => {
      const month = txn.date.getMonth() + 1;
      const monthStr = String(month).padStart(2, '0');
      const key = `${txn.date.getFullYear()}-${monthStr}`;
      summary[key] = (summary[key] || 0) + this.calculateTransactionPoints(txn);
    });
    return summary;
  }

  // Calculates rewards for a given date range
  calculateRewardsForDateRange(userId, startDate, endDate) {
    if (!this.userTransactions.has(userId)) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.userTransactions.get(userId).reduce((sum, txn) => {
      if (txn.date >= start && txn.date <= end) {
        return sum + this.calculateTransactionPoints(txn);
      }
      return sum;
    }, 0);
  }

  // Asynchronously persists the calculation log to a file.
  persistCalculationLog(callback) {
    fs.writeFile(
      path.join(__dirname, 'calcLog.txt'),
      JSON.stringify(this.calculationLog, null, 2),
      (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { persisted: true });
        }
      }
    );
  }

  // Clears all transactions for a given user.
  clearTransactions(userId) {
    if (this.userTransactions.has(userId)) {
      this.userTransactions.delete(userId);
      return true;
    }
    return false;
  }

  // Dynamically updates the reward configuration.
  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);
  }

  // Returns a deep copy of the transaction log as an array of [userId, transactions].
  getTransactionLog() {
    return JSON.parse(
      JSON.stringify(Array.from(this.userTransactions.entries()))
    );
  }

  // Returns the transformed transaction object for a user at the specified index.
  getTransaction(userId, index) {
    if (!this.userTransactions.has(userId)) return null;
    const arr = this.userTransactions.get(userId);
    if (index < 0 || index >= arr.length) return null;
    const txn = arr[index];
    return {
      amount: this.calculateTransactionPoints(txn),
      date: txn.date,
      type: txn.type,
    };
  }

  // Processes an array of bulk transactions.
  processBulkTransactions(transactions) {
    let count = 0;
    let userId = null;
    transactions.forEach((item) => {
      if (item.transaction && typeof item.transaction.amount === 'number') {
        this.addTransaction(item.userId, item.transaction);
        count++;
        userId = item.userId;
      }
    });
    return { count: count, userId: userId };
  }

  // Helper: Returns monthly rewards summary in object format.
  getMonthlySummary(userId) {
    return this.calculateMonthlyRewards(userId);
  }

  // Helper: Returns total rewards as an object.
  getTotalRewards(userId) {
    return { amount: this.calculateUserRewards(userId), userId };
  }

  // Helper: Returns rewards for a specified date range as an object.
  getRewardsForDateRange(userId, startDate, endDate) {
    return {
      amount: this.calculateRewardsForDateRange(userId, startDate, endDate),
      from: new Date(startDate),
      to: new Date(endDate),
      userId,
    };
  }

  // Helper: Prints and returns a detailed summary of a user's rewards.
  printUserRewardSummary(userId) {
    const totalRewards = this.calculateUserRewards(userId);
    const monthly = this.calculateMonthlyRewards(userId);
    let summary = `User: ${userId}\nTotal Rewards: ${totalRewards}\nMonthly Breakdown:\n`;
    Object.keys(monthly)
      .sort()
      .forEach((key) => {
        summary += `${key} : ${monthly[key]}\n`;
      });
    console.log(summary);
    return summary;
  }

  // Exports all transactions to a JSON file.
  exportTransactionsToFile(filePath) {
    try {
      const allTransactions = Array.from(this.userTransactions.entries());
      fs.writeFileSync(filePath, JSON.stringify(allTransactions, null, 2));
      return true;
    } catch (e) {
      return false;
    }
  }

  // Imports transactions from a JSON file.
  importTransactionsFromFile(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const items = JSON.parse(data);
      items.forEach(([userId, txns]) => {
        txns.forEach((txn) => {
          this.addTransaction(userId, {
            amount: txn.amount,
            date: txn.date,
            type: txn.type,
          });
        });
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports = { RewardCalculator };