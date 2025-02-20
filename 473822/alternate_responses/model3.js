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
        this.restaurantName = restaurantName;
        this.maxCapacity = maxCapacity;
        this.ingredients = [];
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
        if (!ingredient || typeof ingredient !== 'string' || 
            quantity <= 0 || !Number.isInteger(quantity) ||
            !expirationDate || !/^\d{4}-\d{2}-\d{2}$/.test(expirationDate)) {
            return false;
        }

        if (this.ingredients.length >= this.maxCapacity) {
            return false;
        }

        const existingIndex = this.ingredients.findIndex(item => item.ingredient === ingredient);
        
        if (existingIndex !== -1) {
            this.ingredients[existingIndex].quantity += quantity;
            this.ingredients[existingIndex].expirationDate = expirationDate;
        } else {
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
        if (!ingredient || typeof ingredient !== 'string') {
            return 0;
        }
        
        const item = this.ingredients.find(item => item.ingredient === ingredient);
        return item ? item.quantity : 0;
    }

    /**
     * Removes expired ingredients from the inventory.
     * 
     * @returns {Array} An array of the names of ingredients that have been removed due to expiration.
     */
    removeExpiredIngredients() {
        const currentDate = new Date();
        const expiredIngredients = [];
        
        this.ingredients = this.ingredients.filter(item => {
            const expirationDate = new Date(item.expirationDate);
            if (expirationDate < currentDate) {
                expiredIngredients.push(item.ingredient);
                return false;
            }
            return true;
        });

        return expiredIngredients;
    }

    /**
     * Returns the current stock level of all ingredients in the inventory.
     * 
     * @returns {Array} A list of objects containing the ingredient name, quantity, and expiration date.
     */
    checkStockLevel() {
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
        if (!ingredient || typeof ingredient !== 'string') {
            return false;
        }

        const initialLength = this.ingredients.length;
        this.ingredients = this.ingredients.filter(item => item.ingredient !== ingredient);
        
        return initialLength > this.ingredients.length;
    }

    /**
     * Returns ingredients that are near expiration within a given date range.
     * 
     * @param {number} dateRange - The number of days before expiration to check.
     * @returns {Array} Array of ingredient names that are near expiration.
     */
    getIngredientsNearExpiration(dateRange) {
        if (!dateRange || dateRange <= 0 || !Number.isInteger(dateRange)) {
            return [];
        }

        const currentDate = new Date();
        const futureDate = new Date(currentDate.getTime() + (dateRange * 24 * 60 * 60 * 1000));

        return this.ingredients
            .filter(item => {
                const expirationDate = new Date(item.expirationDate);
                return expirationDate > currentDate && expirationDate <= futureDate;
            })
            .map(item => item.ingredient);
    }

    /**
     * Removes ingredients with quantity less than the specified minimum stock level.
     * 
     * @param {number} minStock - The minimum stock level threshold.
     * @returns {Array} Array of ingredient names that were removed.
     */
    removeLowStockIngredients(minStock) {
        if (!minStock || minStock <= 0 || !Number.isInteger(minStock)) {
            return [];
        }

        const lowStockIngredients = [];
        this.ingredients = this.ingredients.filter(item => {
            if (item.quantity < minStock) {
                lowStockIngredients.push(item.ingredient);
                return false;
            }
            return true;
        });

        return lowStockIngredients;
    }

    /**
     * Clears all ingredients from the inventory.
     * 
     * @returns {string|void} Returns a message if inventory is already empty, otherwise void.
     */
    clearInventory() {
        if (this.ingredients.length === 0) {
            return "Inventory already cleared";
        }
        this.ingredients = [];
    }

    /**
     * Adds multiple ingredients to the inventory in one operation.
     * 
     * @param {Array} ingredientsBatch - Array of objects with ingredient details.
     * @returns {boolean} True if all ingredients were added successfully, false otherwise.
     */
    addIngredientsBatch(ingredientsBatch) {
        if (!Array.isArray(ingredientsBatch) || ingredientsBatch.length === 0) {
            return false;
        }

        if (this.ingredients.length + ingredientsBatch.length > this.maxCapacity) {
            return false;
        }

        return ingredientsBatch.every(item => 
            this.addIngredient(item.ingredient, item.quantity, item.expirationDate)
        );
    }
}

module.exports = { IngredientInventory };