class SubscriptionManager {
  constructor(subscriptions) {
    this.subscriptions = subscriptions;
    this.cache = new WeakMap();
  }

  calculateRevenue(exchangeRates = { USD: 1 }) {
    // Check cache first
    const cacheKey = JSON.stringify({ subs: this.subscriptions, rates: exchangeRates });
    if (this.cache.has(this)) {
      const cachedResults = this.cache.get(this);
      if (cachedResults[cacheKey]) {
        return cachedResults[cacheKey];
      }
    }

    const revenue = this.subscriptions.reduce((total, subscription) => {
      // Skip invalid prices
      if (!this.isValidPrice(subscription.price)) {
        return total;
      }

      // Convert currency
      if (!exchangeRates[subscription.currency]) {
        throw new Error('Unsupported currency');
      }
      const priceInUSD = subscription.price * exchangeRates[subscription.currency];

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
          return total; // Skip unknown billing cycles
      }

      return total + subscriptionRevenue;
    }, 0);

    // Cache the result
    if (!this.cache.has(this)) {
      this.cache.set(this, {});
    }
    this.cache.get(this)[cacheKey] = revenue;

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
      yearlyPrice = (yearlyPrice / 12) * monthsUsed;
    } else {
      yearlyPrice = yearlyPrice / 12; // Convert to monthly equivalent
    }

    return yearlyPrice;
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