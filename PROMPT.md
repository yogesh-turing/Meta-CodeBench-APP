Base Code:
``` js
function calculateEMA(prices, period) {
    const k = 2 / (period + 1);
    let emaArray = [prices[0]]; 

    for (let i = 1; i < prices.length; i++) {
        emaArray.push(prices[i] * k + emaArray[i - 1] * (1 - k));
    }

    return emaArray;
}

function calculateMACD(prices, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
    const shortEMA = calculateEMA(prices, shortPeriod);
    const longEMA = calculateEMA(prices, longPeriod);

    const macdLine = shortEMA.map((value, index) => value - longEMA[index]);
    const signalLine = calculateEMA(macdLine, signalPeriod);
    const histogram = macdLine.map((value, index) => value - signalLine[index]);

    return {
        macdLine,
        signalLine,
        histogram
    };
}


module.exports = {
    calculateEMA,
    calculateMACD
};

```

Prompt:
The problem with the above code is, that the calculateMACD function assumes that shortEMA and longEMA arrays have the same length, which might not be true if the prices array is shorter than the longPeriod.
Please fix the problem by ensuring that the macdLine calculation only iterates up to the length of the shorter array between shortEMA and longEMA.
Also make sure functions work for null, undefined, empty inputs and input arrays with null/undefined/NaN values. Return an empty array if the input is invalid.