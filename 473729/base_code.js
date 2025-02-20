class UnitConverter {
  constructor() {
    this.metricPrefixes = {
      base: 1,
      kilo: 1e3,
      milli: 1e-3,
      micro: 1e-6,
    };
  }

  convert(value, fromUnit, toUnit) {
    // Basic implementation only handles simple conversions
    if (!this.metricPrefixes[fromUnit] || !this.metricPrefixes[toUnit]) {
      throw new Error("Unsupported unit prefix");
    }

    const baseValue = value * this.metricPrefixes[fromUnit];
    return baseValue / this.metricPrefixes[toUnit];
  }

  _parseUnit(unit) {
    if (typeof unit !== "string") {
      throw new InvalidUnitError("Unit must be a string");
    }

    const prefixes = Object.keys(this.metricPrefixes).join("|");
    const regex = new RegExp(`^(${prefixes})(meter|gram|liter)$`);
    const match = unit.toLowerCase().match(regex);

    if (!match) {
      throw new InvalidUnitError("Invalid unit format");
    }

    return [match[1], match[2]];
  }

}

class InvalidValueError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidValueError";
  }
}

class InvalidUnitError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidUnitError";
  }
}

class UnitMismatchError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnitMismatchError";
  }
}

module.exports = { UnitConverter, InvalidUnitError, UnitMismatchError, InvalidValueError };