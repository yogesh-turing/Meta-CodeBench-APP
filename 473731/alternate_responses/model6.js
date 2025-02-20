function parseCompound(compound) {
  const elements = {};
  let i = 0;
  while (i < compound.length) {
    // Parse the element symbol (one or two characters)
    let symbol = compound[i];
    if (i + 1 < compound.length && compound[i + 1].toUpperCase() === compound[i + 1]) {
      symbol += compound[i + 1];
      i += 2;
    } else {
      i += 1;
    }

    // Parse the atomicity (optional)
    let atomicity = 1;
    if (i < compound.length && !isNaN(compound[i])) {
      let num = "";
      while (i < compound.length && !isNaN(compound[i])) {
        num += compound[i];
        i += 1;
      }
      atomicity = parseInt(num);
    }

    // Add the element and its atomicity to the result
    if (elements[symbol]) {
      elements[symbol] += atomicity;
    } else {
      elements[symbol] = atomicity;
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

  const rightElements = {};
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

  // Find the least common multiple of the denominators
  let lcm = 1;
  Object.keys(leftElements).forEach((element) => {
    lcm = lcm * rightElements[element] / gcd(lcm, rightElements[element]);
  });

  // Multiply each compound by the appropriate factor
  const [reactants, products] = equation.split("->").map((side) =>
    side
      .trim()
      .split("+")
      .map((compound) => compound.trim())
  );

  const balancedReactants = reactants.map((compound) => {
    const elements = parseCompound(compound);
    const factor = lcm / Object.values(elements).reduce((a, b) => a * b, 1);
    return factor > 1 ? factor + compound : compound;
  }).join(" + ");

  const balancedProducts = products.map((compound) => {
    const elements = parseCompound(compound);
    const factor = lcm / Object.values(elements).reduce((a, b) => a * b, 1);
    return factor > 1 ? factor + compound : compound;
  }).join(" + ");

  return balancedReactants + " -> " + balancedProducts;
}

function gcd(a, b) {
  if (b === 0) return a;
  return gcd(b, a % b);
}

module.exports = { balanceEquation, parseCompound, parseEquation };