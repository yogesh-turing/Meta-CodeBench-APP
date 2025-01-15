const { equalObjects } = require('./incorrect');

describe("equalObjects Function Tests", () => {
  // Test case: Same numbers should be equal
  test("Same numbers should be equal", () => {
    expect(equalObjects(5, 5)).toBe(true);
    expect(equalObjects(100, 100)).toBe(true);
  });

  // Test case: Same strings should be equal
  test("Same strings should be equal", () => {
    expect(equalObjects("Hello", "Hello")).toBe(true);
  });

  // Test case: Different numbers should not be equal
  test("Different numbers should not be equal", () => {
    expect(equalObjects(5, 10)).toBe(false);
  });

  // Test case: Different strings should not be equal
  test("Different strings should not be equal", () => {
    expect(equalObjects("Hello", "World")).toBe(false);
  });

  // Test case: Different types should not be equal
  test("Different types should not be equal", () => {
    expect(equalObjects(5, "5")).toBe(false);
    expect(equalObjects(100, "100")).toBe(false);
  });

  // Test case: Empty objects should be equal
  test("Empty objects should be equal", () => {
    expect(equalObjects({}, {})).toBe(true);
  });

  // Test case: Same objects should be equal
  test("Same objects should be equal", () => {
    expect(equalObjects({ name: "John" }, { name: "John" })).toBe(true);
    expect(equalObjects({ score: 100 }, { score: 100 })).toBe(true);
  });

  // Test case: Different objects should not be equal
  test("Different objects should not be equal", () => {
    expect(equalObjects({ name: "John" }, { name: "Doe" })).toBe(false);
    expect(equalObjects({ name: "John", age: 20 }, { age: 30 })).toBe(false);
    expect(equalObjects({ name: "John" }, [20])).toBe(false);
  });

  // Test case: Same Nested objects should be equal
  test("Same Nested objects should be equal", () => {
    expect(
      equalObjects(
        { name: "John", address: { city: "New York" } },
        { name: "John", address: { city: "New York" } }
      )
    ).toBe(true);
  });

  // Test case: Different Nested objects should not be equal
  test("Different Nested objects should not be equal", () => {
    expect(
      equalObjects(
        { name: "John", address: { city: "New York" } },
        { name: "John", address: { city: "Los Angeles" } }
      )
    ).toBe(false);
  });

  // Test case: Same Arrays should be equal
  test("Same Arrays should be equal", () => {
    expect(equalObjects([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  // Test case: Different Arrays should not be equal
  test("Different Arrays should not be equal", () => {
    expect(equalObjects([1, 2, 3], [4, 5, 6])).toBe(false);
    expect(equalObjects([1, 2, 3], [1, 2])).toBe(false);
  });

  // Test case: Same Nested Arrays should be equal
  test("Same Nested Arrays should be equal", () => {
    expect(equalObjects([1, [2, 3], 4], [1, [2, 3], 4])).toBe(true);
  });

  // Test case: Different Nested Arrays should not be equal
  test("Different Nested Arrays should not be equal", () => {
    expect(equalObjects([1, [2, 3], 4], [1, [4, 5], 6])).toBe(false);
  });

  // Test case: Same Arrays with different order should not be equal
  test("Same Arrays with different order should not be equal", () => {
    expect(equalObjects([1, 2, 3], [3, 2, 1])).toBe(false);
  });

  // Test case: Different Arrays with different order should not be equal
  test("Different Arrays with different order should not be equal", () => {
    expect(equalObjects([1, 2, 3], [4, 3, 2])).toBe(false);
  });

  // Test case: Invalid JSON should throw an error
  test("Invalid JSON should throw an error", () => {
    expect(() => {
      equalObjects(undefined, []);
    }).toThrow("Error encountered");
    expect(() => {
      equalObjects(() => {}, null);
    }).toThrow("Error encountered");
  });

  // Test case: Null inputs should be equal
  test("Null inputs should be equal", () => {
    expect(equalObjects(null, null)).toBe(true);
  });


  // Complex test case: 
  // Nested objects with different order should 
  // with all data types 
  // with array with all data types
  test("Complex test case", () => {
    const obj1 = {
      name: "John",
      age: 20,
      addresses: [
        {
          zip: 10001,
          city: "New York",
        },
        {
            zip: 20001,
            city: "Los Angeles",
        }
      ],
      scores: [100, 90, 80],
      phone: null,
    };
    const obj2 = {
      age: 20,
      name: "John",
      addresses: [
        {
          zip: 10001,
          city: "New York",
        },
        {
            zip: 20001,
            city: "Los Angeles",
        }
      ],
      scores: [100, 90, 80],
      phone: null,
    };
    expect(equalObjects(obj1, obj2)).toBe(true);

    const obj3 = {
      name: "John",
      age: 20,
      address: {
        city: "New York",
        zip: 10001,
      },
      scores: [100, 90, 80],
      phone: null,
    };

    const obj4 = {
      name: "John",
      age: 20,
      address: {
        city: "New York",
        zip: 10001,
      },
      scores: [100, 90, 80, 70],
    };

    expect(equalObjects(obj3, obj4)).toBe(false);
  });

});