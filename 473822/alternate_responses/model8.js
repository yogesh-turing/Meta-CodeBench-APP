/**
 * Class representing an inventory of ingredients for a restaurant.
 */
class IngredientInventory {
    /**
     * Creates an instance of IngredientInventory.
     * 
     * @param {string} restaurantName - The name of the restaurant.
     * @param {number} maxCapacity - The maximum capacity for ingredients in the inventory.
     * @throws {Error} Throws an error if the restaurant name is invalid or if max capacity is non-positive.
     */
    constructor(restaurantName, maxCapacity) {
        if (!restaurantName || typeof restaurantName !== 'string' || maxCapacity <= 0) {
            throw new Error("Error Encountered");
        }
        this.restaurantName = restaurantName; // The name of the restaurant
        this.maxCapacity = maxCapacity; // Maximum number of ingredients the inventory can hold
        this.ingredients = []; // Array to hold ingredients and their details
    }

    /**
     * Adds an ingredient to the inventory.
     * 
     * @param {string} ingredient - The name of the ingredient.
     * @param {number} quantity - The quantity of the ingredient to be added.
     * @param {string} expirationDate - The expiration date of the ingredient (in YYYY-MM-DD format).
     * @returns {boolean} Returns `false` if the ingredient is invalid, quantity is non-positive, 
     *                    or expiration date is in an invalid format, or if the max capacity is reached.
     *                    Returns `true` if the ingredient was successfully added or updated.
     */
    addIngredient(ingredient, quantity, expirationDate) {
        // Validate ingredient, quantity, and expiration date
        if (!ingredient || typeof ingredient !== 'string' || 
            quantity <= 0 || !Number.isInteger(quantity) ||
            !expirationDate || !/^\d{4}-\d{2}-\d{2}$/.test(expirationDate)) {
            return false;
        }

        // Check if the inventory has reached its maximum capacity
        if (this.ingredients.length >= this.maxCapacity) {
            return false;
        }

        // Check if the ingredient already exists in the inventory
        const existingIndex = this.ingredients.findIndex(item => item.ingredient === ingredient);
        
        if (existingIndex !== -1) {
            // If ingredient exists, update the quantity and expiration date
            this.ingredients[existingIndex].quantity += quantity;
            this.ingredients[existingIndex].expirationDate = expirationDate;
        } else {
            // If ingredient doesn't exist, add it to the inventory
            this.ingredients.push({ ingredient, quantity, expirationDate });
        }
        return true;
    }

    /**
     * Checks the stock of a specific ingredient.
     * 
     * @param {string} ingredient - The name of the ingredient.
     * @returns {number} The quantity of the ingredient in the inventory. Returns `0` if the ingredient is not found.
     */
    checkIngredientStock(ingredient) {
        // If ingredient name is invalid, return 0
        if (!ingredient || typeof ingredient !== 'string') {
            return 0;
        }
        
        // Find and return the quantity of the ingredient, or 0 if not found
        const item = this.ingredients.find(item => item.ingredient === ingredient);
        return item ? item.quantity : 0;
    }

    /**
     * Removes expired ingredients from the inventory.
     * 
     * @returns {Array} An array of the names of ingredients that have been removed due to expiration.
     */
    removeExpiredIngredients() {
        const currentDate = new Date(); // Current date to compare expiration dates
        const expiredIngredients = [];
        
        // Filter out expired ingredients and add them to the removed list
        this.ingredients = this.ingredients.filter(item => {
            const expirationDate = new Date(item.expirationDate);
            if (expirationDate < currentDate) {
                expiredIngredients.push(item.ingredient);
                return false; // Remove expired ingredient from inventory
            }
            return true; // Keep non-expired ingredients
        });

        return expiredIngredients; // Return the list of expired ingredients
    }

    /**
     * Returns the current stock level of all ingredients in the inventory.
     * 
     * @returns {Array} A list of objects containing the ingredient name, quantity, and expiration date.
     */
    checkStockLevel() {
        // Return a formatted array of the ingredient data
        return this.ingredients.map(({ ingredient, quantity, expirationDate }) => ({
            ingredient,
            quantity,
            expirationDate
        }));
    }

