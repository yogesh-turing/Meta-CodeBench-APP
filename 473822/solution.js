/**
 * Class representing an inventory of ingredients for a restaurant.
 */
class IngredientInventory {
    
    /**
     * Creates an instance of IngredientInventory.
     * @param {string} restaurantName - The name of the restaurant.
     * @param {number} maxCapacity - The maximum capacity for ingredients in the inventory.
     * @throws {Error} Throws an error if the restaurant name is invalid or if max capacity is non-positive.
     */
    constructor(restaurantName, maxCapacity) {
        // Validates input parameters and throws an error if they are invalid
        if (!restaurantName || typeof restaurantName !== 'string' || maxCapacity <= 0) throw new Error("Error Encountered");
        
        // Initializes the properties
        this.restaurantName = restaurantName;
        this.maxCapacity = maxCapacity;
        this.ingredients = []; // Holds the list of ingredients
    }

    /**
     * Adds an ingredient to the inventory.
     * If the ingredient already exists, updates its quantity and expiration date.
     * @param {string} ingredient - The name of the ingredient.
     * @param {number} quantity - The quantity of the ingredient.
     * @param {string} expirationDate - The expiration date of the ingredient in YYYY-MM-DD format.
     * @returns {boolean} - Returns true if the ingredient is successfully added, false otherwise.
     */
    addIngredient(ingredient, quantity, expirationDate) {
        // Validates the input data
        if (!ingredient || typeof ingredient !== 'string' || ingredient.trim().length === 0 || ingredient.match(/[^a-zA-Z0-9]/) || 
            quantity <= 0 || !Number.isInteger(quantity) || !expirationDate || !/^\d{4}-\d{2}-\d{2}$/.test(expirationDate) || 
            this.ingredients.length >= this.maxCapacity) return false;
        
        // Checks if the ingredient is already in the inventory
        const index = this.ingredients.findIndex(item => item.ingredient === ingredient);
        
        // If ingredient exists, updates its quantity and expiration date
        if (index !== -1) {
            this.ingredients[index].quantity += quantity;
            this.ingredients[index].expirationDate = expirationDate;
        } else {
            // Otherwise, adds a new ingredient to the inventory
            this.ingredients.push({ ingredient, quantity, expirationDate });
        }
        return true;
    }

    /**
     * Checks the current stock of a specific ingredient.
     * @param {string} ingredient - The name of the ingredient to check.
     * @returns {number} - The quantity of the ingredient, or 0 if not found.
     */
    checkIngredientStock(ingredient) {
        // Returns the quantity of the ingredient or 0 if not found
        return this.ingredients.find(item => item.ingredient === ingredient)?.quantity || 0;
    }

    /**
     * Removes expired ingredients from the inventory.
     * @returns {Array} - A list of names of the ingredients that were removed due to expiration.
     */
    removeExpiredIngredients() {
        const currentDate = new Date(); // Current date to compare expiration dates
        // Filters and removes expired ingredients
        const expired = this.ingredients.filter(item => new Date(item.expirationDate) < currentDate).map(item => item.ingredient);
        // Filters out the expired ingredients from the inventory
        this.ingredients = this.ingredients.filter(item => new Date(item.expirationDate) >= currentDate);
        return expired;
    }

    /**
     * Returns the current stock level of all ingredients in the inventory.
     * @returns {Array} - An array of objects containing the ingredient name, quantity, and expiration date.
     */
    checkStockLevel() {
        // Returns a formatted list of all ingredients in the inventory
        return this.ingredients.map(({ ingredient, quantity, expirationDate }) => ({ ingredient, quantity, expirationDate }));
    }

    /**
     * Removes a specific ingredient from the inventory.
     * @param {string} ingredient - The name of the ingredient to be removed.
     * @returns {boolean} - Returns true if the ingredient was removed, false if it was not found.
     */
    removeIngredient(ingredient) {
        const initialLength = this.ingredients.length;
        // Filters out the specified ingredient from the inventory
        this.ingredients = this.ingredients.filter(item => item.ingredient !== ingredient);
        // Returns true if an ingredient was removed (length reduced)
        return this.ingredients.length < initialLength;
    }

    /**
     * Returns ingredients that are near expiration within a given date range.
     * @param {number} dateRange - The number of days before expiration to check.
     * @returns {Array} - An array of ingredient names that are nearing expiration.
     */
    getIngredientsNearExpiration(dateRange) {
        // Returns an empty array if dateRange is invalid
        if (dateRange <= 0 || !Number.isInteger(dateRange)) return [];
        
        const futureDate = new Date(Date.now() + dateRange * 24 * 60 * 60 * 1000); // Calculate the future date based on the date range
        // Filters ingredients that are near expiration
        return this.ingredients.filter(item => new Date(item.expirationDate) <= futureDate && new Date(item.expirationDate) > new Date()).map(item => item.ingredient);
    }

    /**
     * Removes ingredients with quantity less than a specified minimum stock.
     * @param {number} minStock - The minimum quantity threshold for ingredients to remain in the inventory.
     * @returns {Array} - An array of names of ingredients that were removed due to low stock.
     */
    removeLowStockIngredients(minStock) {
        // Returns an empty array if minStock is invalid
        if (minStock <= 0 || !Number.isInteger(minStock)) return [];
        
        // Filters ingredients with low stock and removes them
        const removed = this.ingredients.filter(item => item.quantity < minStock).map(item => item.ingredient);
        this.ingredients = this.ingredients.filter(item => item.quantity >= minStock);
        return removed;
    }

    /**
     * Clears all ingredients from the inventory.
     * @returns {string} - A message indicating whether the inventory was cleared or was already empty.
     */
    clearInventory() {
        // Returns a message if the inventory is already empty
        if (this.ingredients.length === 0) return "Inventory already cleared";
        // Clears the entire inventory
        this.ingredients = [];
    }

    /**
     * Adds a batch of ingredients to the inventory in one operation.
     * @param {Array} ingredientsBatch - An array of objects containing ingredient details (ingredient, quantity, expirationDate).
     * @returns {boolean} - Returns true if all ingredients in the batch were added successfully, false if any failed.
     */
    addIngredientsBatch(ingredientsBatch) {
        // Returns false if the batch is invalid or exceeds max capacity
        if (!Array.isArray(ingredientsBatch) || ingredientsBatch.length === 0 || this.ingredients.length + ingredientsBatch.length > this.maxCapacity) return false;
        
        // Tries to add each ingredient in the batch
        return ingredientsBatch.every(item => this.addIngredient(item.ingredient, item.quantity, item.expirationDate));
    }
}

module.exports = { IngredientInventory };