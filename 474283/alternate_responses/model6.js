class ArithmeticSeriesParser {
  constructor(seriesString) {
    if (typeof seriesString !== 'string') {
      throw new Error('Input must be a string.');
    }

    if (seriesString.trim() === '') {
      throw new Error('Input series string is empty.');
    }

    this.seriesString = seriesString;
    this.parsedSeries = this._parseSeries();
  }

  _parseSeries() {
    if (this.seriesString.includes('+')) {
      return this._parseEllipsisSeries();
    } else {
      return this._parseStandardSeries();
    }
  }

  _parseStandardSeries() {
    const tokens = this.seriesString.split(/,|\s+/);
    const series = [];

    for (const token of tokens) {
      if (token === '') continue;

      const number = parseFloat(token);
      if (isNaN(number)) {
        throw new Error(`Invalid number encountered: "${token}".`);
      }

      series.push(number);
    }

    return series;
  }

  _parseEllipsisSeries() {
    const parts = this.seriesString.split('...');
    const initialSequence = parts[0].trim();
    const finalTerm = parts[1].trim();

    if (initialSequence === '') {
      throw new Error('Series cannot start with an ellipsis.');
    }

    if (finalTerm === '') {
      throw new Error('Series must specify a final term after the ellipsis.');
    }

    const initialNumbers = initialSequence.split('+').map((token) => parseFloat(token.trim()));
    if (initialNumbers.length < 2) {
      throw new Error('At least two numbers are required before the ellipsis to determine the pattern.');
    }

    const commonDifference = initialNumbers[1] - initialNumbers[0];
    for (let i = 2; i < initialNumbers.length; i++) {
      if (initialNumbers[i] - initialNumbers[i - 1] !== commonDifference) {
        throw new Error('The initial sequence before the ellipsis is not arithmetic.');
      }
    }

    const lastTerm = parseFloat(finalTerm);
    if (commonDifference === 0 && lastTerm !== initialNumbers[initialNumbers.length - 1]) {
      throw new Error('Invalid series: common difference is 0 but the last term differs.');
    }

    const numberOfTerms = Math.floor((lastTerm - initialNumbers[0]) / commonDifference) + 1;
    const series = [];
    for (let i = 0; i < numberOfTerms; i++) {
      series.push(initialNumbers[0] + i * commonDifference);
    }

    if (series[series.length - 1] !== lastTerm) {
      throw new Error('Last term does not fit the arithmetic progression pattern.');
    }

    return {
      type: 'ellipsis',
      firstTerm: initialNumbers[0],
      commonDifference,
      lastTerm,
      numberOfTerms,
      series,
    };
  }

  isArithmetic() {
    if (this.parsedSeries.length === 1) return true;

    const commonDifference = this.parsedSeries[1] - this.parsedSeries[0];
    for (let i = 2; i < this.parsedSeries.length; i++) {
      if (this.parsedSeries[i] - this.parsedSeries[i - 1] !== commonDifference) {
        return false;
      }
    }

    return true;
  }

  getArithmeticPattern() {
    if (this.parsedSeries.length === 1) {
      return {
        firstTerm: this.parsedSeries[0],
        commonDifference: 0,
        message: 'Series has one element and is considered arithmetic with a trivial difference of 0.',
      };
    }

    if (!this.isArithmetic()) {
      throw new Error('Series is not an arithmetic progression.');
    }

    const commonDifference = this.parsedSeries[1] - this.parsedSeries[0];
    return {
      firstTerm: this.parsedSeries[0],
      commonDifference,
      series: this.parsedSeries,
    };
  }

  nthTerm(n) {
    if (typeof n !== 'number' || n <= 0) {
      throw new Error('n must be a positive integer.');
    }

    if (!this.isArithmetic()) {
      throw new Error('Series is not an arithmetic progression.');
    }

    const commonDifference = this.parsedSeries[1] - this.parsedSeries[0];
    return this.parsedSeries[0] + (n - 1) * commonDifference;
  }
}

module.exports = { ArithmeticSeriesParser };