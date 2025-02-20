const { getMostFrequentWords } = require("./solution.js");

describe("getMostFrequentWords", () => {
  test("Extracts the most frequent words correctly", () => {
    const result = getMostFrequentWords(
      "apple banana apple orange banana apple",
      2
    );
    expect(result).toEqual([
      { word: "apple", count: 3 },
      { word: "banana", count: 2 },
    ]);
  });

  test("Handles case insensitivity", () => {
    const result = getMostFrequentWords(
      "Hello hello HELLO world WORLD world",
      2
    );
    expect(result).toEqual([
      { word: "hello", count: 3 },
      { word: "world", count: 3 },
    ]);
  });

  test("Removes punctuation correctly", () => {
    const result = getMostFrequentWords("Hello, world! Hello. Hello?", 1);
    expect(result).toEqual([{ word: "hello", count: 3 }]);
  });

  test("Handles extra spaces and newlines", () => {
    const result = getMostFrequentWords(
      "   spaced   out   words   \n\n spaced \t out",
      2
    );
    expect(result).toEqual([
      { word: "spaced", count: 2 },
      { word: "out", count: 2 },
    ]);
  });

  test("Returns an empty array for empty input", () => {
    const result = getMostFrequentWords("", 3);
    expect(result).toEqual([]);
  });

  test("Handles single word input correctly", () => {
    const result = getMostFrequentWords("SingleWord", 3);
    expect(result).toEqual([{ word: "singleword", count: 1 }]);
  });

  test("Handles N larger than unique words count", () => {
    const result = getMostFrequentWords("one two two three three three", 5);
    expect(result).toEqual([
      { word: "three", count: 3 },
      { word: "two", count: 2 },
      { word: "one", count: 1 },
    ]);
  });

  test("Handles large text input efficiently", () => {
    const text = "test ".repeat(10000) + "word ".repeat(5000);
    const result = getMostFrequentWords(text, 2);
    expect(result).toEqual([
      { word: "test", count: 10000 },
      { word: "word", count: 5000 },
    ]);
  });

  test("Handles hyphenated words by removing hyphens", () => {
    const result = getMostFrequentWords(
      "State-of-the-art product. State-of-the-art.",
      2
    );
    // After normalization: "stateoftheart product stateoftheart"
    expect(result).toEqual([
      { word: "stateoftheart", count: 2 },
      { word: "product", count: 1 },
    ]);
  });

  test("Returns empty array for input with only punctuation", () => {
    const result = getMostFrequentWords("!!!???,.", 1);
    expect(result).toEqual([]);
  });

  test("Handles numeric strings as words", () => {
    const result = getMostFrequentWords("123 456 123 789 456 123", 2);
    expect(result).toEqual([
      { word: "123", count: 3 },
      { word: "456", count: 2 },
    ]);
  });

  test("Removes apostrophes correctly", () => {
    const result = getMostFrequentWords("Don't stop believing, don't stop!", 1);
    // Normalized: "dont stop believing dont stop"
    // "dont": 2 (lastOccurrence index 3), "stop": 2 (lastOccurrence index 4)
    // Tie-breaker yields "dont" before "stop"
    expect(result).toEqual([{ word: "dont", count: 2 }]);
  });

  // Additional Test Cases

  test("Handles underscores in words", () => {
    const result = getMostFrequentWords("my_var my_var myvar", 2);
    // "my_var" remains intact because underscores are word characters.
    expect(result).toEqual([
      { word: "my_var", count: 2 },
      { word: "myvar", count: 1 },
    ]);
  });

  test("Handles mixed whitespace with ties", () => {
    const result = getMostFrequentWords("a\tb  c\nd e", 3);
    // Words: ["a", "b", "c", "d", "e"] (all count 1).
    // Tie-breaker by lastOccurrence (which equals their index) gives: a, b, c.
    expect(result).toEqual([
      { word: "a", count: 1 },
      { word: "b", count: 1 },
      { word: "c", count: 1 },
    ]);
  });

  test("Handles punctuation in the middle of words", () => {
    const result = getMostFrequentWords("co-operate re-enter co-operate", 1);
    // Normalized: "cooperate reenter cooperate"
    // Frequencies: "cooperate": 2, "reenter": 1.
    expect(result).toEqual([{ word: "cooperate", count: 2 }]);
  });
});
