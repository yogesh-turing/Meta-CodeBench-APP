class SubscriptionManager {
  constructor(subscriptions) {
    this.subscriptions = subscriptions;
    this._cache = new Map();
  }

  calculateRevenue(exchangeRates = { USD: 1 }) {
    // Generate cache key based on current state
    const cacheKey = JSON.stringify({ subs: this.subscriptions, rates: exchangeRates });
    
    // Return cached result if available
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey);
    }

    const revenue = this.subscriptions.reduce((total, subscription) => {
      // Skip invalid prices
      if (!this.isValidPrice(subscription.price)) {
        return total;
      }

      // Verify currency support
      if (!exchangeRates[subscription.currency]) {
        throw new Error('Unsupported currency');
      }

      // Convert price to USD
      let price = subscription.price * exchangeRates[subscription.currency];

      // Apply billing cycle calculations
      switch (subscription.billingCycle) {
        case 'monthly':
          // Handle monthly cancellation
          if (subscription.cancelAfterMonths !== undefined) {
            if (subscription.cancelAfterMonths <= 0) {
              return total;
            }
          }
          break;

        case 'yearly':
          // Convert to monthly equivalent
          price = price / 12;
          
          // Apply discount if available
          if (subscription.discount) {
            price *= (1 - subscription.discount / 100);
          }
          
          // Handle yearly cancellation
          if (subscription.cancelAfterMonths !== undefined) {
            if (subscription.cancelAfterMonths <= 0) {
              return total;
            }
            // Prorate based on months used
            price = (price * subscription.cancelAfterMonths);
          }
          break;

        case 'lifetime':
          // Lifetime subscriptions are one-time payments
          // No cancellation handling needed
          break;

        default:
          // Skip subscriptions with invalid billing cycles
          return total;
      }

      return total + price;
    }, 0);

    // Cache the result
    this._cache.set(cacheKey, revenue);
    
    return revenue;
  }

  isValidPrice(price) {
    return typeof price === 'number' && 
           !isNaN(price) && 
           price !== null && 
           price !== undefined &&
           price >= 0;
  }
}

module.exports = { SubscriptionManager };