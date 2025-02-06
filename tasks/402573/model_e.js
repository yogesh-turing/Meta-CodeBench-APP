function calculateEMA(prices, period) {
    if (!Array.isArray(prices) || prices.length === 0 || !Number.isFinite(period) || period <= 0) {
        return [];
    }

    const validPrices = prices.filter(price => Number.isFinite(price));
    if (validPrices.length === 0) {
        return [];
    }

    const k = 2 / (period + 1);
    let emaArray = [validPrices[0]];

    for (let i = 1; i < validPrices.length; i++) {
        emaArray.push(validPrices[i] * k + emaArray[i - 1] * (1 - k));
    }

    return emaArray;
}

function calculateMACD(prices, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
    if (!Array.isArray(prices) || prices.length === 0) {
        return { macdLine: [], signalLine: [], histogram: [] };
    }

    const shortEMA = calculateEMA(prices, shortPeriod);
    const longEMA = calculateEMA(prices, longPeriod);

    const macdLineLength = Math.min(shortEMA.length, longEMA.length);
    const macdLine = Array(macdLineLength);

    for (let i = 0; i < macdLineLength; i++) {
        macdLine[i] = shortEMA[i] - longEMA[i];
    }

    const signalLine = calculateEMA(macdLine, signalPeriod);
    const histogram = macdLine.map((value, index) => 
        index < signalLine.length ? value - signalLine[index] : NaN
    );

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