const FileCompressor = require("./solution.js");

describe("FileCompressor", () => {
  let compressor;

  beforeEach(() => {
    compressor = new FileCompressor();
  });

  test("should compress a string with repeating characters", () => {
    expect(compressor.compress("aaabbc")).toBe("a3b2c1");
    expect(compressor.compress("aaaaabbbbcccdde")).toBe("a5b4c3d2e1");
    expect(compressor.compress("aaaaauuuuuuuccccccccdddddddejjjjjjjjj")).toBe(
      "a5u7c8d7e1j9"
    );
  });

  test("should compress a string with a mix of uppercase and lowercase letters", () => {
    expect(compressor.compress("AAABBBccDDD")).toBe("A3B3c2D3");
  });

  test("should correctly decompress a valid RLE string", () => {
    expect(compressor.decompress("a3b2c1")).toBe("aaabbc");
    expect(compressor.decompress("a5b4c3d2e1")).toBe("aaaaabbbbcccdde");
  });

  test("should correctly decompress a long RLE-encoded string", () => {
    expect(compressor.decompress("a5u7c8d7e1j9")).toBe(
      "aaaaauuuuuuuccccccccdddddddejjjjjjjjj"
    );
  });

  test("should correctly decompress an RLE string with uppercase and lowercase letters", () => {
    expect(compressor.decompress("A3B3c2D3")).toBe("AAABBBccDDD");
  });

  test("should return an empty string when compressing an empty string", () => {
    expect(compressor.compress("")).toBe("");
  });

  test("should return an empty string when decompressing an empty string", () => {
    expect(compressor.decompress("")).toBe("");
  });

  test("should correctly decompress a string with single-character runs", () => {
    expect(compressor.decompress("a1b1c1d1")).toBe("abcd");
  });

  test("should return an empty string for invalid RLE format", () => {
    expect(compressor.decompress("a3b-2c")).toBe("");
  });

  test("should return an empty string for missing number in RLE", () => {
    expect(compressor.decompress("aa11bb")).toBe("");
  });

  test("should return an empty string if the RLE format contains invalid characters", () => {
    expect(compressor.decompress("a3#b4")).toBe("");
  });

  test("should return an empty string if RLE input has no valid characters", () => {
    expect(compressor.decompress("123456")).toBe("");
  });

  test("should correctly handle mixed case input during compression", () => {
    expect(compressor.compress("aaAAbbBBccC")).toBe("a2A2b2B2c2C1");
  });

  test("should correctly handle mixed case input during decompression", () => {
    expect(compressor.decompress("a2A2b2B2c2C1")).toBe("aaAAbbBBccC");
  });
});