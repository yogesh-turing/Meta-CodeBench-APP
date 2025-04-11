class MaximizeProfit {
  maxProfit(stockPrices, k) {
    if (stockPrices.length === 0 || k === 0) return 0;

    // Initialize a 2D array to store the maximum profit for each transaction
    let dp = Array(k + 1).fill(0).map(() => Array(stockPrices.length).fill(0));

    // Iterate over each transaction
    for (let i = 1; i <= k; i++) {
      // Initialize the maximum profit for the first transaction
      let maxProfitSoFar = -Infinity;
      // Iterate over each day
      for (let j = 1; j < stockPrices.length; j++) {
        // Update the maximum profit for the current transaction
        maxProfitSoFar = Math.max(maxProfitSoFar, dp[i - 1][j - 1] - stockPrices[j - 1]);
        // Update the maximum profit for the current day
        dp[i][j] = Math.max(dp[i][j - 1], maxProfitSoFar + stockPrices[j]);
      }
    }

    // Return the maximum profit for the last transaction
    return dp[k][stockPrices.length - 1];
  }
}

module.exports = { MaximizeProfit };