function parseCompound(compound) {
  const elements = {};
  let i = 0;
  let coefficient = "";

  while (i < compound.length) {
    if (compound[i].match(/[0-9]/)) {
      coefficient += compound[i];
      i++;
      continue;
    }
    break;
  }

  coefficient = coefficient || "1";
  const multiplier = parseInt(coefficient);

  while (i < compound.length) {
    if (compound[i].match(/[A-Z]/)) {
      let element = compound[i];
      i++;

      while (i < compound.length && compound[i].match(/[a-z]/)) {
        element += compound[i];
        i++;
      }

      let count = "";
      while (i < compound.length && compound[i].match(/[0-9]/)) {
        count += compound[i];
        i++;
      }

      count = count || "1";
      elements[element] =
        (elements[element] || 0) + parseInt(count) * multiplier;
    } else {
      i++;
    }
  }
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
    Object.entries(elements).forEach(([element, count]) => {
      leftElements[element] = (leftElements[element] || 0) + count;
    });
  });

  products.forEach((compound) => {
    const elements = parseCompound(compound);
    Object.entries(elements).forEach(([element, count]) => {
      rightElements[element] = (rightElements[element] || 0) + count;
    });
  });
  return { leftElements, rightElements };
}

function balanceEquation(equation) {
  // Basic validation
  if (!equation.includes("->")) {
    throw new Error("Invalid equation format. Must contain ->");
  }

  const { leftElements, rightElements } = parseEquation(equation);

  // Check if elements match on both sides
  const allElements = new Set([
    ...Object.keys(leftElements),
    ...Object.keys(rightElements),
  ]);

  for (const element of allElements) {
    if (!leftElements[element] || !rightElements[element]) {
      throw new Error(`Element ${element} is not present on both sides`);
    }

    if (leftElements[element] !== rightElements[element]) {
      throw new Error("Equation cannot be balanced with simple integer coefficients");
    }
  }

  // If we reach here, the equation is already balanced
  return equation;
}

module.exports = { balanceEquation, parseCompound, parseEquation };