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
      hecto: 1e2,
      deca: 1e1,
      base: 1,
      deci: 1e-1,
      centi: 1e-2,
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
    this._validateValue(value);
    const [fromPrefix, fromBaseUnit] = this._parseUnit(fromUnit);
    const [toPrefix, toBaseUnit] = this._parseUnit(toUnit);

    if (fromBaseUnit !== toBaseUnit) {
      throw new UnitMismatchError(`Cannot convert between ${fromBaseUnit} and ${toBaseUnit}`);
    }

    const baseValue = value * this.metricPrefixes[fromPrefix];

    // Handle extremely small numbers
    if (Math.abs(baseValue) < 1e-20 || (Math.abs(baseValue) < 1e-10 && this.metricPrefixes[fromPrefix] < this.metricPrefixes[toPrefix])) {
      return 0;
    }

    // Handle potential floating-point precision issues
    const result = baseValue / this.metricPrefixes[toPrefix];
    return this._handleExtremeValues(result);
  }

  getSupportedUnits() {
    const supportedUnits = [];
    Object.keys(this.metricPrefixes).forEach((prefix) => {
      this.baseUnits.forEach((baseUnit) => {
        supportedUnits.push(`${prefix}${baseUnit}`);
      });
    });
    return supportedUnits;
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

  _validateValue(value) {
    if (typeof value !== "number") {
      throw new InvalidValueError("Value must be a number");
    }
  }

  _handleExtremeValues(value) {
    if (value === Infinity || value === -Infinity) {
      return value;
    }

    // Handle extremely large or small numbers that would overflow
    if (Math.abs(value) > 1e308) {
      return value > 0 ? Infinity : -Infinity;
    }

    return value;
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