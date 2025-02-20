class GeometricSequenceSolver {
  constructor(sequenceString) {
    //TODO: Creates an instance of GeometricSequenceSolver and calls the correct method.
  }

  _parseStandardSequence() {
    //TODO: Parses a standard sequence string (e.g., "2, 4, 8, 16, 32") into an array of numbers. upports commas and/or whitespace as delimiters.
  }

  _parseEllipsisSequence() {
    //TODO: Parses an ellipsis-based sequence string (e.g., "2 * 4 * 8 * ... * 256").
  }
  isGeometric() {
    //TODO: Checks if the parsed sequence is a valid geometric progression.
  }

  getGeometricPattern() {
    //TODO: Returns an object describing the geometric progression pattern.
  }

  nthTerm(n) {
    //TODO: Calculates the nth term of the geometric progression.
  }
}

module.exports = { GeometricSequenceSolver };