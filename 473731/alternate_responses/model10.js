function parseCompound(compound) {
  const elements = {};
  let element = '';
  let count = '';

  for (let i = 0; i < compound.length; i++) {
    const char = compound[i];

    if (char.match(/[a-z]/i)) {
      element += char;
    } else if (char.match(/[0-9]/)) {
      count += char;
    } else if (char === '(' || char === ')') {
      throw new Error('Invalid compound format. Parentheses are not supported');
    }

    if (i === compound.length - 1 || compound[i + 1].match(/[A-Z]/)) {
      elements[element] = (elements[element] || 0) + (count ? parseInt(count) : 1);
      element = '';
      count = '';
    }
  }

  return elements;
}

function parseEquation(equation) {
  if (!equation.includes('->')) {
    throw new Error('Invalid equation format. Must contain ->');
  }

  const [reactants, products] = equation.split('->').map(side =>
    side
      .trim()
      .split('+')
      .map(compound => compound.trim())
  );

  const leftElements = reactants.reduce((acc, compound) => {
    const elements = parseCompound(compound);
    Object.keys(elements).forEach(element => {
      acc[element] = (acc[element] || 0) + elements[element];
    });
    return acc;
  }, {});

  const rightElements = products.reduce((acc, compound) => {
    const elements = parseCompound(compound);
    Object.keys(elements).forEach(element => {
      acc[element] = (acc[element] || 0) + elements[element];
    });
    return acc;
  }, {});

  return { leftElements, rightElements };
}

function balanceEquation(equation) {
  const { leftElements, rightElements } = parseEquation(equation);

  const elements = Object.keys(leftElements);
  const coefficients = {};

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const leftCount = leftElements[element];
    const rightCount = rightElements[element];

    if (leftCount !== rightCount) {
      const lcm = findLcm(leftCount, rightCount);
      coefficients[element] = lcm / leftCount;
    } else {
      coefficients[element] = 1;
    }
  }

  const reactants = equation.split('->')[0].trim().split('+').map(compound => compound.trim());
  const products = equation.split('->')[1].trim().split('+').map(compound => compound.trim());

  const balancedReactants = reactants.map(compound => {
    const elements = parseCompound(compound);
    const coefficient = Object.keys(elements).reduce((acc, element) => {
      return Math.max(acc, coefficients[element]);
    }, 1);

    return coefficient > 1 ? `${coefficient}${compound}` : compound;
  }).join(' + ');

  const balancedProducts = products.map(compound => {
    const elements = parseCompound(compound);
    const coefficient = Object.keys(elements).reduce((acc, element) => {
      return Math.max(acc, coefficients[element]);
    }, 1);

    return coefficient > 1 ? `${coefficient}${compound}` : compound;
  }).join(' + ');

  return `${balancedReactants} -> ${balancedProducts}`;
}

function findLcm(a, b) {
  return (a * b) / findGcd(a, b);
}

function findGcd(a, b) {
  if (b === 0) return a;
  return findGcd(b, a % b);
}

module.exports = { balanceEquation, parseCompound, parseEquation };