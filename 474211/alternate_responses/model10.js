class GeometricSequenceSolver {
  constructor(sequenceString) {
    if (typeof sequenceString !== 'string') {
      throw new TypeError('Input must be a string.');
    }

    if (sequenceString.trim() === '') {
      throw new Error('Input sequence string is empty.');
    }

    this.sequenceString = sequenceString;
    this.parsedSequence = this._parseSequence();
  }

  _parseStandardSequence() {
    const sequence = this.sequenceString.replace(/,/g, ' ').trim().split(/\s+/);
    const parsedSequence = [];

    for (const token of sequence) {
      const number = parseFloat(token);

      if (isNaN(number)) {
        throw new Error(`Invalid number encountered: ${token}`);
      }

      parsedSequence.push(number);
    }

    return parsedSequence;
  }

  _parseEllipsisSequence() {
    const sequence = this.sequenceString.replace(/,/g, ' ').trim().split(/\s+/);
    const numbers = [];
    let ellipsisEncountered = false;

    for (const token of sequence) {
      if (token === '...') {
        ellipsisEncountered = true;
        continue;
      }

      const number = parseFloat(token);

      if (isNaN(number)) {
        throw new Error(`Invalid number encountered: ${token}`);
      }

      numbers.push(number);
    }

    if (ellipsisEncountered) {
      if (numbers.length < 2) {
        throw new Error('At least two numbers are required before the ellipsis to determine the pattern.');
      }

      if (numbers[0] === 0 && numbers.some((num) => num !== 0)) {
        throw new Error('Invalid sequence: first term is 0 but not all terms are 0.');
      }

      const firstTerm = numbers[0];
      const commonRatio = numbers[1] / numbers[0];
      const lastTerm = numbers[numbers.length - 1];
      const numberOfTerms = Math.floor(Math.log(lastTerm / firstTerm) / Math.log(commonRatio)) + 1;
      const sequence = [];

      for (let i = 0; i < numberOfTerms; i++) {
        sequence.push(firstTerm * Math.pow(commonRatio, i));
      }

      if (sequence[sequence.length - 1] !== lastTerm) {
        throw new Error('Last term does not fit the geometric progression pattern.');
      }

      return {
        type: 'ellipsis',
        firstTerm,
        commonRatio,
        lastTerm,
        numberOfTerms,
        sequence,
      };
    }

    throw new Error('Sequence must specify a final term after the ellipsis.');
  }

  _parseSequence() {
    if (this.sequenceString.includes('...')) {
      return this._parseEllipsisSequence();
    }

    return this._parseStandardSequence();
  }

  isGeometric() {
    if (this.parsedSequence.type === 'ellipsis') {
      return true;
    }

    const sequence = this.parsedSequence;

    if (sequence.length < 2) {
      return true;
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

    if (this.parsedSequence.type === 'ellipsis') {
      return {
        firstTerm: this.parsedSequence.firstTerm,
        commonRatio: this.parsedSequence.commonRatio,
        sequence: this.parsedSequence.sequence,
      };
    }

    const sequence = this.parsedSequence;

    if (sequence.length < 2) {
      return {
        firstTerm: sequence[0],
        commonRatio: 1,
        sequence,
      };
    }

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