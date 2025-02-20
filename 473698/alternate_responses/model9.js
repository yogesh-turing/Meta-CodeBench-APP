class SubscriptionManager {
  constructor(subscriptions) {
    this.subscriptions = subscriptions;
    this.cache = {};
  }

  calculateRevenue(exchangeRates) {
    // Check if the result is already cached
    const cacheKey = JSON.stringify({ subscriptions: this.subscriptions, exchangeRates });
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    let totalRevenue = 0;

    // Iterate over each subscription
    this.subscriptions.forEach((sub) => {
      // Check if the price is valid
      if (typeof sub.price !== 'number' || isNaN(sub.price)) {
        return;
      }

      // Convert the price to USD
      let priceInUSD;
      if (exchangeRates[sub.currency]) {
        priceInUSD = sub.price * exchangeRates[sub.currency];
      } else {
        throw new Error('Unsupported currency');
      }

      // Apply discount if available
      if (sub.discount) {
        priceInUSD *= (1 - sub.discount / 100);
      }

      // Handle different billing cycles
      switch (sub.billingCycle) {
        case 'monthly':
          // Monthly subscriptions are summed directly
          totalRevenue += priceInUSD;
          break;
        case 'yearly':
          // Yearly subscriptions are divided by 12 to obtain the monthly equivalent
          totalRevenue += priceInUSD / 12;
          break;
        case 'lifetime':
          // Lifetime subscriptions are added as a one-time payment
          totalRevenue += priceInUSD;
          break;
        default:
          // If the billing cycle is not recognized, skip this subscription
          return;
      }

      // Handle cancellations
      if (sub.cancelAfterMonths) {
        // Calculate the prorated refund
        const proratedRefund = priceInUSD * (sub.cancelAfterMonths / 12);
        totalRevenue -= proratedRefund;
      }
    });

    // Cache the result
    this.cache[cacheKey] = totalRevenue;

    return totalRevenue;
  }
}

module.exports = SubscriptionManager;