class IngredientInventory {
    constructor(restaurantName, maxCapacity) {
        if (typeof restaurantName !== 'string' || typeof maxCapacity !== 'number' || maxCapacity <= 0) {
            throw new Error('Error Encountered');
        }
        this.restaurantName = restaurantName;
        this.maxCapacity = maxCapacity;
        this.ingredients = {};
    }

    addIngredient(ingredient, quantity, expirationDate) {
        if (typeof ingredient !== 'string' || typeof quantity !== 'number' || quantity <= 0 || typeof expirationDate !== 'string') {
            throw new Error('Error Encountered');
        }
        if (Object.keys(this.ingredients).length >= this.maxCapacity) {
            return false;
        }
        if (this.ingredients[ingredient]) {
            this.ingredients[ingredient].quantity += quantity;
        } else {
            this.ingredients[ingredient] = { quantity, expirationDate };
        }
        return true;
    }

    checkIngredientStock(ingredient) {
        if (typeof ingredient !== 'string') {
            throw new Error('Error Encountered');
        }
        return this.ingredients[ingredient] ? this.ingredients[ingredient].quantity : 0;
    }

    removeExpiredIngredients() {
        const removedIngredients = [];
        const currentDate = new Date();
        for (const ingredient in this.ingredients) {
            const expirationDate = new Date(this.ingredients[ingredient].expirationDate);
            if (expirationDate < currentDate) {
                removedIngredients.push(ingredient);
                delete this.ingredients[ingredient];
            }
        }
        return removedIngredients;
    }

    checkStockLevel() {
        const stockLevel = [];
        for (const ingredient in this.ingredients) {
            stockLevel.push({
                ingredient,
                quantity: this.ingredients[ingredient].quantity,
                expirationDate: this.ingredients[ingredient].expirationDate
            });
        }
        return stockLevel;
    }

    removeIngredient(ingredient) {
        if (typeof ingredient !== 'string') {
            throw new Error('Error Encountered');
        }
        if (this.ingredients[ingredient]) {
            delete this.ingredients[ingredient];
            return true;
        }
        return false;
    }
}

module.exports = { IngredientInventory };