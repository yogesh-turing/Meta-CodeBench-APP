class UnitConverter {
  constructor() {
    this.metricPrefixes = {
      yotta: 1e24,
      zetta: 1e21,
      exa: 1e18,
      peta: 1e15,
      tera: 1e12,
      giga: 1e9,
      mega: 1e6,
      kilo: 1e3,
      base: 1,
      milli: 1e-3,
      micro: 1e-6,
      nano: 1e-9,
      pico: 1e-12,
      femto: 1e-15,
      atto: 1e-18,
      zepto: 1e-21,
      yocto: 1e-24,
    };

    this.baseUnits = ["meter", "gram", "liter"];
  }

  convert(value, fromUnit, toUnit) {
    if (typeof value !== "number") {
      throw new InvalidValueError("Value must be a number");
    }

    const [fromPrefix, fromBaseUnit] = this._parseUnit(fromUnit);
    const [toPrefix, toBaseUnit] = this._parseUnit(toUnit);

    if (fromBaseUnit !== toBaseUnit) {
      throw new UnitMismatchError("Conversions must be between the same base unit");
    }

    const baseValue = value * this.metricPrefixes[fromPrefix];

    // Handle extreme conversions
    if (baseValue > 1e20 || baseValue < 1e-20) {
      return this._handleExtremeConversion(baseValue, fromPrefix, toPrefix);
    }

    return baseValue / this.metricPrefixes[toPrefix];
  }

  _parseUnit(unit) {
    if (typeof unit !== "string") {
      throw new InvalidUnitError("Unit must be a string");
    }

    const prefixes = Object.keys(this.metricPrefixes).join("|");
    const regex = new RegExp(`^(${prefixes})(${this.baseUnits.join("|")})$`);
    const match = unit.toLowerCase().match(regex);

    if (!match) {
      throw new InvalidUnitError("Invalid unit format");
    }

    return [match[1], match[2]];
  }

  _handleExtremeConversion(baseValue, fromPrefix, toPrefix) {
    if (baseValue > 1e20) {
      return Infinity;
    }

    if (baseValue < 1e-20 || (baseValue < 1e-10 && this.metricPrefixes[fromPrefix] < this.metricPrefixes[toPrefix])) {
      return 0;
    }

    return baseValue / this.metricPrefixes[toPrefix];
  }

  getSupportedUnits() {
    const supportedUnits = [];

    for (const prefix in this.metricPrefixes) {
      for (const baseUnit of this.baseUnits) {
        supportedUnits.push(`${prefix}${baseUnit}`);
      }
    }

    return supportedUnits;
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