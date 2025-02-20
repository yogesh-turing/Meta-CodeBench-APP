// The ArithmeticSeriesParser class (copy from your implementation)
// -------------------------------------------------------
class ArithmeticSeriesParser {
  /**
   * Creates an instance of ArithmeticSeriesParser.
   * @param {string} seriesString - The series string, e.g., "2,4,6,8,10" or "4 + 7 + 10 + ... + 58".
   */
  constructor(seriesString) {
    if (typeof seriesString !== "string") {
      throw new TypeError("Input must be a string.");
    }
    this.seriesString = seriesString.trim();
    if (!this.seriesString) {
      throw new Error("Input series string is empty.");
    }
    // Check if the series uses an ellipsis to denote missing terms.
    if (this.seriesString.includes("...")) {
      this.isEllipsisFormat = true;
      this.series = this._parseEllipsisSeries();
    } else {
      this.isEllipsisFormat = false;
      this.series = this._parseStandardSeries();
    }
  }

  /**
   * Parses a standard series string (e.g., "2, 4, 6, 8, 10") into an array of numbers.
   * Supports commas and/or whitespace as delimiters.
   * @returns {number[]} The parsed array of numbers.
   * @throws {Error} If the series contains no valid numbers or non-numeric tokens.
   */
  _parseStandardSeries() {
    // Split on one or more commas or whitespace characters.
    const tokens = this.seriesString.split(/[\s,]+/);

    const numbers = tokens.map((token) => {
      const num = Number(token);
      if (isNaN(num) || !parseInt(token)) {
        throw new Error(`Invalid number encountered: "${token}".`);
      }
      return num;
    });
    return numbers;
  }

  /**
   * Parses an ellipsis-based series string (e.g., "4 + 7 + 10 + ... + 58").
   * It extracts the initial numbers before the ellipsis and the final term.
   * The common difference is determined from the first two numbers.
   * @returns {object} An object containing the arithmetic parameters.
   * @throws {Error} If the format is invalid or the numbers do not form an arithmetic progression.
   */
  _parseEllipsisSeries() {
    // Use a regex to capture numbers (including decimals) and the ellipsis.
    const tokens = this.seriesString.match(/(\d+(?:\.\d+)?|\.\.\.)/g);
    if (!tokens || tokens.length === 0) {
      throw new Error("No valid tokens found in the series string.");
    }

    // Find the index of the ellipsis ("...").
    const ellipsisIndex = tokens.indexOf("...");

    if (ellipsisIndex === 0) {
      throw new Error("Series cannot start with an ellipsis.");
    }
    if (ellipsisIndex === tokens.length - 1) {
      throw new Error("Series must specify a final term after the ellipsis.");
    }

    // Parse the numbers before the ellipsis.
    const initialNumbers = tokens
      .slice(0, ellipsisIndex)
      .map((token) => Number(token));
    // Parse the last term (the final token after the ellipsis).
    const lastTerm = Number(tokens[tokens.length - 1]);

    // We need at least two numbers before the ellipsis to determine the progression.
    if (initialNumbers.length < 2) {
      throw new Error(
        "At least two numbers are required before the ellipsis to determine the pattern."
      );
    }

    // Determine the common difference from the first two numbers.
    const diff = initialNumbers[1] - initialNumbers[0];

    // Verify that the initial part is arithmetic.
    for (let i = 2; i < initialNumbers.length; i++) {
      if (initialNumbers[i] - initialNumbers[i - 1] !== diff) {
        throw new Error(
          "The initial sequence before the ellipsis is not arithmetic."
        );
      }
    }

    // Check if the last term fits the progression.
    if (diff === 0) {
      if (lastTerm !== initialNumbers[0]) {
        throw new Error(
          "Invalid series: common difference is 0 but the last term differs."
        );
      }
    } else {
      if ((lastTerm - initialNumbers[0]) % diff !== 0) {
        throw new Error(
          "Last term does not fit the arithmetic progression pattern."
        );
      }
    }

    // Calculate the total number of terms.
    const numberOfTerms =
      diff === 0
        ? initialNumbers.length + 1
        : (lastTerm - initialNumbers[0]) / diff + 1;

    // Optionally, generate the full series if the number of terms is reasonable.
    let fullSeries = [];
    if (numberOfTerms <= 1000) {
      for (let i = 0; i < numberOfTerms; i++) {
        fullSeries.push(initialNumbers[0] + i * diff);
      }
    }

    // Return an object with all arithmetic details.
    return {
      type: "ellipsis",
      firstTerm: initialNumbers[0],
      commonDifference: diff,
      lastTerm,
      numberOfTerms,
      series: fullSeries,
    };
  }

  /**
   * Checks if the series is arithmetic.
   * For ellipsis-formatted series, the arithmetic nature is ensured during parsing.
   * @returns {boolean} True if the series is arithmetic; otherwise, false.
   */
  isArithmetic() {
    if (this.isEllipsisFormat) {
      return true;
    }
    const n = this.series.length;
    if (n < 2) return true;
    const diff = this.series[1] - this.series[0];
    for (let i = 2; i < n; i++) {
      if (this.series[i] - this.series[i - 1] !== diff) return false;
    }
    return true;
  }

  /**
   * Returns an object describing the arithmetic progression pattern.
   * For ellipsis-formatted series, details include firstTerm, commonDifference, lastTerm, numberOfTerms, and the full series (if generated).
   * @returns {object|null} The arithmetic pattern details, or null if not arithmetic.
   */
  getArithmeticPattern() {
    if (!this.isArithmetic()) {
      return null;
    }
    if (this.isEllipsisFormat) {
      return this.series;
    } else {
      if (this.series.length === 1) {
        return {
          firstTerm: this.series[0],
          commonDifference: 0,
          message:
            "Series has one element and is considered arithmetic with a trivial difference of 0.",
        };
      }
      const diff = this.series[1] - this.series[0];
      return {
        firstTerm: this.series[0],
        commonDifference: diff,
        series: this.series,
      };
    }
  }

  /**
   * Calculates the nth term of the arithmetic progression.
   * @param {number} n - The term position (1-based index).
   * @returns {number} The nth term.
   * @throws {Error} If n is not a positive integer or if the series is not arithmetic.
   */
  nthTerm(n) {
    if (typeof n !== "number" || !Number.isInteger(n) || n < 1) {
      throw new Error("n must be a positive integer.");
    }
    if (!this.isArithmetic()) {
      throw new Error("Series is not an arithmetic progression.");
    }
    let firstTerm, diff;
    if (this.isEllipsisFormat) {
      firstTerm = this.series.firstTerm;
      diff = this.series.commonDifference;
    } else {
      const pattern = this.getArithmeticPattern();
      firstTerm = pattern.firstTerm;
      diff = pattern.commonDifference;
    }
    return firstTerm + (n - 1) * diff;
  }
}

module.exports = { ArithmeticSeriesParser };