    /**
     * Removes a specific ingredient from the inventory.
     * 
     * @param {string} ingredient - The name of the ingredient to be removed.
     * @returns {boolean} Returns `false` if the ingredient doesn't exist in the inventory, 
     *                    otherwise returns `true` if the ingredient was successfully removed.
     */
    removeIngredient(ingredient) {
        // Validate if the ingredient is a valid string
        if (!ingredient || typeof ingredient !== 'string') {
            return false;
        }

        const initialLength = this.ingredients.length;
        // Filter out the ingredient from the inventory
        this.ingredients = this.ingredients.filter(item => item.ingredient !== ingredient);
        
        // If the length of ingredients has changed, return true, indicating removal
        return initialLength > this.ingredients.length;
    }

    /**
     * Returns ingredients that are near expiration within a given date range (in days).
     * 
     * @param {number} dateRange - The number of days before expiration to check.
     * @returns {Array} An array of ingredient names.
     */
    getIngredientsNearExpiration(dateRange) {
        // Validate dateRange
        if (dateRange <= 0 || !Number.isInteger(dateRange)) {
            return [];
        }

        const currentDate = new Date(); // Current date to compare expiration dates
        const nearExpirationIngredients = [];

        // Filter ingredients that are near expiration and add them to the list
        this.ingredients.forEach(item => {
            const expirationDate = new Date(item.expirationDate);
            const daysUntilExpiration = Math.floor((expirationDate - currentDate) / (1000 * 60 * 60 * 24));
            if (daysUntilExpiration <= dateRange) {
                nearExpirationIngredients.push(item.ingredient);
            }
        });

        return nearExpirationIngredients; // Return the list of near-expiration ingredients
    }

    /**
     * Removes ingredients with a quantity less than a specified threshold.
     * 
     * @param {number} minStock - The minimum stock level.
     * @returns {Array} An array of ingredient names that were removed due to low stock.
     */
    removeLowStockIngredients(minStock) {
        // Validate minStock
        if (minStock <= 0 || !Number.isInteger(minStock)) {
            return [];
        }

        const lowStockIngredients = [];

        // Filter out low stock ingredients and add them to the removed list
        this.ingredients = this.ingredients.filter(item => {
            if (item.quantity < minStock) {
                lowStockIngredients.push(item.ingredient);
                return false; // Remove low stock ingredient from inventory
            }
            return true; // Keep ingredients with sufficient stock
        });

        return lowStockIngredients; // Return the list of low stock ingredients
    }

    /**
     * Clears all ingredients from the inventory.
     */
    clearInventory() {
        // Check if the inventory is already empty
        if (this.ingredients.length === 0) {
            throw new Error("Inventory already cleared");
        }

        // Clear the inventory
        this.ingredients = [];
    }

    /**
     * Adds a batch of ingredients to the inventory in one operation.
     * 
     * @param {Array} ingredientsBatch - Array of objects with ingredient, quantity, and expirationDate.
     * @returns {boolean} True if all ingredients were added successfully, false if any fail.
     */
    addIngredientsBatch(ingredientsBatch) {
        // Validate ingredientsBatch
        if (!Array.isArray(ingredientsBatch) || ingredientsBatch.length === 0) {
            return false;
        }

        // Add each ingredient in the batch to the inventory
        for (const ingredient of ingredientsBatch) {
            // Validate ingredient, quantity, and expirationDate
            if (!ingredient.ingredient || typeof ingredient.ingredient !== 'string' || 
                !ingredient.quantity || !Number.isInteger(ingredient.quantity) || ingredient.quantity <= 0 ||
                !ingredient.expirationDate || !/^\d{4}-\d{2}-\d{2}$/.test(ingredient.expirationDate)) {
                return false;
            }

            // Add the ingredient to the inventory
            if (!this.addIngredient(ingredient.ingredient, ingredient.quantity, ingredient.expirationDate)) {
                return false;
            }
        }

        return true; // All ingredients in the batch were added successfully
    }
}

module.exports = { IngredientInventory };