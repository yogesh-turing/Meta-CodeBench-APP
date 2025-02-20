const { IngredientInventory } = require('./solution'); // Adjust the path if necessary

describe('IngredientInventory', () => {

    // Test constructor and initialization
    test('should initialize the inventory correctly', () => {
        const restaurantInventory = new IngredientInventory("Tasty Bites", 50);
        expect(restaurantInventory.restaurantName).toBe("Tasty Bites");
        expect(restaurantInventory.maxCapacity).toBe(50);
        
    });

    // Test addIngredient with valid data
    test('should add ingredient successfully', () => {
        const restaurantInventory = new IngredientInventory("Tasty Bites", 50);
        const result = restaurantInventory.addIngredient("Tomato", 20, "2025-04-15");
        expect(result).toBe(true);
        expect(restaurantInventory.checkIngredientStock("Tomato")).toBe(20);
    });

    // Test addIngredient with invalid ingredient name
    test('should return false for invalid ingredient name', () => {
        const restaurantInventory = new IngredientInventory("Tasty Bites", 50);
        const result = restaurantInventory.addIngredient("", 20, "2025-04-15");
        expect(result).toBe(false);
    });

    // Test addIngredient with invalid quantity
    test('should return false for invalid quantity', () => {
        const restaurantInventory = new IngredientInventory("Tasty Bites", 50);
        
        
        try {
            const result = restaurantInventory.addIngredient("Tomato", -5, "2025-04-15");
            expect(result).toBe(false);  
        } catch (error) {
            expect(error.message).toBe("Error Encountered");  
        }
    });
    // Test addIngredient with invalid expiration date format
    test('should return false for invalid expiration date format', () => {
        const restaurantInventory = new IngredientInventory("Tasty Bites", 50);
        const result = restaurantInventory.addIngredient("Tomato", 20, "15-04-2025");
        expect(result).toBe(false);
    });

    // Test addIngredient exceeding max capacity
    test('should return false when trying to exceed max capacity', () => {
        const restaurantInventory = new IngredientInventory("Tasty Bites", 2);
        restaurantInventory.addIngredient("Tomato", 1, "2025-04-15");
        restaurantInventory.addIngredient("Lettuce", 1, "2025-02-25");
        
       
        try {
            const result = restaurantInventory.addIngredient("Cheese", 1, "2025-03-10");
            expect(result).toBe(false);  
        } catch (error) {
            expect(error.message).toBe("Error Encountered");  
        }
    });

    // Test checkIngredientStock for valid ingredient
    test('should return the correct stock level for an existing ingredient', () => {
        const restaurantInventory = new IngredientInventory("Tasty Bites", 50);
        restaurantInventory.addIngredient("Tomato", 20, "2025-04-15");
        const stock = restaurantInventory.checkIngredientStock("Tomato");
        expect(stock).toBe(20);
    });

    // Test checkIngredientStock for non-existing ingredient
    test('should return 0 for a non-existing ingredient', () => {
        const restaurantInventory = new IngredientInventory("Tasty Bites", 50);
        const stock = restaurantInventory.checkIngredientStock("Bacon");
        expect(stock).toBe(0);
    });

    // Test removeExpiredIngredients with expired ingredients
    test('should remove expired ingredients', () => {
        const restaurantInventory = new IngredientInventory("Tasty Bites", 50);
        restaurantInventory.addIngredient("Lettuce", 10, "2024-02-25");
        restaurantInventory.addIngredient("Tomato", 20, "2025-04-15");

        // Simulate the current date being after "2025-02-25"
        const expired = restaurantInventory.removeExpiredIngredients();
        expect(expired).toEqual(["Lettuce"]);
        expect(restaurantInventory.checkIngredientStock("Lettuce")).toBe(0);
        expect(restaurantInventory.checkIngredientStock("Tomato")).toBe(20);
    });

    // Test removeExpiredIngredients when no ingredients are expired
    test('should return empty array if no ingredients are expired', () => {
        const restaurantInventory = new IngredientInventory("Tasty Bites", 50);
        restaurantInventory.addIngredient("Tomato", 20, "2025-04-15");
        const expired = restaurantInventory.removeExpiredIngredients();
        expect(expired).toEqual([]);
    });

    // Test checkStockLevel for all ingredients
    test('should return all ingredients with correct details', () => {
        const restaurantInventory = new IngredientInventory("Tasty Bites", 50);
        restaurantInventory.addIngredient("Tomato", 20, "2025-04-15");
        restaurantInventory.addIngredient("Lettuce", 15, "2025-02-25");

        const stock = restaurantInventory.checkStockLevel();
        expect(stock).toHaveLength(2);
        expect(stock).toContainEqual({
            ingredient: 'Tomato',
            quantity: 20,
            expirationDate: '2025-04-15'
        });
        expect(stock).toContainEqual({
            ingredient: 'Lettuce',
            quantity: 15,
            expirationDate: '2025-02-25'
        });
    });

    // Test removeIngredient with a valid ingredient
    test('should successfully remove an ingredient', () => {
        const restaurantInventory = new IngredientInventory("Tasty Bites", 50);
        restaurantInventory.addIngredient("Tomato", 20, "2025-04-15");
        const result = restaurantInventory.removeIngredient("Tomato");
        expect(result).toBe(true);
        expect(restaurantInventory.checkIngredientStock("Tomato")).toBe(0);
    });

    // Test removeIngredient with a non-existing ingredient
    test('should return false when removing a non-existing ingredient', () => {
        const restaurantInventory = new IngredientInventory("Tasty Bites", 50);
        const result = restaurantInventory.removeIngredient("Bacon");
        expect(result).toBe(false);
    });

    // Test error handling for invalid input in constructor
    test('should throw an error for invalid constructor parameters', () => {
        expect(() => new IngredientInventory("", 50)).toThrow("Error Encountered");
        expect(() => new IngredientInventory("Tasty Bites", -5)).toThrow("Error Encountered");
    });

    // Test addIngredient when ingredient already exists
    test('should add more quantity to an existing ingredient', () => {
        const restaurantInventory = new IngredientInventory("Tasty Bites", 50);
        restaurantInventory.addIngredient("Tomato", 20, "2025-04-15");
        const result = restaurantInventory.addIngredient("Tomato", 10, "2025-04-15");
        expect(result).toBe(true);
        expect(restaurantInventory.checkIngredientStock("Tomato")).toBe(30);
    });
});