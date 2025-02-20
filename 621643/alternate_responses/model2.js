function calculateDigitalRoot(num) {
  if (num < 0) {
    throw new Error("Number must be non-negative");
  }

  if (num === 0) return 0;

  // Keep summing digits until we get a single digit
  while (num > 9) {
    num = String(num)
      .split("")
      .reduce((sum, digit) => sum + parseInt(digit), 0);
  }

  return num;
}

function calculateModifiedAge(age) {
  // Subtract the ceiling of age/3 from the original age
  return age - Math.ceil(age / 3);
}

function processDigitalRoot(modifiedAge, digitalRoot) {
  // If modified age > 20, add 5 to digital root
  return modifiedAge > 20 ? digitalRoot + 5 : digitalRoot;
}

function isHarshad(base, num) {
  if (!Number.isInteger(base) || base <= 1 || !Number.isInteger(num)) {
    throw new Error(
      "Invalid inputs: base must be integer > 1, num must be integer"
    );
  }

  // Calculate sum of digits in the given base
  const sumOfDigits = String(num)
    .split("")
    .reduce((sum, digit) => sum + parseInt(digit), 0);

  // Number is Harshad if it's divisible by sum of its digits
  return num % sumOfDigits === 0;
}

module.exports = {
  processAge,
  calculateDigitalRoot,
  calculateModifiedAge,
  processDigitalRoot,
  isHarshad,
};
