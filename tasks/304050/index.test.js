const { default: BigNumber } = require('bignumber.js');
const { currencyAmountInWords } = require('./correct');

test.only('special', () => {
    const value = 90000000000231.21;
    expect(currencyAmountInWords(value)).toBe('Ninety Trillion Two Hundred Thirty One Dollars and Twenty One Cents');
});
test('should return "Zero Dollars" for 0', () => {
    expect(currencyAmountInWords(0)).toBe("Zero Dollars");
    expect(currencyAmountInWords(-0)).toBe("Zero Dollars");
});


test('converts amount between 0 and 1 to words', () => {
    expect(currencyAmountInWords(0.01)).toBe('One Cent');
    expect(currencyAmountInWords(0.45)).toBe('Forty Five Cents');
    expect(currencyAmountInWords(0.99)).toBe('Ninety Nine Cents');
});

test('converts positive integers to words', () => {
    // one digit
    expect(currencyAmountInWords(5)).toBe('Five Dollars');

    // two digits
    expect(currencyAmountInWords(31)).toBe('Thirty One Dollars');

    // three digits
    expect(currencyAmountInWords(467)).toBe('Four Hundred Sixty Seven Dollars');

    // four digits
    expect(currencyAmountInWords(3963)).toBe('Three Thousand Nine Hundred Sixty Three Dollars');

    // five digits
    expect(currencyAmountInWords(53867)).toBe('Fifty Three Thousand Eight Hundred Sixty Seven Dollars');

    // six digits
    expect(currencyAmountInWords(642853)).toBe('Six Hundred Forty Two Thousand Eight Hundred Fifty Three Dollars');

    // seven digits
    expect(currencyAmountInWords(8435792)).toBe('Eight Million Four Hundred Thirty Five Thousand Seven Hundred Ninety Two Dollars');

    // eight digits
    expect(currencyAmountInWords(45678901)).toBe('Forty Five Million Six Hundred Seventy Eight Thousand Nine Hundred One Dollars');

    // nine digits
    expect(currencyAmountInWords(936547812)).toBe('Nine Hundred Thirty Six Million Five Hundred Forty Seven Thousand Eight Hundred Twelve Dollars');

    // ten digits
    expect(currencyAmountInWords(4567890123)).toBe('Four Billion Five Hundred Sixty Seven Million Eight Hundred Ninety Thousand One Hundred Twenty Three Dollars');

    // eleven digits
    expect(currencyAmountInWords(34567890123)).toBe('Thirty Four Billion Five Hundred Sixty Seven Million Eight Hundred Ninety Thousand One Hundred Twenty Three Dollars');

    // twelve digits
    expect(currencyAmountInWords(323232323232)).toBe('Three Hundred Twenty Three Billion Two Hundred Thirty Two Million Three Hundred Twenty Three Thousand Two Hundred Thirty Two Dollars');

    // 13 digits
    expect(currencyAmountInWords(9897969595949)).toBe('Nine Trillion Eight Hundred Ninety Seven Billion Nine Hundred Sixty Nine Million Five Hundred Ninety Five Thousand Nine Hundred Forty Nine Dollars');

    // 14 digits
    expect(currencyAmountInWords(98979695959494)).toBe('Ninety Eight Trillion Nine Hundred Seventy Nine Billion Six Hundred Ninety Five Million Nine Hundred Fifty Nine Thousand Four Hundred Ninety Four Dollars');

    // 15 digits
    expect(currencyAmountInWords(989796959594949)).toBe('Nine Hundred Eighty Nine Trillion Seven Hundred Ninety Six Billion Nine Hundred Fifty Nine Million Five Hundred Ninety Four Thousand Nine Hundred Forty Nine Dollars');

    // 1 quadrillion
    expect(currencyAmountInWords(1000000000000000)).toBe('One Quadrillion Dollars');

});

test('converts negative integers to words', () => {
    expect(currencyAmountInWords(-4567)).toBe('Negative Four Thousand Five Hundred Sixty Seven Dollars');
    expect(currencyAmountInWords(-100000)).toBe('Negative One Hundred Thousand Dollars');
});

test('converts numbers with cents to words', () => {
    expect(currencyAmountInWords(123.45)).toBe('One Hundred Twenty Three Dollars and Forty Five Cents');
    expect(currencyAmountInWords(1001.01)).toBe('One Thousand One Dollars and One Cent');
    expect(currencyAmountInWords(1000000.99)).toBe('One Million Dollars and Ninety Nine Cents');
});

test('returns empty string for invalid inputs', () => {
    expect(currencyAmountInWords('123')).toBe('');
    expect(currencyAmountInWords(NaN)).toBe('');
    expect(currencyAmountInWords(undefined)).toBe('');
    expect(currencyAmountInWords(null)).toBe('');

    // out of range
    expect(currencyAmountInWords(1000000000000001)).toBe('');
    expect(currencyAmountInWords(-1000000000000001)).toBe('');
    expect(currencyAmountInWords(10000000000000001)).toBe('');
    expect(currencyAmountInWords(-10000000000000001)).toBe('');
});

test('should return correct words for amounts with cents', () => {
    expect(currencyAmountInWords(1.01)).toBe("One Dollar and One Cent");
    expect(currencyAmountInWords(12.34)).toBe("Twelve Dollars and Thirty Four Cents");
    expect(currencyAmountInWords(123.45)).toBe("One Hundred Twenty Three Dollars and Forty Five Cents");
    expect(currencyAmountInWords(1234.56)).toBe("One Thousand Two Hundred Thirty Four Dollars and Fifty Six Cents");
    expect(currencyAmountInWords(12345.67)).toBe("Twelve Thousand Three Hundred Forty Five Dollars and Sixty Seven Cents");
    expect(currencyAmountInWords(123456.78)).toBe("One Hundred Twenty Three Thousand Four Hundred Fifty Six Dollars and Seventy Eight Cents");
    expect(currencyAmountInWords(1234567.89)).toBe("One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven Dollars and Eighty Nine Cents");
});

test('should return correct words for negative amounts with cents', () => {
    expect(currencyAmountInWords(-1.01)).toBe("Negative One Dollar and One Cent");
    expect(currencyAmountInWords(-12.34)).toBe("Negative Twelve Dollars and Thirty Four Cents");
    expect(currencyAmountInWords(-123.45)).toBe("Negative One Hundred Twenty Three Dollars and Forty Five Cents");
    expect(currencyAmountInWords(-1234.56)).toBe("Negative One Thousand Two Hundred Thirty Four Dollars and Fifty Six Cents");
    expect(currencyAmountInWords(-12345.67)).toBe("Negative Twelve Thousand Three Hundred Forty Five Dollars and Sixty Seven Cents");
    expect(currencyAmountInWords(-123456.78)).toBe("Negative One Hundred Twenty Three Thousand Four Hundred Fifty Six Dollars and Seventy Eight Cents");
    expect(currencyAmountInWords(-1234567.89)).toBe("Negative One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven Dollars and Eighty Nine Cents");
});