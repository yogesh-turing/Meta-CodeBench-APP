class ArithmeticSeriesParser {
  constructor(seriesString) {
    if (typeof seriesString !== 'string') {
      throw new Error('Input must be a string.');
    }
    if (!seriesString.trim()) {
      throw new Error('Input series string is empty.');
    }

    this.seriesString = seriesString.trim();
    this.series = [];
    
    if (this.seriesString.includes('...')) {
      const result = this._parseEllipsisSeries();
      this.series = result.series;
    } else {
      this.series = this._parseStandardSeries();
    }
  }

  _parseStandardSeries() {
    const tokens = this.seriesString.split(/[\s,]+/).filter(token => token.length > 0);
    return tokens.map(token => {
      const num = Number(token);
      if (isNaN(num)) {
        throw new Error(`Invalid number encountered: "${token}".`);
      }
      return num;
    });
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
    
    // Verify initial sequence is arithmetic
    for (let i = 1; i < initialSequence.length; i++) {
      if (initialSequence[i] - initialSequence[i-1] !== commonDifference) {
        throw new Error('The initial sequence before the ellipsis is not arithmetic.');
      }
    }

    const firstTerm = initialSequence[0];
    
    // Calculate number of terms
    const numberOfTerms = Math.floor((lastTerm - firstTerm) / commonDifference) + 1;
    
    // Generate complete series
    const series = Array.from({ length: numberOfTerms }, (_, i) => 
      firstTerm + (i * commonDifference)
    );

    if (commonDifference === 0 && series[series.length - 1] !== lastTerm) {
      throw new Error('Invalid series: common difference is 0 but the last term differs.');
    }

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
    if (this.series.length <= 1) return true;
    const commonDifference = this.series[1] - this.series[0];
    return this.series.every((num, index) => 
      index === 0 || (num - this.series[index - 1] === commonDifference)
    );
  }

  getArithmeticPattern() {
    if (this.series.length === 1) {
      return {
        firstTerm: this.series[0],
        commonDifference: 0,
        message: 'Series has one element and is considered arithmetic with a trivial difference of 0.'
      };
    }

    if (!this.isArithmetic()) {
      throw new Error('Series is not an arithmetic progression.');
    }

    return {
      firstTerm: this.series[0],
      commonDifference: this.series.length > 1 ? this.series[1] - this.series[0] : 0,
      series: this.series
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