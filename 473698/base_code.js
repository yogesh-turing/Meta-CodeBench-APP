class SubscriptionManager {
  constructor(subscriptions) {
    this.subscriptions = subscriptions;
  }

  calculateRevenue() {
    return this.subscriptions.reduce((total, sub) => total + sub.price, 0);
  }
}

module.exports = SubscriptionManager;