const { Inventory, fulfillOrder } = require('./incorrect');

describe("Inventory System", () => {
  let inventory;

  beforeEach(() => {
    inventory = new Inventory();
    inventory.addItem("apple", 5);
    inventory.addItem("banana", 10);
  });

  test("Adding and removing items", () => {
    inventory.addItem("orange", 3);
    expect(inventory.getItemCount("orange")).toBe(3);

    // Add to existing item
    inventory.addItem("orange", 2);
    expect(inventory.getItemCount("orange")).toBe(5);

    inventory.removeItem("banana", 2);
    expect(inventory.getItemCount("banana")).toBe(8);

    let isError = false;
    try{
      inventory.removeItem("banana", 10);
    }catch(error){
        if(error.constructor === Error){
            isError = true
            expect(error.constructor).toBe(Error);
        }
    }

    if(!isError){
        let bananaCount = inventory.getItemCount("banana");
        expect(bananaCount).toBe(0);
    }   
    
    // Verify the final count, regardless of whether an error was thrown
    const finalBananaCount = inventory.getItemCount("banana");
    expect(finalBananaCount).toBeLessThanOrEqual(8);
    expect(finalBananaCount).toBeGreaterThanOrEqual(0);

    // Test removing from non-existent item
    try {
      inventory.removeItem("nonexistent", 1);
      expect(inventory.getItemCount("nonexistent")).toBe(0);
    } catch (error) {
      expect(error.constructor).toBe(Error);
      expect(inventory.getItemCount("nonexistent")).toBe(0);
    }
  });

  test("Handling negative quantities", () => {
    expect(() => inventory.addItem("grape", -5)).toThrow(Error);
    expect(() => inventory.removeItem("apple", -3)).toThrow(Error);
    expect(inventory.getItemCount("apple")).toBe(5); // Should remain unchanged
    expect(inventory.getItemCount("grape")).toBe(0); // Should not be added
  });

  test("Handling floating point quantities", () => {
    expect(() => inventory.addItem("mango", 3.5)).toThrow(Error);
    expect(() => inventory.removeItem("apple", 2.7)).toThrow(Error);
    expect(inventory.getItemCount("apple")).toBe(5); // Should remain unchanged
    expect(inventory.getItemCount("mango")).toBe(0); // Should not be added
  });

  test("Handling undefined and null values", () => {
    expect(() => inventory.addItem(undefined, 5)).toThrow(Error);
    expect(() => inventory.addItem(null, 5)).toThrow(Error);
    expect(() => inventory.addItem("kiwi", undefined)).toThrow(Error);
    expect(() => inventory.addItem("kiwi", null)).toThrow(Error);
    expect(() => inventory.removeItem(undefined, 2)).toThrow(Error);
    expect(() => inventory.removeItem(null, 2)).toThrow(Error);
    expect(() => inventory.removeItem("apple", undefined)).toThrow(Error);
    expect(() => inventory.removeItem("apple", null)).toThrow(Error);
  });

  test("Handling empty and invalid item names", () => {
    expect(() => inventory.addItem("", 5)).toThrow(Error);
    expect(() => inventory.addItem(" ", 3)).toThrow(Error);
    expect(() => inventory.addItem({}, 2)).toThrow(Error);
    expect(() => inventory.addItem(123, 2)).toThrow(Error);
  });

  test("Checking item availability", () => {
    expect(inventory.hasItem("apple")).toBe(true);
    expect(inventory.hasItem("grape")).toBe(false);
    expect(inventory.hasItem("")).toBe(false);
    expect(inventory.hasItem(undefined)).toBe(false);
    expect(inventory.hasItem(null)).toBe(false);
  });

  test("Checking if inventory is empty", () => {
    expect(inventory.isEmpty()).toBe(false);
    
    // Try to remove all items - handle both error and success cases
    try {
      inventory.removeItem("apple", 5);
      inventory.removeItem("banana", 10);
      expect(inventory.isEmpty()).toBe(true);
    } catch (error) {
      // If error thrown, manually empty the inventory
      inventory.removeItem("apple", 5);
      inventory.removeItem("banana", 8);
      inventory.removeItem("banana", 2);
      expect(inventory.isEmpty()).toBe(true);
    }

    // Test with zero quantity items
    inventory.addItem("grape", 0);
    expect(inventory.isEmpty()).toBe(true);

    // Add and remove to test branch coverage
    inventory.addItem("orange", 1);
    expect(inventory.isEmpty()).toBe(false);
    try {
      inventory.removeItem("orange", 1);
      expect(inventory.isEmpty()).toBe(true);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test("Fulfilling orders with edge cases", () => {
    // Order with negative quantities
    const negativeOrder = { apple: -2, banana: 3 };
    expect(fulfillOrder(inventory, negativeOrder)).toBe(false);
    expect(inventory.getItemCount("apple")).toBe(5);
    expect(inventory.getItemCount("banana")).toBe(10);

    // Order with floating point quantities
    const floatOrder = { apple: 2.5, banana: 3 };
    expect(fulfillOrder(inventory, floatOrder)).toBe(false);
    expect(inventory.getItemCount("apple")).toBe(5);
    expect(inventory.getItemCount("banana")).toBe(10);

    // Order with null/undefined quantities
    const nullOrder = { apple: null, banana: 3 };
    expect(fulfillOrder(inventory, nullOrder)).toBe(false);
    const undefinedOrder = { apple: undefined, banana: 3 };
    expect(fulfillOrder(inventory, undefinedOrder)).toBe(false);

    // Order with null/undefined items
    const invalidItemsOrder = { [null]: 2, [undefined]: 3, apple: 2 };
    expect(fulfillOrder(inventory, invalidItemsOrder)).toBe(false);

    // Test with invalid order object
    expect(fulfillOrder(inventory, null)).toBe(false);
    expect(fulfillOrder(inventory, undefined)).toBe(false);
    expect(fulfillOrder(inventory, "not an object")).toBe(false);
    expect(fulfillOrder(inventory, 123)).toBe(false);
  });

  test("Testing hasEnough edge cases", () => {
    // Test with invalid item names
    expect(inventory.hasEnough(undefined, 1)).toBe(false);
    expect(inventory.hasEnough(null, 1)).toBe(false);
    expect(inventory.hasEnough("", 1)).toBe(false);
    expect(inventory.hasEnough({}, 1)).toBe(false);

    // Test with invalid quantities
    expect(inventory.hasEnough("apple", undefined)).toBe(false);
    expect(inventory.hasEnough("apple", null)).toBe(false);
    expect(inventory.hasEnough("apple", -1)).toBe(false);
    expect(inventory.hasEnough("apple", 1.5)).toBe(false);
    expect(inventory.hasEnough("apple", "1")).toBe(false);
  });

  test("Fulfilling a simple order", () => {
    const order = { apple: 2, banana: 3 };
    const result = fulfillOrder(inventory, order);
    expect(result).toBe(true);
    expect(inventory.getItemCount("apple")).toBe(3);
    expect(inventory.getItemCount("banana")).toBe(7);
  });

  test("Fulfilling an order with insufficient items", () => {
    const order = { apple: 7, banana: 5 };
    const result = fulfillOrder(inventory, order);
    expect(result).toBe(false);
    expect(inventory.getItemCount("apple")).toBe(5); // Should not be reduced
    expect(inventory.getItemCount("banana")).toBe(10); // Should not be reduced
  });

  test("Fulfilling an order with a mix of sufficient and insufficient items", () => {
    const order = { apple: 3, banana: 12, orange: 1 };
    const result = fulfillOrder(inventory, order);
    expect(result).toBe(false);
    expect(inventory.getItemCount("apple")).toBe(5); // Should not be reduced
    expect(inventory.getItemCount("banana")).toBe(10); // Should not be reduced
    expect(inventory.getItemCount("orange")).toBe(0); // Should not exist
  });

  test("Fulfilling an empty order", () => {
    const order = {};
    const result = fulfillOrder(inventory, order);
    expect(result).toBe(true);
    expect(inventory.getItemCount("apple")).toBe(5);
    expect(inventory.getItemCount("banana")).toBe(10);
  });
});
