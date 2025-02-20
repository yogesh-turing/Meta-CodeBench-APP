class Component {
  constructor(resistance, type = "resistor") {
    if (typeof resistance !== "number" || resistance <= 0) {
      throw new Error("Resistance must be a positive number");
    }
    this.resistance = resistance;
    this.type = type;
  }
}

class Circuit {
  constructor(components = [], type = "series") {
    if (!["series"].includes(type)) {
      throw new Error("Circuit type must be series");
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

    return this.components.reduce((total, comp) => {
      return (
        total +
        (comp instanceof Circuit
          ? comp.calculateTotalResistance()
          : comp.resistance)
      );
    }, 0);
  }
}

class CircuitAnalyzer {
  constructor() {
    this.mainCircuit = null;
  }

  createCircuit(type = "series") {
    return new Circuit([], type);
  }

  setMainCircuit(circuit) {
    this.mainCircuit = circuit;
  }

  addComponent(resistance, type = "resistor", circuit = this.mainCircuit) {
    if (!circuit) {
      this.mainCircuit = new Circuit();
      circuit = this.mainCircuit;
    }
    circuit.addComponent(new Component(resistance, type));
  }

  calculateTotalResistance() {
    if (!this.mainCircuit) {
      return 0;
    }
    return this.mainCircuit.calculateTotalResistance();
  }

  calculateCurrent(voltage) {
    const totalResistance = this.calculateTotalResistance();
    return totalResistance === 0 ? 0 : voltage / totalResistance;
  }

  calculatePower(voltage) {
    const current = this.calculateCurrent(voltage);
    return voltage * current;
  }

  clear() {
    this.mainCircuit = null;
  }
}

module.exports = {
  CircuitAnalyzer,
  Component,
  Circuit,
};
