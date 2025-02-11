class MaximizeProfit {
  maxProfit(stockPrices, k) {
    if (stockPrices.length === 0 || k === 0) return 0;

    let dp = new Array(stockPrices.length).fill(0).map(() => new Array(k + 1).fill(0));
    let maxDiff = new Array(stockPrices.length).fill(0).map(() => new Array(k + 1).fill(0));

    for (let i = 1; i < stockPrices.length; i++) {
      for (let j = 1; j <= k; j++) {
        maxDiff[i][j] = Math.max(maxDiff[i - 1][j], dp[i - 1][j - 1] - stockPrices[i - 1]);
        dp[i][j] = Math.max(dp[i - 1][j], stockPrices[i] + maxDiff[i][j]);
      }
    }

    return dp[stockPrices.length - 1][k];
  }
}

module.exports = { MaximizeProfit };