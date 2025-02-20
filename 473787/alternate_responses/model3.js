const _ = require("underscore");

const createCircuitComponents = {
  Component: function (resistance, type = "resistor") {
    if (typeof resistance !== "number" || resistance <= 0) {
      throw new Error("Resistance must be a positive number");
    }
    this.resistance = resistance;
    this.type = type;
  },

  Circuit: function (components = [], type = "series") {
    if (!["series", "parallel"].includes(type)) {
      throw new Error("Circuit type must be either series or parallel");
    }
    this.components = components;
    this.type = type;
  },
};

createCircuitComponents.Circuit.prototype.addComponent = function (component) {
  this.components.push(component);
};

createCircuitComponents.Circuit.prototype.calculateTotalResistance =
  function () {
    const { Circuit } = createCircuitComponents;

    if (_.isEmpty(this.components)) return 0;

    if (this.type === "series") {
      return _.reduce(
        this.components,
        (total, component) => {
          return (
            total +
            (component instanceof Circuit
              ? component.calculateTotalResistance()
              : component.resistance)
          );
        },
        0
      );
    }

    const reciprocalSum = _.reduce(
      this.components,
      (sum, component) => {
        const resistance =
          component instanceof Circuit
            ? component.calculateTotalResistance()
            : component.resistance;
        return resistance === 0 ? sum : sum + 1 / resistance;
      },
      0
    );

    return reciprocalSum === 0 ? 0 : 1 / reciprocalSum;
  };

class CircuitAnalyzer {
  constructor() {
    this.mainCircuit = null;
  }

  clear() {
    this.mainCircuit = null;
  }

  createCircuit(type = "series") {
    const { Circuit } = createCircuitComponents;
    return new Circuit([], type);
  }

  setMainCircuit(circuit) {
    this.mainCircuit = circuit;
  }

  addComponent(resistance, type = "resistor", circuit = this.mainCircuit) {
    const { Component, Circuit } = createCircuitComponents;

    if (!circuit) {
      this.mainCircuit = new Circuit();
      circuit = this.mainCircuit;
    }
    circuit.addComponent(new Component(resistance, type));
  }

  calculateTotalResistance() {
    return this.mainCircuit ? this.mainCircuit.calculateTotalResistance() : 0;
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

  calculateVoltageDistribution(totalVoltage, circuit = this.mainCircuit) {
    const { Circuit } = createCircuitComponents;

    if (!circuit || _.isEmpty(circuit.components)) return [];

    const distribution = [];
    const current = this.calculateCurrent(totalVoltage);

    if (circuit.type === "series") {
      _.each(circuit.components, (component) => {
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
      });
    } else {
      const branchVoltage = totalVoltage;
      _.each(circuit.components, (component) => {
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
      });
    }

    return distribution;
  }
}

module.exports = {
  CircuitAnalyzer,
  createCircuitComponents,
};
