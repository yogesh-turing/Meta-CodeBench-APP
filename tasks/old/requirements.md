Base Code:
```javascript
class Trade {
  maxProfit(prices) {
    if (prices.length === 0) return 0;

    let min = prices[0];
    let profit = 0;

    for (let i = 1; i < prices.length; i++) {
      // Update the current minimum value
      min = Math.min(min, prices[i]);

      // Update result if we get more profit
      profit = Math.max(profit, prices[i] - min);
    }

    return profit;
  }
}

module.exports =  { Trade };
```

In share trading company, traders can buy shares and sell them on a future date. Given the stock price of n days, the trader is allowed to make  transactions, where a new transaction can only start after the previous transaction is complete, the goal is to find the maximum profit that can be made. The given code correctly calculates the maximum profit when the trader is allowed to buy and sell the stocks only once. However, it needs to be modified such that the stocks can be bought and sold at most k times to maximize the total profit. Ensure that the updated function adheres to the following conditions:

1. k should be taken as user input and passed as a parameter to the maxProfit method. 1 <= k <= 100
2. You cannot hold more than one stock at a time (i.e., you must sell your current stock before buying another).

Update the maxProfit function in the Trade class to compute the maximum total profit achievable under these rules.
give code in javascript 

Example 1:
Input  : [100, 30, 15, 10, 8, 25, 80],  k=2
Output : 72

Example 2:
Input  : [90, 80, 70, 60, 50], k=1
Output : 0