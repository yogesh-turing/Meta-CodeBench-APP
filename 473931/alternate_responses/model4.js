class FraudDetector {
  constructor() {
    this.transactions = [];
    this.flaggedTransactions = new Set();
    this.blacklistedUsers = new Set();
    this.userTransactionHistory = new Map();
  }

  addTransaction({ id, userId, amount, timestamp, country, device }) {
    if (this.blacklistedUsers.has(userId)) {
      throw new Error('User is blacklisted');
    }

    if (!this.userTransactionHistory.has(userId)) {
      this.userTransactionHistory.set(userId, []);
    }
    
    const userTransactions = this.userTransactionHistory.get(userId);
    const transaction = { id, amount, timestamp, country, device };
    
    // Store transaction
    this.transactions.push({ ...transaction, userId });
    userTransactions.push(transaction);

    // Run all fraud checks
    this.checkVelocity(userId);
    this.checkAnomalousSpending(userId);
    this.checkGeolocation(userId);
    this.checkDeviceFingerprinting(userId);
    
    // Update blacklist status
    if (this.getFlaggedCount(userId) >= 3) {
      this.blacklistedUsers.add(userId);
    }
  }

  checkVelocity(userId) {
    const userTransactions = this.userTransactionHistory.get(userId);
    if (userTransactions.length < 5) return;

    const latestTx = userTransactions[userTransactions.length - 1];
    const timeWindow = 60000; // 60 seconds in milliseconds
    
    const transactionsInWindow = userTransactions.filter(tx => 
      latestTx.timestamp - tx.timestamp <= timeWindow
    );

    if (transactionsInWindow.length >= 5) {
      this.flaggedTransactions.add(latestTx.id);
    }
  }

  checkAnomalousSpending(userId) {
    const userTransactions = this.userTransactionHistory.get(userId);
    if (userTransactions.length < 10) return;
    
    const latestTx = userTransactions[userTransactions.length - 1];
    const last10 = userTransactions.slice(-10);
    const previousTransactions = last10.slice(0, -1); // Exclude the latest transaction
    
    const avg = previousTransactions.reduce((sum, tx) => sum + tx.amount, 0) / previousTransactions.length;

    if (latestTx.amount > avg * 10) {
      this.flaggedTransactions.add(latestTx.id);
    }
  }

  checkGeolocation(userId) {
    const userTransactions = this.userTransactionHistory.get(userId);
    if (userTransactions.length < 2) return;

    const latestTx = userTransactions[userTransactions.length - 1];
    const timeWindow = 300000; // 5 minutes in milliseconds

    const recentTransactions = userTransactions.filter(tx =>
      latestTx.timestamp - tx.timestamp <= timeWindow
    );

    const uniqueCountries = new Set(recentTransactions.map(tx => tx.country));
    
    if (uniqueCountries.size > 1) {
      this.flaggedTransactions.add(latestTx.id);
    }
  }

  checkDeviceFingerprinting(userId) {
    const userTransactions = this.userTransactionHistory.get(userId);
    if (userTransactions.length < 2) return;

    const latestTx = userTransactions[userTransactions.length - 1];
    const timeWindow = 600000; // 10 minutes in milliseconds

    const recentTransactions = userTransactions.filter(tx =>
      latestTx.timestamp - tx.timestamp <= timeWindow
    );

    const uniqueDevices = new Set(recentTransactions.map(tx => tx.device));
    
    if (uniqueDevices.size > 1) {
      this.flaggedTransactions.add(latestTx.id);
    }
  }

  getFlaggedCount(userId) {
    const userTransactions = this.userTransactionHistory.get(userId);
    return [...this.flaggedTransactions].filter(id =>
      userTransactions.some(tx => tx.id === id)
    ).length;
  }
}

module.exports = { FraudDetector };