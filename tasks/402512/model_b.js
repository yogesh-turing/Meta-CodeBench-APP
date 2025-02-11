class MaximizeProfit {
    maxProfit(stockPrices, k) {
      // Handle edge cases
      if (!stockPrices || stockPrices.length < 2 || k <= 0) return 0;
      
      // If k is larger than n/2, we can make as many transactions as we want
      const n = stockPrices.length;
      if (k >= Math.floor(n/2)) {
        let maxProfit = 0;
        for (let i = 1; i < n; i++) {
          if (stockPrices[i] > stockPrices[i-1]) {
            maxProfit += stockPrices[i] - stockPrices[i-1];
          }
        }
        return maxProfit;
      }
  
      // Create dp table: dp[i][j] represents maximum profit using up to i transactions up to day j
      const dp = Array(k + 1).fill(0).map(() => Array(n).fill(0));
  
      // For each transaction
      for (let i = 1; i <= k; i++) {
        let maxDiff = -stockPrices[0];
        // For each day
        for (let j = 1; j < n; j++) {
          dp[i][j] = Math.max(dp[i][j-1], stockPrices[j] + maxDiff);
          maxDiff = Math.max(maxDiff, dp[i-1][j-1] - stockPrices[j]);
        }
      }
  
      return dp[k][n-1];
    }
  }
  
  module.exports = { MaximizeProfit };