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
      this.sequenceData = this._parseEllipsisSequence();
      this.sequence = this.sequenceData.sequence;
    } else {
      this.sequence = this._parseStandardSequence();
    }
  }

  _parseStandardSequence() {
    const tokens = this.sequenceString.split(/[\s,*]+/).filter(token => token.trim());
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

    const initialNumbers = this._parseStandardSequence(parts[0]);
    if (initialNumbers.length < 2) {
      throw new Error('At least two numbers are required before the ellipsis to determine the pattern.');
    }

    const lastTerm = Number(parts[1].split(/[\s,*]+/).filter(token => token.trim())[0]);
    if (isNaN(lastTerm)) {
      throw new Error(`Invalid number encountered: ${parts[1].trim()}`);
    }

    const firstTerm = initialNumbers[0];
    const commonRatio = initialNumbers[1] / initialNumbers[0];

    if (firstTerm === 0 && lastTerm !== 0) {
      throw new Error('Invalid sequence: first term is 0 but not all terms are 0.');
    }

    // Calculate number of terms needed to reach lastTerm
    const numberOfTerms = Math.log(lastTerm / firstTerm) / Math.log(commonRatio) + 1;
    if (!Number.isInteger(numberOfTerms) || Math.abs(firstTerm * Math.pow(commonRatio, numberOfTerms - 1) - lastTerm) > 1e-10) {
      throw new Error('Last term does not fit the geometric progression pattern.');
    }

    const sequence = Array.from({ length: numberOfTerms }, (_, i) => 
      firstTerm * Math.pow(commonRatio, i)
    );

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
    if (this.sequence.length <= 1) return true;
    if (this.sequence[0] === 0) {
      return this.sequence.every(term => term === 0);
    }

    const ratio = this.sequence[1] / this.sequence[0];
    for (let i = 1; i < this.sequence.length; i++) {
      if (Math.abs(this.sequence[i] / this.sequence[i - 1] - ratio) > 1e-10) {
        return false;
      }
    }
    return true;
  }

  getGeometricPattern() {
    if (!this.isGeometric()) return null;

    const firstTerm = this.sequence[0];
    let commonRatio = 1;
    if (this.sequence.length > 1 && firstTerm !== 0) {
      commonRatio = this.sequence[1] / firstTerm;
    }

    return {
      firstTerm,
      commonRatio,
      sequence: this.sequence
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