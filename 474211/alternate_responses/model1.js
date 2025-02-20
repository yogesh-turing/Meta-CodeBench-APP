class GeometricSequenceSolver {
  constructor(sequenceString) {
    if (typeof sequenceString !== 'string') {
      throw new TypeError('Input must be a string.');
    }
    if (sequenceString.trim() === '') {
      throw new Error('Input sequence string is empty.');
    }

    this.sequenceString = sequenceString.trim();
    if (this.sequenceString.includes('...')) {
      this.sequence = this._parseEllipsisSequence();
    } else {
      this.sequence = this._parseStandardSequence();
    }
  }

  _parseStandardSequence() {
    const tokens = this.sequenceString.split(/[\s,]+/).filter(token => token.length > 0);
    const numbers = tokens.map(token => {
      const num = Number(token);
      if (isNaN(num)) {
        throw new Error(`Invalid number encountered: ${token}`);
      }
      return num;
    });
    return numbers;
  }

  _parseEllipsisSequence() {
    const parts = this.sequenceString.split('...');
    if (parts[0].trim() === '') {
      throw new Error('Sequence cannot start with an ellipsis.');
    }
    if (parts.length !== 2 || !parts[1].trim()) {
      throw new Error('Sequence must specify a final term after the ellipsis.');
    }

    const initialNumbers = parts[0].split(/[\s,*]+/).filter(token => token.length > 0).map(Number);
    if (initialNumbers.length < 2) {
      throw new Error('At least two numbers are required before the ellipsis to determine the pattern.');
    }
    if (initialNumbers.some(isNaN)) {
      throw new Error(`Invalid number encountered: ${parts[0].split(/[\s,*]+/).find(token => isNaN(Number(token)))}`);
    }

    const lastTerm = Number(parts[1].trim());
    if (isNaN(lastTerm)) {
      throw new Error(`Invalid number encountered: ${parts[1].trim()}`);
    }

    const firstTerm = initialNumbers[0];
    const commonRatio = initialNumbers[1] / initialNumbers[0];

    if (firstTerm === 0 && lastTerm !== 0) {
      throw new Error('Invalid sequence: first term is 0 but not all terms are 0.');
    }

    let currentTerm = firstTerm;
    const sequence = [firstTerm];
    let numberOfTerms = 1;

    while (Math.abs(currentTerm * commonRatio - lastTerm) > Math.abs(lastTerm) * Number.EPSILON && currentTerm * commonRatio <= lastTerm) {
      currentTerm *= commonRatio;
      sequence.push(currentTerm);
      numberOfTerms++;
    }

    currentTerm *= commonRatio;
    if (Math.abs(currentTerm - lastTerm) > Math.abs(lastTerm) * Number.EPSILON) {
      throw new Error('Last term does not fit the geometric progression pattern.');
    }
    sequence.push(lastTerm);
    numberOfTerms++;

    return {
      type: 'ellipsis',
      firstTerm,
      commonRatio,
      lastTerm,
      numberOfTerms,
      sequence
    };
  }

  isGeometric() {
    const seq = Array.isArray(this.sequence) ? this.sequence : this.sequence.sequence;
    if (seq.length <= 1) return true;
    if (seq[0] === 0) return seq.every(term => term === 0);

    const ratio = seq[1] / seq[0];
    for (let i = 1; i < seq.length; i++) {
      if (Math.abs(seq[i] / seq[i - 1] - ratio) > Math.abs(ratio) * Number.EPSILON) {
        return false;
      }
    }
    return true;
  }

  getGeometricPattern() {
    if (!this.isGeometric()) return null;

    const seq = Array.isArray(this.sequence) ? this.sequence : this.sequence.sequence;
    const firstTerm = seq[0];
    const commonRatio = seq.length > 1 ? seq[1] / seq[0] : 1;

    return {
      firstTerm,
      commonRatio,
      sequence: seq
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