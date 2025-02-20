function Compnt(resistance, t) {
  var defTyp = "resistor";
  if (!t) t = defTyp;
  if (typeof resistance !== "number" || resistance <= 0) {
    throw new Error("Resistance must be a positive number");
  }
  this.resistance = resistance;
  this.type = t;
}

function Cir(components = [], type = "series") {
  if (!["series", "parallel"].includes(type)) {
    throw new Error("Circuit type must be either series or parallel");
  }
  this.components = components;
  this.type = type;
}

Cir.prototype.addComponent = function (component) {
  this.components.push(component);
};

Cir.prototype.calculateTotalResistance = function () {
  if (this.components.length === 0) {
    return 0;
  }

  if (this.type === "series") {
    return this.components.reduce((total, comp) => {
      return (
        total +
        (comp instanceof Cir
          ? comp.calculateTotalResistance()
          : comp.resistance)
      );
    }, 0);
  } else {
    var reciSum = this.components.reduce((sum, comp) => {
      var resist =
        comp instanceof Cir ? comp.calculateTotalResistance() : comp.resistance;
      return resist === 0 ? sum : sum + 1 / resist;
    }, 0);
    return reciSum === 0 ? 0 : 1 / reciSum;
  }
};

function CirAnl() {
  function clearCircuit() {
    this.mainCircuit = null;
  }
  this.clear = clearCircuit;
  this.mainCircuit = null;
}

CirAnl.prototype.createCircuit = function (type) {
  var defTyp = "series";
  if (!type) type = defTyp;

  return new Cir([], type);
};

CirAnl.prototype.setMainCircuit = function (circuit) {
  this.mainCircuit = circuit;
};

CirAnl.prototype.addComponent = function (
  resistance,
  type,
  cir = this.mainCircuit
) {
  var defTyp = "resistor";
  if (!type) type = defTyp;
  if (!cir) {
    this.mainCircuit = new Cir();
    cir = this.mainCircuit;
  }
  cir.addComponent(new Compnt(resistance, type));
};

CirAnl.prototype.calculateTotalResistance = function () {
  if (!this.mainCircuit) {
    return 0;
  }
  return this.mainCircuit.calculateTotalResistance();
};

CirAnl.prototype.calculateCurrent = function (voltage) {
  if (typeof voltage !== "number" || voltage < 0) {
    throw new Error("Voltage must be a non-negative number");
  }
  var totalResistance = this.calculateTotalResistance();
  return totalResistance === 0 ? 0 : voltage / totalResistance;
};

CirAnl.prototype.calculatePower = function (voltage) {
  var current = this.calculateCurrent(voltage);
  return voltage * current;
};

CirAnl.prototype.calculateVoltageDistribution = function (
  totalVoltage,
  cir = this.mainCircuit
) {
  if (!cir || cir.components.length === 0) return [];

  var distribution = [];
  var current = this.calculateCurrent(totalVoltage);

  if (cir.type === "series") {
    for (var component of cir.components) {
      if (component instanceof Cir) {
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
    var branchVoltage = totalVoltage;
    for (var component of cir.components) {
      if (component instanceof Cir) {
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
};

module.exports = {
  CircuitAnalyzer: CirAnl,
  Component: Compnt,
  Circuit: Cir,
};
