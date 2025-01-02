const { currencyAmountInWords } = require('./correct');

test('converts 0 to words', () => {
    expect(currencyAmountInWords(0)).toBe('Zero');
});

test('converts positive integer to words', () => {
    expect(currencyAmountInWords(123)).toBe('One Hundred Twenty Three');
    expect(currencyAmountInWords(1001)).toBe('One Thousand One');
    expect(currencyAmountInWords(1000000)).toBe('One Million');
});

test('converts negative integer to words', () => {
    expect(currencyAmountInWords(-123)).toBe('Negative One Hundred Twenty Three');
    expect(currencyAmountInWords(-1001)).toBe('Negative One Thousand One');
    expect(currencyAmountInWords(-1000000)).toBe('Negative One Million');
});

test('converts positive float to words', () => {
    expect(currencyAmountInWords(123.45)).toBe('One Hundred Twenty Three and Forty Five Cents');
    expect(currencyAmountInWords(1001.99)).toBe('One Thousand One and Ninety Nine Cents');
    expect(currencyAmountInWords(1000000.01)).toBe('One Million and One Cent');

    // 23 cents
    expect(currencyAmountInWords(0.23)).toBe('Twenty Three Cents');
    // 1 cent
    expect(currencyAmountInWords(0.01)).toBe('One Cent');
    // one digit amount
    expect(currencyAmountInWords(3.1)).toBe('Three and Ten Cents');
    // two digit amount
    expect(currencyAmountInWords(10.23)).toBe('Ten and Twenty Three Cents');
    // three digit amount
    expect(currencyAmountInWords(456.37)).toBe('Four Hundred Fifty Six and Thirty Seven Cents');
    // four digit amount
    expect(currencyAmountInWords(9743.49)).toBe('Nine Thousand Seven Hundred Forty Three and Forty Nine Cents');
    // five digit amount
    expect(currencyAmountInWords(12345.67)).toBe('Twelve Thousand Three Hundred Forty Five and Sixty Seven Cents');
    // six digit amount
    expect(currencyAmountInWords(523456.78)).toBe('Five Hundred Twenty Three Thousand Four Hundred Fifty Six and Seventy Eight Cents');
    // seven digit amount
    expect(currencyAmountInWords(7523456.89)).toBe('Seven Million Five Hundred Twenty Three Thousand Four Hundred Fifty Six and Eighty Nine Cents');
    // eight digit amount
    expect(currencyAmountInWords(87523456.99)).toBe('Eighty Seven Million Five Hundred Twenty Three Thousand Four Hundred Fifty Six and Ninety Nine Cents');
    // nine digit amount
    expect(currencyAmountInWords(987523456.01)).toBe('Nine Hundred Eighty Seven Million Five Hundred Twenty Three Thousand Four Hundred Fifty Six and One Cent');
    // ten digit amount
    expect(currencyAmountInWords(1987523456.23)).toBe('One Billion Nine Hundred Eighty Seven Million Five Hundred Twenty Three Thousand Four Hundred Fifty Six and Twenty Three Cents');
    // eleven digit amount
    expect(currencyAmountInWords(41987523456.45)).toBe('Forty One Billion Nine Hundred Eighty Seven Million Five Hundred Twenty Three Thousand Four Hundred Fifty Six and Forty Five Cents');
    // twelve digit amount
    expect(currencyAmountInWords(541987523456.67)).toBe('Five Hundred Forty One Billion Nine Hundred Eighty Seven Million Five Hundred Twenty Three Thousand Four Hundred Fifty Six and Sixty Seven Cents');
});

test('converts negative float to words', () => {
    expect(currencyAmountInWords(-123.45)).toBe('Negative One Hundred Twenty Three and Forty Five Cents');
    expect(currencyAmountInWords(-1001.99)).toBe('Negative One Thousand One and Ninety Nine Cents');
    expect(currencyAmountInWords(-1000000.01)).toBe('Negative One Million and One Cent');
    expect(currencyAmountInWords(-1000000.23)).toBe('Negative One Million and Twenty Three Cents');
});

test('returns empty string for invalid input', () => {
    expect(currencyAmountInWords('abc')).toBe('');
    expect(currencyAmountInWords(NaN)).toBe('');
    expect(currencyAmountInWords(undefined)).toBe('');
    expect(currencyAmountInWords(null)).toBe('');
    expect(currencyAmountInWords(1000000000001)).toBe('');
    expect(currencyAmountInWords(-1000000000001)).toBe('');
});
