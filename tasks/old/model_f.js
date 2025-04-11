class MaximizeProfit {
  maxProfit(stockPrices, k) {
    if (stockPrices.length === 0) return 0;

    k = Math.min(k, Math.floor(stockPrices.length / 2));
    let dp = Array.from({ length: k + 1 }, () => new Array(stockPrices.length).fill(0));

    for (let i = 1; i <= k; i++) {
      let maxDiff = -stockPrices[0];
      for (let j = 1; j < stockPrices.length; j++) {
        dp[i][j] = Math.max(dp[i][j - 1], stockPrices[j] + maxDiff);
        maxDiff = Math.max(maxDiff, dp[i - 1][j] - stockPrices[j]);
      }
    }

    return dp[k][stockPrices.length - 1];
  }
}

module.exports = { MaximizeProfit };