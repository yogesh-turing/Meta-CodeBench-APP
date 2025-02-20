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
    const { components, type } = this;

    if (_.isEmpty(components)) return 0;

    if (type === "series") {
      return _.reduce(
        components,
        (total, comp) => {
          return (
            total +
            (comp instanceof createCircuitComponents.Circuit
              ? comp.calculateTotalResistance()
              : comp.resistance)
          );
        },
        0
      );
    } else {
      const reciprocalSum = _.reduce(
        components,
        (sum, comp) => {
          const resistance =
            comp instanceof createCircuitComponents.Circuit
              ? comp.calculateTotalResistance()
              : comp.resistance;
          return resistance === 0 ? sum : sum + 1 / resistance;
        },
        0
      );
      return reciprocalSum === 0 ? 0 : 1 / reciprocalSum;
    }
  };

class CircuitAnalyzer {
  constructor() {
    this.mainCircuit = null;
    this.clear = this.clearCircuit.bind(this);
  }

  clearCircuit() {
    this.mainCircuit = null;
  }

  createCircuit(type = "series") {
    return new createCircuitComponents.Circuit([], type);
  }

  setMainCircuit(circuit) {
    this.mainCircuit = circuit;
  }

  addComponent(resistance, type = "resistor", circuit = this.mainCircuit) {
    if (!circuit) {
      this.mainCircuit = new createCircuitComponents.Circuit();
      circuit = this.mainCircuit;
    }
    circuit.addComponent(
      new createCircuitComponents.Component(resistance, type)
    );
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
    if (!circuit || _.isEmpty(circuit.components)) return [];

    const distribution = [];
    const current = this.calculateCurrent(totalVoltage);
    const { type, components } = circuit;

    if (type === "series") {
      _.each(components, (component) => {
        if (component instanceof createCircuitComponents.Circuit) {
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
      _.each(components, (component) => {
        if (component instanceof createCircuitComponents.Circuit) {
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
