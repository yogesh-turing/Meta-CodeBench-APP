function calculateEMA(prices, period) {
    if (!Array.isArray(prices) || prices.length === 0 || period <= 0) {
        return [];
    }

    const filteredPrices = prices.filter(price => !isNaN(price));
    if (filteredPrices.length < period) {
        return [];
    }

    const k = 2 / (period + 1);
    let emaArray = [filteredPrices[0]];

    for (let i = 1; i < filteredPrices.length; i++) {
        emaArray.push(filteredPrices[i] * k + emaArray[i - 1] * (1 - k));
    }

    return emaArray;
}

function calculateMACD(prices, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
    if (!Array.isArray(prices) || prices.length === 0 || shortPeriod <= 0 || longPeriod <= 0 || signalPeriod <= 0) {
        return {
            macdLine: [],
            signalLine: [],
            histogram: []
        };
    }

    const shortEMA = calculateEMA(prices, shortPeriod);
    const longEMA = calculateEMA(prices, longPeriod);

    if (shortEMA.length === 0 || longEMA.length === 0) {
        return {
            macdLine: [],
            signalLine: [],
            histogram: []
        };
    }

    const macdLine = [];
    for (let i = 0; i < Math.min(shortEMA.length, longEMA.length); i++) {
        macdLine.push(shortEMA[i] - longEMA[i]);
    }

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