class MaximizeProfit {
    maxProfit(stockPrices, k) {
      if (!stockPrices || stockPrices.length < 2 || k <= 0) return 0;
      
      // If k is larger than n/2, we can make as many transactions as we want
      // because we can't make more than n/2 transactions in n days
      if (k >= Math.floor(stockPrices.length / 2)) {
        let profit = 0;
        for (let i = 1; i < stockPrices.length; i++) {
          if (stockPrices[i] > stockPrices[i - 1]) {
            profit += stockPrices[i] - stockPrices[i - 1];
          }
        }
        return profit;
      }
  
      // dp[i][j] represents maximum profit using at most i transactions up to day j
      const dp = Array(k + 1).fill().map(() => Array(stockPrices.length).fill(0));
  
      // For each transaction
      for (let i = 1; i <= k; i++) {
        let maxDiff = -stockPrices[0]; // Initialize maxDiff
        
        // For each day
        for (let j = 1; j < stockPrices.length; j++) {
          // Maximum of:
          // 1. Previous day's profit with same number of transactions
          // 2. Today's price + maxDiff (which considers all possible buying points before today)
          dp[i][j] = Math.max(dp[i][j-1], stockPrices[j] + maxDiff);
          
          // Update maxDiff for the next iteration
          maxDiff = Math.max(maxDiff, dp[i-1][j] - stockPrices[j]);
        }
      }
  
      return dp[k][stockPrices.length - 1];
    }
  }
  
  module.exports = { MaximizeProfit };