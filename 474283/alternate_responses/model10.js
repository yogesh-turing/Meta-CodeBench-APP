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
    const tokens = this.seriesString.split(/[\s,]+/);
    const numbers = tokens.map(token => {
      const number = parseFloat(token);
      if (isNaN(number)) {
        throw new Error(`Invalid number encountered: "${token}".`);
      }
      return number;
    });
    return numbers;
  }

  _parseEllipsisSeries() {
    const parts = this.seriesString.split('...');
    if (parts.length !== 2) {
      throw new Error('Invalid ellipsis series format.');
    }
    const initialSequence = parts[0].trim().split('+').map(token => {
      const number = parseFloat(token.trim());
      if (isNaN(number)) {
        throw new Error(`Invalid number encountered: "${token}".`);
      }
      return number;
    });
    if (initialSequence.length < 2) {
      throw new Error('At least two numbers are required before the ellipsis to determine the pattern.');
    }
    const lastTerm = parseFloat(parts[1].trim());
    if (isNaN(lastTerm)) {
      throw new Error('Invalid last term encountered.');
    }
    const commonDifference = initialSequence[1] - initialSequence[0];
    if (initialSequence.length > 2 && initialSequence[2] - initialSequence[1] !== commonDifference) {
      throw new Error('The initial sequence before the ellipsis is not arithmetic.');
    }
    if (commonDifference === 0 && lastTerm !== initialSequence[0]) {
      throw new Error('Invalid series: common difference is 0 but the last term differs.');
    }
    const numberOfTerms = Math.floor((lastTerm - initialSequence[0]) / commonDifference) + 1;
    const series = Array(numberOfTerms).fill(0).map((_, index) => initialSequence[0] + index * commonDifference);
    return {
      type: 'ellipsis',
      firstTerm: initialSequence[0],
      commonDifference,
      lastTerm,
      numberOfTerms,
      series,
    };
  }

  isArithmetic() {
    if (this.parsedSeries.length === 1) {
      return true;
    }
    const commonDifference = this.parsedSeries[1] - this.parsedSeries[0];
    for (let i = 2; i < this.parsedSeries.length; i++) {
      if (this.parsedSeries[i] - this.parsedSeries[i - 1] !== commonDifference) {
        return false;
      }
    }
    return true;
  }

  getArithmeticPattern() {
    if (!this.isArithmetic()) {
      throw new Error('Series is not an arithmetic progression.');
    }
    if (this.parsedSeries.length === 1) {
      return {
        firstTerm: this.parsedSeries[0],
        commonDifference: 0,
        message: 'Series has one element and is considered arithmetic with a trivial difference of 0.',
      };
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
    const { firstTerm, commonDifference } = this.getArithmeticPattern();
    return firstTerm + (n - 1) * commonDifference;
  }
}

module.exports = { ArithmeticSeriesParser };