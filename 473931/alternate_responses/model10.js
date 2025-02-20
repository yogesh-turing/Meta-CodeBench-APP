class FraudDetector {
  constructor() {
    this.transactions = []; // Stores all transactions
    this.flaggedTransactions = new Set();
    this.blacklistedUsers = new Set();
    this.userTransactionHistory = new Map(); // Maps userId -> List of transactions
  }

  addTransaction({ id, userId, amount, timestamp, country, device }) {
    if (!this.userTransactionHistory.has(userId)) {
      this.userTransactionHistory.set(userId, []);
    }
    
    const userTransactions = this.userTransactionHistory.get(userId);
    
    // Store transaction
    this.transactions.push({ id, userId, amount, timestamp, country, device });
    userTransactions.push({ id, amount, timestamp, country, device });

    // Check for fraud
    this.checkVelocity(userId);
    this.checkAnomalousSpending(userId);
    this.checkGeolocation(userId);
    this.checkDeviceFingerprinting(userId);
    
    // Blacklist user if they have 3 or more flagged transactions
    if (this.getFlaggedCount(userId) >= 3) {
      this.blacklistedUsers.add(userId);
    }
  }

  checkVelocity(userId) {
    const userTransactions = this.userTransactionHistory.get(userId);
    const latestTx = userTransactions[userTransactions.length - 1];
    
    // Check last 5 transactions
    if (userTransactions.length >= 5) {
      const firstTxInWindow = userTransactions[userTransactions.length - 5];
      if (latestTx.timestamp - firstTxInWindow.timestamp <= 60000) {
        this.flaggedTransactions.add(latestTx.id);
      }
    }
  }

  checkAnomalousSpending(userId) {
    const userTransactions = this.userTransactionHistory.get(userId);
    if (userTransactions.length < 10) return; // Need enough data
    
    const latestTx = userTransactions[userTransactions.length - 1];
    const last10 = userTransactions.slice(-10);
    const avg = last10.reduce((sum, tx) => sum + tx.amount, 0) / 10;

    if (latestTx.amount > avg * 10) {
      this.flaggedTransactions.add(latestTx.id);
    }
  }

  checkGeolocation(userId) {
    const userTransactions = this.userTransactionHistory.get(userId);
    if (userTransactions.length < 2) return; // Need at least two transactions
    
    const latestTx = userTransactions[userTransactions.length - 1];
    const secondLatestTx = userTransactions[userTransactions.length - 2];
    
    if (latestTx.country !== secondLatestTx.country && latestTx.timestamp - secondLatestTx.timestamp <= 300000) {
      this.flaggedTransactions.add(latestTx.id);
    }
  }

  checkDeviceFingerprinting(userId) {
    const userTransactions = this.userTransactionHistory.get(userId);
    if (userTransactions.length < 2) return; // Need at least two transactions
    
    const latestTx = userTransactions[userTransactions.length - 1];
    const secondLatestTx = userTransactions[userTransactions.length - 2];
    
    if (latestTx.device !== secondLatestTx.device && latestTx.timestamp - secondLatestTx.timestamp <= 600000) {
      this.flaggedTransactions.add(latestTx.id);
    }
  }

  getFlaggedCount(userId) {
    return [...this.flaggedTransactions].filter((id) =>
      this.userTransactionHistory.get(userId).some((tx) => tx.id === id)
    ).length;
  }
}

module.exports = { FraudDetector };