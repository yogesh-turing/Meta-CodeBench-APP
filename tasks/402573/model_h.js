function calculateEMA(prices, period) {
    // Check if the input array is valid
    if (!Array.isArray(prices) || prices.length === 0 || prices.some(isNaN)) {
        return [];
    }

    const k = 2 / (period + 1);
    let emaArray = [prices[0]];

    for (let i = 1; i < prices.length; i++) {
        emaArray.push(prices[i] * k + emaArray[i - 1] * (1 - k));
    }

    return emaArray;
}

function calculateMACD(prices, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
    // Check if the input array is valid
    if (!Array.isArray(prices) || prices.length === 0 || prices.some(isNaN)) {
        return {
            macdLine: [],
            signalLine: [],
            histogram: []
        };
    }

    const shortEMA = calculateEMA(prices, shortPeriod);
    const longEMA = calculateEMA(prices, longPeriod);

    const minLength = Math.min(shortEMA.length, longEMA.length);
    const macdLine = Array(minLength).fill(0).map((_, index) => shortEMA[index] - longEMA[index]);
    const signalLine = calculateEMA(macdLine, signalPeriod);
    const histogram = macdLine.map((value, index) => value - (signalLine[index] || 0));

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