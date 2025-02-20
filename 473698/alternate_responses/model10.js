class SubscriptionManager {
  constructor(subscriptions) {
    this.subscriptions = subscriptions;
    this.cache = {};
  }

  calculateRevenue(exchangeRates) {
    const cacheKey = JSON.stringify({ subscriptions: this.subscriptions, exchangeRates });
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    let totalRevenue = 0;

    this.subscriptions.forEach(subscription => {
      const price = subscription.price;
      if (price === null || price === undefined || isNaN(price) || typeof price !== 'number') {
        return;
      }

      const currency = subscription.currency;
      if (!exchangeRates[currency]) {
        throw new Error(`Unsupported currency: ${currency}`);
      }

      const convertedPrice = price * exchangeRates[currency];

      switch (subscription.billingCycle) {
        case 'monthly':
          if (subscription.cancelAfterMonths) {
            totalRevenue += convertedPrice * subscription.cancelAfterMonths;
          } else {
            totalRevenue += convertedPrice;
          }
          break;
        case 'yearly':
          const yearlyPrice = convertedPrice;
          const discount = subscription.discount;
          if (discount) {
            yearlyPrice *= (1 - discount / 100);
          }

          if (subscription.cancelAfterMonths) {
            totalRevenue += yearlyPrice / 12 * subscription.cancelAfterMonths;
          } else {
            totalRevenue += yearlyPrice / 12;
          }
          break;
        case 'lifetime':
          totalRevenue += convertedPrice;
          break;
        default:
          throw new Error(`Unsupported billing cycle: ${subscription.billingCycle}`);
      }
    });

    this.cache[cacheKey] = totalRevenue;
    return totalRevenue;
  }
}

module.exports = SubscriptionManager;