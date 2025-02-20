const { createCircuitComponents, CircuitAnalyzer } = require("./solution");

const { Component, Circuit } = createCircuitComponents();

describe("Component", () => {
  test("should create component with default type", () => {
    const component = new Component(10);
    expect(component.type).toBe("resistor");
    expect(component.resistance).toBe(10);
  });

  test("should create component with custom type", () => {
    const component = new Component(10, "capacitor");
    expect(component.type).toBe("capacitor");
    expect(component.resistance).toBe(10);
  });

  test("should throw error for non-numeric resistance", () => {
    expect(() => new Component("10")).toThrow();
    expect(() => new Component(undefined)).toThrow();
    expect(() => new Component(null)).toThrow();
    expect(() => new Component(-1)).toThrow();
    expect(() => new Component(0)).toThrow();
  });
});

describe("Circuit", () => {
  test("should create circuit with default values", () => {
    const circuit = new Circuit();
    expect(circuit.type).toBe("series");
    expect(circuit.components).toEqual([]);
  });

  test("should create circuit with custom values", () => {
    const components = [new Component(10)];
    const circuit = new Circuit(components, "parallel");
    expect(circuit.type).toBe("parallel");
    expect(circuit.components).toBe(components);
  });

  test("should throw error for invalid circuit type", () => {
    expect(() => new Circuit([], "invalid")).toThrow();
    expect(() => new Circuit([], "")).toThrow();
    expect(() => new Circuit([], null)).toThrow();
  });

  test("should handle nested circuit resistance calculations", () => {
    const innerCircuit = new Circuit([new Component(10)], "series");
    const outerCircuit = new Circuit([innerCircuit], "series");
    expect(outerCircuit.calculateTotalResistance()).toBe(10);
  });

  test("should handle nested parallel circuit resistance calculations", () => {
    const innerCircuit = new Circuit([new Component(20)], "parallel");
    const outerCircuit = new Circuit([innerCircuit], "parallel");
    expect(outerCircuit.calculateTotalResistance()).toBe(20);
  });

  test("should handle mixed nested circuit resistance calculations", () => {
    const innerParallel = new Circuit(
      [new Component(20), new Component(20)],
      "parallel"
    );
    const outerSeries = new Circuit(
      [new Component(10), innerParallel],
      "series"
    );
    expect(outerSeries.calculateTotalResistance()).toBe(20); // 10 + (1/(1/20 + 1/20)) = 10 + 10
  });
});

