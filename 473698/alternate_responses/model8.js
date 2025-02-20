const cache = new Map();

class SubscriptionManager {
  constructor(subscriptions) {
    this.subscriptions = subscriptions;
  }

  calculateRevenue(exchangeRates) {
    // Check if the result is already cached
    const cacheKey = JSON.stringify({ subscriptions: this.subscriptions, exchangeRates });
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    // Initialize revenue to 0
    let revenue = 0;

    // Iterate over each subscription
    for (const sub of this.subscriptions) {
      // Check if the price is valid
      if (typeof sub.price !== 'number' || isNaN(sub.price)) {
        continue;
      }

      // Convert price to USD
      if (!exchangeRates[sub.currency]) {
        throw new Error('Unsupported currency');
      }
      let priceInUSD = sub.price * exchangeRates[sub.currency];

      // Apply discount if available
      if (sub.discount) {
        priceInUSD *= (1 - sub.discount / 100);
      }

      // Handle different billing cycles
      switch (sub.billingCycle) {
        case 'monthly':
          // If canceled, only count up to the canceled month
          if (sub.cancelAfterMonths) {
            revenue += priceInUSD * Math.min(sub.cancelAfterMonths, 1);
          } else {
            revenue += priceInUSD;
          }
          break;
        case 'yearly':
          // Convert yearly price to monthly equivalent
          priceInUSD /= 12;

          // If canceled, only count up to the canceled month
          if (sub.cancelAfterMonths) {
            revenue += priceInUSD * Math.min(sub.cancelAfterMonths, 12);
          } else {
            revenue += priceInUSD * 12;
          }
          break;
        case 'lifetime':
          // Add lifetime subscription as a one-time payment
          revenue += priceInUSD;
          break;
        default:
          throw new Error('Unsupported billing cycle');
      }
    }

    // Cache the result
    cache.set(cacheKey, revenue);

    return revenue;
  }
}

module.exports = SubscriptionManager;