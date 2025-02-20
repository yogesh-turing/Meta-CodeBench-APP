class SubscriptionManager {
  constructor(subscriptions) {
    this.subscriptions = subscriptions;
    this.cache = new Map();
  }

  calculateRevenue(exchangeRates = { USD: 1 }) {
    // Generate cache key based on subscriptions and exchange rates
    const cacheKey = JSON.stringify({ subs: this.subscriptions, rates: exchangeRates });
    
    // Return cached result if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const revenue = this.subscriptions.reduce((total, subscription) => {
      // Skip invalid prices
      if (!this.isValidPrice(subscription.price)) {
        return total;
      }

      // Convert currency to USD
      if (!exchangeRates[subscription.currency]) {
        throw new Error("Unsupported currency");
      }
      const priceInUSD = subscription.price * exchangeRates[subscription.currency];

      // Calculate base revenue based on billing cycle
      let subscriptionRevenue = 0;
      switch (subscription.billingCycle) {
        case 'monthly':
          subscriptionRevenue = this.calculateMonthlyRevenue(subscription, priceInUSD);
          break;
        case 'yearly':
          subscriptionRevenue = this.calculateYearlyRevenue(subscription, priceInUSD);
          break;
        case 'lifetime':
          subscriptionRevenue = priceInUSD;
          break;
        default:
          return total; // Skip invalid billing cycles
      }

      return total + subscriptionRevenue;
    }, 0);

    // Cache the result
    this.cache.set(cacheKey, revenue);
    return revenue;
  }

  calculateMonthlyRevenue(subscription, priceInUSD) {
    if (subscription.cancelAfterMonths !== undefined) {
      return subscription.cancelAfterMonths > 0 ? priceInUSD : 0;
    }
    return priceInUSD;
  }

  calculateYearlyRevenue(subscription, priceInUSD) {
    let yearlyPrice = priceInUSD;
    
    // Apply discount if available
    if (subscription.discount) {
      yearlyPrice *= (1 - subscription.discount / 100);
    }

    // Handle cancellation
    if (subscription.cancelAfterMonths !== undefined) {
      const monthsUsed = Math.min(12, Math.max(0, subscription.cancelAfterMonths));
      return (yearlyPrice / 12) * monthsUsed;
    }

    // Convert yearly to monthly equivalent
    return yearlyPrice / 12;
  }

  isValidPrice(price) {
    return typeof price === 'number' && 
           !isNaN(price) && 
           price !== null && 
           price !== undefined && 
           price >= 0;
  }

  clearCache() {
    this.cache.clear();
  }
}

module.exports = { SubscriptionManager };