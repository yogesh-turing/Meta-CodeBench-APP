class GeometricSequenceSolver {
  constructor(sequenceString) {
    if (typeof sequenceString !== 'string') {
      throw new TypeError('Input must be a string.');
    }

    if (sequenceString.trim() === '') {
      throw new Error('Input sequence string is empty.');
    }

    this.sequenceString = sequenceString;
    this.parsedSequence = this._parseSequence(sequenceString);
  }

  _parseSequence(sequenceString) {
    if (sequenceString.includes('...')) {
      return this._parseEllipsisSequence(sequenceString);
    } else {
      return this._parseStandardSequence(sequenceString);
    }
  }

  _parseStandardSequence(sequenceString) {
    const tokens = sequenceString.split(/[\s,]+/);
    const sequence = [];

    for (const token of tokens) {
      const number = parseFloat(token);

      if (isNaN(number)) {
        throw new Error(`Invalid number encountered: ${token}`);
      }

      sequence.push(number);
    }

    return sequence;
  }

  _parseEllipsisSequence(sequenceString) {
    const parts = sequenceString.split('...');
    const firstPart = parts[0].trim();
    const secondPart = parts[1].trim();

    if (firstPart === '') {
      throw new Error('Sequence cannot start with an ellipsis.');
    }

    if (secondPart === '') {
      throw new Error('Sequence must specify a final term after the ellipsis.');
    }

    const firstTerms = firstPart.split(/[\s,*]+/).map(parseFloat);
    const lastTerm = parseFloat(secondPart);

    if (firstTerms.length < 2) {
      throw new Error('At least two numbers are required before the ellipsis to determine the pattern.');
    }

    const commonRatio = firstTerms[1] / firstTerms[0];
    const sequence = [firstTerms[0], firstTerms[1]];

    while (sequence[sequence.length - 1] * commonRatio <= lastTerm) {
      sequence.push(sequence[sequence.length - 1] * commonRatio);
    }

    if (sequence[sequence.length - 1] !== lastTerm) {
      throw new Error('Last term does not fit the geometric progression pattern.');
    }

    if (firstTerms[0] === 0 && sequence.some(term => term !== 0)) {
      throw new Error('Invalid sequence: first term is 0 but not all terms are 0.');
    }

    return {
      type: 'ellipsis',
      firstTerm: firstTerms[0],
      commonRatio,
      lastTerm,
      numberOfTerms: sequence.length,
      sequence,
    };
  }

  isGeometric() {
    if (this.parsedSequence.type === 'ellipsis') {
      return true;
    }

    const sequence = this.parsedSequence;
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

    if (this.parsedSequence.type === 'ellipsis') {
      return {
        firstTerm: this.parsedSequence.firstTerm,
        commonRatio: this.parsedSequence.commonRatio,
        sequence: this.parsedSequence.sequence,
      };
    }

    const sequence = this.parsedSequence;
    const commonRatio = sequence[1] / sequence[0];

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

    if (!this.isGeometric()) {
      throw new Error('Sequence is not geometric.');
    }

    const pattern = this.getGeometricPattern();
    return pattern.firstTerm * Math.pow(pattern.commonRatio, n - 1);
  }
}

module.exports = { GeometricSequenceSolver };