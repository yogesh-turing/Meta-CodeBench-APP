class MaximizeProfit {
  maxProfit(stockPrices, k) {
    if (stockPrices.length === 0) return 0;

    let n = stockPrices.length;
    k = Math.min(k, Math.floor(n / 2)); // We can't make more transactions than n/2

    let dp = new Array(k + 1).fill(0).map(() => new Array(n).fill(0));

    for (let i = 1; i <= k; i++) {
      let maxDiff = -Infinity;
      for (let j = 1; j < n; j++) {
        maxDiff = Math.max(maxDiff, dp[i - 1][j - 1] - stockPrices[j - 1]);
        dp[i][j] = Math.max(dp[i][j - 1], stockPrices[j] + maxDiff);
      }
    }

    return dp[k][n - 1];
  }
}

module.exports = { MaximizeProfit };