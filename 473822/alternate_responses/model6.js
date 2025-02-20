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
     * @returns {Array} Array of ingredient names.
     */
    getIngredientsNearExpiration(dateRange) {
        if (!dateRange || typeof dateRange !== 'number' || dateRange <= 0) {
            return [];
        }

        const nearExpirationIngredients = [];
        const currentDate = new Date();

        this.ingredients.forEach(item => {
            const expirationDate = new Date(item.expirationDate);
            const diffTime = Math.abs(expirationDate - currentDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= dateRange) {
                nearExpirationIngredients.push(item.ingredient);
            }
        });

        return nearExpirationIngredients;
    }

    /**
     * Removes ingredients with a quantity less than a specified threshold.
     * 
     * @param {number} minStock - The minimum stock level.
     * @returns {Array} Array of ingredient names that were removed due to low stock.
     */
    removeLowStockIngredients(minStock) {
        if (!minStock || typeof minStock !== 'number' || minStock < 0) {
            return [];
        }

        const removedIngredients = [];

        this.ingredients = this.ingredients.filter(item => {
            if (item.quantity < minStock) {
                removedIngredients.push(item.ingredient);
                return false;
            }
            return true;
        });

        return removedIngredients;
    }

    /**
     * Clears all ingredients from the inventory.
     * 
     * @returns {void}
     */
    clearInventory() {
        if (this.ingredients.length === 0) {
            throw new Error("Inventory already cleared");
        }
        this.ingredients = [];
    }

    /**
     * Adds a batch of ingredients to the inventory in one operation.
     * 
     * @param {Array} ingredientsBatch - Array of objects with ingredient, quantity, and expirationDate.
     * @returns {boolean} true if all ingredients were added successfully, false if any fail
     */
    addIngredientsBatch(ingredientsBatch) {
        if (!Array.isArray(ingredientsBatch) || ingredientsBatch.length === 0) {
            return false;
        }

        let allAdded = true;

        ingredientsBatch.forEach(item => {
            if (!item.ingredient || typeof item.ingredient !== 'string' ||
                !item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0 ||
                !item.expirationDate || !/^\d{4}-\d{2}-\d{2}$/.test(item.expirationDate)) {
                allAdded = false;
            } else {
                this.addIngredient(item.ingredient, item.quantity, item.expirationDate);
            }
        });

        return allAdded;
    }
}

module.exports = { IngredientInventory };