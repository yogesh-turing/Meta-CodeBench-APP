const { calculateEMA, calculateMACD } = require('./model_a');

describe('calculateEMA', () => {
    it('should calculate EMA for a simple set of prices', () => {
        const prices = [1, 2, 3, 4, 5];
        const period = 3;
        const result = calculateEMA(prices, period);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(prices.length);
    });

    it('should return an empty array when prices array is empty', () => {
        const prices = [];
        const period = 3;
        const result = calculateEMA(prices, period);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return the same price when prices array has one element', () => {
        const prices = [5];
        const period = 3;
        const result = calculateEMA(prices, period);
        expect(result).toEqual([5]);
    });

    it('should calculate EMA correctly for a known set of prices', () => {
        const prices = [1, 2, 3, 4, 5];
        const period = 3;
        const expectedEMA = [1, 1.5, 2.25, 3.125, 4.0625];
        const result = calculateEMA(prices, period);
        expect(result).toEqual(expectedEMA);
    });

    it('should return an empty array when prices are null', () => {
        const prices = null;
        const period = 3;
        const result = calculateEMA(prices, period);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return an empty array when period is null', () => {
        const prices = [1, 2, 3, 4, 5];
        const period = null;
        const result = calculateEMA(prices, period);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return an empty array when period is zero', () => {
        const prices = [1, 2, 3, 4, 5];
        const period = 0;
        const result = calculateEMA(prices, period);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return an empty array when period is negative', () => {
        const prices = [1, 2, 3, 4, 5];
        const period = -3;
        const result = calculateEMA(prices, period);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return an empty array when prices array has null values', () => {
        const prices = [1, null, 3, 4, 5];
        const period = 3;
        const result = calculateEMA(prices, period);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return an empty array when prices array has undefined values', () => {
        const prices = [1, undefined, 3, 4, 5];
        const period = 3;
        const result = calculateEMA(prices, period);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

});

describe('calculateMACD', () => {
    it('should calculate MACD for a simple set of prices with default periods', () => {
        const prices = [1, 2, 3, 4, 5];
        const result = calculateMACD(prices);
        expect(result.macdLine.length).toBe(prices.length);
        expect(result.signalLine.length).toBe(prices.length);
        expect(result.histogram.length).toBe(prices.length);
    });

    it('should calculate MACD for a simple set of prices with custom periods', () => {
        const prices = [1, 2, 3, 4, 5];
        const shortPeriod = 2;
        const longPeriod = 4;
        const signalPeriod = 1;
        const result = calculateMACD(prices, shortPeriod, longPeriod, signalPeriod);
        expect(result.macdLine.length).toBe(prices.length);
        expect(result.signalLine.length).toBe(prices.length);
        expect(result.histogram.length).toBe(prices.length);
    });

    it('should return empty arrays when prices array is empty', () => {
        const prices = [];
        const result = calculateMACD(prices);
        expect(Array.isArray(result.macdLine)).toBe(true);
        expect(result.macdLine.length).toBe(0);
        expect(Array.isArray(result.signalLine)).toBe(true);
        expect(result.signalLine.length).toBe(0);
        expect(Array.isArray(result.histogram)).toBe(true);
        expect(result.histogram.length).toBe(0);
    });

    it('should return zeroed arrays when prices array has one element', () => {
        const prices = [5];
        const result = calculateMACD(prices);
        expect(result.macdLine).toEqual([0]);
        expect(result.signalLine).toEqual([0]);
        expect(result.histogram).toEqual([0]);
    });

    it('should calculate MACD correctly for a known set of prices', () => {
        const prices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const shortPeriod = 3;
        const longPeriod = 6;
        const signalPeriod = 2;
        const result = calculateMACD(prices, shortPeriod, longPeriod, signalPeriod);
        expect(result.macdLine.length).toBe(prices.length);
        expect(result.signalLine.length).toBe(prices.length);
        expect(result.histogram.length).toBe(prices.length);
    });

    it('should handle shortPeriod longer than prices array', () => {
        const prices = [1, 2, 3];
        const shortPeriod = 5;
        const longPeriod = 10;
        const signalPeriod = 3;
        const result = calculateMACD(prices, shortPeriod, longPeriod, signalPeriod);
        expect(result.macdLine.length).toBe(prices.length);
        expect(result.signalLine.length).toBe(prices.length);
        expect(result.histogram.length).toBe(prices.length);
    });

    it('should handle longPeriod longer than prices array', () => {
        const prices = [1, 2, 3];
        const shortPeriod = 2;
        const longPeriod = 5;
        const signalPeriod = 3;
        const result = calculateMACD(prices, shortPeriod, longPeriod, signalPeriod);
        expect(result.macdLine.length).toBe(prices.length);
        expect(result.signalLine.length).toBe(prices.length);
        expect(result.histogram.length).toBe(prices.length);
    });

    it('should handle signalPeriod longer than prices array', () => {
        const prices = [1, 2, 3];
        const shortPeriod = 2;
        const longPeriod = 3;
        const signalPeriod = 5;
        const result = calculateMACD(prices, shortPeriod, longPeriod, signalPeriod);
        expect(result.macdLine.length).toBe(prices.length);
        expect(result.signalLine.length).toBe(prices.length);
        expect(result.histogram.length).toBe(prices.length);
    });

    it('should handle all periods longer than prices array', () => {
        const prices = [1, 2];
        const shortPeriod = 5;
        const longPeriod = 6;
        const signalPeriod = 7;
        const result = calculateMACD(prices, shortPeriod, longPeriod, signalPeriod);
        expect(result.macdLine.length).toBe(prices.length);
        expect(result.signalLine.length).toBe(prices.length);
        expect(result.histogram.length).toBe(prices.length);
    });

    it('should return empty arrays when prices array is null', () => {
        const prices = null;
        const result = calculateMACD(prices);
        expect(Array.isArray(result.macdLine)).toBe(true);
        expect(result.macdLine.length).toBe(0);
        expect(Array.isArray(result.signalLine)).toBe(true);
        expect(result.signalLine.length).toBe(0);
        expect(Array.isArray(result.histogram)).toBe(true);
        expect(result.histogram.length).toBe(0);
    });

    it('should return empty arrays when prices array is undefined', () => {
        const prices = undefined;
        const result = calculateMACD(prices);
        expect(Array.isArray(result.macdLine)).toBe(true);
        expect(result.macdLine.length).toBe(0);
        expect(Array.isArray(result.signalLine)).toBe(true);
        expect(result.signalLine.length).toBe(0);
        expect(Array.isArray(result.histogram)).toBe(true);
        expect(result.histogram.length).toBe(0);
    });

    it('should return empty arrays when prices array has null values', () => {
        const prices = [1, null, 3, 4, 5];
        const result = calculateMACD(prices);
        expect(Array.isArray(result.macdLine)).toBe(true);
        expect(result.macdLine.length).toBe(0);
        expect(Array.isArray(result.signalLine)).toBe(true);
        expect(result.signalLine.length).toBe(0);
        expect(Array.isArray(result.histogram)).toBe(true);
        expect(result.histogram.length).toBe(0);
    });

    it('should return empty arrays when prices array has undefined values', () => {
        const prices = [1, undefined, 3, 4, 5];
        const result = calculateMACD(prices);
        expect(Array.isArray(result.macdLine)).toBe(true);
        expect(result.macdLine.length).toBe(0);
        expect(Array.isArray(result.signalLine)).toBe(true);
        expect(result.signalLine.length).toBe(0);
        expect(Array.isArray(result.histogram)).toBe(true);
        expect(result.histogram.length).toBe(0);
    });
});