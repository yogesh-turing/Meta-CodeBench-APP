function balanceEquation(equation) {
  if (!equation.includes("->")) {
    throw new Error("Invalid equation format. Must contain ->");
  }

  const [reactants, products] = equation.split("->").map((side) =>
    side
      .trim()
      .split("+")
      .map((compound) => compound.trim())
  );

  // Very basic implementation that only checks if compounds are the same
  const leftCompounds = new Set(reactants);
  const rightCompounds = new Set(products);

  if (leftCompounds.size !== rightCompounds.size) {
    throw new Error("Different number of compounds on each side");
  }

  // This base implementation just returns the input equation without balancing
  return equation;
}

module.exports = { balanceEquation };