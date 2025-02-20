class ArithmeticSeriesParser {
  constructor(seriesString) {
    if (typeof seriesString !== 'string') {
      throw new Error('Input must be a string.');
    }

    if (seriesString.trim() === '') {
      throw new Error('Input series string is empty.');
    }

    this.seriesString = seriesString;
    this.series = this._parseSeries();
  }

  _parseStandardSeries() {
    const tokens = this.seriesString.split(/[\s,]+/);
    const numbers = [];

    for (const token of tokens) {
      const number = parseFloat(token);
      if (isNaN(number)) {
        throw new Error(`Invalid number encountered: "${token}".`);
      }
      numbers.push(number);
    }

    return numbers;
  }

  _parseEllipsisSeries() {
    const parts = this.seriesString.split('...');
    if (parts.length !== 2) {
      throw new Error('Invalid ellipsis series format.');
    }

    const initialSequence = parts[0].trim().split('+');
    const lastTerm = parseFloat(parts[1].trim());
    if (isNaN(lastTerm)) {
      throw new Error('Invalid last term in ellipsis series.');
    }

    if (initialSequence.length < 2) {
      throw new Error('At least two numbers are required before the ellipsis to determine the pattern.');
    }

    const numbers = initialSequence.map((token) => {
      const number = parseFloat(token.trim());
      if (isNaN(number)) {
        throw new Error(`Invalid number encountered: "${token}".`);
      }
      return number;
    });

    const commonDifference = numbers[1] - numbers[0];
    for (let i = 2; i < numbers.length; i++) {
      if (numbers[i] - numbers[i - 1] !== commonDifference) {
        throw new Error('The initial sequence before the ellipsis is not arithmetic.');
      }
    }

    if (commonDifference === 0 && lastTerm !== numbers[numbers.length - 1]) {
      throw new Error('Invalid series: common difference is 0 but the last term differs.');
    }

    const numberOfTerms = Math.floor((lastTerm - numbers[0]) / commonDifference) + 1;
    const series = [];
    for (let i = 0; i < numberOfTerms; i++) {
      series.push(numbers[0] + i * commonDifference);
    }

    if (series[series.length - 1] !== lastTerm) {
      throw new Error('Last term does not fit the arithmetic progression pattern.');
    }

    return {
      type: 'ellipsis',
      firstTerm: numbers[0],
      commonDifference,
      lastTerm,
      numberOfTerms,
      series,
    };
  }

  _parseSeries() {
    if (this.seriesString.includes('...')) {
      return this._parseEllipsisSeries();
    } else {
      return this._parseStandardSeries();
    }
  }

  isArithmetic() {
    if (Array.isArray(this.series)) {
      if (this.series.length < 2) {
        return true; // trivial case with one element
      }

      const commonDifference = this.series[1] - this.series[0];
      for (let i = 2; i < this.series.length; i++) {
        if (this.series[i] - this.series[i - 1] !== commonDifference) {
          return false;
        }
      }

      return true;
    } else {
      // ellipsis series is already validated during parsing
      return true;
    }
  }

  getArithmeticPattern() {
    if (!this.isArithmetic()) {
      throw new Error('Series is not an arithmetic progression.');
    }

    if (Array.isArray(this.series)) {
      if (this.series.length === 1) {
        return {
          firstTerm: this.series[0],
          commonDifference: 0,
          message: 'Series has one element and is considered arithmetic with a trivial difference of 0.',
        };
      }

      const commonDifference = this.series[1] - this.series[0];
      return {
        firstTerm: this.series[0],
        commonDifference,
        series: this.series,
      };
    } else {
      return this.series;
    }
  }

  nthTerm(n) {
    if (typeof n !== 'number' || n <= 0) {
      throw new Error('n must be a positive integer.');
    }

    if (!this.isArithmetic()) {
      throw new Error('Series is not an arithmetic progression.');
    }

    const pattern = this.getArithmeticPattern();
    return pattern.firstTerm + (n - 1) * pattern.commonDifference;
  }
}

module.exports = { ArithmeticSeriesParser };