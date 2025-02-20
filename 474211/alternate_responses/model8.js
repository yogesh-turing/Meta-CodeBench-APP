class GeometricSequenceSolver {
  constructor(sequenceString) {
    if (typeof sequenceString !== 'string') {
      throw new TypeError('Input must be a string.');
    }
    if (sequenceString.trim() === '') {
      throw new Error('Input sequence string is empty.');
    }

    this.sequenceString = sequenceString;
    this.parsedSequence = null;
    this.isEllipsisSequence = false;

    if (sequenceString.includes('...')) {
      this.parsedSequence = this._parseEllipsisSequence();
      this.isEllipsisSequence = true;
    } else {
      this.parsedSequence = this._parseStandardSequence();
    }
  }

  _parseStandardSequence() {
    const sequence = this.sequenceString.replace(/,/g, ' ').split(/\s+/).map(token => {
      const number = parseFloat(token);
      if (isNaN(number)) {
        throw new Error(`Invalid number encountered: ${token}`);
      }
      return number;
    });

    return sequence;
  }

  _parseEllipsisSequence() {
    const parts = this.sequenceString.split('...');
    if (parts.length !== 2) {
      throw new Error('Invalid ellipsis sequence format.');
    }

    const beforeEllipsis = parts[0].replace(/,/g, ' ').split(/\s+/).map(token => {
      const number = parseFloat(token);
      if (isNaN(number)) {
        throw new Error(`Invalid number encountered: ${token}`);
      }
      return number;
    });

    if (beforeEllipsis.length < 2) {
      throw new Error('At least two numbers are required before the ellipsis to determine the pattern.');
    }

    const afterEllipsis = parts[1].trim();
    if (afterEllipsis === '') {
      throw new Error('Sequence must specify a final term after the ellipsis.');
    }

    const lastTerm = parseFloat(afterEllipsis);
    if (isNaN(lastTerm)) {
      throw new Error(`Invalid last term: ${afterEllipsis}`);
    }

    const commonRatio = beforeEllipsis[1] / beforeEllipsis[0];
    let sequence = [...beforeEllipsis];

    while (sequence[sequence.length - 1] < lastTerm) {
      sequence.push(sequence[sequence.length - 1] * commonRatio);
    }

    if (sequence[sequence.length - 1] !== lastTerm) {
      throw new Error('Last term does not fit the geometric progression pattern.');
    }

    if (beforeEllipsis[0] === 0 && sequence.some(term => term !== 0)) {
      throw new Error('Invalid sequence: first term is 0 but not all terms are 0.');
    }

    return {
      type: 'ellipsis',
      firstTerm: beforeEllipsis[0],
      commonRatio,
      lastTerm,
      numberOfTerms: sequence.length,
      sequence,
    };
  }

  isGeometric() {
    if (this.isEllipsisSequence) {
      return true;
    }

    const sequence = this.parsedSequence;
    if (sequence.length < 2) {
      return true; // A single-element sequence is considered geometric
    }

    const commonRatio = sequence[1] / sequence[0];
    for (let i = 2; i < sequence.length; i++) {
      if (sequence[i] / sequence[i - 1] !== commonRatio) {
        return false;
      }
    }

    return true;
  }

  getGeometricPattern() {
    if (!this.isGeometric()) {
      return null;
    }

    if (this.isEllipsisSequence) {
      return this.parsedSequence;
    }

    const sequence = this.parsedSequence;
    const firstTerm = sequence[0];
    const commonRatio = sequence.length > 1 ? sequence[1] / sequence[0] : 1;

    return {
      firstTerm,
      commonRatio,
      sequence,
    };
  }

  nthTerm(n) {
    if (!Number.isInteger(n) || n <= 0) {
      throw new Error('n must be a positive integer.');
    }

    if (!this.isGeometric()) {
      throw new Error('Sequence is not geometric.');
    }

    const pattern = this.getGeometricPattern();
    return pattern.firstTerm * Math.pow(pattern.commonRatio, n - 1);
  }
}

module.exports = { GeometricSequenceSolver };