describe("Enhanced CircuitAnalyzer", () => {
  let analyzer;
  let circuitComponents;

  beforeEach(() => {
    circuitComponents = createCircuitComponents();
    analyzer = new CircuitAnalyzer(circuitComponents);
  });

  test("should handle series circuit calculations", () => {
    const circuit = analyzer.createCircuit("series");
    analyzer.setMainCircuit(circuit);
    analyzer.addComponent(10);
    analyzer.addComponent(20);
    expect(analyzer.calculateTotalResistance()).toBe(30);
    expect(analyzer.calculateCurrent(60)).toBe(2);
  });

  test("should handle parallel circuit calculations", () => {
    const circuit = analyzer.createCircuit("parallel");
    analyzer.setMainCircuit(circuit);
    analyzer.addComponent(10);
    analyzer.addComponent(20);
    // 1/R_total = 1/10 + 1/20 = 3/20, so R_total = 6.666...
    expect(analyzer.calculateTotalResistance()).toBeCloseTo(6.67, 2);
  });

  test("should handle nested circuits", () => {
    const mainCircuit = analyzer.createCircuit("series");
    const parallelSection = analyzer.createCircuit("parallel");

    // Add components to parallel section
    analyzer.addComponent(20, "resistor", parallelSection);
    analyzer.addComponent(20, "resistor", parallelSection);
    // Parallel section total resistance = 10Ω

    // Create main circuit
    analyzer.setMainCircuit(mainCircuit);
    analyzer.addComponent(10); // First resistor in series
    mainCircuit.addComponent(parallelSection); // Add parallel section
    analyzer.addComponent(10); // Last resistor in series

    // Total resistance should be 10 + 10 + 10 = 30Ω
    expect(analyzer.calculateTotalResistance()).toBe(30);
  });

  test("should calculate voltage distribution correctly", () => {
    const mainCircuit = analyzer.createCircuit("series");
    analyzer.setMainCircuit(mainCircuit);
    analyzer.addComponent(10);
    analyzer.addComponent(20);

    const distribution = analyzer.calculateVoltageDistribution(60);
    expect(distribution).toHaveLength(2);
    expect(distribution[0].voltage).toBe(20); // 2A * 10Ω
    expect(distribution[1].voltage).toBe(40); // 2A * 20Ω
  });

  test("should calculate power", () => {
    const circuit = analyzer.createCircuit("series");
    analyzer.setMainCircuit(circuit);
    analyzer.addComponent(10);
    analyzer.addComponent(10);
    // With 20V: I = 20V/20Ω = 1A, P = 20V * 1A = 20W
    expect(analyzer.calculatePower(20)).toBe(20);
  });

  test("should handle different component types", () => {
    const circuit = analyzer.createCircuit("series");
    analyzer.setMainCircuit(circuit);
    analyzer.addComponent(10, "resistor");
    analyzer.addComponent(20, "potentiometer");

    const distribution = analyzer.calculateVoltageDistribution(60);
    expect(distribution[0].type).toBe("resistor");
    expect(distribution[1].type).toBe("potentiometer");
  });

  test("should handle complex nested circuit configurations", () => {
    const mainCircuit = analyzer.createCircuit("series");
    const parallelSection1 = analyzer.createCircuit("parallel");
    const parallelSection2 = analyzer.createCircuit("parallel");
    const innerSeries = analyzer.createCircuit("series");

    // Build inner series circuit
    analyzer.addComponent(5, "resistor", innerSeries);
    analyzer.addComponent(5, "resistor", innerSeries);

    // Add components to first parallel section
    analyzer.addComponent(20, "resistor", parallelSection1);
    parallelSection1.addComponent(innerSeries);

    // Add components to second parallel section
    analyzer.addComponent(30, "resistor", parallelSection2);
    analyzer.addComponent(30, "resistor", parallelSection2);

    // Build main circuit
    analyzer.setMainCircuit(mainCircuit);
    analyzer.addComponent(10); // First resistor in series
    mainCircuit.addComponent(parallelSection1);
    mainCircuit.addComponent(parallelSection2);

    // Recalculated resistance:
    // First resistor: 10Ω
    // Parallel section 1: 1/(1/20 + 1/10) = 6.67Ω
    // Parallel section 2: 1/(1/30 + 1/30) = 15Ω
    // Total = 10 + 6.67 + 15 = 31.67Ω
    const totalResistance = analyzer.calculateTotalResistance();
    expect(totalResistance).toBeCloseTo(31.67, 2);

    const distribution = analyzer.calculateVoltageDistribution(70);
    expect(distribution.length).toBeGreaterThan(5);
  });

  test("should throw error for invalid circuit type", () => {
    expect(() => analyzer.createCircuit("invalid")).toThrow();
  });

  test("should handle empty circuit", () => {
    expect(analyzer.calculateTotalResistance()).toBe(0);
    expect(analyzer.calculateCurrent(10)).toBe(0);
    expect(analyzer.calculatePower(10)).toBe(0);
    expect(analyzer.calculateVoltageDistribution(10)).toEqual([]);
  });

  test("should throw error for invalid voltage", () => {
    const circuit = analyzer.createCircuit("series");
    analyzer.setMainCircuit(circuit);
    analyzer.addComponent(10);
    expect(() => analyzer.calculateCurrent(-1)).toThrow();
    expect(() => analyzer.calculateCurrent("invalid")).toThrow();
    expect(() => analyzer.calculateCurrent(null)).toThrow();
  });

  test("should throw error for invalid resistance", () => {
    expect(() => analyzer.addComponent(-1)).toThrow();
    expect(() => analyzer.addComponent(0)).toThrow();
    expect(() => analyzer.addComponent("invalid")).toThrow();
    expect(() => analyzer.addComponent(null)).toThrow();
    expect(() => analyzer.addComponent(undefined)).toThrow();
  });

  test("should handle voltage distribution in parallel circuits", () => {
    const circuit = analyzer.createCircuit("parallel");
    analyzer.setMainCircuit(circuit);
    analyzer.addComponent(10);
    analyzer.addComponent(20);

    const distribution = analyzer.calculateVoltageDistribution(60);
    expect(distribution).toHaveLength(2);
    // In parallel circuits, voltage is the same across all components
    expect(distribution[0].voltage).toBe(60);
    expect(distribution[1].voltage).toBe(60);
  });

  test("should handle voltage distribution in nested parallel-series circuits", () => {
    const mainCircuit = analyzer.createCircuit("parallel");
    const seriesSection = analyzer.createCircuit("series");

    analyzer.addComponent(10, "resistor", seriesSection);
    analyzer.addComponent(10, "resistor", seriesSection);

    analyzer.setMainCircuit(mainCircuit);
    analyzer.addComponent(20);
    mainCircuit.addComponent(seriesSection);

    const distribution = analyzer.calculateVoltageDistribution(60);
    expect(distribution).toHaveLength(3);
    expect(distribution[0].voltage).toBe(60); // Parallel branch with 20Ω
    expect(distribution[1].voltage).toBe(60); // Total voltage across series section
    expect(distribution[2].voltage).toBe(60); // Total voltage across series section
  });

  test("should handle circuit creation without type parameter", () => {
    const circuit = analyzer.createCircuit();
    expect(circuit.type).toBe("series"); // Default type
  });

  test("should handle component addition without circuit parameter", () => {
    analyzer.addComponent(10);
    expect(analyzer.calculateTotalResistance()).toBe(10);
  });

  test("should handle clear operation", () => {
    analyzer.addComponent(10);
    expect(analyzer.calculateTotalResistance()).toBe(10);
    analyzer.clear();
    expect(analyzer.calculateTotalResistance()).toBe(0);
    expect(analyzer.calculateCurrent(10)).toBe(0);
  });

  test("should handle empty parallel circuit", () => {
    const circuit = analyzer.createCircuit("parallel");
    analyzer.setMainCircuit(circuit);
    expect(analyzer.calculateTotalResistance()).toBe(0);
  });

  test("should handle single component parallel circuit", () => {
    const circuit = analyzer.createCircuit("parallel");
    analyzer.setMainCircuit(circuit);
    analyzer.addComponent(10);
    expect(analyzer.calculateTotalResistance()).toBe(10);
  });

  test("should handle voltage distribution with zero resistance", () => {
    const mainCircuit = analyzer.createCircuit("parallel");
    analyzer.setMainCircuit(mainCircuit);
    expect(analyzer.calculateVoltageDistribution(60)).toEqual([]);
  });

  test("should handle nested empty circuits", () => {
    const mainCircuit = analyzer.createCircuit("series");
    const nestedCircuit = analyzer.createCircuit("parallel");
    analyzer.setMainCircuit(mainCircuit);
    mainCircuit.addComponent(nestedCircuit);
    expect(analyzer.calculateTotalResistance()).toBe(0);
  });

  test("should create component with default type", () => {
    const circuit = analyzer.createCircuit();
    analyzer.addComponent(10); // This will use default type 'resistor'
    const distribution = analyzer.calculateVoltageDistribution(10);
    expect(distribution[0].type).toBe("resistor");
  });

  test("should create component with custom type", () => {
    const circuit = analyzer.createCircuit();
    analyzer.addComponent(10, "capacitor");
    const distribution = analyzer.calculateVoltageDistribution(10);
    expect(distribution[0].type).toBe("capacitor");
  });

  test("should create circuit with empty components array", () => {
    const circuit = analyzer.createCircuit("series");
    expect(circuit.components).toEqual([]);
  });

  test("should create circuit with provided components array", () => {
    const components = [{ resistance: 10, type: "resistor" }];
    const circuit = new circuitComponents.Circuit(components, "series");
    expect(circuit.components).toBe(components);
  });

  test("should handle voltage distribution in complex nested circuits", () => {
    const mainCircuit = analyzer.createCircuit("series");
    const parallelSection = analyzer.createCircuit("parallel");
    const innerSeries = analyzer.createCircuit("series");

    // Build inner series circuit
    analyzer.addComponent(10, "resistor", innerSeries);
    analyzer.addComponent(10, "resistor", innerSeries);

    // Add to parallel section
    analyzer.addComponent(20, "resistor", parallelSection);
    parallelSection.addComponent(innerSeries);

    // Build main circuit
    analyzer.setMainCircuit(mainCircuit);
    analyzer.addComponent(10);
    mainCircuit.addComponent(parallelSection);

    const distribution = analyzer.calculateVoltageDistribution(60);
    expect(distribution.length).toBeGreaterThan(3);

    // Verify nested circuit voltage distributions
    const totalResistance = analyzer.calculateTotalResistance();
    const current = 60 / totalResistance;
    const parallelVoltage =
      current * parallelSection.calculateTotalResistance();

    // Find voltages for parallel section components
    const parallelComponents = distribution.filter(
      (d) => d.voltage === parallelVoltage
    );
    expect(parallelComponents.length).toBeGreaterThan(0);
  });

  test("should handle voltage distribution with nested empty parallel circuit", () => {
    const mainCircuit = analyzer.createCircuit("series");
    const emptyParallel = analyzer.createCircuit("parallel");
    analyzer.setMainCircuit(mainCircuit);
    analyzer.addComponent(10);
    mainCircuit.addComponent(emptyParallel);

    const distribution = analyzer.calculateVoltageDistribution(60);
    expect(distribution.length).toBe(1); // Only the series component should have voltage
  });

  test("should handle voltage distribution with nested circuits having zero resistance", () => {
    const mainCircuit = analyzer.createCircuit("series");
    const parallelSection = analyzer.createCircuit("parallel");
    const emptyInnerSeries = analyzer.createCircuit("series");

    parallelSection.addComponent(emptyInnerSeries);
    mainCircuit.addComponent(parallelSection);
    analyzer.setMainCircuit(mainCircuit);

    const distribution = analyzer.calculateVoltageDistribution(60);
    expect(distribution).toEqual([]);
  });
});
