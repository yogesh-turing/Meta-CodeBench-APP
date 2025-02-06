function isValidNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

function isValidArray(arr) {
    return Array.isArray(arr) && arr.length > 0 && arr.every(isValidNumber);
}

function calculateEMA(prices, period) {
    if (!isValidArray(prices) || !isValidNumber(period) || period <= 0 || period > prices.length) {
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
    if (!isValidArray(prices) || !isValidNumber(shortPeriod) || !isValidNumber(longPeriod) || !isValidNumber(signalPeriod)) {
        return { macdLine: [], signalLine: [], histogram: [] };
    }

    const shortEMA = calculateEMA(prices, shortPeriod);
    const longEMA = calculateEMA(prices, longPeriod);

    if (shortEMA.length === 0 || longEMA.length === 0) {
        return { macdLine: [], signalLine: [], histogram: [] };
    }

    const macdLineLength = Math.min(shortEMA.length, longEMA.length);
    const macdLine = Array(macdLineLength);
    for (let i = 0; i < macdLineLength; i++) {
        macdLine[i] = shortEMA[i] - longEMA[i];
    }

    const signalLine = calculateEMA(macdLine, signalPeriod);
    const histogram = macdLine.map((value, index) => 
        index < signalLine.length ? value - signalLine[index] : null
    ).filter(value => value !== null);

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