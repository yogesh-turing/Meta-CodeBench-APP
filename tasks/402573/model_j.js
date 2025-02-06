function calculateEMA(prices, period) {
    if (!Array.isArray(prices) || prices.length < period || prices.some(price => price == null || isNaN(price))) {
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
    if (!Array.isArray(prices) || prices.length < longPeriod || prices.some(price => price == null || isNaN(price))) {
        return { macdLine: [], signalLine: [], histogram: [] };
    }

    const shortEMA = calculateEMA(prices, shortPeriod);
    const longEMA = calculateEMA(prices, longPeriod);

    const macdLine = shortEMA.slice(0, longEMA.length).map((value, index) => value - longEMA[index]);
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