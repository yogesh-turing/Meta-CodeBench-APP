function parseCompound(compound) {
  const elements = {};
  let currentSymbol = '';
  let currentAtomicity = '';

  for (let i = 0; i < compound.length; i++) {
    const char = compound[i];

    if (char.match(/[A-Z]/)) {
      if (currentSymbol) {
        elements[currentSymbol] = currentAtomicity ? parseInt(currentAtomicity) : 1;
        currentSymbol = '';
        currentAtomicity = '';
      }
      currentSymbol += char;
    } else if (char.match(/[a-z]/)) {
      currentSymbol += char;
    } else if (char.match(/[0-9]/)) {
      currentAtomicity += char;
    }
  }

  if (currentSymbol) {
    elements[currentSymbol] = currentAtomicity ? parseInt(currentAtomicity) : 1;
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
    Object.keys(elements).forEach((symbol) => {
      if (!leftElements[symbol]) {
        leftElements[symbol] = 0;
      }
      leftElements[symbol] += elements[symbol];
    });
  });

  products.forEach((compound) => {
    const elements = parseCompound(compound);
    Object.keys(elements).forEach((symbol) => {
      if (!rightElements[symbol]) {
        rightElements[symbol] = 0;
      }
      rightElements[symbol] += elements[symbol];
    });
  });

  return { leftElements, rightElements };
}

function balanceEquation(equation) {
  const { leftElements, rightElements } = parseEquation(equation);

  const leftSymbols = Object.keys(leftElements);
  const rightSymbols = Object.keys(rightElements);

  if (leftSymbols.length !== rightSymbols.length) {
    throw new Error("Different number of elements on each side");
  }

  const coefficients = {};

  leftSymbols.forEach((symbol) => {
    const leftCount = leftElements[symbol];
    const rightCount = rightElements[symbol];

    if (leftCount !== rightCount) {
      const lcm = getLcm(leftCount, rightCount);
      coefficients[symbol] = lcm / leftCount;
    } else {
      coefficients[symbol] = 1;
    }
  });

  const [reactants, products] = equation.split("->").map((side) =>
    side
      .trim()
      .split("+")
      .map((compound) => compound.trim())
  );

  const balancedReactants = reactants.map((compound) => {
    const elements = parseCompound(compound);
    const symbol = Object.keys(elements)[0];
    const coefficient = coefficients[symbol];

    return coefficient > 1 ? `${coefficient}${compound}` : compound;
  });

  const balancedProducts = products.map((compound) => {
    const elements = parseCompound(compound);
    const symbol = Object.keys(elements)[0];
    const coefficient = coefficients[symbol];

    return coefficient > 1 ? `${coefficient}${compound}` : compound;
  });

  return `${balancedReactants.join(" + ")} -> ${balancedProducts.join(" + ")}`;
}

function getLcm(a, b) {
  return (a * b) / getGcd(a, b);
}

function getGcd(a, b) {
  if (b === 0) {
    return a;
  }
  return getGcd(b, a % b);
}

module.exports = { balanceEquation, parseCompound, parseEquation };