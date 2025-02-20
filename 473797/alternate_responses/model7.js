class IngredientInventory {
    constructor(restaurantName, maxCapacity) {
        this.restaurantName = restaurantName;
        this.maxCapacity = maxCapacity;
        this.inventory = {};
    }

    addIngredient(ingredient, quantity, expirationDate) {
        if (typeof quantity !== 'number' || quantity <= 0) {
            throw new Error("Error Encountered");
        }

        if (Object.keys(this.inventory).length >= this.maxCapacity) {
            throw new Error("Error Encountered");
        }

        if (!this.inventory[ingredient]) {
            this.inventory[ingredient] = { quantity: 0, expirationDate: expirationDate };
        }

        this.inventory[ingredient].quantity += quantity;
        return true;
    }

    checkIngredientStock(ingredient) {
        if (!this.inventory[ingredient]) {
            return 0;
        }
        return this.inventory[ingredient].quantity;
    }

    removeExpiredIngredients() {
        const expiredIngredients = [];
        const currentDate = new Date();

        for (const ingredient in this.inventory) {
            const expirationDate = new Date(this.inventory[ingredient].expirationDate);
            if (expirationDate < currentDate) {
                expiredIngredients.push(ingredient);
                delete this.inventory[ingredient];
            }
        }

        return expiredIngredients;
    }

    checkStockLevel() {
        const stockLevel = [];

        for (const ingredient in this.inventory) {
            stockLevel.push({
                ingredient: ingredient,
                quantity: this.inventory[ingredient].quantity,
                expirationDate: this.inventory[ingredient].expirationDate
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