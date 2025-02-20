function parseCompound(compound) {
  const elements = {};
  let symbol = "";
  let count = "";

  for (let i = 0; i < compound.length; i++) {
    const char = compound[i];

    // If the character is uppercase, it's a new element
    if (char === char.toUpperCase()) {
      if (symbol !== "") {
        elements[symbol] = count === "" ? 1 : parseInt(count);
      }

      symbol = char;
      count = "";
    } else if (char === char.toLowerCase()) {
      // If the character is lowercase, it's part of the current element
      symbol += char;
    } else if (!isNaN(char)) {
      // If the character is a number, it's the count of the current element
      count += char;
    }
  }

  // Add the last element to the list
  elements[symbol] = count === "" ? 1 : parseInt(count);

  return elements;
}

function parseEquation(equation) {
  const [reactants, products] = equation.split("->").map((side) =>
    side
      .trim()
      .split("+")
      .map((compound) => compound.trim())
  );

  const leftElements = {};
  const rightElements = {};

  reactants.forEach((compound) => {
    const elements = parseCompound(compound);
    Object.keys(elements).forEach((element) => {
      if (!leftElements[element]) {
        leftElements[element] = 0;
      }
      leftElements[element] += elements[element];
    });
  });

  products.forEach((compound) => {
    const elements = parseCompound(compound);
    Object.keys(elements).forEach((element) => {
      if (!rightElements[element]) {
        rightElements[element] = 0;
      }
      rightElements[element] += elements[element];
    });
  });

  return { leftElements, rightElements };
}

function balanceEquation(equation) {
  if (!equation.includes("->")) {
    throw new Error("Invalid equation format. Must contain ->");
  }

  const { leftElements, rightElements } = parseEquation(equation);
  const elements = Object.keys(leftElements);

  // Check if all elements are present on both sides
  elements.forEach((element) => {
    if (!rightElements[element]) {
      throw new Error(`Element ${element} is not present on the right side`);
    }
  });

  Object.keys(rightElements).forEach((element) => {
    if (!leftElements[element]) {
      throw new Error(`Element ${element} is not present on the left side`);
    }
  });

  // Calculate the least common multiple of the two sides
  const lcm = (a, b) => (a * b) / gcd(a, b);
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

  let leftMultiplier = 1;
  let rightMultiplier = 1;

  elements.forEach((element) => {
    const leftCount = leftElements[element];
    const rightCount = rightElements[element];

    const multiplier = lcm(leftCount, rightCount);

    leftMultiplier = lcm(leftMultiplier, multiplier / leftCount);
    rightMultiplier = lcm(rightMultiplier, multiplier / rightCount);
  });

  // Split the equation into reactants and products
  const [reactants, products] = equation.split("->").map((side) =>
    side
      .trim()
      .split("+")
      .map((compound) => compound.trim())
  );

  // Balance the equation
  const balancedReactants = reactants.map((compound) => {
    const elements = parseCompound(compound);
    const multiplier = leftMultiplier / Object.values(elements).reduce((a, b) => a * b);

    return (multiplier > 1 ? multiplier : "") + compound;
  });

  const balancedProducts = products.map((compound) => {
    const elements = parseCompound(compound);
    const multiplier = rightMultiplier / Object.values(elements).reduce((a, b) => a * b);

    return (multiplier > 1 ? multiplier : "") + compound;
  });

  // Join the balanced reactants and products back into an equation
  const balancedEquation = balancedReactants.join(" + ") + " -> " + balancedProducts.join(" + ");

  return balancedEquation;
}

module.exports = { balanceEquation, parseCompound, parseEquation };