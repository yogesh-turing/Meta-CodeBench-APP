class ArithmeticSeriesParser {
  constructor(seriesString) {
    if (typeof seriesString !== 'string') {
      throw new Error('Input must be a string.');
    }
    if (seriesString.trim() === '') {
      throw new Error('Input series string is empty.');
    }

    this.seriesString = seriesString.trim();
    if (this.seriesString.includes('...')) {
      this.parsedData = this._parseEllipsisSeries();
    } else {
      this.series = this._parseStandardSeries();
    }
  }

  _parseStandardSeries() {
    const tokens = this.seriesString.split(/[\s,]+/).filter(token => token.length > 0);
    const numbers = tokens.map(token => {
      const num = Number(token);
      if (isNaN(num)) {
        throw new Error(`Invalid number encountered: "${token}"`);
      }
      return num;
    });
    return numbers;
  }

  _parseEllipsisSeries() {
    if (this.seriesString.startsWith('...')) {
      throw new Error('Series cannot start with an ellipsis.');
    }
    if (this.seriesString.endsWith('...')) {
      throw new Error('Series must specify a final term after the ellipsis.');
    }

    const parts = this.seriesString.split('...');
    const initialSequence = parts[0].split('+').map(n => Number(n.trim()));
    const lastTerm = Number(parts[1].split('+').pop().trim());

    if (initialSequence.length < 2) {
      throw new Error('At least two numbers are required before the ellipsis to determine the pattern.');
    }

    const commonDifference = initialSequence[1] - initialSequence[0];
    const isInitialArithmetic = initialSequence.every((num, index) => {
      return index === 0 || (num - initialSequence[index - 1] === commonDifference);
    });

    if (!isInitialArithmetic) {
      throw new Error('The initial sequence before the ellipsis is not arithmetic.');
    }

    const firstTerm = initialSequence[0];
    if (commonDifference === 0 && lastTerm !== firstTerm) {
      throw new Error('Invalid series: common difference is 0 but the last term differs.');
    }

    const numberOfTerms = Math.floor((lastTerm - firstTerm) / commonDifference) + 1;
    const series = Array.from({ length: numberOfTerms }, (_, i) => firstTerm + i * commonDifference);

    if (series[series.length - 1] !== lastTerm) {
      throw new Error('Last term does not fit the arithmetic progression pattern.');
    }

    return {
      type: 'ellipsis',
      firstTerm,
      commonDifference,
      lastTerm,
      numberOfTerms,
      series
    };
  }

  isArithmetic() {
    const series = this.parsedData?.series || this.series;
    if (series.length <= 1) return true;
    const commonDiff = series[1] - series[0];
    return series.every((num, index) => 
      index === 0 || (num - series[index - 1] === commonDiff)
    );
  }

  getArithmeticPattern() {
    const series = this.parsedData?.series || this.series;
    if (series.length === 1) {
      return {
        firstTerm: series[0],
        commonDifference: 0,
        message: 'Series has one element and is considered arithmetic with a trivial difference of 0.'
      };
    }

    if (!this.isArithmetic()) {
      throw new Error('Series is not an arithmetic progression.');
    }

    return {
      firstTerm: series[0],
      commonDifference: series.length > 1 ? series[1] - series[0] : 0,
      series: series
    };
  }

  nthTerm(n) {
    if (!Number.isInteger(n) || n <= 0) {
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