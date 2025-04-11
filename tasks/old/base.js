class Trade {
  maxProfit(prices) {
    if (prices.length === 0) return 0;

    let min = prices[0];
    let profit = 0;

    for (let i = 1; i < prices.length; i++) {
      // Update the current minimum value
      min = Math.min(min, prices[i]);

      // Update result if we get more profit
      profit = Math.max(profit, prices[i] - min);
    }

    return profit;
  }
}

module.exports =  { Trade };