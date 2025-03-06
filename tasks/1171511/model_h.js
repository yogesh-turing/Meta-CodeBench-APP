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

    // Convert the provided transaction date to a Date object.
    const dateObj = new Date(transaction.date);
    // If the date is invalid, do not store the transaction at all.
    if (isNaN(dateObj.getTime())) {
      // "Handle invalid dates gracefully" means skip storing the transaction.
      return;
    }

    // Create the transaction object.
    const txnObj = {
      amount: transaction.amount,
      date: dateObj,
      type: transaction.type || 'purchase',
    };

    // Initialize user transactions array if needed.
    if (!this.userTransactions.has(userId)) {
      this.userTransactions.set(userId, []);
    }
    const transactions = this.userTransactions.get(userId);
    transactions.push(txnObj);

    // Sort transactions by date.
    transactions.sort((a, b) =>
      a.date.toISOString().localeCompare(b.date.toISOString())
    );
  }

  calculateTransactionPoints(transaction) {
    const { amount, type } = transaction;
    const { lowerThreshold, upperThreshold, lowerMultiplier, upperMultiplier } =
      this.config;

    let points = 0;

    if (amount <= lowerThreshold) {
      // No points for amounts ≤ lowerThreshold.
      points = 0;
    } else if (amount > lowerThreshold && amount <= upperThreshold) {
      // Points for amounts between lowerThreshold+1 and upperThreshold.
      points = Math.floor((amount - lowerThreshold) * lowerMultiplier);
    } else {
      // For amounts above upperThreshold:
      // points = floor((upperThreshold - lowerThreshold) * lowerMultiplier)
      //        + floor((amount - upperThreshold) * upperMultiplier)
      const firstPortion = Math.floor(
        (upperThreshold - lowerThreshold) * lowerMultiplier
      );
      const secondPortion = Math.floor((amount - upperThreshold) * upperMultiplier);
      points = firstPortion + secondPortion;
    }

    // For refunds, points are negative of what the purchase would have been.
    if (type === 'refund') {
      points = -points;
    }

    return points;
  }

  calculateUserRewards(userId) {
    if (!this.userTransactions.has(userId)) return 0;
    const transactions = this.userTransactions.get(userId);

    let totalPoints = transactions.reduce((sum, txn) => {
      if (isNaN(txn.date.getTime())) return sum;
      return sum + this.calculateTransactionPoints(txn);
    }, 0);

    // Log the calculation.
    this.calculationLog.push({ userId, totalPoints, timestamp: new Date() });
    return totalPoints;
  }

  calculateMonthlyRewards(userId) {
    if (!this.userTransactions.has(userId)) return {};
    const transactions = this.userTransactions.get(userId);
    const monthlySummary = {};

    for (let txn of transactions) {
      if (isNaN(txn.date.getTime())) continue;

      // Format month as YYYY-MM:
      const month = (txn.date.getMonth() + 1).toString().padStart(2, '0');
      const monthKey = txn.date.getFullYear() + '-' + month;

      if (!monthlySummary[monthKey]) {
        monthlySummary[monthKey] = 0;
      }
      monthlySummary[monthKey] += this.calculateTransactionPoints(txn);
    }

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
    // Return a deep copy of the internal Map as an array of [userId, transactions].
    return JSON.parse(
      JSON.stringify(Array.from(this.userTransactions.entries()))
    );
  }

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

  printUserRewardSummary(userId) {
    const rewards = this.calculateUserRewards(userId);
    const monthly = this.calculateMonthlyRewards(userId);

    let summary =
      'User: ' + userId + '\nTotal Rewards: ' + rewards + '\nMonthly Breakdown:\n';
    for (let key in monthly) {
      summary += key + ' : ' + monthly[key] + '\n';
    }

    console.log(summary);
    return summary;
  }

  importTransactionsFromFile(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const transactions = JSON.parse(data);

      // Expect an array of { userId, transaction } objects.
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
    let userId = null;

    transactions.forEach((item) => {
      if (item.transaction && typeof item.transaction.amount === 'number') {
        this.addTransaction(item.userId, item.transaction);
        processedCount += 1; // increment by 1 per valid transaction
        userId = item.userId;
      }
    });

    return { count: processedCount, userId };
  }

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