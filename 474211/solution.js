class GeometricSequenceSolver {
  /**
   * Creates an instance of GeometricSequenceSolver.
   * @param {string} sequenceString - The sequence string, e.g., "2, 4, 8, 16, 32" or "2 * 4 * 8 * ... * 256".
   */
  constructor(sequenceString) {
    if (typeof sequenceString !== "string") {
      throw new TypeError("Input must be a string.");
    }
    this.sequenceString = sequenceString.trim();
    if (!this.sequenceString) {
      throw new Error("Input sequence string is empty.");
    }
    // Check if the sequence uses an ellipsis ("...") to denote omitted terms.
    if (this.sequenceString.includes("...")) {
      this.isEllipsisFormat = true;
      this.sequence = this._parseEllipsisSequence();
    } else {
      this.isEllipsisFormat = false;
      this.sequence = this._parseStandardSequence();
    }
  }

  /**
   * Parses a standard sequence string (e.g., "2, 4, 8, 16, 32") into an array of numbers.
   * Supports commas and/or whitespace as delimiters.
   * @returns {number[]} The parsed array of numbers.
   * @throws {Error} If no valid numbers are found or an invalid token is encountered.
   */
  _parseStandardSequence() {
    // Split on one or more commas or whitespace characters.
    const tokens = this.sequenceString.split(/[\s,]+/);

    const numbers = tokens.map((token) => {
      const num = Number(token);
      if (isNaN(num)) {
        throw new Error(`Invalid number encountered: "${token}".`);
      }
      return num;
    });
    return numbers;
  }

  /**
   * Parses an ellipsis-based sequence string (e.g., "2 * 4 * 8 * ... * 256").
   * It extracts the initial numbers before the ellipsis and the final term.
   * The common ratio is determined from the first two numbers.
   * @returns {object} An object containing the geometric details.
   * @throws {Error} If the format is invalid or the numbers do not form a geometric progression.
   */
  _parseEllipsisSequence() {
    // Use a regex to capture numbers (including decimals) and the ellipsis.
    const tokens = this.sequenceString.match(/(\d+(?:\.\d+)?|\.\.\.)/g);

    // Find the index of the ellipsis ("...").
    const ellipsisIndex = tokens.indexOf("...");

    if (ellipsisIndex === 0) {
      throw new Error("Sequence cannot start with an ellipsis.");
    }
    if (ellipsisIndex === tokens.length - 1) {
      throw new Error("Sequence must specify a final term after the ellipsis.");
    }

    // Parse the numbers before the ellipsis.
    const initialNumbers = tokens
      .slice(0, ellipsisIndex)
      .map((token) => Number(token));
    // Parse the last term (the final token after the ellipsis).
    const lastTerm = Number(tokens[tokens.length - 1]);

    if (initialNumbers.length < 2) {
      throw new Error(
        "At least two numbers are required before the ellipsis to determine the pattern."
      );
    }

    // Special handling if the first term is 0.
    if (initialNumbers[0] === 0) {
      // In a geometric sequence with first term 0, all terms must be 0.
      if (!initialNumbers.every((num) => num === 0) || lastTerm !== 0) {
        throw new Error(
          "Invalid sequence: first term is 0 but not all terms are 0."
        );
      }
      const numberOfTerms = initialNumbers.length + 1;
      return {
        type: "ellipsis",
        firstTerm: 0,
        commonRatio: 0,
        lastTerm: 0,
        numberOfTerms,
        sequence: Array(numberOfTerms).fill(0),
      };
    } else {
      // Determine the common ratio from the first two numbers.
      const ratio = initialNumbers[1] / initialNumbers[0];
      // Verify that the initial numbers form a geometric progression.
      for (let i = 1; i < initialNumbers.length; i++) {
        if (initialNumbers[i - 1] === 0) {
          throw new Error("Division by zero encountered in the sequence.");
        }
        if (initialNumbers[i] / initialNumbers[i - 1] !== ratio) {
          throw new Error(
            "The initial sequence before the ellipsis is not geometric."
          );
        }
      }

      // If the ratio is 1, the sequence must be constant.
      if (ratio === 1) {
        if (lastTerm !== initialNumbers[0]) {
          throw new Error(
            "Invalid sequence: common ratio is 1 but the last term differs."
          );
        }
        const numberOfTerms = initialNumbers.length + 1;
        return {
          type: "ellipsis",
          firstTerm: initialNumbers[0],
          commonRatio: 1,
          lastTerm: lastTerm,
          numberOfTerms,
          sequence: Array(numberOfTerms).fill(initialNumbers[0]),
        };
      } else {
        // For a valid geometric progression, lastTerm should equal firstTerm * ratio^(n-1) for some integer n.
        const nCalc =
          Math.log(lastTerm / initialNumbers[0]) / Math.log(ratio) + 1;
        const nRounded = Math.round(nCalc);
        // Use a more lenient tolerance due to floating point precision issues
        const epsilon = 1e-8;
        if (Math.abs(nCalc - nRounded) > epsilon) {
          throw new Error(
            "Last term does not fit the geometric progression pattern."
          );
        }
        const numberOfTerms = nRounded;
        let fullSequence = [];
        // Optionally generate the full sequence if the number of terms is reasonable.
        if (numberOfTerms <= 1000) {
          for (let i = 0; i < numberOfTerms; i++) {
            fullSequence.push(initialNumbers[0] * Math.pow(ratio, i));
          }
        }
        return {
          type: "ellipsis",
          firstTerm: initialNumbers[0],
          commonRatio: ratio,
          lastTerm: lastTerm,
          numberOfTerms,
          sequence: fullSequence,
        };
      }
    }
  }

  /**
   * Checks if the parsed sequence is a valid geometric progression.
   * For ellipsis-formatted sequences, validity is ensured during parsing.
   * @returns {boolean} True if the sequence is geometric; otherwise, false.
   */
  isGeometric() {
    if (this.isEllipsisFormat) return true;
    const arr = this.sequence;
    const n = arr.length;
    if (n < 2) return true;
    // Handle the case when the first term is 0.
    if (arr[0] === 0) {
      return arr.every((num) => num === 0);
    }
    const ratio = arr[1] / arr[0];
    for (let i = 1; i < n; i++) {
      if (arr[i - 1] === 0) return false;
      if (arr[i] / arr[i - 1] !== ratio) return false;
    }
    return true;
  }

  /**
   * Returns an object describing the geometric progression pattern.
   * For ellipsis-formatted sequences, details include firstTerm, commonRatio, lastTerm, numberOfTerms, and (if generated) the full sequence.
   * For standard sequences, returns the first term, common ratio, and the parsed sequence.
   * @returns {object|null} The geometric progression details, or null if the sequence is not geometric.
   */
  getGeometricPattern() {
    if (!this.isGeometric()) return null;
    if (this.isEllipsisFormat) {
      return this.sequence;
    } else {
      // For a single-element sequence, we assume a trivial common ratio of 1 (or 0 if the term is 0).
      if (this.sequence.length === 1) {
        return {
          firstTerm: this.sequence[0],
          commonRatio: this.sequence[0] === 0 ? 0 : 1,
          sequence: this.sequence,
        };
      }
      if (this.sequence[0] === 0) {
        return {
          firstTerm: 0,
          commonRatio: 0,
          sequence: this.sequence,
        };
      }
      const ratio = this.sequence[1] / this.sequence[0];
      return {
        firstTerm: this.sequence[0],
        commonRatio: ratio,
        sequence: this.sequence,
      };
    }
  }

  /**
   * Calculates the nth term of the geometric progression.
   * @param {number} n - The term position (1-based index).
   * @returns {number} The nth term.
   * @throws {Error} If n is not a positive integer or if the sequence is not geometric.
   */
  nthTerm(n) {
    if (typeof n !== "number" || !Number.isInteger(n) || n < 1) {
      throw new Error("n must be a positive integer.");
    }
    if (!this.isGeometric()) {
      throw new Error("Sequence is not geometric.");
    }
    let firstTerm, ratio;
    if (this.isEllipsisFormat) {
      firstTerm = this.sequence.firstTerm;
      ratio = this.sequence.commonRatio;
    } else {
      const pattern = this.getGeometricPattern();
      firstTerm = pattern.firstTerm;
      ratio = pattern.commonRatio;
    }
    return firstTerm * Math.pow(ratio, n - 1);
  }
}

module.exports = { GeometricSequenceSolver };