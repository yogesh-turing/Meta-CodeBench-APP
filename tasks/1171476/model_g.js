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

    const txnDate = new Date(transaction.date);
    // Skip adding the transaction entirely if the date is invalid.
    if (isNaN(txnDate.getTime())) {
      return;
    }

    const txnObj = {
      amount: transaction.amount,
      date: txnDate,
      type: transaction.type || 'purchase',
    };

    if (!this.userTransactions.has(userId)) {
      this.userTransactions.set(userId, []);
    }
    const transactions = this.userTransactions.get(userId);
    transactions.push(txnObj);

    // Sort transactions by date
    transactions.sort((a, b) =>
      a.date.toISOString().localeCompare(b.date.toISOString())
    );
  }

  // Calculates reward points for a single transaction.
  calculateTransactionPoints(transaction) {
    const { amount, type } = transaction;
    const { lowerThreshold, upperThreshold, lowerMultiplier, upperMultiplier } =
      this.config;

    let points = 0;

    if (amount <= lowerThreshold) {
      points = 0;
    } else if (amount > lowerThreshold && amount <= upperThreshold) {
      points = Math.floor((amount - lowerThreshold) * lowerMultiplier);
    } else {
      // For amounts above upperThreshold:
      //   points = floor((upperThreshold - lowerThreshold) * lowerMultiplier)
      //          + floor((amount - upperThreshold) * upperMultiplier)
      points =
        Math.floor((upperThreshold - lowerThreshold) * lowerMultiplier) +
        Math.floor((amount - upperThreshold) * upperMultiplier);
    }

    // Refund transactions yield negative points.
    if (type === 'refund') {
      points = -points;
    }

    return points;
  }

  // Calculates total reward points for a user across all transactions.
  calculateUserRewards(userId) {
    if (!this.userTransactions.has(userId)) return 0;
    const transactions = this.userTransactions.get(userId);

    let totalPoints = transactions.reduce((sum, txn) => {
      if (isNaN(txn.date.getTime())) return sum;
      return sum + this.calculateTransactionPoints(txn);
    }, 0);

    // Log the calculation
    this.calculationLog.push({ userId, totalPoints, timestamp: new Date() });
    return totalPoints;
  }

  // Calculates monthly rewards summary for a user.
  calculateMonthlyRewards(userId) {
    if (!this.userTransactions.has(userId)) return {};
    const transactions = this.userTransactions.get(userId);

    const monthlySummary = {};
    for (let txn of transactions) {
      if (isNaN(txn.date.getTime())) continue;

      // Format month key as YYYY-MM (month padded with zero)
      const month = (txn.date.getMonth() + 1).toString().padStart(2, '0');
      const monthKey = txn.date.getFullYear() + '-' + month;

      if (!monthlySummary[monthKey]) {
        monthlySummary[monthKey] = 0;
      }
      monthlySummary[monthKey] += this.calculateTransactionPoints(txn);
    }
    return monthlySummary;
  }

  // Asynchronously persists the calculation log to a file.
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

  // Clears all transactions for a user.
  clearTransactions(userId) {
    if (!this.userTransactions.has(userId)) return false;
    this.userTransactions.delete(userId);
    return true;
  }

  // Dynamically updates reward configuration.
  updateConfig(newConfig) {
    for (let key in newConfig) {
      if (this.config.hasOwnProperty(key)) {
        this.config[key] = newConfig[key];
      }
    }
  }

  // Returns a deep copy of the transaction log (as an array of [userId, transactions]).
  getTransactionLog() {
    return JSON.parse(
      JSON.stringify(Array.from(this.userTransactions.entries()))
    );
  }

  // Calculates rewards for a given date range.
  calculateRewardsForDateRange(userId, startDate, endDate) {
    if (!this.userTransactions.has(userId)) return 0;
    const transactions = this.userTransactions.get(userId);

    let total = 0;
    const start = new Date(startDate);
    const end = new Date(endDate);

    transactions.forEach((txn) => {
      if (txn.date > start && txn.date < end) {
        total += this.calculateTransactionPoints(txn);
      }
    });
    return total;
  }

  // Prints a detailed summary of a user's rewards.
  printUserRewardSummary(userId) {
    const rewards = this.calculateUserRewards(userId);
    const monthly = this.calculateMonthlyRewards(userId);

    let summary =
      'User: ' + userId + '\n' +
      'Total Rewards: ' + rewards + '\n' +
      'Monthly Breakdown:\n';

    for (let key in monthly) {
      summary += key + ' : ' + monthly[key] + '\n';
    }
    console.log(summary);
    return summary;
  }

  // Imports transactions from a JSON file.
  importTransactionsFromFile(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const transactions = JSON.parse(data);
      // Expect transactions to be an array of { userId, transaction }.
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

  // Exports all transactions to a JSON file.
  exportTransactionsToFile(filePath) {
    try {
      // Match the import format:
      // an array of objects with { userId, transaction }
      const allTransactions = [];
      for (const [userId, txArray] of this.userTransactions.entries()) {
        for (const txn of txArray) {
          allTransactions.push({ userId, transaction: txn });
        }
      }
      fs.writeFileSync(filePath, JSON.stringify(allTransactions, null, 2));
      return true;
    } catch (e) {
      console.log('Error exporting transactions: ' + e.message);
      return false;
    }
  }

  // Processes bulk transactions.
  processBulkTransactions(transactions) {
    if (!Array.isArray(transactions)) {
      throw new Error('Invalid transactions data');
    }
    let processedCount = 0;
    let userId = null;

    transactions.forEach((item) => {
      if (item.transaction && typeof item.transaction.amount === 'number') {
        this.addTransaction(item.userId, item.transaction);
        processedCount++;
        userId = item.userId;
      }
    });
    return { count: processedCount, userId };
  }

  // --- Helper functions to return data in the expected object formats ---

  // Returns the transformed transaction for a user at a given index.
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

  // Returns the monthly summary (object mapping YYYY-MM to total rewards).
  getMonthlySummary(userId) {
    return this.calculateMonthlyRewards(userId);
  }

  // Returns total rewards as an object.
  getTotalRewards(userId) {
    const total = this.calculateUserRewards(userId);
    return { amount: total, userId };
  }

  // Returns rewards for a given date range as an object.
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