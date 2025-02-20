class FraudDetector {
  constructor() {
    this.transactions = [];
    this.flaggedTransactions = new Set();
    this.blacklistedUsers = new Set();
    this.userTransactionHistory = new Map();
  }

  addTransaction({ id, userId, amount, timestamp, country, device }) {
    if (this.blacklistedUsers.has(userId)) {
      throw new Error('Transaction rejected: User is blacklisted');
    }

    if (!this.userTransactionHistory.has(userId)) {
      this.userTransactionHistory.set(userId, []);
    }
    
    const userTransactions = this.userTransactionHistory.get(userId);
    const transaction = { id, userId, amount, timestamp, country, device };
    
    // Store transaction
    this.transactions.push(transaction);
    userTransactions.push(transaction);

    // Apply all fraud detection rules
    this.checkVelocity(userId);
    this.checkAnomalousSpending(userId);
    this.checkGeolocation(userId);
    this.checkDeviceFingerprinting(userId);
    
    // Check for blacklisting
    if (this.getFlaggedCount(userId) >= 3) {
      this.blacklistedUsers.add(userId);
    }
  }

  checkVelocity(userId) {
    const userTransactions = this.userTransactionHistory.get(userId);
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
    const last10 = userTransactions.slice(-11, -1); // Exclude current transaction
    const avg = last10.reduce((sum, tx) => sum + tx.amount, 0) / last10.length;

    if (latestTx.amount > avg * 10) {
      this.flaggedTransactions.add(latestTx.id);
    }
  }

  checkGeolocation(userId) {
    const userTransactions = this.userTransactionHistory.get(userId);
    const latestTx = userTransactions[userTransactions.length - 1];
    const timeWindow = 300000; // 5 minutes in milliseconds

    const recentTransactions = userTransactions.filter(tx =>
      latestTx.timestamp - tx.timestamp <= timeWindow
    );

    const countries = new Set(recentTransactions.map(tx => tx.country));
    if (countries.size > 1) {
      this.flaggedTransactions.add(latestTx.id);
    }
  }

  checkDeviceFingerprinting(userId) {
    const userTransactions = this.userTransactionHistory.get(userId);
    const latestTx = userTransactions[userTransactions.length - 1];
    const timeWindow = 600000; // 10 minutes in milliseconds

    const recentTransactions = userTransactions.filter(tx =>
      latestTx.timestamp - tx.timestamp <= timeWindow
    );

    const devices = new Set(recentTransactions.map(tx => tx.device));
    if (devices.size > 1) {
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