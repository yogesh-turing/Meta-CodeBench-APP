class MaximizeProfit {
    maxProfit(stockPrices, k) {
      if (!stockPrices || stockPrices.length < 2 || k <= 0) return 0;
      
      const n = stockPrices.length;
      
      // If k is larger than n/2, we can make as many transactions as we want
      // because we can't make more than n/2 transactions in n days
      if (k >= Math.floor(n/2)) {
        let profit = 0;
        for (let i = 1; i < n; i++) {
          if (stockPrices[i] > stockPrices[i-1]) {
            profit += stockPrices[i] - stockPrices[i-1];
          }
        }
        return profit;
      }
      
      // dp[i][j] represents maximum profit using at most i transactions up to day j
      const dp = Array(k + 1).fill().map(() => Array(n).fill(0));
      
      for (let i = 1; i <= k; i++) {
        let maxDiff = -stockPrices[0];
        for (let j = 1; j < n; j++) {
          // Maximum of:
          // 1. Previous day's profit with same number of transactions
          // 2. Current day's price plus the maximum profit we could have made by
          //    buying on any previous day and making i-1 transactions before that
          dp[i][j] = Math.max(dp[i][j-1], stockPrices[j] + maxDiff);
          maxDiff = Math.max(maxDiff, dp[i-1][j] - stockPrices[j]);
        }
      }
      
      return dp[k][n-1];
    }
  }
  
  module.exports = { MaximizeProfit };