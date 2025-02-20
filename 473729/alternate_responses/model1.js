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
      yocto: 1e-24
    };

    this.baseUnits = ['meter', 'gram', 'liter'];
  }

  convert(value, fromUnit, toUnit) {
    // Validate numeric value
    if (typeof value !== 'number' || isNaN(value)) {
      throw new InvalidValueError('Value must be a valid number');
    }

    // Parse units
    const [fromPrefix, fromBase] = this._parseUnit(fromUnit);
    const [toPrefix, toBase] = this._parseUnit(toUnit);

    // Validate matching base units
    if (fromBase !== toBase) {
      throw new UnitMismatchError(`Cannot convert between different base units: ${fromBase} and ${toBase}`);
    }

    // Get conversion factors
    const fromFactor = this.metricPrefixes[fromPrefix];
    const toFactor = this.metricPrefixes[toPrefix];

    // Handle very small numbers
    if (Math.abs(value) < 1e-20 || 
        (Math.abs(value) < 1e-10 && fromFactor < toFactor)) {
      return 0;
    }

    // Calculate conversion with handling for extreme values
    try {
      const baseValue = value * fromFactor;
      const result = baseValue / toFactor;

      // Handle overflow cases
      if (!Number.isFinite(baseValue) || !Number.isFinite(result)) {
        return baseValue > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
      }

      // Handle floating-point precision
      return Number.parseFloat(result.toPrecision(15));
    } catch (error) {
      throw new Error('Conversion calculation error: ' + error.message);
    }
  }

  _parseUnit(unit) {
    if (typeof unit !== 'string') {
      throw new InvalidUnitError('Unit must be a string');
    }

    const prefixes = Object.keys(this.metricPrefixes).join('|');
    const baseUnits = this.baseUnits.join('|');
    const regex = new RegExp(`^(${prefixes})(${baseUnits})$`);
    const match = unit.toLowerCase().match(regex);

    if (!match) {
      throw new InvalidUnitError(
        `Invalid unit format. Must be in format: [prefix][baseunit]. Example: kilometer`
      );
    }

    return [match[1], match[2]];
  }

  getSupportedUnits() {
    const units = [];
    for (const prefix of Object.keys(this.metricPrefixes)) {
      for (const baseUnit of this.baseUnits) {
        if (prefix === 'base') {
          units.push(baseUnit);
        } else {
          units.push(prefix + baseUnit);
        }
      }
    }
    return units.sort();
  }
}

class InvalidValueError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidValueError';
  }
}

class InvalidUnitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidUnitError';
  }
}

class UnitMismatchError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnitMismatchError';
  }
}

module.exports = { UnitConverter, InvalidUnitError, UnitMismatchError, InvalidValueError };