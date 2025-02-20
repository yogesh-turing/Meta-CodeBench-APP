class ArithmeticSeriesParser {
  constructor(seriesString) {
    if (typeof seriesString !== 'string') {
      throw new Error('Input must be a string.');
    }
    if (seriesString.trim() === '') {
      throw new Error('Input series string is empty.');
    }
    this.seriesString = seriesString;
    this.parsedSeries = null;
  }

  _parseStandardSeries() {
    const tokens = this.seriesString.split(/[\s,]+/);
    const numbers = [];
    for (const token of tokens) {
      const num = parseFloat(token);
      if (isNaN(num)) {
        throw new Error(`Invalid number encountered: "${token}".`);
      }
      numbers.push(num);
    }
    return numbers;
  }

  _parseEllipsisSeries() {
    const parts = this.seriesString.split('...');
    if (parts.length !== 2) {
      throw new Error('Invalid ellipsis-based series string.');
    }
    const initialNumbers = parts[0].trim().split('+').map((num) => parseFloat(num.trim()));
    if (initialNumbers.length < 2) {
      throw new Error('At least two numbers are required before the ellipsis to determine the pattern.');
    }
    const lastTerm = parseFloat(parts[1].trim());
    const commonDifference = initialNumbers[1] - initialNumbers[0];
    if (initialNumbers.some((num, index) => index > 0 && num - initialNumbers[index - 1] !== commonDifference)) {
      throw new Error('The initial sequence before the ellipsis is not arithmetic.');
    }
    if (commonDifference === 0 && lastTerm !== initialNumbers[initialNumbers.length - 1]) {
      throw new Error('Invalid series: common difference is 0 but the last term differs.');
    }
    const numberOfTerms = Math.floor((lastTerm - initialNumbers[0]) / commonDifference) + 1;
    const series = Array(numberOfTerms).fill(0).map((_, index) => initialNumbers[0] + index * commonDifference);
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
    if (this.parsedSeries === null) {
      this.parsedSeries = this.seriesString.includes('...') ? this._parseEllipsisSeries() : this._parseStandardSeries();
    }
    if (Array.isArray(this.parsedSeries)) {
      return this.parsedSeries.length > 1 && this.parsedSeries.every((num, index) => index === 0 || num - this.parsedSeries[index - 1] === this.parsedSeries[1] - this.parsedSeries[0]);
    } else {
      return true; // ellipsis-based series is always arithmetic
    }
  }

  getArithmeticPattern() {
    if (!this.isArithmetic()) {
      throw new Error('Series is not an arithmetic progression.');
    }
    if (Array.isArray(this.parsedSeries)) {
      if (this.parsedSeries.length === 1) {
        return {
          firstTerm: this.parsedSeries[0],
          commonDifference: 0,
          message: 'Series has one element and is considered arithmetic with a trivial difference of 0.',
        };
      } else {
        return {
          firstTerm: this.parsedSeries[0],
          commonDifference: this.parsedSeries[1] - this.parsedSeries[0],
          series: this.parsedSeries,
        };
      }
    } else {
      return this.parsedSeries;
    }
  }

  nthTerm(n) {
    if (typeof n !== 'number' || n <= 0) {
      throw new Error('n must be a positive integer.');
    }
    const pattern = this.getArithmeticPattern();
    return pattern.firstTerm + (n - 1) * pattern.commonDifference;
  }
}

module.exports = { ArithmeticSeriesParser };