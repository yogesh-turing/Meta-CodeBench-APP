class GeometricSequenceSolver {
  constructor(sequenceString) {
    if (typeof sequenceString !== 'string') {
      throw new TypeError('Input must be a string.');
    }
    if (sequenceString.trim() === '') {
      throw new Error('Input sequence string is empty.');
    }

    if (sequenceString.includes('...')) {
      this.parsedSequence = this._parseEllipsisSequence(sequenceString);
    } else {
      this.parsedSequence = this._parseStandardSequence(sequenceString);
    }

    this.isGeometricSequence = this.isGeometric();
  }

  _parseStandardSequence(sequenceString) {
    const tokens = sequenceString.split(/[\s,]+/);
    const sequence = [];

    for (const token of tokens) {
      const num = parseFloat(token);
      if (isNaN(num)) {
        throw new Error(`Invalid number encountered: ${token}`);
      }
      sequence.push(num);
    }

    return sequence;
  }

  _parseEllipsisSequence(sequenceString) {
    const parts = sequenceString.split('...');
    if (parts.length !== 2) {
      throw new Error('Invalid ellipsis sequence format.');
    }

    const beforeEllipsis = parts[0].trim();
    const afterEllipsis = parts[1].trim();

    if (beforeEllipsis === '') {
      throw new Error('Sequence cannot start with an ellipsis.');
    }

    if (afterEllipsis === '') {
      throw new Error('Sequence must specify a final term after the ellipsis.');
    }

    const beforeEllipsisTokens = beforeEllipsis.split(/[\s,*]+/);
    const afterEllipsisToken = afterEllipsis;

    if (beforeEllipsisTokens.length < 2) {
      throw new Error('At least two numbers are required before the ellipsis to determine the pattern.');
    }

    const sequence = beforeEllipsisTokens.map(parseFloat);
    const lastTerm = parseFloat(afterEllipsisToken);

    const commonRatio = sequence[1] / sequence[0];
    const numberOfTerms = Math.floor(Math.log(lastTerm / sequence[0]) / Math.log(commonRatio)) + 1;

    if (lastTerm !== sequence[0] * Math.pow(commonRatio, numberOfTerms - 1)) {
      throw new Error('Last term does not fit the geometric progression pattern.');
    }

    if (sequence[0] === 0 && sequence.some(term => term !== 0)) {
      throw new Error('Invalid sequence: first term is 0 but not all terms are 0.');
    }

    return {
      type: 'ellipsis',
      firstTerm: sequence[0],
      commonRatio,
      lastTerm,
      numberOfTerms,
      sequence: Array(numberOfTerms).fill(0).map((_, i) => sequence[0] * Math.pow(commonRatio, i)),
    };
  }

  isGeometric() {
    if (this.parsedSequence.type === 'ellipsis') {
      return true;
    }

    const sequence = this.parsedSequence;
    if (sequence.length < 2) {
      return true; // Single-element sequence is considered geometric
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
    if (!this.isGeometricSequence) {
      return null;
    }

    if (this.parsedSequence.type === 'ellipsis') {
      return this.parsedSequence;
    }

    const sequence = this.parsedSequence;
    const commonRatio = sequence.length < 2 ? 1 : sequence[1] / sequence[0];

    return {
      firstTerm: sequence[0],
      commonRatio,
      sequence,
    };
  }

  nthTerm(n) {
    if (!Number.isInteger(n) || n <= 0) {
      throw new Error('n must be a positive integer.');
    }

    if (!this.isGeometricSequence) {
      throw new Error('Sequence is not geometric.');
    }

    const pattern = this.getGeometricPattern();
    return pattern.firstTerm * Math.pow(pattern.commonRatio, n - 1);
  }
}

module.exports = { GeometricSequenceSolver };