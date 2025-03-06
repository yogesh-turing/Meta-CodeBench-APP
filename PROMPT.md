Base Code:
```javascript
function createAutocompleteManager(entries) {
  let data = entries;

  return {
    search(prefix) {
      const lower = prefix.toLowerCase();

      return data.filter(entry => {
        return entry.toLowerCase().includes(lower);
      }).slice(0, 5);
    },

    addEntry(item) {
      data.push(item);
    },

    removeEntry(item) {
      const idx = data.indexOf(item);
      data.splice(idx, 1);
    }
  };
}
module.exports = { createAutocompleteManager };
```


Stack Trace:
```javascript
createAutocompleteManager (Multi-Word Autocomplete)
    ✓ returns matching entries where any word starts with prefix (case-insensitive) (1 ms)
    ✓ does not match if prefix only appears mid-word
    ✓ limits results to 5 if more than 5 matches exist
    ✕ handles prefix that is not a string by returning empty array or throwing error
    ✓ addEntry() allows adding new multi-word entries (1 ms)
    ✕ removeEntry() does not splice the last entry if item is not found (3 ms)
    ✓ removeEntry() actually removes the exact entry
    ✕ verifies partial matching is on word boundaries, not mid-word (1 ms)
    ✓ multi-word entries: searching 'apple' matches both 'apple banana' and 'apple sauce'
    ✓ case-insensitive search for 'BAN'

  ● createAutocompleteManager (Multi-Word Autocomplete) › handles prefix that is not a string by returning empty array or throwing error

    TypeError: prefix.toLowerCase is not a function

      4 |   return {
      5 |     search(prefix) {
    > 6 |       const lower = prefix.toLowerCase();
        |                            ^
      7 |
      8 |       return data.filter(entry => {
      9 |         return entry.toLowerCase().includes(lower);

      at Object.toLowerCase [as search] (task9/solution.js:6:28)
      at Object.search (task9/index.test.js:49:29)

  ● createAutocompleteManager (Multi-Word Autocomplete) › removeEntry() does not splice the last entry if item is not found

    expect(received).toBe(expected) // Object.is equality

    Expected: 5
    Received: 4

      67 |     // The original 5 should still exist
      68 |     const afterRemoval = manager.search("");
    > 69 |     expect(afterRemoval.length).toBe(5);
         |                                 ^
      70 |   });
      71 |
      72 |   test("removeEntry() actually removes the exact entry", () => {

      at Object.toBe (task9/index.test.js:69:33)

  ● createAutocompleteManager (Multi-Word Autocomplete) › verifies partial matching is on word boundaries, not mid-word

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 5

    - Array []
    + Array [
    +   "apple banana",
    +   "apple sauce",
    +   "apple pie",
    + ]

      80 |     // "apple banana" has "apple" and "banana"
      81 |     // Searching "ple" or "ana" in the middle of "apple"/"banana" is not a match
    > 82 |     expect(manager.search("ple")).toEqual([]);
         |                                   ^
      83 |     expect(manager.search("ana")).toEqual([]);
      84 |   });
      85 |

      at Object.toEqual (task9/index.test.js:82:35)

Test Suites: 1 failed, 1 total
Tests:       3 failed, 7 passed, 10 total
Snapshots:   0 total
Time:        0.255 s, estimated 1 s
```

Prompt:
The `createAutocompleteManager` function aims to support multi-word entries (e.g., `"apple banana"`) and provide partial matching where searchTerm only needs to match the start of any word in the entry. For instance:

- Entry `"apple banana"` should match prefix `"ban"` because the second word, `"banana"`, starts with `"ban"`.  
- It should not match prefix `"ann"` just because `"ann"` appears in the middle of `"banana"`; it must be at the start of a word.  
- Case-insensitive matches are required, so `"Ban"` or `"BAN"` should still match `"banana"`.  
- Only the first five matches should be returned, ignoring duplicates or entries that appear in the manager multiple times (optional requirement).  


### Example usage:
```javascript
const items = [
  "apple banana",
  "carrot bean",
  "apple sauce",
  "banana bread",
  "apple pie"
];

const manager = createAutocompleteManager(items);

console.log(manager.search("ban")); 
```
However, the base code contains several bugs:
1. If `prefix` is not a string, calling `prefix.toLowerCase()` results in a TypeError.  
2. The logic uses `includes(lower)` for the entire entry, incorrectly matching substrings in the middle of words.  
3. No checks for duplicates or invalid (non-string) entries in `addEntry`.  
4. Removal uses `indexOf(item)`; if not found, it returns `-1`, causing an unintended splice on the last element.  

Please fix all the above issues.