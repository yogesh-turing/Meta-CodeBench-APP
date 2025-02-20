class SubscriptionManager {
  constructor(subscriptions) {
    this.subscriptions = subscriptions;
    this.cache = {};
  }

  calculateRevenue(exchangeRates) {
    const cacheKey = JSON.stringify([this.subscriptions, exchangeRates]);
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    let totalRevenue = 0;

    this.subscriptions.forEach(sub => {
      if (!sub.price || isNaN(sub.price)) {
        return;
      }

      let price = sub.price;

      if (sub.billingCycle === 'yearly') {
        if (sub.cancelAfterMonths) {
          price = price * (sub.cancelAfterMonths / 12);
        }

        if (sub.discount) {
          price = price * (1 - sub.discount / 100);
        }

        price = price / 12;
      } else if (sub.billingCycle === 'lifetime') {
        // do nothing
      } else {
        if (sub.cancelAfterMonths) {
          price = price * (sub.cancelAfterMonths / 12);
        }
      }

      if (sub.currency !== 'USD') {
        if (!exchangeRates[sub.currency]) {
          throw new Error(`Unsupported currency: ${sub.currency}`);
        }
        price = price * exchangeRates[sub.currency];
      }

      totalRevenue += price;
    });

    this.cache[cacheKey] = totalRevenue;
    return totalRevenue;
  }
}

module.exports = SubscriptionManager;