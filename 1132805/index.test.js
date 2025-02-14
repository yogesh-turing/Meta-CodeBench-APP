const { extractDeepKeys } = require('./alternate_responses/model7'); // Replace functionNames with the correct function(s)

describe('functionNames', () => {
    test("should extract keys from a simple object", () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(extractDeepKeys(obj)).toEqual(["a", "b", "c"]);
    });

    test("should extract keys up to maxDepth", () => {
        const obj = { a: { b: { c: { d: 1 } } } };
        expect(extractDeepKeys(obj, 2)).toEqual(["a", "b"]);
    });

    test("should extract all keys when maxDepth is Infinity", () => {
        const obj = { a: { b: { c: { d: 1 } } } };
        expect(extractDeepKeys(obj, Infinity)).toEqual(["a", "b", "c", "d"]);
    });

    test("should return an empty array when maxDepth is 0", () => {
        const obj = { a: 1, b: { c: 2 } };
        expect(extractDeepKeys(obj, 0)).toEqual([]);
    });

    test("should return an empty array for an empty object", () => {
        expect(extractDeepKeys({})).toEqual([]);
    });

    test("should extract keys from objects with mixed types", () => {
        const obj = { a: { b: 1 }, c: "text", d: null, e: undefined, f: true };
        expect(extractDeepKeys(obj)).toEqual(["a", "b", "c", "d", "e", "f"]);
    });

    test("should handle objects with arrays and extract only object keys", () => {
        const obj = { a: [1, 2, { b: 3 }] };
        expect(extractDeepKeys(obj)).toEqual(["a", "b"]);
    });

    test("should throw an error for invalid inputs", () => {
        expect(() => extractDeepKeys(null)).toThrow("Invalid input encountered");
        expect(() => extractDeepKeys(undefined)).toThrow("Invalid input encountered");
        expect(() => extractDeepKeys(42)).toThrow("Invalid input encountered");
        expect(() => extractDeepKeys("string")).toThrow("Invalid input encountered");
    });

    test("should throw an error if maxDepth is negative", () => {
        expect(() => extractDeepKeys({ a: 1 }, -1)).toThrow("maxDepth must be a non-negative integer");
    });

    test("should throw an error if maxDepth is not an integer", () => {
        expect(() => extractDeepKeys({ a: 1 }, 2.5)).toThrow("maxDepth must be a non-negative integer");
        expect(() => extractDeepKeys({ a: 1 }, "3")).toThrow("maxDepth must be a non-negative integer");
    });

    test("should throw an error for circular references", () => {
        const obj = {};
        obj.self = obj;
        expect(() => extractDeepKeys(obj)).toThrow("Circular reference detected");
    });

    test("should handle deeply nested structures (1000+ levels)", () => {
        const deepObject = {};
        let current = deepObject;
        for (let i = 0; i < 1000; i++) {
            current["key" + i] = {};
            current = current["key" + i];
        }
        expect(() => extractDeepKeys(deepObject, Infinity)).not.toThrow();
    });

    test("should handle large object graphs efficiently", () => {
        const largeObject = {};
        for (let i = 0; i < 1000000; i++) {
            largeObject["key" + i] = i;
        }
        expect(() => extractDeepKeys(largeObject, Infinity)).not.toThrow();
    });

});