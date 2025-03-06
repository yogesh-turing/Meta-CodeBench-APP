const { createAutocompleteManager } = require("./solution");

describe("createAutocompleteManager (Multi-Word Autocomplete)", () => { let manager;

beforeEach(() => { const initialEntries = [ "apple banana", "carrot bean", "apple sauce", "banana bread", "apple pie" ]; manager = createAutocompleteManager(initialEntries); });

test("returns matching entries where any word starts with prefix (case-insensitive)", () => { // "apple banana" -> second word is "banana", which starts with "ban" // "banana bread" -> first word "banana" starts with "ban" const results = manager.search("ban"); expect(results).toContain("apple banana"); expect(results).toContain("banana bread"); });

test("does not match if prefix only appears mid-word", () => { // "apple banana" has "banana" which contains "ann" in the middle, // but does not start with "ann". const results = manager.search("ann"); expect(results).toEqual([]); // No match });

test("limits results to 5 if more than 5 matches exist", () => { // Add extra entries that match "app" to force more than 5 manager.addEntry("app tart"); manager.addEntry("app test"); manager.addEntry("app fun"); manager.addEntry("app data"); manager.addEntry("app doc"); manager.addEntry("app zero");

const results = manager.search("app"); 
// We expect only 5 items, even if more match
expect(results.length).toBeLessThanOrEqual(5);
});

test("handles prefix that is not a string by returning empty array or throwing error", () => { // Decide if we want to throw an error or return [] // We'll assume the correct approach is to return an empty array const results = manager.search(123); // Not a string expect(results).toEqual([]); });

test("addEntry() allows adding new multi-word entries", () => { manager.addEntry("coconut water"); const results = manager.search("coc"); expect(results).toEqual(["coconut water"]); });

test("removeEntry() does not splice the last entry if item is not found", () => { 
  // Initially we have 5 entries 
  const allEntries = manager.search(""); 
  expect(allEntries.length).toBe(5);

// Attempt to remove an entry that doesn't exist
manager.removeEntry("nonexistent entry");

// The original 5 should still exist
const afterRemoval = manager.search("");
expect(afterRemoval.length).toBe(5);
});

test("removeEntry() actually removes the exact entry", () => { manager.removeEntry("carrot bean"); const results = manager.search("car"); // "carrot bean" should be removed, so no match expect(results).toEqual([]); });

test("verifies partial matching is on word boundaries, not mid-word", () => { // "apple banana" has "apple" and "banana" // Searching "ple" or "ana" in the middle of "apple"/"banana" is not a match expect(manager.search("ple")).toEqual([]); expect(manager.search("ana")).toEqual([]); });

test("multi-word entries: searching 'apple' matches both 'apple banana' and 'apple sauce'", () => { const results = manager.search("apple"); // We expect at least these two expect(results).toContain("apple banana"); expect(results).toContain("apple sauce"); });

test("case-insensitive search for 'BAN'", () => { 
  // Should match both 'apple banana' and 'banana bread' 
  const results = manager.search("BAN"); expect(results).toEqual( expect.arrayContaining(["apple banana", "banana bread"]) ); }); });