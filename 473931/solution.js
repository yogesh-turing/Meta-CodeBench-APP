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
      const latestTx = userTransactions[userTransactions.length - 1];
      
      // If we have previous transactions, check for anomalous amount
      if (userTransactions.length > 1) {
        const previousTransactions = userTransactions.slice(0, -1);
        const avg = previousTransactions.reduce((sum, tx) => sum + tx.amount, 0) / previousTransactions.length;
  
        if (latestTx.amount > avg * 5) { // Lowered threshold to 5x average
          this.flaggedTransactions.add(latestTx.id);
        }
      }
    }

    checkGeolocation(userId) {
      const userTransactions = this.userTransactionHistory.get(userId);
      if (userTransactions.length < 2) return;

      const latestTx = userTransactions[userTransactions.length - 1];
      const previousTx = userTransactions[userTransactions.length - 2];

      // Flag if country changes between consecutive transactions
      if (previousTx.country !== latestTx.country) {
        this.flaggedTransactions.add(latestTx.id);
      }
    }

    checkDeviceFingerprinting(userId) {
      const userTransactions = this.userTransactionHistory.get(userId);
      if (userTransactions.length < 2) return;

      const latestTx = userTransactions[userTransactions.length - 1];
      const previousTx = userTransactions[userTransactions.length - 2];

      // Flag if device changes between consecutive transactions
      if (previousTx.device !== latestTx.device) {
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