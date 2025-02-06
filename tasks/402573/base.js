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