const { IngredientInventory } = require('./solution');

describe('IngredientInventory', () => {

    // Test case 1: Constructor test
    test('should throw error when restaurantName is invalid', () => {
        expect(() => new IngredientInventory("", 50)).toThrow("Error Encountered");
        expect(() => new IngredientInventory("Valid Restaurant", -1)).toThrow("Error Encountered");
        expect(() => new IngredientInventory("Valid Restaurant", 0)).toThrow("Error Encountered");
    });

    test('should create an inventory with valid restaurantName and maxCapacity', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        expect(inventory.restaurantName).toBe("Gourmet Bistro");
        expect(inventory.maxCapacity).toBe(50);
        expect(inventory.ingredients).toEqual([]);
    });

    // Test case 2: addIngredient test
    test('should add an ingredient correctly', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        expect(inventory.addIngredient("Tomato", 10, "2025-02-25")).toBe(true);
        expect(inventory.ingredients.length).toBe(1);
    });

    test('should return false if ingredient is invalid or quantity is non-positive', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        expect(inventory.addIngredient("", 10, "2025-02-25")).toBe(false); // Invalid ingredient
        expect(inventory.addIngredient("Tomato", -5, "2025-02-25")).toBe(false); // Invalid quantity
        expect(inventory.addIngredient("Tomato", 10, "invalid-date")).toBe(false); // Invalid date format
    });

    test('should return false when inventory is at max capacity', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 1);
        inventory.addIngredient("Tomato", 10, "2025-02-25");
        expect(inventory.addIngredient("Lettuce", 5, "2025-03-10")).toBe(false); // Max capacity reached
    });

    // Test case 3: checkIngredientStock test
    test('should return correct stock level for an ingredient', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        inventory.addIngredient("Tomato", 10, "2025-02-25");
        expect(inventory.checkIngredientStock("Tomato")).toBe(10);
        expect(inventory.checkIngredientStock("Lettuce")).toBe(0); // Ingredient not in inventory
    });

    // Test case 4: removeExpiredIngredients test
    test('should remove expired ingredients correctly', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        inventory.addIngredient("Tomato", 10, "2025-02-25");
        inventory.addIngredient("Lettuce", 5, "2024-02-18");
        const removed = inventory.removeExpiredIngredients();
        expect(removed).toContain("Lettuce");
        expect(inventory.ingredients.length).toBe(1); // Only "Tomato" should remain
    });

    // Test case 5: checkStockLevel test
    test('should return the current stock level of all ingredients', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        inventory.addIngredient("Tomato", 10, "2025-02-25");
        inventory.addIngredient("Lettuce", 5, "2025-02-18");
        const stock = inventory.checkStockLevel();
        expect(stock.length).toBe(2);
        expect(stock[0].ingredient).toBe("Tomato");
        expect(stock[1].ingredient).toBe("Lettuce");
    });

    // Test case 6: removeIngredient test
    test('should remove an ingredient from the inventory', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        inventory.addIngredient("Tomato", 10, "2025-02-25");
        expect(inventory.removeIngredient("Tomato")).toBe(true); // Successfully removed
        expect(inventory.removeIngredient("Lettuce")).toBe(false); // Ingredient doesn't exist
    });

    test('should return an empty array if no ingredients are near expiration', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        inventory.addIngredient("Tomato", 10, "2025-04-25");
        const nearExpiration = inventory.getIngredientsNearExpiration(10);
        expect(nearExpiration).toEqual([]); // No ingredients within the 10 days
    });

    test('should return empty array if invalid dateRange is passed', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        inventory.addIngredient("Tomato", 10, "2025-02-25");
        expect(inventory.getIngredientsNearExpiration(-5)).toEqual([]);
        expect(inventory.getIngredientsNearExpiration(0)).toEqual([]);
        expect(inventory.getIngredientsNearExpiration("invalid")).toEqual([]);
    });

    // Test case 8: removeLowStockIngredients test
    test('should remove ingredients with low stock correctly', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        inventory.addIngredient("Tomato", 10, "2025-02-25");
        inventory.addIngredient("Lettuce", 2, "2025-02-18");
        inventory.addIngredient("Cheese", 1, "2025-03-10");
        
        const removed = inventory.removeLowStockIngredients(5);
        expect(removed).toContain("Lettuce");
        expect(removed).toContain("Cheese");
        expect(inventory.ingredients.length).toBe(1); // Only "Tomato" should remain
    });

    test('should return empty array if no ingredients are below minStock', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        inventory.addIngredient("Tomato", 10, "2025-02-25");
        const removed = inventory.removeLowStockIngredients(5);
        expect(removed).toEqual([]); // No ingredient has less than 5 stock
    });

    // Test case 9: clearInventory test
    test('should clear the inventory correctly', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        inventory.addIngredient("Tomato", 10, "2025-02-25");
    
        // Clear inventory for the first time
        inventory.clearInventory();
        
        // Assert that the inventory is empty
        expect(inventory.ingredients.length).toBe(0);
        try {
            inventory.clearInventory();
            if (typeof inventory.clearInventory() !== 'string') {
                throw new Error('Expected an error or message but got none');
            }
        } catch (error) {
            expect(error.message).toBe('Inventory already cleared');
        }
    });
    test('should return false if any ingredient in the batch is invalid', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        const invalidBatch = [
            { ingredient: "Olive Oil", quantity: -5, expirationDate: "2025-04-15" }, // Invalid quantity
            { ingredient: "Garlic", quantity: 8, expirationDate: "invalid-date" } // Invalid date format
        ];
        const result = inventory.addIngredientsBatch(invalidBatch);
        expect(result).toBe(false); // Batch addition failed due to invalid data
    });
