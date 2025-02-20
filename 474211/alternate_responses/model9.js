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
    this.isGeometricFlag = this.isGeometric();
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
    const numbers = [];

    for (const token of tokens) {
      const number = parseFloat(token);
      if (isNaN(number)) {
        throw new Error(`Invalid number encountered: ${token}`);
      }
      numbers.push(number);
    }

    return numbers;
  }

  _parseEllipsisSequence(sequenceString) {
    const parts = sequenceString.split('...');
    if (parts.length !== 2) {
      throw new Error('Invalid ellipsis sequence format.');
    }

    const firstPart = parts[0].trim();
    const secondPart = parts[1].trim();

    if (firstPart === '') {
      throw new Error('Sequence cannot start with an ellipsis.');
    }

    if (secondPart === '') {
      throw new Error('Sequence must specify a final term after the ellipsis.');
    }

    const initialTerms = this._parseStandardSequence(firstPart);
    if (initialTerms.length < 2) {
      throw new Error('At least two numbers are required before the ellipsis to determine the pattern.');
    }

    const lastTerm = parseFloat(secondPart);
    if (isNaN(lastTerm)) {
      throw new Error(`Invalid last term: ${secondPart}`);
    }

    const commonRatio = initialTerms[1] / initialTerms[0];
    if (initialTerms[0] === 0 && initialTerms.some(term => term !== 0)) {
      throw new Error('Invalid sequence: first term is 0 but not all terms are 0.');
    }

    const sequence = [initialTerms[0], initialTerms[1]];
    while (sequence[sequence.length - 1] * commonRatio <= lastTerm) {
      sequence.push(sequence[sequence.length - 1] * commonRatio);
    }

    if (sequence[sequence.length - 1] !== lastTerm) {
      throw new Error('Last term does not fit the geometric progression pattern.');
    }

    return {
      type: 'ellipsis',
      firstTerm: initialTerms[0],
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

    const ratio = this.parsedSequence[1] / this.parsedSequence[0];
    for (let i = 2; i < this.parsedSequence.length; i++) {
      if (this.parsedSequence[i] / this.parsedSequence[i - 1] !== ratio) {
        return false;
      }
    }

    return true;
  }

  getGeometricPattern() {
    if (!this.isGeometricFlag) {
      return null;
    }

    if (this.parsedSequence.type === 'ellipsis') {
      return {
        firstTerm: this.parsedSequence.firstTerm,
        commonRatio: this.parsedSequence.commonRatio,
        sequence: this.parsedSequence.sequence,
      };
    }

    const commonRatio = this.parsedSequence[1] / this.parsedSequence[0];
    return {
      firstTerm: this.parsedSequence[0],
      commonRatio,
      sequence: this.parsedSequence,
    };
  }

  nthTerm(n) {
    if (!Number.isInteger(n) || n <= 0) {
      throw new Error('n must be a positive integer.');
    }

    if (!this.isGeometricFlag) {
      throw new Error('Sequence is not geometric.');
    }

    const { firstTerm, commonRatio } = this.getGeometricPattern();
    return firstTerm * Math.pow(commonRatio, n - 1);
  }
}

module.exports = { GeometricSequenceSolver };