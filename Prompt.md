Base Code:
```javascript
const extractDeepKeys = (input, maxDepth, currentDepth = 0, visited = new WeakSet()) => {
  const extractedKeys = [];

  if (currentDepth > maxDepth || typeof input !== "object" || input === null) {
    return extractedKeys;
  }

  if (visited.has(input)) {
    throw new Error("Circular reference detected");
  }
  visited.add(input);

  for (const key in input) {
    extractedKeys.push(key);
    extractDeepKeys(input[key], maxDepth, currentDepth + 1, visited);
  }

  return extractedKeys;
};

module.exports = { extractDeepKeys };
```

Prompt:
The function "extractDeepKeys" should recursively extract all unique keys from a deeply nested object structure, ensuring that the traversal respects a `maxDepth` parameter and avoids cyclic references.

For the `input` parameter:  
* The function must detect and prevent circular references (i.e., objects referencing themselves) and throw an error with the message "Circular reference detected".
* The function must handle non*object values properly by ignoring them.
* If the input is null, undefined, a string, or a number, throw an error with the message "Invalid input encountered".
* The input should only accept objects and arrays.

For the `maxDepth` parameter:  
* If `maxDepth = 0`, return an empty array.  
* For other values of `maxDepth`, extract all keys up to and including that depth.  
* Default `maxDepth` should be Infinity.  
* `maxDepth` should be a non*negative integer.

Constraints:
* The function must handle extremely deep nested structures efficiently (test cases may include 1000+ depth levels).  
* The function must be optimized for large object graphs (objects with millions of keys should not crash or freeze execution).  
* Performance must be O(n) where `n` is the total number of keys in the object (or fail if it does not meet this criterion).  
* The function must not mutate the original input object.

Example Usage:
extractDeepKeys({
    user: {
        id: 123,
        profile: {
            name: "Alice",
            details: {
                age: 25,
                address: { city: "NYC", zip: "10001" }
            }
        }
    }
})

Expected Output:
["user", "id", "profile", "name", "details", "age", "address", "city", "zip"]

Example Usage (with maxDepth 1):
extractDeepKeys({
    user: {
        id: 123,
        profile: {
            name: "Alice",
            details: {
                age: 25,
                address: { city: "NYC", zip: "10001" }
            }
        }
    }
}, 1)

Expected Output:
["user", "id", "profile"]

Example Usage (with circular reference)
const obj = { a: { b: { c: {} } } };
obj.a.b.c = obj;

extractDeepKeys(obj);

Expected Output
Error: "Circular reference detected"