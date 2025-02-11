class MaximizeProfit {
  maxProfit(stockPrices, k) {
    if (stockPrices.length === 0) return 0;

    let buy = new Array(k + 1).fill(-Infinity);
    let sell = new Array(k + 1).fill(0);

    for (let price of stockPrices) {
      for (let i = 1; i <= k; i++) {
        buy[i] = Math.max(buy[i], sell[i - 1] - price);
        sell[i] = Math.max(sell[i], buy[i] + price);
      }
    }

    return sell[k];
  }
}

module.exports = { MaximizeProfit };