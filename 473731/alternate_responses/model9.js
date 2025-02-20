function parseCompound(compound) {
  const regex = /([A-Z][a-z]?)(\d*)/g;
  const elements = {};

  let match;
  while ((match = regex.exec(compound))) {
    const element = match[1];
    const count = match[2] ? parseInt(match[2]) : 1;

    if (elements[element]) {
      elements[element] += count;
    } else {
      elements[element] = count;
    }
  }

  return elements;
}

function parseEquation(equation) {
  if (!equation.includes("->")) {
    throw new Error("Invalid equation format. Must contain ->");
  }

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
      if (leftElements[element]) {
        leftElements[element] += elements[element];
      } else {
        leftElements[element] = elements[element];
      }
    });
  });

  products.forEach((compound) => {
    const elements = parseCompound(compound);
    Object.keys(elements).forEach((element) => {
      if (rightElements[element]) {
        rightElements[element] += elements[element];
      } else {
        rightElements[element] = elements[element];
      }
    });
  });

  return { leftElements, rightElements };
}

function balanceEquation(equation) {
  const { leftElements, rightElements } = parseEquation(equation);

  // Check if all elements are present on both sides
  Object.keys(leftElements).forEach((element) => {
    if (!rightElements[element]) {
      throw new Error(`Element ${element} is not present on the right side`);
    }
  });

  Object.keys(rightElements).forEach((element) => {
    if (!leftElements[element]) {
      throw new Error(`Element ${element} is not present on the left side`);
    }
  });

  // Calculate the least common multiple (LCM) of the counts of each element
  const lcm = (a, b) => (a * b) / gcd(a, b);
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

  let multiplier = 1;
  Object.keys(leftElements).forEach((element) => {
    const leftCount = leftElements[element];
    const rightCount = rightElements[element];
    multiplier = lcm(multiplier, lcm(leftCount, rightCount));
  });

  // Balance the equation
  const [reactants, products] = equation.split("->").map((side) =>
    side
      .trim()
      .split("+")
      .map((compound) => compound.trim())
  );

  const balancedReactants = reactants.map((compound) => {
    const elements = parseCompound(compound);
    const count = Object.keys(elements).reduce((acc, element) => {
      return acc * (multiplier / leftElements[element]);
    }, 1);
    return count > 1 ? `${count}${compound}` : compound;
  });

  const balancedProducts = products.map((compound) => {
    const elements = parseCompound(compound);
    const count = Object.keys(elements).reduce((acc, element) => {
      return acc * (multiplier / rightElements[element]);
    }, 1);
    return count > 1 ? `${count}${compound}` : compound;
  });

  return `${balancedReactants.join(" + ")} -> ${balancedProducts.join(" + ")}`;
}

module.exports = { balanceEquation, parseCompound, parseEquation };