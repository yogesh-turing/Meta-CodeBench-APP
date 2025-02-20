class SubscriptionManager {
  constructor(subscriptions) {
    this.subscriptions = subscriptions;
    this.cache = new Map();
  }

  calculateRevenue(exchangeRates = { USD: 1 }) {
    const cacheKey = JSON.stringify({ subs: this.subscriptions, rates: exchangeRates });
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
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
      const priceInUSD = subscription.price * exchangeRates[subscription.currency];

      let adjustedPrice = this.calculateAdjustedPrice(subscription, priceInUSD);

      // Apply discount for yearly subscriptions
      if (subscription.billingCycle === 'yearly' && subscription.discount) {
        adjustedPrice *= (1 - subscription.discount / 100);
      }

      return total + adjustedPrice;
    }, 0);

    this.cache.set(cacheKey, revenue);
    return revenue;
  }

  isValidPrice(price) {
    return typeof price === 'number' && 
           !isNaN(price) && 
           price !== null && 
           price !== undefined;
  }

  calculateAdjustedPrice(subscription, priceInUSD) {
    switch (subscription.billingCycle) {
      case 'monthly':
        return this.handleMonthlyCancellation(subscription, priceInUSD);
      
      case 'yearly':
        return this.handleYearlyCancellation(subscription, priceInUSD);
      
      case 'lifetime':
        return priceInUSD;
      
      default:
        return 0;
    }
  }

  handleMonthlyCancellation(subscription, priceInUSD) {
    if (!subscription.cancelAfterMonths) {
      return priceInUSD;
    }
    return subscription.cancelAfterMonths === 0 ? 0 : priceInUSD;
  }

  handleYearlyCancellation(subscription, priceInUSD) {
    const monthlyEquivalent = priceInUSD / 12;
    
    if (!subscription.cancelAfterMonths) {
      return monthlyEquivalent;
    }

    const monthsUsed = Math.min(subscription.cancelAfterMonths, 12);
    return (monthsUsed * monthlyEquivalent) / 12;
  }

  clearCache() {
    this.cache.clear();
  }
}

module.exports = { SubscriptionManager };