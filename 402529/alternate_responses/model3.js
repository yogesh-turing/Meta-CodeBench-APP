/**
 * Main function that processes age input and calculates final result
 * @param {number} age - The age input from user
 * @returns {Object} Object containing all calculated values
 * @throws {Error} If age is not a positive integer
 */
function processAge(age) {
  if (!Number.isInteger(age) || age <= 0) {
    throw new Error("Age must be a positive integer");
  }

  const digitalRoot = calculateDigitalRoot(age);
  const modifiedAge = calculateModifiedAge(age);
  const finalResult = processDigitalRoot(modifiedAge, digitalRoot);

  const result = {
    digitalRoot: digitalRoot,
    modifiedAge: modifiedAge,
  };

  if (isHarshad(10, finalResult)) {
    result.finalResult = ((finalResult * 2 + 7) % 10) + 4;
  } else {
    result.finalResult = digitalRoot;
  }

  return result;
}

/**
 * Calculates the digital root of a non-negative integer.
 * The digital root is the single-digit number remaining after repeated summation of digits.
 *
 * @param {number} num - The non-negative integer for which to calculate the digital root.
 * @returns {number} The digital root of the given number.
 * @throws {Error} if the input number is negative.
 */
function calculateDigitalRoot(num) {
  if (num < 0) {
    throw new Error("Number must be non-negative");
  }
  if (num === 0) return 0;
  return 1 + ((num - 1) % 9);
}

/**
 * Calculates a modified age based on the original age and its digital root.
 * The modified age is the original age minus the ceiling of the original age divided by 3.
 *
 * @param {number} age - The original age.
 * @returns {number} The modified age.
 */
function calculateModifiedAge(age) {
  return age - Math.ceil(age / 3);
}

/**
 * Processes the digital root based on a condition.
 * If the modified age is greater than 20, the digital root is incremented by 5.
 * Otherwise, the digital root remains unchanged.
 *
 * @param {number} modifiedAge - The modified age.
 * @param {number} digitalRoot - The digital root.
 * @returns {number} The processed digital root.
 */
function processDigitalRoot(modifiedAge, digitalRoot) {
  return modifiedAge > 20 ? digitalRoot + 5 : digitalRoot;
}

/**
 * Checks if a number is a Harshad number with a given base.
 * A Harshad number is an integer that is divisible by the sum of its digits.
 *
 * @param {number} base - The base for the Harshad number check (typically 10).
 * @param {number} num - The number to check for Harshad property.
 * @returns {boolean} True if the number is a Harshad number, False otherwise.
 * @throws {Error} If inputs are invalid
 */
function isHarshad(base, num) {
  if (
    !Number.isInteger(base) ||
    base <= 1 ||
    !Number.isInteger(num) ||
    num < 0
  ) {
    throw new Error(
      "Invalid input: base must be integer > 1, num must be non-negative integer"
    );
  }

  let sum = 0;
  let temp = num;

  while (temp > 0) {
    sum += temp % base;
    temp = Math.floor(temp / base);
  }

  return sum !== 0 && num % sum === 0;
}

module.exports = {
  processAge,
  calculateDigitalRoot,
  calculateModifiedAge,
  processDigitalRoot,
  isHarshad,
};
