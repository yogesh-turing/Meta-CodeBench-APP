class MaximizeProfit {
  maxProfit(stockPrices, k) {
    const n = stockPrices.length;
    if (n === 0 || k === 0) return 0;

    if (k >= Math.floor(n / 2)) {
      let maxProfit = 0;
      for (let i = 1; i < n; i++) {
        if (stockPrices[i] >= stockPrices[i - 1]) {
          maxProfit += stockPrices[i] - stockPrices[i - 1];
        }
      }
      return maxProfit;
    }

    const dp = Array.from({ length: k + 1 }, () => Array(n).fill(0));

    for (let t = 1; t <= k; t++) {
      let maxDiff = 0;
      for (let d = 1; d < n; d++) {
        dp[t][d] = Math.max(dp[t][d - 1], stockPrices[d] + maxDiff);
        maxDiff = Math.max(maxDiff, dp[t - 1][d] - stockPrices[d]);
      }
    }

    return dp[k][n - 1];
  }
}

module.exports = { MaximizeProfit };
