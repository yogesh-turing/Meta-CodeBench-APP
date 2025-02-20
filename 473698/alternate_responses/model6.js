const cache = {};

class SubscriptionManager {
  constructor(subscriptions) {
    this.subscriptions = subscriptions;
  }

  calculateRevenue(exchangeRates) {
    const cacheKey = JSON.stringify(this.subscriptions) + JSON.stringify(exchangeRates);

    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    let totalRevenue = 0;

    for (const subscription of this.subscriptions) {
      if (!subscription.price || isNaN(subscription.price) || typeof subscription.price !== 'number') {
        continue;
      }

      const priceInUSD = this.convertToUSD(subscription.price, subscription.currency, exchangeRates);

      let monthlyPrice;
      switch (subscription.billingCycle) {
        case 'monthly':
          monthlyPrice = priceInUSD;
          break;
        case 'yearly':
          monthlyPrice = priceInUSD / 12;
          break;
        case 'lifetime':
          totalRevenue += priceInUSD;
          continue;
        default:
          throw new Error('Unsupported billing cycle');
      }

      if (subscription.cancelAfterMonths) {
        monthlyPrice *= subscription.cancelAfterMonths / 12;
      }

      if (subscription.discount) {
        monthlyPrice *= (1 - subscription.discount / 100);
      }

      totalRevenue += monthlyPrice;
    }

    cache[cacheKey] = totalRevenue;
    return totalRevenue;
  }

  convertToUSD(price, currency, exchangeRates) {
    if (!exchangeRates[currency]) {
      throw new Error('Unsupported currency');
    }

    return price * exchangeRates[currency];
  }
}

module.exports = SubscriptionManager;