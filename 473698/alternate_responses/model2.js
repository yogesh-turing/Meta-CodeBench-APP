class SubscriptionManager {
  constructor(subscriptions) {
    this.subscriptions = subscriptions;
    this.cache = new WeakMap();
  }

  calculateRevenue(exchangeRates = { USD: 1 }) {
    // Check cache first
    const cacheKey = JSON.stringify({ subs: this.subscriptions, rates: exchangeRates });
    if (this.cache.has(exchangeRates) && this.cache.get(exchangeRates)[cacheKey]) {
      return this.cache.get(exchangeRates)[cacheKey];
    }

    const revenue = this.subscriptions.reduce((total, subscription) => {
      // Skip invalid prices
      if (!this.isValidPrice(subscription.price)) {
        return total;
      }

      // Validate currency
      if (!exchangeRates[subscription.currency]) {
        throw new Error("Unsupported currency");
      }

      // Convert to USD
      let price = subscription.price * exchangeRates[subscription.currency];

      // Apply billing cycle calculations
      switch (subscription.billingCycle) {
        case 'monthly':
          if (subscription.cancelAfterMonths) {
            if (subscription.cancelAfterMonths < 1) {
              return total;
            }
            price *= Math.min(1, subscription.cancelAfterMonths);
          }
          break;

        case 'yearly':
          // Convert to monthly equivalent
          price = price / 12;
          
          // Apply discount if available
          if (subscription.discount) {
            price *= (1 - subscription.discount / 100);
          }

          // Handle cancellation
          if (subscription.cancelAfterMonths) {
            if (subscription.cancelAfterMonths < 12) {
              price *= (subscription.cancelAfterMonths / 12);
            }
          }
          break;

        case 'lifetime':
          // One-time payment, no proration needed
          break;

        default:
          // Skip invalid billing cycles
          return total;
      }

      return total + price;
    }, 0);

    // Cache the result
    if (!this.cache.has(exchangeRates)) {
      this.cache.set(exchangeRates, {});
    }
    this.cache.get(exchangeRates)[cacheKey] = revenue;

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