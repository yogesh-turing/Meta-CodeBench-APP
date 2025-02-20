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
}

module.exports = { IngredientInventory };