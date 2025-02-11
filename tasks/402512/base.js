class MaximizeProfit {
  maxProfit(stockPrices) {
    if (stockPrices.length === 0) return 0;

    let currentMin = stockPrices[0];
    let maximumProfit = 0;

    for (let i = 1; i < stockPrices.length; i++) {
      // Update the current minimum value
      currentMin = Math.min(currentMin, stockPrices[i]);

      // Update result if we get more profit
      maximumProfit = Math.max(maximumProfit, stockPrices[i] - currentMin);
    }

    return maximumProfit;
  }
}

module.exports =  { MaximizeProfit };