// Additional cases.
    test('should return false for invalid ingredient names with special characters', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        expect(inventory.addIngredient("Tom@to", 10, "2025-02-25")).toBe(false); // Special character in name
    });

    test('should not allow adding ingredients beyond max capacity during initialization', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 1);
        expect(inventory.addIngredient("Tomato", 10, "2025-02-25")).toBe(true); // First ingredient added
        expect(inventory.addIngredient("Lettuce", 5, "2025-03-10")).toBe(false); // Should fail, capacity reached
    });
    
    test('should allow adding ingredients after inventory is cleared', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        inventory.addIngredient("Tomato", 10, "2025-02-25");
        inventory.clearInventory();
        expect(inventory.addIngredient("Lettuce", 5, "2025-02-18")).toBe(true); // Adding after clearing
        expect(inventory.checkIngredientStock("Lettuce")).toBe(5);
    });
    
    test('should return false if quantity is not an integer', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        expect(inventory.addIngredient("Tomato", 10.5, "2025-02-25")).toBe(false); // Invalid quantity (float)
        expect(inventory.addIngredient("Lettuce", "ten", "2025-02-18")).toBe(false); // Non-numeric quantity
    });
    
    test('should return false if expiration date is in an invalid format', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        expect(inventory.addIngredient("Tomato", 10, "2025-02-25")).toBe(true);
        expect(inventory.addIngredient("Lettuce", 5, "18-02-2025")).toBe(false); // Invalid format
        expect(inventory.addIngredient("Garlic", 3, "20250225")).toBe(false); // Missing dash
    });
    
    test('should return 0 for non-existing ingredient when checking stock', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        expect(inventory.checkIngredientStock("Nonexistent Ingredient")).toBe(0); // Should be 0
    });
    
    test('should return false if any ingredient in the batch exceeds max capacity', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 1); // Max capacity 1
        const batch = [
            { ingredient: "Olive Oil", quantity: 5, expirationDate: "2025-04-15" },
            { ingredient: "Garlic", quantity: 5, expirationDate: "2025-05-01" }
        ];
        expect(inventory.addIngredientsBatch(batch)).toBe(false); // Batch exceeds capacity
    });
    
    test('should return false for empty batch in addIngredientsBatch', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        expect(inventory.addIngredientsBatch([])).toBe(false); // Empty batch should fail
    });
    
    
    test('should return an empty array when stock is empty', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        expect(inventory.checkStockLevel()).toEqual([]); // No ingredients to check
    })
    
    test('should return false when trying to remove an ingredient not in the inventory', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        expect(inventory.removeIngredient("Tomato")).toBe(false); // Ingredient not in inventory
    });
    
    test('should correctly handle ingredients with the same name but different expiration dates', () => {
        const inventory = new IngredientInventory("Gourmet Bistro", 50);
        inventory.addIngredient("Tomato", 10, "2025-02-25");
        inventory.addIngredient("Tomato", 5, "2025-03-01");
    
        expect(inventory.checkIngredientStock("Tomato")).toBe(15); // Should sum the quantities
    });
        
});