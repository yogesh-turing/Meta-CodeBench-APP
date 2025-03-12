const { getWordCloud, transformStructure } = require(process.env.TARGET_FILE);
// const { getWordCloud, transformStructure } = require('./model_b');
describe("transformStructure", () => {
  test("valid Json Structure input with hashtags appearing more than one times in hashtag list", () => {
    const input = [
      { id: 1, hashtags: ["A", "B", "C", "C"] },
      { id: 2, hashtags: ["D", "E", "F", "F"] },
      { id: 3, hashtags: ["G", "H", "I"] },
    ];
    const expectedOutput = [
      { id: 1, hashtags: ["A", "B"] },
      { id: 2, hashtags: ["D", "E"] },
      { id: 3, hashtags: ["G", "H", "I"] },
      { id: 4, hashtags: ["C", "C", "F", "F"] },
    ];

    console.log(transformStructure(input), "tranform");
    expect(transformStructure(input)).toEqual(expectedOutput);
  });

  test("valid Json Structure input with hashtags appearing exactly one time", () => {
    const input = [
      { id: 1, hashtags: ["A", "B"] },
      { id: 2, hashtags: ["C", "D"] },
    ];
    const expectedOutput = input; // No changes expected
    expect(transformStructure(input)).toEqual(expectedOutput);
  });

  test("invalid JSON structure with record id not incremented by 1", () => {
    const input = [
      { id: 1, hashtags: ["A", "B"] },
      { id: 21, hashtags: ["C", "D"] },
    ];

    expect(() => transformStructure(input)).toThrow("Invalid Json Structure");
  });

  test("invalid JSON structure with record id as string", () => {
    const input = [{ id: "1", hashtags: ["A", "B"] }];
    expect(() => transformStructure(input)).toThrow("Invalid Json Structure");
  });

  test("invalid JSON structure with hastag not as list", () => {
    const input = [{ id: "1", hashtags: {} }];
    expect(() => transformStructure(input)).toThrow("Invalid Json Structure");
  });

  test("invalid JSON structure with hastag list not having string type values", () => {
    const input = [{ id: "1", hashtags: [1, 1] }];
    expect(() => transformStructure(input)).toThrow("Invalid Json Structure");
  });

  test("invalid JSON structure with empty json structure", () => {
    const input = [];
    expect(() => transformStructure(input)).toThrow("Invalid Json Structure");
  });
});

describe("getWordCloud", () => {
  test("valid input with valid hashtag string input", () => {
    const jsonStructure = [
      { id: 1, hashtags: ["A", "B", "C", "C"] },
      { id: 2, hashtags: ["D", "E", "F", "F"] },
      { id: 3, hashtags: ["G", "H", "I"] },
    ];
    const hashtags = "#A#L#C";
    const expectedOutput = [
      ["A", 1],
      ["C", 2],
      ["L", 0],
    ];
    console.log(getWordCloud(hashtags, jsonStructure), "structure");
    expect(getWordCloud(hashtags, jsonStructure)).toEqual(expectedOutput);
  });

  test("valid input with valid hashtag string input and having same hashtags in multiple records", () => {
    const jsonStructure = [
      { id: 1, hashtags: ["A", "B", "C", "C"] },
      { id: 2, hashtags: ["A", "D", "E", "F", "F"] },
      { id: 3, hashtags: ["G", "H", "I", "C"] },
    ];
    const hashtags = "#A#L#C";
    const expectedOutput = [
      ["A", 2],
      ["C", 3],
      ["L", 0],
    ];
    console.log(getWordCloud(hashtags, jsonStructure), "structure");
    expect(getWordCloud(hashtags, jsonStructure)).toEqual(expectedOutput);
  });

  test("invalid hashtags string having character other than #", () => {
    const jsonStructure = [];
    const hashtags = "#A#B#C?D#";
    expect(() => getWordCloud(hashtags, jsonStructure)).toThrow(
      "Not a hashtags string"
    );
  });

  test("invalid JSON structure with record id as string", () => {
    const input = [{ id: "1", hashtags: ["A", "B"] }];
    expect(() => transformStructure(input)).toThrow("Invalid Json Structure");
  });

  test("invalid JSON structure with hastag not as list", () => {
    const input = [{ id: "1", hashtags: {} }];
    expect(() => transformStructure(input)).toThrow("Invalid Json Structure");
  });

  test("invalid JSON structure with hastag list not having string type values", () => {
    const input = [{ id: "1", hashtags: [1, 1] }];
    expect(() => transformStructure(input)).toThrow("Invalid Json Structure");
  });

  test("invalid JSON structure with empty json structure", () => {
    const input = [];
    expect(() => transformStructure(input)).toThrow("Invalid Json Structure");
  });

  test("invalid JSON structure with multiple records having the same id", () => {
    const input = [
      { id: 1, hashtags: ["A", "B"] },
      { id: 1, hashtags: ["C", "D"] },
    ];
    expect(() => transformStructure(input)).toThrow(
      "Multiple Records with same id"
    );
  });
});