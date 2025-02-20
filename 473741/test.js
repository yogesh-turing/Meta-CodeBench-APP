const {processData} = require("./solution");

describe("processData function", () => {
  test("Handles negative numbers correctly with the minus sign at the beginning", () => {
    expect(processData([-120, -450, -9])).toEqual("-021|-054|-9");
  });

  test("Handles positive floats with multi-digit integer parts", () => {
    expect(processData([89.002])).toEqual("98.200");
  });

  test("Handles positive floats with single-digit integer part", () => {
    expect(processData([8.002])).toEqual("8.200");
  });

  test("Handles positive floats with single-digit integer part", () => {
    expect(processData([0.45])).toEqual("0.54");
  });

  test("Handles negative floats correctly", () => {
    expect(processData([-78.910])).toEqual("-87.019");
  });

  test("Preserves leading zeros for integers with trailing zeros", () => {
    expect(processData([1000, 20500])).toEqual("0001|00502");
  });

  test("Returns 'INVALID' for NaN, Infinity, and -Infinity", () => {
    expect(processData([NaN, Infinity, -Infinity])).toEqual("INVALID|INVALID|INVALID");
  });

  test("Handles BigInt values correctly without converting them to regular numbers", () => {
    expect(processData([9876543210123456789n])).toEqual("9876543210123456789");
  });

  test("Handles single-digit numbers correctly", () => {
    expect(processData([5, 9, 0])).toEqual("5|9|0");
  });

  test("Handles mixed formatting for floats and integers", () => {
    expect(processData([123.450, -0.012, 400.600])).toEqual("321.054|-0.210|004.006");
  });

  test("Handles a mixed array with valid and invalid numbers", () => {
    expect(processData([-123, 456, 0.450, NaN, Infinity, -78.910, 9876543210123456789n]))
      .toEqual("-321|654|0.54|INVALID|INVALID|-87.019|9876543210123456789");
  });

  test("Handles numbers just below MAX_SAFE_INTEGER", () => {
    expect(processData([Number.MAX_SAFE_INTEGER])).toEqual("1990474529917009");
  });

  test("Handles BigInt numbers beyond MAX_SAFE_INTEGER", () => {
    expect(processData([9007199254740993n])).toEqual("3990474529917009");
  });
});