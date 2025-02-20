const _ = require("underscore");

// Combined function for Component and Circuit
function createCircuitComponents() {
  function Component(resistance, type = "resistor") {
    if (!_.isNumber(resistance) || resistance <= 0) {
      throw new Error("Resistance must be a positive number");
    }
    this.resistance = resistance;
    this.type = type;
  }

  function Circuit(components = [], type = "series") {
    if (!_.contains(["series", "parallel"], type)) {
      throw new Error("Circuit type must be either series or parallel");
    }
    this.components = components;
    this.type = type;
  }

  Circuit.prototype.addComponent = function (component) {
    this.components.push(component);
  };

  Circuit.prototype.calculateTotalResistance = function () {
    const { components, type } = this;

    if (_.isEmpty(components)) {
      return 0;
    }

    if (type === "series") {
      // For series circuits, sum all resistances
      return _.reduce(
        components,
        (total, comp) => {
          const resistance =
            comp instanceof Circuit
              ? comp.calculateTotalResistance()
              : comp.resistance;
          return total + resistance;
        },
        0
      );
    } else {
      // For parallel circuits, use reciprocal sum formula
      const reciprocalSum = _.reduce(
        components,
        (sum, comp) => {
          const resistance =
            comp instanceof Circuit
              ? comp.calculateTotalResistance()
              : comp.resistance;
          return resistance === 0 ? sum : sum + 1 / resistance;
        },
        0
      );
      return reciprocalSum === 0 ? 0 : 1 / reciprocalSum;
    }
  };

  return { Component, Circuit };
}

class CircuitAnalyzer {
  constructor(circuitComponents) {
    this.mainCircuit = null;
    this.circuitComponents = circuitComponents;
  }

  createCircuit(type = "series") {
    return new this.circuitComponents.Circuit([], type);
  }

  setMainCircuit(circuit) {
    this.mainCircuit = circuit;
  }

  addComponent(resistance, type = "resistor", circuit = this.mainCircuit) {
    if (_.isNull(circuit)) {
      this.mainCircuit = new this.circuitComponents.Circuit();
      circuit = this.mainCircuit;
    }
    circuit.addComponent(
      new this.circuitComponents.Component(resistance, type)
    );
  }

  calculateTotalResistance() {
    const { mainCircuit } = this;
    if (_.isNull(mainCircuit)) {
      return 0;
    }
    return mainCircuit.calculateTotalResistance();
  }

  calculateCurrent(voltage) {
    if (!_.isNumber(voltage) || voltage < 0) {
      throw new Error("Voltage must be a non-negative number");
    }
    const totalResistance = this.calculateTotalResistance();
    return totalResistance === 0 ? 0 : voltage / totalResistance;
  }

  calculatePower(voltage) {
    const current = this.calculateCurrent(voltage);
    return voltage * current;
  }

  calculateVoltageDistribution(totalVoltage, circuit = this.mainCircuit) {
    if (_.isNull(circuit) || _.isEmpty(circuit.components)) return [];

    const { components, type } = circuit;
    const distribution = [];
    const current = this.calculateCurrent(totalVoltage);

    if (type === "series") {
      // For series circuits, voltage is distributed based on resistance ratio
      _.each(components, (component) => {
        if (component instanceof this.circuitComponents.Circuit) {
          // Recursively calculate distribution for nested circuits
          const nestedVoltage = current * component.calculateTotalResistance();
          distribution.push(
            ...this.calculateVoltageDistribution(nestedVoltage, component)
          );
        } else {
          // Calculate voltage across individual component (V = I * R)
          distribution.push({
            type: component.type,
            voltage: current * component.resistance,
          });
        }
      });
    } else {
      // For parallel circuits, voltage is same across all branches
      const branchVoltage = totalVoltage;
      _.each(components, (component) => {
        if (component instanceof this.circuitComponents.Circuit) {
          distribution.push(
            ...this.calculateVoltageDistribution(branchVoltage, component)
          );
        } else {
          distribution.push({
            type: component.type,
            voltage: branchVoltage,
          });
        }
      });
    }

    return distribution;
  }

  clear() {
    this.mainCircuit = null;
  }
}

module.exports = {
  createCircuitComponents,
  CircuitAnalyzer,
};
