Base Code:
```javascript
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
    // Create transaction object with a Date instance.
    const txnObj = {
      amount: transaction.amount,
      date: new Date(transaction.date),
      type: transaction.type || 'purchase',
    };
    // Initialize user transactions array if needed.
    if (!this.userTransactions.has(userId)) {
      this.userTransactions.set(userId, []);
    }
    const transactions = this.userTransactions.get(userId);
    transactions.push(txnObj);
    // Sort transactions by date using ISO strings for proper ordering.
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
      //calculation:
      //   floor((upperThreshold - lowerThreshold)*lowerMultiplier)
      //   + floor((amount - upperThreshold)*upperMultiplier)
      points =
        Math.floor((upperThreshold - lowerThreshold + 1) * lowerMultiplier) +
        Math.floor(amount - upperThreshold);
    }
    // For refund transactions, return negative points.
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
      // Ignore transactions with invalid dates.
      if (isNaN(txn.date.getTime())) return sum;
      return sum + this.calculateTransactionPoints(txn);
    });
    // Log the calculation.
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
    // Remove the user's transactions entirely.
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
      'User: ' +
      userId +
      '\nTotal Rewards: ' +
      rewards +
      '\nMonthly Breakdown:\n';
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
      const allTransactions = Array.from(this.userTransactions.entries());
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
    transactions.forEach((item, index) => {
      if (item.transaction && typeof item.transaction.amount === 'number') {
        this.addTransaction(item.userId, item.transaction);
        processedCount += index;
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
```

