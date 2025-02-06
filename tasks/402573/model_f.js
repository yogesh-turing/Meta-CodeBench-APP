function calculateEMA(prices, period) {
    if (!prices || !Array.isArray(prices) || prices.length === 0 || period <= 0) {
        return [];
    }

    prices = prices.filter(price => price !== null && price !== undefined && !isNaN(price));

    if (prices.length === 0) {
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
    if (!prices || !Array.isArray(prices) || prices.length === 0 || shortPeriod <= 0 || longPeriod <= 0 || signalPeriod <= 0) {
        return {
            macdLine: [],
            signalLine: [],
            histogram: []
        };
    }

    prices = prices.filter(price => price !== null && price !== undefined && !isNaN(price));

    if (prices.length === 0) {
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