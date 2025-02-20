const _ = require("underscore");

class CircuitAnalyzer {
  constructor() {
    this.mainCircuit = null;
  }

  createCircuit(type = "series") {
    return new Circuit(type);
  }

  setMainCircuit(circuit) {
    this.mainCircuit = circuit;
  }

  addComponent(resistance, type, cir = this.mainCircuit) {
    if (!cir) {
      this.mainCircuit = this.createCircuit();
      cir = this.mainCircuit;
    }
    cir.addComponent(createCircuitComponents(resistance, type));
  }

  calculateTotalResistance() {
    if (!this.mainCircuit) {
      return 0;
    }
    return this.mainCircuit.calculateTotalResistance();
  }

  calculateCurrent(voltage) {
    if (typeof voltage !== "number" || voltage < 0) {
      throw new Error("Voltage must be a non-negative number");
    }
    const totalResistance = this.calculateTotalResistance();
    return totalResistance === 0 ? 0 : voltage / totalResistance;
  }

  calculatePower(voltage) {
    const current = this.calculateCurrent(voltage);
    return voltage * current;
  }

  calculateVoltageDistribution(totalVoltage, cir = this.mainCircuit) {
    if (!cir || cir.components.length === 0) return [];

    const distribution = [];
    const current = this.calculateCurrent(totalVoltage);

    if (cir.type === "series") {
      for (const component of cir.components) {
        if (component instanceof Circuit) {
          distribution.push(
            ...this.calculateVoltageDistribution(
              current * component.calculateTotalResistance(),
              component
            )
          );
        } else {
          distribution.push({
            type: component.type,
            voltage: current * component.resistance,
          });
        }
      }
    } else {
      // parallel
      const branchVoltage = totalVoltage;
      for (const component of cir.components) {
        if (component instanceof Circuit) {
          distribution.push(
            ...this.calculateVoltageDistribution(branchVoltage, component)
          );
        } else {
          distribution.push({
            type: component.type,
            voltage: branchVoltage,
          });
        }
      }
    }

    return distribution;
  }
}

function createCircuitComponents(resistance, type = "resistor") {
  if (typeof resistance !== "number" || resistance <= 0) {
    throw new Error("Resistance must be a positive number");
  }
  return { resistance, type };
}

class Circuit {
  constructor(type = "series", components = []) {
    if (!["series", "parallel"].includes(type)) {
      throw new Error("Circuit type must be either series or parallel");
    }
    this.components = components;
    this.type = type;
  }

  addComponent(component) {
    this.components.push(component);
  }

  calculateTotalResistance() {
    if (this.components.length === 0) {
      return 0;
    }

    if (this.type === "series") {
      return this.components.reduce((total, comp) => {
        return (
          total +
          (comp instanceof Circuit
            ? comp.calculateTotalResistance()
            : comp.resistance)
        );
      }, 0);
    } else {
      const reciSum = this.components.reduce((sum, comp) => {
        const resist =
          comp instanceof Circuit
            ? comp.calculateTotalResistance()
            : comp.resistance;
        return resist === 0 ? sum : sum + 1 / resist;
      }, 0);
      return reciSum === 0 ? 0 : 1 / reciSum;
    }
  }
}

module.exports = {
  CircuitAnalyzer,
  createCircuitComponents,
};
