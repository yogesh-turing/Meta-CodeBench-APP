class IngredientInventory {
    constructor(restaurantName, maxCapacity) {
        this.restaurantName = restaurantName;
        this.maxCapacity = maxCapacity;
        this.inventory = {};
    }

    addIngredient(ingredient, quantity, expirationDate) {
        if (quantity <= 0) {
            throw new Error("Error Encountered");
        }
        if (Object.keys(this.inventory).length >= this.maxCapacity) {
            throw new Error("Error Encountered");
        }
        if (this.inventory[ingredient]) {
            this.inventory[ingredient].quantity += quantity;
        } else {
            this.inventory[ingredient] = {
                quantity,
                expirationDate,
            };
        }
        return true;
    }

    checkIngredientStock(ingredient) {
        if (!this.inventory[ingredient]) {
            return 0;
        }
        return this.inventory[ingredient].quantity;
    }

    removeExpiredIngredients() {
        const removedIngredients = [];
        const today = new Date();
        for (const ingredient in this.inventory) {
            const expirationDate = new Date(this.inventory[ingredient].expirationDate);
            if (expirationDate < today) {
                removedIngredients.push(ingredient);
                delete this.inventory[ingredient];
            }
        }
        return removedIngredients;
    }

    checkStockLevel() {
        const stockLevel = [];
        for (const ingredient in this.inventory) {
            stockLevel.push({
                ingredient,
                quantity: this.inventory[ingredient].quantity,
                expirationDate: this.inventory[ingredient].expirationDate,
            });
        }
        return stockLevel;
    }

    removeIngredient(ingredient) {
        if (!this.inventory[ingredient]) {
            return false;
        }
        delete this.inventory[ingredient];
        return true;
    }
}

module.exports = { IngredientInventory };