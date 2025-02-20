/**
 * Class representing a Chemical Equation Balancer
 */
class ChemicalEquationBalancer {
    /**
     * Parses a chemical compound into its constituent elements and their counts
     * @param {string} compound - The chemical compound to parse (e.g., "2H2O")
     * @returns {Object} An object mapping elements to their total count
     */
  #parseCompound(compound) {
      const elements = {};
      let i = 0;
      let coefficient = "";
  
      // Parse the leading coefficient if any (e.g., the "2" in "2H2O")
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
  
      // Parse each element and its count
      while (i < compound.length) {
        if (compound[i].match(/[A-Z]/)) {
          let element = compound[i];
          i++;
  
          // Handle multi-letter elements (e.g., "Na", "Cl")
          while (i < compound.length && compound[i].match(/[a-z]/)) {
            element += compound[i];
            i++;
          }
  
          // Parse the count for this element (e.g., the "2" in "H2")
          let count = "";
          while (i < compound.length && compound[i].match(/[0-9]/)) {
            count += compound[i];
            i++;
          }
  
          count = count || "1";
          elements[element] = (elements[element] || 0) + parseInt(count) * multiplier;
        } else {
          i++;
        }
      }
      return elements;
    }
  
    /**
     * Parses a chemical equation into its reactants and products elements count
     * @param {string} equation - The chemical equation to parse
     * @returns {Object} Object containing element counts for both sides of the equation
     */
    #parseEquation(equation) {
      const [reactants, products] = equation.split("->").map((side) =>
        side
          .trim()
          .split("+")
          .map((compound) => compound.trim())
      );
  
      const leftElements = {};
      const rightElements = {};
  
      // Calculate total element counts for reactants
      reactants.forEach((compound) => {
        const elements = this.#parseCompound(compound);
        Object.entries(elements).forEach(([element, count]) => {
          leftElements[element] = (leftElements[element] || 0) + count;
        });
      });
  
      // Calculate total element counts for products
      products.forEach((compound) => {
        const elements = this.#parseCompound(compound);
        Object.entries(elements).forEach(([element, count]) => {
          rightElements[element] = (rightElements[element] || 0) + count;
        });
      });
      return { leftElements, rightElements };
    }
  
    /**
     * Attempts to balance a chemical equation
     * @param {string} equation - The chemical equation to balance
     * @returns {string} The balanced equation if possible
     * @throws {Error} If the equation cannot be balanced or is invalid
     */
    balanceEquation(equation) {
      // Basic validation
      if (!equation || typeof equation !== 'string') {
        throw new Error("Invalid input: equation must be a non-empty string");
      }
  
      if (!equation.includes("->")) {
        throw new Error("Invalid equation format. Must contain ->");
      }
  
      const { leftElements, rightElements } = this.#parseEquation(equation);
  
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
  }
  
  module.exports = { ChemicalEquationBalancer };