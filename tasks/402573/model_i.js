function calculateEMA(prices, period) {
    if (!prices || prices.length === 0 || period <= 0) {
        return [];
    }

    const cleanPrices = prices.filter((price) => !isNaN(price));
    if (cleanPrices.length === 0) {
        return [];
    }

    const k = 2 / (period + 1);
    let emaArray = [cleanPrices[0]];

    for (let i = 1; i < cleanPrices.length; i++) {
        emaArray.push(cleanPrices[i] * k + emaArray[i - 1] * (1 - k));
    }

    return emaArray;
}

function calculateMACD(prices, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
    if (!prices || prices.length === 0 || shortPeriod <= 0 || longPeriod <= 0 || signalPeriod <= 0) {
        return {
            macdLine: [],
            signalLine: [],
            histogram: []
        };
    }

    const cleanPrices = prices.filter((price) => !isNaN(price));
    if (cleanPrices.length === 0) {
        return {
            macdLine: [],
            signalLine: [],
            histogram: []
        };
    }

    const shortEMA = calculateEMA(cleanPrices, shortPeriod);
    const longEMA = calculateEMA(cleanPrices, longPeriod);

    const minLength = Math.min(shortEMA.length, longEMA.length);
    const macdLine = [];
    for (let i = 0; i < minLength; i++) {
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