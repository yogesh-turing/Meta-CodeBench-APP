class MaximizeProfit {
  maxProfit(prices, k) {
    // Handle edge cases
    if (!prices || prices.length < 2 || k <= 0) {
      return 0;
    }

    const n = prices.length;

    // For large k, use greedy approach
    if (k >= Math.floor(n / 2)) {
      let profit = 0;

      for (let i = 1; i < n; i++) {
        if (prices[i] > prices[i - 1]) {
          profit += prices[i] - prices[i - 1];
        }
      }
      return profit;
    }

    // Initialize DP arrays
    const dp = Array.from({ length: k + 1 }, () => Array(n).fill(0));

    // DP calculation
    for (let t = 1; t <= k; t++) {
      let maxDiff = -prices[0];
      for (let d = 1; d < n; d++) {
        dp[t][d] = Math.max(dp[t][d - 1], prices[d] + maxDiff);
        maxDiff = Math.max(maxDiff, dp[t - 1][d] - prices[d]);
      }
    }

    return dp[k][n - 1];
  }
}

module.exports = { MaximizeProfit };