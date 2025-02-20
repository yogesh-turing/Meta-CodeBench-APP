class IngredientInventory {
    constructor(restaurantName, maxCapacity) {
        // Initializes the inventory system with a restaurant name and a maximum capacity of ingredients
    }

    addIngredient(ingredient, quantity, expirationDate) {
        // Adds a new ingredient to the inventory with the given quantity and expiration date
    }

    checkIngredientStock(ingredient) {
        // Checks the current stock level of a specific ingredient
    }

    removeExpiredIngredients() {
        // Removes ingredients that have passed their expiration date from the inventory
    }

    checkStockLevel() {
        // Returns a list of ingredients with their current stock levels
    }

    removeIngredient(ingredient) {
        // Removes an ingredient completely from the inventory
    }
}
module.exports ={  IngredientInventory }