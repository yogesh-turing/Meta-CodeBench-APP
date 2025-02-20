class IngredientInventory {
    constructor(restaurantName, maxCapacity) {
        this.restaurantName = restaurantName;
        this.maxCapacity = maxCapacity;
        this.inventory = [];
    }

    addIngredient(ingredient, quantity, expirationDate) {
        if (quantity <= 0) {
            throw new Error("Error Encountered");
        }

        if (this.inventory.length >= this.maxCapacity) {
            throw new Error("Error Encountered");
        }

        const existingIngredient = this.inventory.find(i => i.ingredient === ingredient);
        if (existingIngredient) {
            existingIngredient.quantity += quantity;
        } else {
            this.inventory.push({ ingredient, quantity, expirationDate });
        }
        return true;
    }

    checkIngredientStock(ingredient) {
        const existingIngredient = this.inventory.find(i => i.ingredient === ingredient);
        return existingIngredient ? existingIngredient.quantity : 0;
    }

    removeExpiredIngredients() {
        const currentDate = new Date();
        const removedIngredients = this.inventory.filter(i => new Date(i.expirationDate) < currentDate);
        this.inventory = this.inventory.filter(i => new Date(i.expirationDate) >= currentDate);
        return removedIngredients.map(i => i.ingredient);
    }

    checkStockLevel() {
        return this.inventory;
    }

    removeIngredient(ingredient) {
        const index = this.inventory.findIndex(i => i.ingredient === ingredient);
        if (index !== -1) {
            this.inventory.splice(index, 1);
            return true;
        }
        return false;
    }
}

module.exports = { IngredientInventory };