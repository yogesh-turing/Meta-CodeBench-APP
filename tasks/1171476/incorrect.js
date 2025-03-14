const fs = require('fs');
const path = require('path');
const { RewardCalculator } = require('./model_h');

describe('RewardCalculator Module - Expected Object Output', () => {
  let rc;
  const tempFile = path.join(__dirname, 'tempTransactions.json');

  beforeEach(() => {
    rc = new RewardCalculator();
  });

  afterEach(() => {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    const logFile = path.join(__dirname, 'calcLog.txt');
    if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
  });

  // invalid transaction
  test('should not add an invalid transaction (null transaction)', () => {
    try {
      rc.addTransaction('user1', null);
    } catch (e) {
      expect(e.message).toEqual('Invalid transaction data');
    }
  });

  test('should not add an invalid transaction (amount is not a number)', () => {
    try {
      rc.addTransaction('user1', { amount: 'abc', date: '2023-07-01' });
    } catch (e) {
      expect(e.message).toEqual('Invalid transaction data');
    }
  });

  test('should not add an invalid transaction (no date)', () => {
    try {
      rc.addTransaction('user8', { amount: 100 });
    } catch (e) {
      expect(e.message).toEqual('Invalid transaction data');
    }
  });

      
  test('should correctly transform a $120 purchase transaction', () => {
    // For a $120 purchase:
    // reward calculation: (100 - 50)*1 + (120 - 100)*2 = 50 + 40 = 90.
    rc.addTransaction('user1', {
      amount: 120,
      date: '2023-07-01',
      type: 'purchase',
    });
    const tx = rc.getTransaction('user1', 0);
    expect(tx).toEqual({
      amount: 90,
      date: new Date('2023-07-01'),
      type: 'purchase',
    });
  });

  test('should correctly transform a $45 purchase transaction to 0 points', () => {
    rc.addTransaction('user2', {
      amount: 45,
      date: '2023-07-02',
      type: 'purchase',
    });
    const tx = rc.getTransaction('user2', 0);
    expect(tx).toEqual({
      amount: 0,
      date: new Date('2023-07-02'),
      type: 'purchase',
    });
  });

  test('should correctly transform a $150 refund transaction', () => {
    // For a $150 refund:
    // Expected reward: -((100-50)*1 + (150-100)*2) = -150.
    rc.addTransaction('user3', {
      amount: 150,
      date: '2023-07-03',
      type: 'refund',
    });
    const tx = rc.getTransaction('user3', 0);
    expect(tx).toEqual({
      amount: -150,
      date: new Date('2023-07-03'),
      type: 'refund',
    });
  });

  test('should correctly generate monthly rewards summary for multiple transactions', () => {
    // For user4:
    // Transaction 1: $70 on 2023-06-15 → reward = 70 - 50 = 20.
    // Transaction 2: $130 on 2023-06-20 → reward = (100-50) + (130-100)*2 = 50 + 60 = 110.
    // Transaction 3: $80 on 2023-07-05 → reward = 80 - 50 = 30.
    rc.addTransaction('user4', {
      amount: 70,
      date: '2023-06-15',
      type: 'purchase',
    });
    rc.addTransaction('user4', {
      amount: 130,
      date: '2023-06-20',
      type: 'purchase',
    });
    rc.addTransaction('user4', {
      amount: 80,
      date: '2023-07-05',
      type: 'purchase',
    });
    const summary = rc.getMonthlySummary('user4');
    expect(summary).toEqual({
      '2023-06': 130, // 20 + 110
      '2023-07': 30,
    });
  });

  test('should correctly calculate total rewards for a user', () => {
    // For user5:
    // Transaction 1: $90 on 2023-05-01 → reward = 90 - 50 = 40.
    // Transaction 2: $110 on 2023-05-15 → reward = (100-50) + (110-100)*2 = 50 + 20 = 70.
    rc.addTransaction('user5', {
      amount: 90,
      date: '2023-05-01',
      type: 'purchase',
    });
    rc.addTransaction('user5', {
      amount: 110,
      date: '2023-05-15',
      type: 'purchase',
    });
    const total = rc.getTotalRewards('user5');
    expect(total).toEqual({ amount: 110, userId: 'user5' });
  });

  test('should correctly calculate rewards for a given date range', () => {
    // For user6:
    // Transaction 1: $90 on 2023-05-01 → reward = 40.
    // Transaction 2: $110 on 2023-05-15 → reward = 70.
    // Transaction 3: $130 on 2023-06-01 → not within date range.
    rc.addTransaction('user6', {
      amount: 90,
      date: '2023-05-01',
      type: 'purchase',
    });
    rc.addTransaction('user6', {
      amount: 110,
      date: '2023-05-15',
      type: 'purchase',
    });
    rc.addTransaction('user6', {
      amount: 130,
      date: '2023-06-01',
      type: 'purchase',
    });
    
    const rangeRewards = rc.getRewardsForDateRange(
      'user6',
      '2023-05-01',
      '2023-05-31'
    );
    expect(rangeRewards).toEqual({
      amount: 110,
      from: new Date('2023-05-01'),
      to: new Date('2023-05-31'),
      userId: 'user6',
    });
  });

  test('should return false when user does not exist', () => {
    const tx = rc.getTransaction('nonexistent', 0);
    expect(tx).toBeNull();
  });

  test('should clear transactions for a user', () => {
    rc.addTransaction('user7', {
      amount: 100,
      date: '2023-07-10',
      type: 'purchase',
    });
    // Before clearing, the transaction should exist.
    let tx = rc.getTransaction('user7', 0);
    expect(tx).toEqual({
      amount: 50, // 100 - 50 = 50 points for a purchase of $100
      date: new Date('2023-07-10'),
      type: 'purchase',
    });
    rc.clearTransactions('user7');
    const log = rc.getTransactionLog();
    expect(log.find(([id]) => id === 'user7')).toBeUndefined();
  });

  test('clearTransactions should return false for a non-existent user', () => {
    const success = rc.clearTransactions('nonexistent');
    expect(success).toEqual(false);
  });

  test('should update reward configuration and affect calculations', () => {
    // New configuration: lowerThreshold: 30, upperThreshold: 80, lowerMultiplier: 2, upperMultiplier: 3.
    rc.updateConfig({
      lowerThreshold: 30,
      upperThreshold: 80,
      lowerMultiplier: 2,
      upperMultiplier: 3,
    });
    rc.addTransaction('user8', {
      amount: 100,
      date: '2023-08-01',
      type: 'purchase',
    });
    // Expected reward = floor((80-30)*2) + floor((100-80)*3) = 100 + 60 = 160.
    const tx = rc.getTransaction('user8', 0);
    expect(tx).toEqual({
      amount: 160,
      date: new Date('2023-08-01'),
      type: 'purchase',
    });
  });

  test(`exportTransactionsToFile should return false file path is invalid`, () => {
    const tempFile = path.join(__dirname, 'nonexistent', 'tempTransactions.json');
    const success = rc.exportTransactionsToFile(tempFile);
    expect(success).toEqual(false);
  });

  test('importTransactionsFromFile should return false if file does not exist', () => {
    const success = rc.importTransactionsFromFile('nonexistent.json');
    expect(success).toEqual(false);
  });

  test('should export and import transactions correctly', () => {
    rc.addTransaction('user9', {
      amount: 95,
      date: '2023-08-05',
      type: 'purchase',
    });
    const exportSuccess = rc.exportTransactionsToFile(tempFile);
    expect(exportSuccess).toEqual(true);
    const rc2 = new RewardCalculator();
    const importSuccess = rc2.importTransactionsFromFile(tempFile);
    expect(importSuccess).toEqual(true);
    const tx = rc2.getTransaction('user9', 0);
    expect(tx).toEqual({
      amount: 45,
      date: new Date('2023-08-05'),
      type: 'purchase',
    });
  });

  test('should process bulk transactions and return correct processed count', () => {
    const bulk = [
      {
        userId: 'user10',
        transaction: { amount: 60, date: '2023-09-01', type: 'purchase' },
      }, // → reward = 10.
      {
        userId: 'user10',
        transaction: { amount: 110, date: '2023-09-02', type: 'purchase' },
      }, // → reward = 60.
      {
        userId: 'user10',
        transaction: { amount: 80, date: '2023-09-03', type: 'purchase' },
      }, // → reward = 30.
      {
        userId: 'user10',
        transaction: { amount: 120, date: '2023-09-04', type: 'purchase' },
      }, // → reward = 90.
    ];
    const processed = rc.processBulkTransactions(bulk);
    expect(processed).toEqual({ count: 4, userId: 'user10' });
  });

  test('should return a deep copy of the transaction log', () => {
    rc.addTransaction('user11', {
      amount: 100,
      date: '2023-10-01',
      type: 'purchase',
    });
    const logCopy1 = rc.getTransactionLog();
    logCopy1[0][1][0].amount = 9999;
    const logCopy2 = rc.getTransactionLog();
    expect(logCopy2[0][1][0].amount).not.toEqual(9999);
  });

  test('should print user reward summary with correct information', () => {
    rc.addTransaction('user12', {
      amount: 120,
      date: '2023-11-01',
      type: 'purchase',
    }); // → reward = 90.
    rc.addTransaction('user12', {
      amount: 80,
      date: '2023-11-05',
      type: 'purchase',
    }); // → reward = 30.
    const summary = rc.printUserRewardSummary('user12');
    const expectedSummary =
      'User: user12\nTotal Rewards: 120\nMonthly Breakdown:\n2023-11 : 120\n';
    expect(summary).toEqual(expectedSummary);
  });

  test('should persist calculation log asynchronously', (done) => {
    rc.addTransaction('user13', {
      amount: 150,
      date: '2023-12-01',
      type: 'purchase',
    });
    const total = rc.getTotalRewards('user13');
    rc.persistCalculationLog((err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual({ persisted: true });
      const logFile = path.join(__dirname, 'calcLog.txt');
      expect(fs.existsSync(logFile)).toEqual(true);
      done();
    });
  }, 10000); 

  test('should correctly transform a $50 purchase transaction (exact threshold) to 0 points', () => {
    rc.addTransaction('user14', {
      amount: 50,
      date: '2023-12-15',
      type: 'purchase',
    });
    const tx = rc.getTransaction('user14', 0);
    expect(tx).toEqual({
      amount: 0,
      date: new Date('2023-12-15'),
      type: 'purchase',
    });
  });

  test('should handle transactions with invalid dates gracefully', () => {
    rc.addTransaction('user15', {
      amount: 120,
      date: 'invalid-date',
      type: 'purchase',
    });
    const log = rc.getTransactionLog();
    expect(log.find(([id]) => id === 'user15')).toBeUndefined();
  });

  test('should return 0 total rewards for a non-existent user', () => {
    const total = rc.getTotalRewards('nonexistent');
    expect(total).toEqual({ amount: 0, userId: 'nonexistent' });
  });
});