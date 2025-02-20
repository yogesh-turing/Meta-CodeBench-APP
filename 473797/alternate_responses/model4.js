class IngredientInventory {
    constructor(restaurantName, maxCapacity) {
        if (!restaurantName || typeof restaurantName !== 'string' || maxCapacity <= 0) {
            throw new Error("Error Encountered");
        }
        this.restaurantName = restaurantName;
        this.maxCapacity = maxCapacity;
        this.ingredients = new Map();
    }

    addIngredient(ingredient, quantity, expirationDate) {
        if (!ingredient || typeof ingredient !== 'string' || 
            !Number.isInteger(quantity) || quantity <= 0 ||
            !expirationDate || !/^\d{4}-\d{2}-\d{2}$/.test(expirationDate)) {
            return false;
        }

        if (this.ingredients.size >= this.maxCapacity && !this.ingredients.has(ingredient)) {
            return false;
        }

        const currentDate = new Date();
        const expDate = new Date(expirationDate);
        
        if (expDate <= currentDate || isNaN(expDate.getTime())) {
            return false;
        }

        if (this.ingredients.has(ingredient)) {
            const existing = this.ingredients.get(ingredient);
            existing.quantity += quantity;
            if (expDate > new Date(existing.expirationDate)) {
                existing.expirationDate = expirationDate;
            }
        } else {
            this.ingredients.set(ingredient, {
                quantity,
                expirationDate
            });
        }
        return true;
    }

    checkIngredientStock(ingredient) {
        if (!ingredient || typeof ingredient !== 'string') {
            return 0;
        }
        return this.ingredients.has(ingredient) ? this.ingredients.get(ingredient).quantity : 0;
    }

    removeExpiredIngredients() {
        const currentDate = new Date();
        const expiredIngredients = [];

        for (const [ingredient, details] of this.ingredients.entries()) {
            if (new Date(details.expirationDate) <= currentDate) {
                this.ingredients.delete(ingredient);
                expiredIngredients.push(ingredient);
            }
        }

        return expiredIngredients;
    }

    checkStockLevel() {
        const stockList = [];
        
        for (const [ingredient, details] of this.ingredients.entries()) {
            stockList.push({
                ingredient,
                quantity: details.quantity,
                expirationDate: details.expirationDate
            });
        }

        return stockList;
    }

    removeIngredient(ingredient) {
        if (!ingredient || typeof ingredient !== 'string') {
            return false;
        }
        return this.ingredients.delete(ingredient);
    }
}

module.exports = { IngredientInventory };