const { autoCompleteWords } = require("./solution.js");

describe("AutoCompleteWords Function", () => {
  let autoComplete;

  beforeEach(() => {
    autoComplete = autoCompleteWords();
  });

  test("should insert words and retrieve suggestions correctly", () => {
    autoComplete.insertWord("dog");
    autoComplete.insertWord("door");
    autoComplete.insertWord("dove");
    autoComplete.insertWord("dinosaur");

    expect(autoComplete.getSuggestions("do", 3)).toEqual([
      "dog",
      "door",
      "dove",
    ]);
  });

  test("should return an empty array if no words match the prefix", () => {
    autoComplete.insertWord("alpha");
    autoComplete.insertWord("beta");
    autoComplete.insertWord("gamma");

    expect(autoComplete.getSuggestions("z", 3)).toEqual([]);
  });

  test("should return suggestions sorted lexicographically", () => {
    autoComplete.insertWord("banana");
    autoComplete.insertWord("band");
    autoComplete.insertWord("banner");
    autoComplete.insertWord("bang");

    expect(autoComplete.getSuggestions("ban", 4)).toEqual([
      "banana",
      "band",
      "bang",
      "banner",
    ]);
  });

  test("should allow alphanumeric words", () => {
    autoComplete.insertWord("dev99");
    autoComplete.insertWord("dev1");

    expect(autoComplete.getSuggestions("dev", 5)).toEqual(["dev1", "dev99"]);
  });

  test("should ignore duplicate words during insertion", () => {
    autoComplete.insertWord("apple");
    autoComplete.insertWord("apple");
    autoComplete.insertWord("apple");

    expect(autoComplete.getSuggestions("app", 5)).toEqual(["apple"]);
  });

  test("should remove a word from the trie", () => {
    autoComplete.insertWord("cat");
    autoComplete.insertWord("caterpillar");
    autoComplete.insertWord("castle");

    autoComplete.removeWord("cat");
    expect(autoComplete.getSuggestions("cat", 1)).toEqual(["caterpillar"]);
  });

  test("should throw an error when removing a non-existent word", () => {
    autoComplete.insertWord("table");

    expect(() => autoComplete.removeWord("chair")).toThrow(
      "Word does not exist"
    );
  });

  test("should only remove the specified word without affecting similar words", () => {
    autoComplete.insertWord("mango");
    autoComplete.insertWord("mangrove");
    autoComplete.insertWord("mangosteen");

    autoComplete.removeWord("mango");
    expect(autoComplete.getSuggestions("man", 5)).toEqual([
      "mangosteen",
      "mangrove",
    ]);
  });

  test("should treat words as case-insensitive", () => {
    autoComplete.insertWord("HELLO");
    autoComplete.insertWord("hello");
    autoComplete.insertWord("HeLLo");

    expect(autoComplete.getSuggestions("hel", 5)).toEqual(["hello"]);
  });

  test("should efficiently handle thousands of words", () => {
    const words = Array.from({ length: 1000 }, (_, i) => `word${i}`);
    words.forEach((word) => autoComplete.insertWord(word));

    expect(autoComplete.getSuggestions("word", 10).length).toBe(10);
  });

  test("should return at most 'limit' words in getSuggestions", () => {
    autoComplete.insertWord("car");
    autoComplete.insertWord("carbon");
    autoComplete.insertWord("carrot");
    autoComplete.insertWord("cart");

    expect(autoComplete.getSuggestions("car", 2)).toEqual(["car", "carbon"]);
  });

  test("should return an empty array when limit is 0", () => {
    autoComplete.insertWord("car");
    autoComplete.insertWord("carbon");

    expect(autoComplete.getSuggestions("car", 0)).toEqual([]);
  });

  test("should return an empty array if prefix does not exist", () => {
    autoComplete.insertWord("moon");
    autoComplete.insertWord("mood");

    expect(autoComplete.getSuggestions("sun", 5)).toEqual([]);
  });

  test("should handle special characters correctly", () => {
    autoComplete.insertWord("hello!");
    autoComplete.insertWord("hello-world");

    expect(autoComplete.getSuggestions("hello", 5)).toEqual([
      "hello!",
      "hello-world",
    ]);
  });

  test("should allow words with numbers", () => {
    autoComplete.insertWord("code123");
    autoComplete.insertWord("code456");

    expect(autoComplete.getSuggestions("code", 5)).toEqual([
      "code123",
      "code456",
    ]);
  });
});