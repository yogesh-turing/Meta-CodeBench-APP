const {
  UnitConverter,
  InvalidValueError,
  InvalidUnitError,
  UnitMismatchError,
} = require("./solution");

describe("UnitConverter", () => {
  let converter;

  beforeEach(() => {
    converter = new UnitConverter();
  });

  test("should convert from millimeter to meter", () => {
    expect(converter.convert(1000, "millimeter", "basemeter")).toBe(1);
  });

  test("should convert from kilometer to meter", () => {
    expect(converter.convert(1, "kilometer", "basemeter")).toBe(1000);
  });

  test("should convert from micrometer to millimeter", () => {
    expect(converter.convert(1000, "micrometer", "millimeter")).toBe(1);
  });

  test("should throw InvalidUnitError for invalid unit prefix", () => {
    expect(() => {
      converter.convert(1000, "invalidmeter", "millimeter");
    }).toThrow(InvalidUnitError);
  });

  test("should convert from femtometer to yottameter", () => {
    expect(converter.convert(1e39, "femtometer", "yottameter")).toBe(1);
  });

  test("should convert from picogram to megagram", () => {
    expect(converter.convert(1e15, "picogram", "megagram")).toBe(0.001);
  });

  test("should handle overflow and underflow", () => {
    expect(converter.convert(1e308, "yottameter", "yoctometer")).toBe(Infinity);
    expect(converter.convert(-1e308, "yottameter", "yoctometer")).toBe(
      -Infinity
    );
    expect(converter.convert(1e-308, "yoctometer", "yottameter")).toBe(0);
    expect(converter.convert(1e-25, "yoctometer", "yottameter")).toBe(0);
  });

  test("should handle very small numbers", () => {
    expect(converter.convert(0, "millimeter", "kilometer")).toBe(0);
    expect(converter.convert(1e-21, "millimeter", "kilometer")).toBe(0);
    expect(converter.convert(-1e-21, "millimeter", "kilometer")).toBe(0);
    expect(converter.convert(1e-11, "millimeter", "kilometer")).toBe(0);
  });

  test("should handle special cases", () => {
    expect(converter.convert(1e15, "picogram", "megagram")).toBe(0.001);
    expect(converter.convert(1, "millimeter", "nanometer")).toBe(1000000);
    expect(converter.convert(1e30, "yoctometer", "yottameter")).toBe(1e-18);
    expect(converter.convert(1e-20, "millimeter", "kilometer")).toBe(0);
    expect(converter.convert(1e-15, "millimeter", "megameter")).toBe(0);
  });

  test("should handle extreme prefix differences", () => {
    expect(converter.convert(1e-12, "yoctometer", "yottameter")).toBe(0);
    expect(converter.convert(1e308, "yottameter", "yoctometer")).toBe(Infinity);
    expect(converter.convert(-1e308, "yottameter", "yoctometer")).toBe(
      -Infinity
    );
  });

  test("should throw InvalidUnitError for invalid unit format", () => {
    expect(() => {
      converter.convert(1000, "kilo", "milli");
    }).toThrow(InvalidUnitError);
  });

  test("should throw UnitMismatchError for mismatched base units", () => {
    expect(() => {
      converter.convert(1000, "kilometer", "milligram");
    }).toThrow(UnitMismatchError);
  });

  test("should throw InvalidValueError for non-numeric input", () => {
    expect(() => {
      converter.convert("1000", "kilometer", "meter");
    }).toThrow(InvalidValueError);
  });

  test("should handle floating point precision for very small numbers", () => {
    expect(converter.convert(1e-25, "basemeter", "basemeter")).toBe(0);
    expect(converter.convert(-1e-25, "basemeter", "basemeter")).toBe(0);
  });

  test("should handle floating point precision for very large numbers", () => {
    const result = converter.convert(1e25, "basemeter", "basemeter");
    expect(result).toBe(1e25);
    expect(converter.convert(-1e25, "basemeter", "basemeter")).toBe(-1e25);
  });

  test("should handle normal range numbers", () => {
    expect(converter.convert(1000, "millimeter", "basemeter")).toBe(1);
    expect(converter.convert(1e5, "millimeter", "basemeter")).toBe(100);
  });

  test("should handle special cases with no match", () => {
    expect(converter.convert(1, "millimeter", "centimeter")).toBe(0.1);
    expect(converter.convert(1, "centimeter", "millimeter")).toBe(10);
    expect(converter.convert(1, "millimeter", "basemeter")).toBe(0.001);
  });

  test("should handle invalid unit formats comprehensively", () => {
    expect(() => converter.convert(1, "invalid", "meter")).toThrow(
      InvalidUnitError
    );
    expect(() => converter.convert(1, "meter", "invalid")).toThrow(
      InvalidUnitError
    );
    expect(() => converter.convert(1, "basemeter", "invalidmeter")).toThrow(
      InvalidUnitError
    );
    expect(() => converter.convert(1, "meter", 123)).toThrow(InvalidUnitError);
    expect(() => converter.convert(1, "invalidmeter", "basemeter")).toThrow(
      InvalidUnitError
    );
  });

  test("should validate unit prefixes", () => {
    expect(() => converter.convert(1, "invalidmeter", "basemeter")).toThrow(
      InvalidUnitError
    );
    expect(() => converter.convert(1, "basemeter", "invalidmeter")).toThrow(
      InvalidUnitError
    );
    expect(() => converter.convert(1, "unknownmeter", "basemeter")).toThrow(
      InvalidUnitError
    );
  });

  test("should list all supported units", () => {
    const units = converter.getSupportedUnits();
    expect(units).toContain("femtometer");
    expect(units).toContain("nanogram");
    expect(units).toContain("megaliter");
    expect(units.length).toBe(Object.keys(converter.metricPrefixes).length * 3);
  });

  test("should throw InvalidUnitError for non-string unit", () => {
    expect(() => {
      converter.convert(1000, 123, "millimeter");
    }).toThrow(InvalidUnitError);
  });

  test("should throw InvalidValueError for NaN input", () => {
    expect(() => {
      converter.convert(NaN, "kilometer", "meter");
    }).toThrow(InvalidValueError);
  });

  test("should convert between all base units", () => {
    expect(converter.convert(1, "basemeter", "basemeter")).toBe(1);
    expect(converter.convert(1, "basegram", "basegram")).toBe(1);
    expect(converter.convert(1, "baseliter", "baseliter")).toBe(1);
  });

  test("should convert between extreme prefixes for all base units", () => {
    expect(converter.convert(1, "yoctogram", "yottagram")).toBe(1e-48);
    expect(converter.convert(1, "yoctoliter", "yottaliter")).toBe(1e-48);
  });

  test("should handle precision for various scales", () => {
    expect(converter.convert(1e-5, "millimeter", "nanometer")).toBe(10);
    expect(converter.convert(1e30, "yoctometer", "yottameter")).toBe(1e-18);
  });
});
