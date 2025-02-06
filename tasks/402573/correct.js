
function calculateEMA(prices, period) {
    if (!Array.isArray(prices) || prices.length === 0 || period <= 0 
        || prices.includes(null) || prices.includes(undefined) || prices.includes(NaN)) {
        return [];
    }

    const k = 2 / (period + 1);
    let emaArray = [prices[0]]; // Start with the first price as the initial EMA

    for (let i = 1; i < prices.length; i++) {
        emaArray.push(prices[i] * k + emaArray[i - 1] * (1 - k));
    }

    return emaArray;
}

function calculateMACD(prices, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
    const shortEMA = calculateEMA(prices, shortPeriod);
    const longEMA = calculateEMA(prices, longPeriod);

    const minLength = Math.min(shortEMA.length, longEMA.length);
    const macdLine = shortEMA.slice(0, minLength).map((value, index) => value - longEMA[index]);
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