Stack Trace:
```javascript
 FAIL  1171476/index.test.js
  RewardCalculator Module - Expected Object Output
    ✕ should correctly transform a $120 purchase transaction (27 ms)
    ✓ should correctly transform a $45 purchase transaction to 0 points (3 ms)
    ✕ should correctly transform a $150 refund transaction (5 ms)
    ✕ should correctly generate monthly rewards summary for multiple transactions (56 ms)
    ✕ should correctly calculate total rewards for a user (3 ms)
    ✕ should correctly calculate rewards for a given date range (4 ms)
    ✓ should clear transactions for a user (3 ms)
    ✕ should update reward configuration and affect calculations (3 ms)
    ✕ should export and import transactions correctly (6 ms)
    ✕ should process bulk transactions and return correct processed count (4 ms)
    ✓ should return a deep copy of the transaction log (2 ms)
    ✕ should print user reward summary with correct information (72 ms)
    ✓ should persist calculation log asynchronously (54 ms)
    ✓ should correctly transform a $50 purchase transaction (exact threshold) to 0 points (1 ms)
    ✕ should handle transactions with invalid dates gracefully (2 ms)
    ✓ should return 0 total rewards for a non-existent user (1 ms)

  ● RewardCalculator Module - Expected Object Output › should correctly transform a $120 purchase transaction

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "amount": 90,
    +   "amount": 71,
        "date": 2023-07-01T00:00:00.000Z,
        "type": "purchase",
      }

      29 |     // Assume getTransaction returns the transformed transaction object.
      30 |     const tx = rc.getTransaction('user1', 0);
    > 31 |     expect(tx).toEqual({
         |                ^
      32 |       amount: 90,
      33 |       date: new Date('2023-07-01'),
      34 |       type: 'purchase',

      at Object.toEqual (1171476/index.test.js:31:16)

  ● RewardCalculator Module - Expected Object Output › should correctly transform a $150 refund transaction

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "amount": -150,
    +   "amount": -101,
        "date": 2023-07-03T00:00:00.000Z,
        "type": "refund",
      }

      59 |     });
      60 |     const tx = rc.getTransaction('user3', 0);
    > 61 |     expect(tx).toEqual({
         |                ^
      62 |       amount: -150,
      63 |       date: new Date('2023-07-03'),
      64 |       type: 'refund',

      at Object.toEqual (1171476/index.test.js:61:16)

  ● RewardCalculator Module - Expected Object Output › should correctly generate monthly rewards summary for multiple transactions

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "2023-06": 130,
    +   "2023-06": 101,
        "2023-07": 30,
      }

      88 |     // Assume getMonthlySummary returns an object mapping month keys to total rewards.
      89 |     const summary = rc.getMonthlySummary('user4');
    > 90 |     expect(summary).toEqual({
         |                     ^
      91 |       '2023-06': 130, // 20 + 110
      92 |       '2023-07': 30,
      93 |     });

      at Object.toEqual (1171476/index.test.js:90:21)

  ● RewardCalculator Module - Expected Object Output › should correctly calculate total rewards for a user

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "amount": 110,
    +   "amount": "[object Object]61",
        "userId": "user5",
      }

      110 |     // Assume getTotalRewards returns an object with total reward points.
      111 |     const total = rc.getTotalRewards('user5');
    > 112 |     expect(total).toEqual({ amount: 110, userId: 'user5' });
          |                   ^
      113 |   });
      114 |
      115 |   test('should correctly calculate rewards for a given date range', () => {

      at Object.toEqual (1171476/index.test.js:112:19)

  ● RewardCalculator Module - Expected Object Output › should correctly calculate rewards for a given date range

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "amount": 110,
    +   "amount": 61,
        "from": 2023-05-01T00:00:00.000Z,
        "to": 2023-05-31T00:00:00.000Z,
        "userId": "user6",
      }

      139 |       '2023-05-31'
      140 |     );
    > 141 |     expect(rangeRewards).toEqual({
          |                          ^
      142 |       amount: 110,
      143 |       from: new Date('2023-05-01'),
      144 |       to: new Date('2023-05-31'),

      at Object.toEqual (1171476/index.test.js:141:26)

  ● RewardCalculator Module - Expected Object Output › should update reward configuration and affect calculations

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "amount": 160,
    +   "amount": 122,
        "date": 2023-08-01T00:00:00.000Z,
        "type": "purchase",
      }

      181 |     // Expected reward = floor((80-30)*2) + floor((100-80)*3) = 100 + 60 = 160.
      182 |     const tx = rc.getTransaction('user8', 0);
    > 183 |     expect(tx).toEqual({
          |                ^
      184 |       amount: 160,
      185 |       date: new Date('2023-08-01'),
      186 |       type: 'purchase',

      at Object.toEqual (1171476/index.test.js:183:16)

  ● RewardCalculator Module - Expected Object Output › should export and import transactions correctly

    expect(received).toEqual(expected) // deep equality

    Expected: {"amount": 45, "date": 2023-08-05T00:00:00.000Z, "type": "purchase"}
    Received: null

      200 |     expect(importSuccess).toEqual(true);
      201 |     const tx = rc2.getTransaction('user9', 0);
    > 202 |     expect(tx).toEqual({
          |                ^
      203 |       amount: 45,
      204 |       date: new Date('2023-08-05'),
      205 |       type: 'purchase',

      at Object.toEqual (1171476/index.test.js:202:16)

  ● RewardCalculator Module - Expected Object Output › should process bulk transactions and return correct processed count

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "count": 4,
    +   "count": 6,
        "userId": "user10",
      }

      228 |     // Assume processBulkTransactions returns an object with a count and userId.
      229 |     const processed = rc.processBulkTransactions(bulk);
    > 230 |     expect(processed).toEqual({ count: 4, userId: 'user10' });
          |                       ^
      231 |   });
      232 |
      233 |   test('should return a deep copy of the transaction log', () => {

      at Object.toEqual (1171476/index.test.js:230:23)

  ● RewardCalculator Module - Expected Object Output › should print user reward summary with correct information

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

      User: user12
    - Total Rewards: 120
    + Total Rewards: [object Object]30
      Monthly Breakdown:
    - 2023-11 : 120
    + 2023-11 : 101
      ↵

      258 |     const expectedSummary =
      259 |       'User: user12\nTotal Rewards: 120\nMonthly Breakdown:\n2023-11 : 120\n';
    > 260 |     expect(summary).toEqual(expectedSummary);
          |                     ^
      261 |   });
      262 |
      263 |   test('should persist calculation log asynchronously', (done) => {

      at Object.toEqual (1171476/index.test.js:260:21)

  ● RewardCalculator Module - Expected Object Output › should handle transactions with invalid dates gracefully

    expect(received).toBeUndefined()

    Received: ["user15", [{"amount": 120, "date": null, "type": "purchase"}]]

      300 |     });
      301 |     const log = rc.getTransactionLog();
    > 302 |     expect(log.find(([id]) => id === 'user15')).toBeUndefined();
          |                                                 ^
      303 |   });
      304 |
      305 |   test('should return 0 total rewards for a non-existent user', () => {

      at Object.toBeUndefined (1171476/index.test.js:302:49)

Test Suites: 1 failed, 1 total
Tests:       10 failed, 6 passed, 16 total
Snapshots:   0 total
Time:        1.827 s
Ran all test suites matching /1171476/i.
```

Prompt:
I'm building a reward calculator module that process user transactions and calculates reward points Currently, several tests are failing could you help me to fix those issues 
The rules for calculating reward are
- No points for amounts ≤ lowerThreshold (default: 50).
- For amounts above 50 but ≤ 100: points = floor(amount – 50) × 1.
- For amounts above 100: points = floor((100 – 50) × 1) + floor((amount – 100) × 2).
- For refund transactions, points should be the negative of the purchase points.
please provide me the full version of corrected code not code snippets.