class MaximizeProfit {
  maxProfit(stockPrices, k) {
    if (stockPrices.length <= 1 || k <= 0) return 0;
    
    // Limit k to n/2 as we can't make more transactions than half the number of days
    k = Math.min(k, Math.floor(stockPrices.length / 2));
    
    // Create a 2D DP table
    const dp = Array(k + 1).fill().map(() => Array(stockPrices.length).fill(0));
    
    // For each transaction
    for (let i = 1; i <= k; i++) {
      let maxDiff = -stockPrices[0];
      
      // For each day
      for (let j = 1; j < stockPrices.length; j++) {
        // Maximum of:
        // 1. Previous day's profit (no transaction today)
        // 2. Today's price + maximum difference found so far
        dp[i][j] = Math.max(dp[i][j-1], stockPrices[j] + maxDiff);
        
        // Update maxDiff for the next iteration
        // This represents the maximum profit we could get if we buy on a previous day
        maxDiff = Math.max(maxDiff, dp[i-1][j] - stockPrices[j]);
      }
    }
    
    return dp[k][stockPrices.length - 1];
  }
}

module.exports = { MaximizeProfit };